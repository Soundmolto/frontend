import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import styles from './style.css';

export class ShareTrack extends Component {

	onClickShare = () => {
		this.props.onClick();
	};

	render () {
		return (
			<div>
				<span class={styles.saveTrack} onClick={this.onClickShare}>
					<Icon>share</Icon>
				</span>
			</div>
		);
	}
}