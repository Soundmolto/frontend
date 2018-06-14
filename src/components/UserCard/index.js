import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { Link } from 'preact-router';
import styles from './style.css';

export class UserCard extends Component {
    render ({ user }) {
        return (
            <div>
                <Card>
                    <div class={styles.overlayImage}></div>
                    <div class={styles.profile} style={{ "background-image": `url(${user.profile.profilePicture})` }}></div>
                    <div style={{ 'z-index': 3 }}>
                        <h2 class=" mdc-typography--title">
                            {user.profile.displayName || "Untitled user"}
                        </h2>
                        <div class=" mdc-typography--caption" style={{ 'word-break': 'break-all' }}>
                            {user.profile.description || "No description"}
                        </div>
                    </div>
                    <Card.Actions style={{ 'z-index': 3 }}>
                        <Link className="mdc-card__action mdc-button mdc-card__action--button" style="width: 100%" href={`/${user.profile.url}`}>View Profile</Link>
                    </Card.Actions>
                </Card>
            </div>
        );
    }
}