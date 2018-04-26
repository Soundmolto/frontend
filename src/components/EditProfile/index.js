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
import { edit_profile } from '../../actions/profile';

const full_width = Object.freeze({ width: '100%' });

let state = { profile: {} };

/**
 * The login page / component
 */
@connect(({ user, auth }) => ({user, auth}))
export default class EditProfile extends Component {
    
    get values () {
        return Object.assign({}, state);
    }

    onSubmit (e) {
        e.preventDefault();
        const id = this.props.user.id;
        edit_profile(this.props.dispatch, {
            token: this.props.auth.token,
            profile: {
                ...state
            },
            id
        })
        return true;
    }

    onInputChange (e, val) {
        let _opt = { [val]: e.currentTarget.value };
        state.profile = {...state.profile, ..._opt };
    }

    render ({ user }) {
        state.profile = Object.assign({}, user.profile);
        return (
            <form onSubmit={this.onSubmit.bind(this)} class={styles.form}>
                <TextField label="Your display name" type="text" autofocus value={user.profile.displayName} style={full_width} onChange={e => this.onInputChange(e, 'displayName')} />
                <TextField label="Your profile URL" type="text" autofocus value={user.profile.url} style={full_width} onChange={e => this.onInputChange(e, 'url')} />
                <Button type="submit">Submit</Button>
            </form>
        );
    }
}
