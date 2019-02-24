import { Component } from "preact";
import style from './style';
import { UserPictureName } from '../../components/UserPictureName';
import TimeAgo from 'timeago-react';
import dayjs from 'dayjs';
import Icon from "preact-material-components/Icon";


export class Comments extends Component {

	deleteComment = (e, comment) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
		e.target.blur();
		this.props.deleteComment(comment);
	}

	render ({ comments, profile, user }) {
		return (
			<div class={style.comments}>
				<h1 class={style.mainHeader} style={{ margin: '0 0 10px 0' }}>
					Comments
					<small>{comments.length}</small>
				</h1>
				{comments && comments.map(comment => 
					<div class={style.customCard}>
						<div class={style.userPictureComment}>
							<UserPictureName user={profile} linksToProfile={true}>
								<TimeAgo
									datetime={dayjs(parseInt(comment.createdAt)).toDate()} 
									locale='en_AU'
									className={style.timeago}
									title={`Posted on ${dayjs(parseInt(comment.createdAt)).format('DD MMMM YYYY')}`}
								/>
								{user.id === comment.userId && (
									<Icon
										class={style.delete}
										onClick={e => this.deleteComment(e, comment)}
									>
										close
									</Icon>
								)}
							</UserPictureName>
						</div>
						<div class={style.comment}>
							<blockquote>{comment.comment}</blockquote>
						</div>
					</div>
				)}
			</div>
		);
	}
}