import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import Goku from '../../assets/goku.png';
import styles from './style';

const className = styles.smol;

const getPicture = user => user.profilePicture || Goku;

const renderProfile = ({
	children,
	user,
	show_location,
	h1_class = '',
	showUsername = true,
	role = null,
	style = {},
}) => <div class="vertical-center" style={style}>
	<img src={getPicture(user)} />
	{(showUsername === true || show_location === true) && (
		<h1 class={`${h1_class} ${styles.usernameCustom}`}>
			{showUsername === true && user.displayName || user.url || "[Name]"}
			{role != null && role === "admin" && <Icon>verified_user</Icon>}
			{show_location && <small class={className}>{user.location || ""}</small>}
		</h1>
	)}
	{children != null && children}
</div>

export class UserPictureName extends Component {
	render (props) {
		
		return (
			props.linksToProfile ? (
				<a href={`/${props.user.url}`} class={`${styles.noTextDecoration} ${props.class || ''}`} onClick={props.onClickProfile || function () {}} onMouseOver={props.onMouseOver}>
					{renderProfile(props)}
				</a>
			) : (renderProfile(props))
		);
	}
}