import { h, Component } from "preact";
import { connect } from "preact-redux";
import Helmet from "preact-helmet";
import { route } from "preact-router";
import { SETTINGS } from "../../enums/settings";
import { light_theme, dark_theme } from "../../actions/ui";
import {
	disable_beta,
	enable_beta,
	enable_waveform,
	disable_waveform
} from "../../actions/settings";
import Switch from "preact-material-components/Switch";
import "preact-material-components/Switch/style.css";
import styles from "./style.css";
import { THEMES } from "../../enums/themes";
import Formfield from "preact-material-components/FormField";

@connect(({ auth, user, settings, UI }) => ({ auth, user, settings, UI }))
export default class Settings extends Component {
	toggleDarkTheme = () => {
		if (this.props.UI.theme === THEMES.dark) {
			light_theme(this.props.dispatch);
		} else {
			dark_theme(this.props.dispatch);
		}
	};

	toggleBeta = () => {
		if (this.props.settings.beta === SETTINGS.ENABLE_BETA) {
			disable_beta(this.props.dispatch);
		} else {
			enable_beta(this.props.dispatch);
		}
	};

	toggleWaveForms = () => {
		if (this.props.settings.waveforms === SETTINGS.DISABLE_WAVEFORMS) {
			enable_waveform(this.props.dispatch);
		} else {
			disable_waveform(this.props.dispatch);
		}
	};

	shouldComponentUpdate() {
		return true;
	}

	render({ auth, user, settings, UI }) {
		if (!auth.logged_in) return route("/", true);

		return (
			<div>
				<Helmet title={"SoundMolto - Settings"} />
				<div class="header">
					<h1>Settings</h1>
				</div>
				<div class={styles.container}>
					<div class={styles.column}>
						<h4>App settings</h4>
						<Formfield class={styles.switchContainer}>
							<label for="toggleDarkTheme">
								Enable dark theme
							</label>
							<Switch
								checked={UI.theme === THEMES.dark}
								onChange={this.toggleDarkTheme}
								id="toggleDarkTheme"
								key={settings.beta}
							/>
						</Formfield>
						<Formfield class={styles.switchContainer}>
							<label for="toggleBetaFeatures">
								Enable beta features
							</label>
							<Switch
								checked={settings.beta === SETTINGS.ENABLE_BETA}
								onClick={this.toggleBeta}
								id="toggleBetaFeatures"
							/>
						</Formfield>
						<Formfield class={styles.switchContainer}>
							<label for="toggleWaveForms">
								Enable waveforms on profile page
							</label>
							<Switch
								checked={
									settings.waveforms ===
										SETTINGS.ENABLE_WAVEFORMS ||
									settings.waveforms == null
								}
								onClick={this.toggleWaveForms}
								id="toggleWaveForms"
							/>
						</Formfield>
					</div>

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
