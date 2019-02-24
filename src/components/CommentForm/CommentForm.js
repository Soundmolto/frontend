import { Component } from "preact";
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import style from './style';

export class CommentForm extends Component {

	state = { comment: '' };

	onSubmit = (e) => {
		e.preventDefault();

		if (this.state.comment.trim() != '') {
			this.props.submitComment(this.state.comment, () => this.setState({ comment: '' }));
		}
	}

	render () {
		return (
			<form onSubmit={this.onSubmit} class={`${style.form} ${style.profile_contents}`}>
				<TextField
					label="Comment"
					textarea
					onChange={e => this.setState({ comment: e.target.value })}
					className={style.textarea}
					value={this.state.comment}
				/>
				<Button class={style.button} type="submit">Submit</Button>
			</form>
		);
	}
}