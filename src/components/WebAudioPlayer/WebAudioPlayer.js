import store from "../../store";
import { API_ENDPOINT } from "../../api";

export class WebAudioPlayer {

	audioContext = null;
	playing = false;
	startedAt = 0;
	stopped = true;
	pausedAt = 0;
	source = null;
	events = {};
	duration = 0;
	_currentTime = 0;
	buffers = {};

	constructor (opts) {
		this.audioContext = opts.audioContext;
		console.log('well fuck');
	}

	get src () {
		return this.currentlyPlaying;
	}

	set src (file) {
		this.play(file);
		this.currentlyPlaying = file;
	}

	removeEventListener (event) {
		delete this.events[event];
	}

	addEventListener (event, cb) {
		this.events[event] = cb;
	}

	loadFile (url, done) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		const { token } = store.getState().auth;
		if (token) {
			request.setRequestHeader('Authorization', `Bearer ${token}`);
		}

		request.responseType = 'arraybuffer';
	  
		// Decode asynchronously
		request.onload = () => this.audioContext.decodeAudioData(request.response, done);
		request.send();
	}

	_dispatchUpdate (time) {
		if (this.events.timeupdate) {
			this.events.timeupdate();
		} else {
			window.document.dispatchEvent(
				new CustomEvent('webAudioPlayerTimeUpdate', { detail: time })
			);
		}
	}

	play (file, time) {
		this.stop();
		this.currentlyPlaying = file;
		if (this.buffers[file] == null) {
			this.loadFile(file, (buffer) => {
				this.buffers[file] = buffer;
				this._playBuffer(buffer, time || this.pausedAt);
			});
		} else {
			this._playBuffer(this.buffers[file], time || this.pausedAt);
		}
	}

	_playBuffer (buffer, offset) {
		console.log(offset);
		this._currentTime = offset || 0;
		this.source = this.audioContext.createBufferSource();
		this.source.buffer = buffer;
		this.duration = buffer.duration;
		this.source.connect(this.audioContext.destination);
		this.source.start(0, offset);
		if (this.events.timeupdate) {
			new CustomEvent('webAudioPlayerTimeUpdate', { detail: 0 })
		} else {
			window.document.dispatchEvent(
				new CustomEvent('webAudioPlayerTimeUpdate', { detail: 0 })
			);
		}
		this.playing = true;
		this.stopped = false;

		this.startedAt = this.audioContext.currentTime - offset;
		this.pausedAt = 0;
		this.timeupdateInt = window.setInterval(() => {
			this._currentTime += 1;
			this._dispatchUpdate(this.currentTime);
		}, 1000);

		this.source.onended = () => {
			console.log(parseInt(this.currentTime), parseInt(this.duration))
			if (
				parseInt(this.currentTime) === parseInt(this.duration) ||
				parseInt(this.currentTime) + 1 === parseInt(this.duration) ||
				parseInt(this.currentTime) >= parseInt(this.duration)
			) {
				this.stop();
				this.events.ended();
			}
		};
	}

	pause () {
		this.pausedAt = this.audioContext.currentTime - this.startedAt;
		this.stop();
	}

	stop () {
		this.stopped = true;

		if (this.timeupdateInt) {
			window.clearInterval(this.timeupdateInt);
		}

		if (this.source) {
			this.source.disconnect();
			this.source.stop(0);
			this.source = null;
		}

		this.pausedAt = 0;
		this.startedAt = 0;
		this.playing = false;
	}

	get currentTime () {
		return this._currentTime;
	}

	set currentTime (seconds) {
		if (typeof seconds != 'number') throw new Error('currentTime only accepts a number');
		if (this.currentlyPlaying == null || this.playing == false) throw new Error('Cannot set time of track that isn\'t playing');
		this._currentTime = seconds;
		this.play(this.currentlyPlaying, seconds);
	}
}
