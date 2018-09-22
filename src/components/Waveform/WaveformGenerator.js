export class WaveformGenerator {

	buffer = [];

	constructor (settings = {
		canvas: document.createElement('canvas'),
		bar_width: 3,
		bar_gap : 0.2,
		wave_color: "#666",
		onComplete () {}
	}) {
		this.audioContext = settings.audioContext;
		this.settings = settings;
		this.settings.context = this.settings.canvas.getContext('2d', {
			antialias: false,
			depth: false

		});
	}

	extractBuffer (vals = []) {
		let sections = this.settings.canvas.width;
		let len = Math.floor(vals.length / sections);
		let maxHeight = this.settings.canvas.height;
		vals.max = function() { return Math.max.apply(null, this); };
		// this.settings.canvas.transferControlToOffscreen();
		const idle = (cb) => {
			if (requestIdleCallback) {
				requestIdleCallback(cb);
			} else {
				window.setTimeout(cb, 128);
			}
		};

		idle(() => {
			for (let j = 0; j < sections; j += this.settings.bar_width) {
				let scale = maxHeight / vals.max();
				let val = this.bufferMeasure(j * len, len, vals) * 50;
				val *= scale;
				val += 1;
				this.drawBar(j, val);
			}
			if (this.settings.onComplete) this.settings.onComplete(this.buffer);
		});

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