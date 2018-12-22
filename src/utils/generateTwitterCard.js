export const generateTwitterCard = ({ summary, site, title, description, image }) => [
	{ name: 'twitter:card', content: summary },
	{ name: 'twitter:site', content: site },
	{ name: 'twitter:title', content: title },
	{ name: 'twitter:description', content: description },
	{ name: 'twitter:image', content: image },
]