import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';
import FormField from 'preact-material-components/FormField';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/FormField/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import styles from './style';

const full_width = Object.freeze({ width: '100%' });

let state = { profile: {} };

/**
 * The login page / component
 */
@connect(({ user }) => user)
export default class EditProfile extends Component {
    
    get values () {
        return Object.assign({}, state);
    }

    onSubmit (e) {
        e.preventDefault();
        return true;
    }

    onProfileUrlChange (e) {
        state.profile = {...state.profile, url: e.currentTarget.value };
    }

    render (user) {
        state.profile = Object.assign({}, user.profile);
        return (
            <FormField onSubmit={this.onSubmit.bind(this)} class={styles.formField}>
                <TextField label="Your display name" type="text" autofocus value={user.profile.displayName} style={full_width} />
                <TextField label="Your profile URL" type="text" autofocus value={user.profile.url} style={full_width} onChange={this.onProfileUrlChange} />
            </FormField>
        );
    }
}
