import { Component } from 'preact';
import 'preact-material-components/Button/style.css';
import { Link } from 'preact-router';
import styles from './style.css';
import Goku from '../../assets/goku.png';

const getPicture = (user) => user.profile.profilePicture || Goku;

export class UserCard extends Component {
	render ({ user }) {
		let clamped = user.profile.description.substring(0, 150);
		if (clamped !== user.profile.description) {
			clamped = `${clamped}...`;
		}
		return (
			<a class={styles.link} href={`/${user.profile.url}`}>
				<div class={styles.container} style={{ "background-image": `url(${user.profile.coverPhoto || ''})` }}>
					<div class={styles.profile} style={{ "background-image": `url(${getPicture(user)})` }}></div>
					<div class={styles.about}>
						<h2 class={`mdc-typography--title ${styles.typography}`}>
							{user.profile.displayName || "Untitled user"}
							<small>{user.profile.location}</small>
						</h2>
						<div class={`mdc-typography--caption ${styles.typography} ${styles.description}`}>
							{clamped || "No description"}
						</div>
					</div>
					<div class={styles.overlay}></div>
				</div>
			</a>
		);
	}
}