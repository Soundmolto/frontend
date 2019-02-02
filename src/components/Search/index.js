import { Component } from "preact";
import raf from 'raf';
import debounce from 'lodash.debounce';
import { API_ENDPOINT } from "../../api";
import styles from './style.css';
import { prefill_auth } from "../../prefill-authorized-route";
import Goku from '../../assets/goku.png';
import store from '../../store';
import { SEARCH } from "../../enums/search";

export class Search extends Component {

	onFocus = e => {
		store.dispatch({ type: SEARCH.SHOW_SEARCH_PANEL });
		e.target.blur();
	}

	render () {
		return (
			<div class={`search-container ${styles.container}`}>
				<input type="text" className="search-input" onFocus={this.onFocus} placeholder="Search for artists, songs or playlists" />
			</div>
		);
	}
}