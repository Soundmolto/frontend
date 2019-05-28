import { h, Component } from "preact";
import { THEMES } from "../../enums/themes";
import { SETTINGS } from "../../enums/settings";
import Switch from "preact-material-components/Switch";
import Formfield from "preact-material-components/FormField";
import { connect } from "preact-redux";
import {
	disable_beta,
	enable_beta,
	enable_waveform,
	disable_waveform
} from "../../actions/settings";
import { light_theme, dark_theme } from "../../actions/ui";
import "preact-material-components/Switch/style.css";
import styles from "./AppSettings.css";

@connect(({ settings, UI }) => ({ settings, UI }))
export class AppSettings extends Component {
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

	render ({ rootClass, settings, UI }) {
		return (
			<div class={rootClass}>
				<h4>App settings</h4>
				<Formfield class={styles.switchContainer}>
					<label for="toggleDarkTheme">Enable dark theme</label>
					<Switch
						checked={UI.theme === THEMES.dark}
						onChange={this.toggleDarkTheme}
						id="toggleDarkTheme"
						key={settings.beta}
					/>
				</Formfield>
				<Formfield class={styles.switchContainer}>
					<label for="toggleBetaFeatures">Enable beta features</label>
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
							settings.waveforms === SETTINGS.ENABLE_WAVEFORMS ||
							settings.waveforms == null
						}
						onClick={this.toggleWaveForms}
						id="toggleWaveForms"
					/>
				</Formfield>
			</div>
		);
	}
}
