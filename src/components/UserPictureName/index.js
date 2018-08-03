import { Component } from "preact";
import Goku from '../../assets/goku.png';
import style from './style';

const className = style.smol;

export class UserPictureName extends Component {
    render ({ children, user, show_location, style = {}, h1_class = '' }) {
		let picture = user.profilePicture;
		if (picture === '') picture = Goku;
        return (
            <div class="vertical-center" style={style}>
                <img src={picture} />
                <h1 class={h1_class}>
                    {user.displayName || user.url || "[Name]"}
                    {show_location && <small class={className}>{user.location || ""}</small>}
                </h1>

                {children != null && children}
            </div>
        );
    }
}