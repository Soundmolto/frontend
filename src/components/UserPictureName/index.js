import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import Goku from '../../assets/goku.png';
import styles from './style';

const className = styles.smol;

export class UserPictureName extends Component {
	render ({ children, user, show_location, style = {}, h1_class = '', showUsername = true, role = null }) {
		let picture = user.profilePicture;
		if (picture === '') picture = Goku;
		return (
			<div class="vertical-center" style={style}>
				<img src={picture} />
				{(showUsername === true || show_location === true) && (
					<h1 class={`${h1_class} ${styles.usernameCustom}`}>
						{showUsername === true && user.displayName || user.url || "[Name]"}
						{role != null && role === "admin" && <Icon>verified_user</Icon>}
						{show_location && <small class={className}>{user.location || ""}</small>}
					</h1>
				)}

				{children != null && children}
			</div>
		);
	}
}