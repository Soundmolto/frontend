import { Component } from "preact";
import Card from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Card/style.css';
import styles from './style.css';
import Goku from '../../assets/goku.png';
import { route } from "preact-router";

export class DiscoverCard extends Component {

	goTo (e, path) {
		e.preventDefault();
		route(path);
	}

	render ({ track, user }) {
		return (
			<a href={`${user.url}/${track.url}`} onClick={e => this.goTo(e, `${user.url}/${track.url}`)}>
				<Card class={styles.root}>
					<div class={styles.overlayImage}></div>
					<div class={styles.profile} style={{ "background-image": `url(${track.artwork || user.profilePicture || Goku})` }}></div>
					<div style={{ 'z-index': 3 }}>
						<h2 class={`mdc-typography--title ${styles.typography}`}>{user.displayName || "Untitled user"}</h2>
						<h3 class={`mdc-typography--title ${styles.typography}`}>{track.name}</h3>
						<p class={`mdc-typography--title ${styles.typography}`}><Icon>headset</Icon> {track.plays}</p>
					</div>
				</Card>
			</a>
		);
	}
}