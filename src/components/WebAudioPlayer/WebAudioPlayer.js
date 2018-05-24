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
        if(pausedAt) {
            return pausedAt;
        }
        if(startedAt) {
            return context.currentTime - startedAt;
        }
        return 0;
    }

    getDuration () {
      return buffer.duration;
    }
}

function createSound(buffer, context) {
    var sourceNode = null,
        startedAt = 0,
        pausedAt = 0,
        playing = false;

    var play = function() {
        var offset = pausedAt;

        sourceNode = context.createBufferSource();
        sourceNode.connect(context.destination);
        sourceNode.buffer = buffer;
        sourceNode.start(0, offset);

        startedAt = context.currentTime - offset;
        pausedAt = 0;
        playing = true;
    };

    var pause = function() {
        var elapsed = context.currentTime - startedAt;
        stop();
        pausedAt = elapsed;
    };

    var stop = function() {
        if (sourceNode) {          
            sourceNode.disconnect();
            sourceNode.stop(0);
            sourceNode = null;
        }
        pausedAt = 0;
        startedAt = 0;
        playing = false;
    };

    

    return {
        getCurrentTime: getCurrentTime,
        getDuration: getDuration,
        getPlaying: getPlaying,
        play: play,
        pause: pause,
        stop: stop
    };
}