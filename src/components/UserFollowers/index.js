import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { UserPictureName } from '../UserPictureName';
import { Link, route } from 'preact-router';
import styles from './style';
import { connect } from 'preact-redux';

@connect(state => state)
export class UserFollowers extends Component {
	
	popovers = {};

	showPopover (id) {
		this.popovers[id].style.display = "block";
		this.popovers[id].style.opacity = 1;
	}

	hidePopover (id) {
		const ontransitionend = () => {
			this.popovers[id].removeEventListener('transitionend', ontransitionend);
			requestAnimationFrame(_ => {
				this.popovers[id].style.display = "none";
			});
		};
		this.popovers[id].style.opacity = 0;
		this.popovers[id].addEventListener('transitionend', ontransitionend);
	}

	render ({ viewedUser, style = {} }) {
		return (
			<div style={style}>
				<Card class={styles.card}>
					<h1 style={{ 'margin-bottom': '10px' }}>Followers {viewedUser.followers.length}</h1>
					<div class={styles.w100}>
						{viewedUser.followers.length !== 0 && viewedUser.followers.map(follower => (
							<div>
								<Link href={`/${follower.url}`} class={styles.link}
									onMouseOver={this.showPopover.bind(this, follower.id)} onMouseOut={this.hidePopover.bind(this, follower.id)}>
									<UserPictureName user={follower} showUsername={false} />
								</Link>
								<div class={`mdc-custom-card ${styles.popover}`} ref={e => this.popovers[follower.id] = e} style={{ display: 'none' }}>
									<UserPictureName user={follower} show_location={true} h1_class={styles.h1Class} />
									<p class={styles.followers}>{follower.amountOfFollowers} Follower{follower.amountOfFollowers > 1 ? 's' : ''}</p>
								</div>
							</div>
						))}
					</div>
					{viewedUser.followers.length <= 0 && (<p>No followers</p>)}
				</Card>
			</div>
		);
	}
}