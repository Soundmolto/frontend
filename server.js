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
		possiblePaths,
		request.originalUrl
	)

	if (possiblePaths.length === 1) {
		toAdd = toAddValues.HOMEPAGE;
	}

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
			console.log('url', url);
		}
	}
	if (toAdd != null) {
		const defImage = 'https://soundmolto.com/assets/icons/android-chrome-512x512.png';
		let summary, site, title, description, image;
		const file = readFileSync(__dirname + '/build/index.html');
		const DOM = new JSDOM(file);
		const document = DOM.window.document;
		const head = document.head;
		let data = {};
		if (url != url) {
			const fetched = await fetch(url);
			data = await fetched.json();
		}

		switch (toAdd) {
			case toAddValues.HOMEPAGE: {
				summary = `${APP.NAME} - Discover`;
				site = `${APP.TWITTER_HANDLE}`;
				title = `${APP.NAME} - Discover`;
				description = `${APP.NAME} Discovery page`;
				image = defImage;
				break;
			}

			case toAddValues.PROFILE: {
				const getUserName = user => user.displayName || user.url || user.id;
				const user = {
					name: data.profile && (`View ${getUserName(data.profile)}'s profile on ${APP.NAME}`) || 'User not found',
					description: data.profile && data.profile.description || '',
					image: data.profile && data.profile.profilePicture || defImage
				};
				console.log(
					user
				)
				summary = user.name;
				site = `${APP.TWITTER_HANDLE}`;
				title = user.name;
				description = user.description;
				image = user.image;
				break;
			}

			case toAddValues.TRACK: {
				const getUserName = user => user.displayName || user.url || user.id;
				const track = {
					name: data.track && (`Listen to ${data.track.name || data.track.id} by ${getUserName(data.track.user)} on ${APP.NAME}`) || "Track not found",
					description: data.track && (data.track.description || "No description") || "No description",
					image: data.track && (data.track.artwork || data.track.user.profilePicture || defImage) || defImage
				}
				console.log(track);
				summary = track.name;
				site = `${APP.TWITTER_HANDLE}`;
				title = track.name;
				description = track.description;
				image = track.image;
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

if (process.env.NODE_ENV === 'PRODUCTION') {
	https.createServer(httpsOptions, app).listen(8081);
	const httpServer = express();
	// set up a route to redirect http to https
	httpServer.get('*', (req, res )=> res.redirect('https://' + req.headers.host + req.url));
	// have it listen on 8080
	http.createServer(httpServer).listen(8080);
} else {
	http.createServer(httpsOptions, app).listen(port)
}
