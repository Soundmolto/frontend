import * as mitt from 'mitt';

export type WebAudioSchedulerEvents = 'timeUpdate' | 'stop' | 'paused' | 'resumed';

export interface IWebAudioSchedulerEventData {
	currentTime: number;
}

export interface IWebAudioSchedulerEvent {
	event: WebAudioSchedulerEvents;
	data: IWebAudioSchedulerEventData;
}

// TODO: Define the details object
export type EventHandler = (event: IWebAudioSchedulerEvent) => any;

export interface IWebAudioScheduler {
	currentTime: number;
	addEventListener(event: string, fn: EventHandler): void;
	removeEventListener(event: string, fn: EventHandler): void;
}

/**
 * Performant & battery conscious scheduler for the WebAudio API.
 */
export class WebAudioScheduler implements IWebAudioScheduler {

	private emitter: mitt.Emitter;
	private events: WebAudioSchedulerEvents;
	public currentTime: number = 0;
	
	constructor (opts: any) {
		this.emitter = new mitt();
	}
	
	public addEventListener (event: string, fn: EventHandler): void {
		this.emitter.on(event, fn);
	}

	public removeEventListener (event: string, fn: EventHandler): void {
		this.emitter.off(event, fn);
	}


}