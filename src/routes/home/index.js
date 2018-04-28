import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import { Link } from 'preact-router';

export default class Home extends Component {
	render() {
		return (
			<div class={style.home}>
				<h1>Home route</h1>
				<Card>
					<div class={style.cardHeader}>
						<p>
							Shortcuts
							<ul>
								<li>
									<pre>Control + ,</pre>
									Open settings panel
								</li>
								<li>
									<pre>Control + g</pre>
									Open "Go to" panel
								</li>
							</ul>
						</p>
						<Link href="/users">Users</Link>
					</div>
				</Card>
			</div>
		);
	}
}
