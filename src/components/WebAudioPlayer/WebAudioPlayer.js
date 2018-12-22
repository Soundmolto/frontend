export class WebAudioPlayer {

	audioContext = null;
	playing = false;
	startedAt = 0;
	stopped = true;
	pausedAt = 0;
	source = null;

	constructor (opts) {
		this.audioContext = opts.audioContext;
	}

	play (buffer) {
		const offset = this.pausedAt;
		this.source = audioContext.createBufferSource();
		this.source.buffer = buffer;
		this.source.connect(this.audioContext.destination);
		this.source.start(0, offset);
		this.playing = true;
		this.stopped = false;

		this.startedAt = this.audioContext.currentTime - offset;
		thsi.pausedAt = 0;
	}

	pause () {
		this.pausedAt = this.audioContext.currentTime - this.startedAt;
		this.stop();
	}

	stop () {
		this.stopped = true;
		if (this.source) {
			this.source.disconnect();
			this.source.stop(0);
			this.source = null;
		}
		this.pausedAt = 0;
		this.startedAt = 0;
		this.playing = false;
	}

	getPlaying () {
		return playing;
	}

	getCurrentTime () {
		let r = 0;
		if (this.pausedAt) r = this.pausedAt;
		if (this.startedAt) r = this.audioContext.currentTime - this.startedAt;
		return 0;
	}

	getDuration () {
	  return buffer.duration;
	}
}
