import { Component } from "preact";
import Goku from '../../assets/goku.png';
import style from './style';

export class UserPictureName extends Component {
    render ({ user }) {
        return (
            <div class="vertical-center">
                <img src={Goku} />
                <h1>
                    {user.profile.displayName || user.profile.url || "[Name]"}
                    <small className={style.smol}>{user.profile.location || ""}</small>
                </h1>
            </div>
        );
    }
}