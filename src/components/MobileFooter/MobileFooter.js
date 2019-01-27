import { Component } from "preact";
import Icon from 'preact-material-components/Icon';
import Tabs from "preact-material-components/Tabs";
import Button from 'preact-material-components/Button';
import "preact-material-components/Tabs/style.css";
import 'preact-material-components/Button/style.css';
import styles from './style';
import { route, getCurrentUrl } from "preact-router";
import { connect } from "preact-redux";

@connect(state => state)
export class MobileFooter extends Component {
	state = { activeTabIndex: 0 };

	goHome = (e) => {
		route('/');
		e.preventDefault();
		e.target.blur();
	};

	goToMusic = (e) => {
		route('/collection/tracks');
		e.preventDefault();
		e.target.blur();
	};

	goToLogin = e => {
		route('/login');
		e.preventDefault();
		e.target.blur();
	};

	componentDidMount () {
		let activeTabIndex = 0;
		if (getCurrentUrl() === '/search') activeTabIndex = 1;
		if (getCurrentUrl() === '/collection/tracks' && this.props.auth.logged_in) activeTabIndex = 2;
		if (getCurrentUrl() === '/login' && !this.props.auth.logged_in) activeTabIndex = 2;

		console.log(activeTabIndex, getCurrentUrl());

		this.setState({ activeTabIndex });

		window.document.addEventListener('url-change', () => {
			let activeTabIndex = 0;
			if (getCurrentUrl() === '/search') activeTabIndex = 1;
			if (getCurrentUrl() === '/collection/tracks' && this.props.auth.logged_in) activeTabIndex = 2;
			if (getCurrentUrl() === '/login' && !this.props.auth.logged_in) activeTabIndex = 2;

			this.setState({ activeTabIndex });
		});
	}

	render ({ trackName, owner, playing, onClickPlay, onClickPause, auth }, { activeTabIndex }) {
		return (
			<div class={styles.mobile}>
				<div class={styles.footer}>
					<div class={styles.breaker}></div>
					<div class={styles.start}>
						<div class={styles.songInfo}>
							<p>
								<span>{owner}</span>
								<span>{trackName}</span>
							</p>
						</div>
					</div>
					<div class={styles.end}>
						{!playing && (
							<Button ripple className={`${styles.button}`} onClick={onClickPlay}>
								<Icon style={{ margin: 0 }} >play_arrow</Icon>
							</Button>
						)}

						{playing && (
							<Button ripple className={`${styles.button}`} onClick={onClickPause}>
								<Icon style={{ margin: 0 }} >pause</Icon>
							</Button>
						)}
					</div>
				</div>
				<Tabs className={`${styles.tabs} footer-tabs`} activeTabIndex={activeTabIndex}>
					<Tabs.Tab onClick={this.goHome} active={activeTabIndex === 0}>
						<Icon>home</Icon>
						Home
					</Tabs.Tab>
					<Tabs.Tab active={activeTabIndex === 1} onClick={() => console.log('yeah thats comin soon')}>
						<Icon>search</Icon>
						Search
					</Tabs.Tab>
					{auth.logged_in ? (
						<Tabs.Tab active={activeTabIndex === 2} onClick={this.goToMusic}>
							<Icon>music_note</Icon>
							My Music
						</Tabs.Tab>
					) : (
						<Tabs.Tab active={activeTabIndex === 2} onClick={this.goToLogin}>
							<Icon>vpn_key</Icon>
							Login
						</Tabs.Tab>
					)}
				</Tabs>
			</div>
		);
	}
}