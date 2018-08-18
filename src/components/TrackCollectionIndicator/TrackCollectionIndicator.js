import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import styles from './style.css';

export class TrackCollectionIndicator extends Component {

	state = { icon: 'check', inCollection: false };

	saveTrackToCollection () {
		this.setState({ inCollection: true });
		this.props.onSaveTrackToCollection(this.props);
	}

	removeTrackFromCollection () {
		this.setState({ inCollection: false });
		this.props.onRemoveTrackFromCollection(this.props);
	}

	mouseOver (e) {
		this.setState({ icon: 'close' });
	}

	mouseOut (e) {
		this.setState({ icon: 'check' });
	}

	componentWillMount () {
		this.setState({ inCollection: this.props.track.inCollection });
	}

	render (props, { icon, inCollection }) {
		return (
			<div>
				{inCollection === true && (
					<span onClick={this.removeTrackFromCollection.bind(this)} class={styles.saveTrack} onMouseOut={this.mouseOut.bind(this)} onMouseOver={this.mouseOver.bind(this)}>
						<Icon>
							{icon}
						</Icon>
					</span>
				)}

				{inCollection !== true && (
					<span onClick={this.saveTrackToCollection.bind(this)} class={styles.saveTrack}>
						<Icon>add</Icon>
					</span>
				)}
			</div>
		);
	}
}