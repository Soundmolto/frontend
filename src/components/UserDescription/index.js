import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { Link } from 'preact-router';

const new_line_br = text => {
    let _t = text;
    try {
        _t = text.replace('\n', '<br />');
    } catch (e) {
        console.error(e);
    } finally {
        return _t;
    }
};

export class UserDescription extends Component {
    render ({ user }) {
        return (
            <div>
                <Card>
                    <div>
                        <h2 class=" mdc-typography--title">
                            {user.profile.displayName || user.profile.url || "Untitled user"}
                        </h2>
                        <div class=" mdc-typography--caption" dangerouslySetInnerHTML={{__html: new_line_br(user.profile.description) || "<p>No description</p>"}}>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}