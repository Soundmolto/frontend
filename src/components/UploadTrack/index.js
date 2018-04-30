import { Component } from "preact";
import style from './style';
import Icon from 'preact-material-components/Icon';
import { API_ENDPOINT } from "../../api";
import { prefill_auth } from "../../prefill-authorized-route";
import { connect } from "preact-redux";
import { USER } from "../../enums/user";

@connect(({ auth }) => ({ auth }))
export class UploadTrack extends Component {

    state = { active: false, imageSrc: '', loaded: false, loading: false };

    onDragEnter(e) {
        this.setState({ active: true });
    }

    onDragLeave(e) {
        this.setState({ active: false });
    }

    onDragOver(e) { 
        e.preventDefault(); 
    }

    onDrop(e) {
        e.preventDefault();
        this.setState({ active: false });
        this.onFileChange(e, e.dataTransfer.files[0]);
    }

    async onFileChange(e, f) {
        const file = f || e.target.files[0];
        const data = new FormData();
        const { token } = this.props.auth;
        data.append('file', file, file.name);
        this.setState({ loading: true });

        const post = await fetch(`${API_ENDPOINT}/tracks`, { method: "POST", headers: { ...prefill_auth(token) }, body: data });
        const payload = await post.json();

        this.props.dispatch({ type: USER.HAS_NEW_DATA, payload: payload.user });

        for (const id of payload.created) {
            console.log()
        }

        this.setState({ loaded: true, loading: false })
    }

    render (props, state) {
        let className = `${style.uploader} ${style.center}`;
        console.log(props, state)
        return (
            <div class={style.root}>
                <label className={className}
                    onDragEnter={this.onDragEnter.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)}
                    onDragOver={this.onDragOver.bind(this)}
                    onDrop={this.onDrop.bind(this)}>
                    
                    <img className={style.loaded}/>
                    <Icon class={style.icon}>cloud_upload</Icon> Upload Track
                    <input type="file" accept="audio/*" onChange={this.onFileChange.bind(this)} />
                </label>
            </div>
        );
    }

}