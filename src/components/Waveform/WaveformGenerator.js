// Refactored
export class SoundCloudWaveform {

	buffer = [];

	constructor (settings = {
		canvas: document.createElement('canvas'),
		bar_width: 3,
		bar_gap : 0.2,
		wave_color: "#666",
		onComplete (png, pixels) {}
	}) {
		this.audioContext = settings.audioContext;
		this.settings = settings;
		this.settings.context = this.settings.canvas.getContext('2d');
	}

	// MUSIC LOADER + DECODE
	loadMusic (url) {   
		let req = new XMLHttpRequest();
		req.open( "GET", `${url}?isWaveForm=true`, true );
		req.responseType = "arraybuffer";    
		req.onreadystatechange = e => {
			if (req.readyState == 4) {
				if(req.status == 200) {
					this.audioContext.decodeAudioData(req.response,  buffer => {
						this.buffer = buffer;
						this.extractBuffer(buffer)
					});
				} else {
					alert('error during the load.Wrong url or cross origin issue');
				}
			}
		};
		req.send();
	}

	extractBuffer (buffer) {
		if (buffer == null) return;
	    buffer = buffer.getChannelData(0);
	    let sections = this.settings.canvas.width;
	    let len = Math.floor(buffer.length / sections);
	    let maxHeight = this.settings.canvas.height;
		let vals = [];
		// Scoped monkey patch
		vals.max = function() { return Math.max.apply(null, this); };
		
	    for (let i = 0; i < sections; i += this.settings.bar_width) {
	        vals.push(this.bufferMeasure(i * len, len, buffer) * 10000);
	    }

	    for (let j = 0; j < sections; j += this.settings.bar_width) {
	        let scale = maxHeight / vals.max();
	        let val = this.bufferMeasure(j * len, len, buffer) * 10000;
	        val *= scale;
	        val += 1;
	        this.drawBar(j, val);
		}

		if (this.settings.onComplete) this.settings.onComplete(this.buffer);
    }

    bufferMeasure (position, length, data) {
        let sum = 0.0;
        for (let i = position; i <= (position + length) - 1; i++) sum += Math.pow(data[i], 2);
        return Math.sqrt(sum / data.length);
    }

    drawBar (i, h) {
    	this.settings.context.fillStyle = this.settings.wave_color;
		let w = this.settings.bar_width;
        if (this.settings.bar_gap !== 0) w *= Math.abs(1 - this.settings.bar_gap);
        const x = i + (w / 2);
        const y = this.settings.canvas.height - h;
        this.settings.context.fillRect(x, y, w, h);
    }
}