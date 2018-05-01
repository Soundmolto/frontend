import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { Link } from 'preact-router';
import styles from './style';

const new_line_br = (text = '') => text.replace('\n', '<br />');

export class UserDescription extends Component {
    render ({ user }) {
        let className = `mdc-typography--title ${styles.username}`;
        return (
            <div>
                <Card>
                    <div>
                        <h2 class={className}>
                            {user.displayName || user.url || "Untitled user"}
                        </h2>
                        <div class={"mdc-typography--caption " + styles.caption} dangerouslySetInnerHTML={{__html: new_line_br(user.description) || "<p>No description</p>"}}>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}