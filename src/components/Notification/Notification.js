import { Component } from "preact";
import Menu from 'preact-material-components/Menu';
import 'preact-material-components/Menu/style.css';
import { UserPictureName } from "../UserPictureName";
import TimeAgo from 'timeago-react';
import dayjs from 'dayjs';
import style from './style';
import { route } from "preact-router";

const getAction = type => {
	switch (type) {
		case "comment": {
			return 'commented on';
		}
	}
}

export class Notification extends Component {

	goTo = (e) => {
		const { notification } = this.props;
		e.preventDefault();
		route(`/${notification.user.url}/${notification.track.url}`, false);
	};

	render ({ notification }) {
		let action = getAction(notification.notification.type);

		return (
			<Menu.Item class={style.user} href={`/${notification.user.url}/${notification.track.url}`} onClick={this.goTo}>
				<UserPictureName user={notification.from} class={style.userPic}>
					<TimeAgo
						datetime={dayjs(parseInt(notification.createdAt)).toDate()} 
						locale='en_AU'
						className={style.timeago}
						title={`Posted on ${dayjs(parseInt(notification.createdAt)).format('DD MMMM YYYY')}`}
					/>
				</UserPictureName>
				<p>{notification.from.displayName} {action} {notification.track.name}</p>
			</Menu.Item>
		);
	}
}