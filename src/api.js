// TODO - Refactor this shit.
const production = true;
export const API_ENDPOINT = production ? "https://api.soundmolto.com" : "http://192.168.1.18:1344";
export const WS_ENDPOINT = production ? "wss://api.soundmolto.com:3000" : "ws://192.168.1.18:3000"
