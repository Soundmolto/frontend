import mitt from 'mitt';
import { hidden, visibilityChange } from './pageVisibilityPolyfill';

/**
 * Performant & battery conscious scheduler for the WebAudio API.
 */
export class WebAudioScheduler {

	emitter;
	events;
	currentTime = 0;
	
	constructor (opts) {
		this.emitter = new mitt();

		// SSR support
		if (typeof window !== "undefined") {
			window.document.addEventListener(visibilityChange, () => {
				console.log('we hidden', window.document[hidden]);
			}, { passive: true });

			window.document.addEventListener('readystatechange', e => console.log(e));
		}
	}
	
	addEventListener (event, fn) {
		this.emitter.on(event, fn);
	}

	removeEventListener (event, fn) {
		this.emitter.off(event, fn);
	}
}