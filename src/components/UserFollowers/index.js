import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { UserPictureName } from '../UserPictureName';
import { Link, route } from 'preact-router';
import styles from './style';
import { connect } from 'preact-redux';
import { fetch_user } from '../../actions/user';

@connect(state => state)
export class UserFollowers extends Component {
    render ({ viewedUser, style = {} }) {
        let className = `mdc-typography--title ${styles.username}`;
        return (
            <div style={style}>
                <Card class={styles.card}>
                    <h1 style={{ 'margin-bottom': '10px' }}>Followers</h1>
                    {viewedUser.followers.length !== 0 && viewedUser.followers.map(follower => (
                        <Link href={`/${follower.url}`} class={styles.link}>
                            <UserPictureName user={follower} />
                        </Link>
                    ))}
                    {viewedUser.followers.length <= 0 && (<p>No followers</p>)}
                </Card>
            </div>
        );
    }
}