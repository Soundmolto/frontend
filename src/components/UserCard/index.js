import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { Link } from 'preact-router';

export class UserCard extends Component {
    render ({ user }) {
        return (
            <div>
                <Card>
                    <div>
                        <h2 class=" mdc-typography--title">
                            {user.profile.displayName || "Untitled user"}
                        </h2>
                        <div class=" mdc-typography--caption">
                            {user.profile.description || "No description"}
                        </div>
                    </div>
                    <Card.Actions>
                        <Link className="mdc-card__action mdc-button mdc-card__action--button" style="width: 100%" href={`/users/${user.profile.url}`}>View Profile</Link>
                    </Card.Actions>
                </Card>
            </div>
        );
    }
}