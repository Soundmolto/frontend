import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';

export class UserCard extends Component {
    render ({ user }) {
        return (
            <div>
                <Card>
                    <div>
                        <h2 class=" mdc-typography--title">
                            {user.profile.displayName || ""}
                        </h2>
                        <div class=" mdc-typography--caption">
                            {user.profile.description || "No description"}
                        </div>
                    </div>
                    <Card.Actions>
                        <Card.ActionButton>View Profile</Card.ActionButton>
                    </Card.Actions>
                </Card>
            </div>
        );
    }
}