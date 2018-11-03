/**
 * TODO:
 * 		Clean this up!
 */
'use strict';
const { readFileSync } = require('fs');
const { resolve } = require('path');
const PRODUCTION_MODE = readFileSync(resolve(__dirname, 'mode')).toString();
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const API = PRODUCTION_MODE === 'PRODUCTION' ? 'https://api.soundmolto.com:1344' : 'https://api.musicstreaming.dev:1344';
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

const generateFacebookCard = ({ type, title, description, image, url = '' }) => [
	{ name: 'og:type', content: type },
	{ name: 'og:title', content: title },
	{ name: 'og:description', content: description },
	{ name: 'og:image', content: image },
	{ name: 'og:url', content: url },
	{ name: 'og:site_name', content: APP.NAME }
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
		let tags = [];
		let ogTags = [];

		if (url != null) {
			const fetched = await fetch(url);
			data = await fetched.json();
		}

		switch (toAdd) {
			case toAddValues.HOMEPAGE: {
				summary = 'summary';
				site = `${APP.TWITTER_HANDLE}`;
				title = `${APP.NAME} - Discover`;
				description = `${APP.NAME} Discovery page`;
				image = defImage;
				tags = generateTwitterCard({ summary, site, title, description, image });
				ogTags = generateFacebookCard({
					title,
					type: 'website',
					description,
					image,
					url: `https://soundmolto.com/`
				})
				break;
			}

			case toAddValues.PROFILE: {
				const getUserName = user => user.displayName || user.url || user.id;
				const user = {
					name: data.profile != null && (`View ${getUserName(data.profile)}'s profile on ${APP.NAME}`) || 'User not found',
					description: data.profile != null && data.profile.description || '',
					image: data.profile != null && data.profile.profilePicture || defImage
				};
				summary = 'summary_large_image';
				site = `${APP.TWITTER_HANDLE}`;
				title = user.name;
				description = user.description;
				image = user.image;
				tags = generateTwitterCard({ summary, site, title, description, image });
				ogTags = generateFacebookCard({ title, type: 'profile', description, image, url: `https://soundmolto.com${request.originalUrl}` })
				ogTags.push({ name: 'profile:username', content: user.name });
				break;
			}

			case toAddValues.TRACK: {
				const getUserName = user => user.displayName || user.url || user.id;
				const track = {
					name: data.track != null && (`Listen to ${data.track.name || data.track.id} by ${getUserName(data.track.user)} on ${APP.NAME}`) || "Track not found",
					description: data.track != null && (data.track.description || "No description") || "No description",
					image: data.track != null && (data.track.artwork || data.track.user.profilePicture || defImage) || defImage,
					streamUrl: data.track != null && (data.track.stream_url) || '',
					duration: data.track != null && data.track.duration || 0,
					userUrl: data.track != null && data.track.user && data.track.user.url || ''
				}
				site = `${APP.TWITTER_HANDLE}`;
				title = track.name;
				description = track.description;
				image = track.image;

				tags = generateTwitterCard({ summary: 'player', site, title, description, image, url });
				tags.push({ name: "twitter:player", content: track.streamUrl });
				tags.push({ name: "twitter:player:stream", content: track.streamUrl });
				tags.push({ name: 'twitter:player:stream:content_type', content: 'audio/mpeg' });
				tags.push({ name: 'twitter:player:width', content: '100px' });
				tags.push({ name: 'twitter:player:height', content: '100px' });

				ogTags = generateFacebookCard({ title, type: 'music.song', description, image, url: `https://soundmolto.com${request.originalUrl}` })
				ogTags.push({ name: 'music:duration', content: track.duration });
				ogTags.push({ name: 'music:musician', content: track.userUrl });
				ogTags.push({ name: 'og:audio', content: track.streamUrl });
				ogTags.push({ name: 'og:audio:type', content: 'audio/vnd.facebook.bridge' });
				break;
			}
		}

		for (const tag of tags) {
			const meta = document.createElement('meta');
			meta.setAttribute('name', tag.name);
			meta.setAttribute('content', tag.content);
			head.appendChild(meta);
		}

		for (const tag of ogTags) {
			const meta = document.createElement('meta');
			meta.setAttribute('property', tag.name);
			meta.setAttribute('content', tag.content);
			console.log(meta.outerHTML);
			head.appendChild(meta);
		}

		response.send(DOM.serialize());
	} else {
		const defImage = 'https://soundmolto.com/assets/icons/android-chrome-512x512.png';
		let summary, site, title, description, image;
		const file = readFileSync(__dirname + '/build/index.html');
		const DOM = new JSDOM(file);
		const document = DOM.window.document;
		const head = document.head;
		let tags = [];
		let ogTags = [];

		summary = 'summary';
		site = `${APP.TWITTER_HANDLE}`;
		title = `${APP.NAME} - Discover`;
		description = `${APP.NAME} Discover new artists on SoundMolto`;
		image = defImage;
		tags = generateTwitterCard({ summary, site, title, description, image });
		ogTags = generateFacebookCard({
			title,
			type: 'website',
			description,
			image,
			url: `https://soundmolto.com/`
		})

		for (const tag of tags) {
			const meta = document.createElement('meta');
			meta.setAttribute('name', tag.name);
			meta.setAttribute('content', tag.content);
			head.appendChild(meta);
		}

		for (const tag of ogTags) {
			const meta = document.createElement('meta');
			meta.setAttribute('property', tag.name);
			meta.setAttribute('content', tag.content);
			head.appendChild(meta);
		}

		response.send(DOM.serialize());
	}
});

if (PRODUCTION_MODE === 'PRODUCTION') {
	https.createServer(httpsOptions, app).listen(443);
	const httpServer = express();
	// set up a route to redirect http to https
	httpServer.get('*', (req, res )=> res.redirect('https://' + req.headers.host + req.url));
	// have it listen on 8080
	http.createServer(httpServer).listen(80);
} else {
	http.createServer(httpsOptions, app).listen(80)
}
