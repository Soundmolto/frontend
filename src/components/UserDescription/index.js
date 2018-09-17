import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import snarkdown from 'snarkdown';
import styles from './style';

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
                        <div class={"mdc-typography--caption " + styles.caption} dangerouslySetInnerHTML={{ __html: snarkdown(user.description) || "<p>No description</p>" }}>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}