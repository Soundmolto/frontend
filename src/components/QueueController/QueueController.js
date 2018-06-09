let position = 0;
let tracks = [];

export class QueueController {

	events = { 'set:tracks': tracks => {} };

	on (event, handler) {
		this.events[event] = handler;
	}
	
	get tracks () {
		return tracks.concat([]);
	}

	set tracks (t = []) {
		if (Array.isArray(t) === false) {
			throw new Error('Tracks must be an array.');
		}
		tracks = t;
		this.events['set:tracks'](tracks);
	}

	get current () {
		return tracks[position];
	}

	first () {
		return tracks[0];
	}

	last () {
		return tracks[tracks.length - 1];
	}

	next () {
		position += 1;
		return tracks[position];
	}

	previous () {
		position -= 1;
		return tracks[position];
	}

	shuffle () {
		let currentIndex = tracks.length;
		let temporaryValue;
		let randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
	
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
		
			// And swap it with the current element.
			temporaryValue = tracks[currentIndex];
			tracks[currentIndex] = tracks[randomIndex];
			tracks[randomIndex] = temporaryValue;
		}
	
		tracks = array.concat([]);
	}

}