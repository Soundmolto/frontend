import { Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import { UserPictureName } from '../UserPictureName';
import { Link } from 'preact-router';
import styles from './style';
import { connect } from 'preact-redux';

@connect(state => state)
export class UserFollowing extends Component {

    render ({ viewedUser, style = {} }) {
        return (
            <div style={style}>
                <Card class={styles.card}>
                    <h1 style={{ 'margin-bottom': '10px' }}>Following {viewedUser.following.length}</h1>
                    {viewedUser.following.length !== 0 && viewedUser.following.map(follower => (
                        <Link href={`/${follower.url}`} class={styles.link}>
                            <UserPictureName user={follower} />
                        </Link>
                    ))}
                    {viewedUser.following.length <= 0 && (<p>Not following anyone</p>)}
                </Card>
            </div>
        );
    }
}