import { Component } from "preact";
import IconToggle from 'preact-material-components/IconToggle';
import 'preact-material-components/IconToggle/style.css';
import { toggle_like } from '../../actions/track';
import { connect } from 'preact-redux';

@connect(({ auth, user }) => ({ auth, user }))
export class LikeIndicator extends Component {

	state = { amountOfLikes: 0 };


	toggle_like = () => {
		toggle_like(this.props.dispatch, { token: this.props.auth.token, id: this.props.track.id, user: this.props.track.user }, data => {
			const track = data.tracks[0] || { amountOfLikes: 0 };
			console.log(
				track,
				data.tracks
			)
			this.setState({ amountOfLikes: track.amountOfLikes });
		});
	}

	componentDidMount () {
		this.setState({
			amountOfLikes: this.props.track.amountOfLikes
		})
	}

	render ({ track, user, className }, { amountOfLikes }) {
		const userLikesTrack = user.likes && user.likes.filter(like => like.id === track.id).length != 0;
		console.log(user.likes)
		const toggleOnIcon = { content: "favorite", label: "Remove From Favorites" };
		const toggleOffIcon = { content: "favorite_border", label: "Add to Favorites" };

		return (
			<div class={className}>
				{Math.max(0, amountOfLikes)}
				<IconToggle
					role="button"
					tabindex="0"
					aria-pressed={userLikesTrack}
					aria-label="Add to favorites"
					data-toggle-on={toggleOnIcon}
					data-toggle-off={toggleOffIcon}
					onClick={this.toggle_like}
				>
					{userLikesTrack ? "favorite" : "favorite_border"}
				</IconToggle>
			</div>
		);
	}
}