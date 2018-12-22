import { h, Component } from 'preact';
import Carousel from "nuka-carousel";
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
					<Tabs.Tab onClick={() => this.setState({slideIndex: 0})}>
						<Icon>music_note</Icon>
						Tracks <small>{amountOfTracks}</small>
					</Tabs.Tab>
					<Tabs.Tab onClick={() => this.setState({slideIndex: 1})}>
						<Icon>person</Icon>
						About
					</Tabs.Tab>
				</Tabs>

				<Carousel
					renderBottomCenterControls={null}
					renderCenterRightControls={null}
					renderCenterLeftControls={null}
					slideIndex={this.state.slideIndex}
					afterSlide={slideIndex => this.setState({ slideIndex })}
					className={styles.tabContainer}
				>
					<div class={`slide ${styles.containerEl}`}>{tracks}</div>
					<div class={`slide ${styles.minHeight} ${styles.containerEl}`}>{about}</div>
				</Carousel>
			</div>
		);
	}
}