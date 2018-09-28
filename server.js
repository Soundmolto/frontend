/**
 * TODO:
 * 		Clean this up!
 */
'use strict';
const { readFileSync } = require('fs');
const { resolve } = require('path');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const API = process.env.NODE_ENV === 'PRODUCTION' ? 'https://api.soundmolto.com:1344' : 'https://api.musicstreaming.dev:1344';
const toAddValues = {
	PROFILE: "PROFILE",
	TRACK: "TRACK",
	HOMEPAGE: "HOMEPAGE"
};

const APP = Object.freeze({
	NAME: "SoundMolto",
	TWITTER_HANDLE: "@soundmolto"
});

const generateTwitterCard = ({ summary, site, title, description, image }) => [
	{ name: 'twitter:card', content: summary },
	{ name: 'twitter:site', content: site },
	{ name: 'twitter:title', content: title },
	{ name: 'twitter:description', content: description },
	{ name: 'twitter:image', content: image },
]

const express = require('express')
const app = express();
const port = 8080;
const key = readFileSync(resolve(__dirname, './certs/_wildcard.musicstreaming.dev-key.pem'), { encoding: 'UTF8' });
const cert = readFileSync(resolve(__dirname, './certs/_wildcard.musicstreaming.dev.pem'), { encoding: 'UTF8' });
const httpsOptions = { key, cert };
const http = require('http');
const https = require('https');

app.use(express.static('build'));

app.get('*', async (request, response, next) => {
	const possiblePaths = request.originalUrl.split("/");
	let url;
	let toAdd;
	console.log(
		possiblePaths.length
	)
	if (possiblePaths.length === 2) {
		const path = possiblePaths[1];
		switch (path) {
			case "login": {
				break;
			}
			case "register": {
				break;
			}
			case "admin": {
				break;
			}
			case "users": {
				break;
			}
			default: {
				url = `${API}/users/${path}`;
				toAdd = toAddValues.PROFILE;
				break;
			}
		}
	}

	if (possiblePaths.length === 3) {
		if (possiblePaths[1] !== 'collection') {
			url = `${API}/${possiblePaths[1]}/${possiblePaths[2]}`;
			toAdd = toAddValues.TRACK;
			console.log(`${API}/${possiblePaths[1]}/${possiblePaths[2]}`)
		}
	}
	if (toAdd != null) {
		let summary, site, title, description, image;
		const file = readFileSync(__dirname + '/build/index.html');
		const DOM = new JSDOM(file);
		const document = DOM.window.document;
		const head = document.head;
		const fetched = await fetch(url);
		const data = await fetched.json();
		switch (toAdd) {
			case toAddValues.HOMEPAGE: {
				summary = `${APP.NAME} - Discover`;
				site = `${APP.TWITTER_HANDLE}`;
				title = `${APP.NAME} - Discover`;
				description = `${APP.NAME} Discovery page`;
				image = `https://soundmolto.com/assets/icons/android-chrome-512x512.png`;
				break;
			}

			case toAddValues.PROFILE: {
				summary = `${APP.NAME} - ${data.profile.displayName || data.profile.url || data.profile.id}'s profile`;
				site = `${APP.TWITTER_HANDLE}`;
				title = `${APP.NAME} - ${data.profile.displayName || data.profile.url || data.profile.id}'s profile`;
				description = `${data.profile.description || ''}`;
				image = `${data.profile.profilePicture || 'https://soundmolto.com/assets/icons/android-chrome-512x512.png'}`;
				break;
			}

			case toAddValues.TRACK: {
				summary = `Listen to ${(data.track.name || data.track.id)} on SoundMolto`;
				site = `${APP.TWITTER_HANDLE}`;
				title = `Listen to ${(data.track.name || data.track.id)} on SoundMolto`;
				description = `${data.track.description || "No description"}`;
				image = `${data.track.artwork || data.track.user.profilePicture || 'https://soundmolto.com/assets/icons/android-chrome-512x512.png'}`;
				break;
			}
		}
		const tags = generateTwitterCard({ summary, site, title, description, image });
		for (const tag of tags) {
			const meta = document.createElement('meta');
			meta.setAttribute('name', tag.name);
			meta.setAttribute('content', tag.content);
			head.appendChild(meta);
		}
		response.send(DOM.serialize());
	} else {
		response.sendFile(__dirname + '/build/index.html');
	}
});

// app.get('/', (req, res) => res.send('Hello World!'));
if (process.env.NODE_ENV) {
	https.createServer(httpsOptions, app).listen(port)
} else {
	http.createServer(httpsOptions, app).listen(port)
}

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

