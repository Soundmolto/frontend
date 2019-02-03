import { h, Component } from 'preact';
import Icon from 'preact-material-components/Icon';
import Tabs from "preact-material-components/Tabs";
import "preact-material-components/Tabs/style.css";
import styles from './styles.css';

export class ProfileTabContainer extends Component {

	state = { slideIndex: 0 };

	render ({ tracks, about, amountOfTracks }) {
		return (
			<div>
				<Tabs className={styles.tabs} activeTabIndex={this.state.slideIndex}>
					<Tabs.Tab onClick={() => this.setState({slideIndex: 0})}
					 class={this.state.slideIndex === 0 ? 'mdc-tab--active' : ''}>
						<Icon>music_note</Icon>
						Tracks <small>{amountOfTracks}</small>
						<div class="block"></div>
					</Tabs.Tab>
					<Tabs.Tab onClick={() => this.setState({slideIndex: 1})}>
						<Icon>person</Icon>
						About
						<div class="block"></div>
					</Tabs.Tab>
				</Tabs>
				<div className={styles.tabContainer}>
					{this.state.slideIndex === 0 ?
						(<div class={`slide ${styles.containerEl}`}>{tracks}</div>) :
						(<div class={`slide ${styles.minHeight} ${styles.containerEl}`}>{about}</div>)
					}
				</div>
			</div>
		);
	}
}