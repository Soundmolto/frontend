import { h, Component } from "preact";
import { connect } from "preact-redux";
import Helmet from "preact-helmet";
import { AppSettings } from "../../components/AppSettings";
import { route } from "preact-router";

import styles from "./style.css";

@connect(({ auth, user }) => ({ auth, user }))
export default class Settings extends Component {
	shouldComponentUpdate() {
		return true;
	}

	render ({ auth, user }) {
		if (!auth.logged_in) return route("/", true);

		return (
			<div>
				<Helmet title={"SoundMolto - Settings"} />
				<div class="header">
					<h1>Settings</h1>
				</div>
				<div class={styles.container}>
					<AppSettings rootClass={styles.column} className={styles.switchContainer} />

					<div class={styles.column}>
						<h4>User Settings</h4>
						{console.log(user)}
						<h6>Connected Accounts</h6>
						<p>Facebook ID: {user.facebookId || "Connect FB"}</p>
					</div>
				</div>
			</div>
		);
	}
}
