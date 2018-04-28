import { Component } from "preact";
import Goku from '../../assets/goku.png';
import style from './style';

export class UserPictureName extends Component {
    render ({ user, show_location }) {
        return (
            <div class="vertical-center">
                <img src={Goku} />
                <h1>
                    {user.profile.displayName || user.profile.url || "[Name]"}
                    {show_location && <small className={style.smol}>{user.profile.location || ""}</small>}
                </h1>
            </div>
        );
    }
}