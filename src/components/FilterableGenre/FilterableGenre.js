import { Component, h } from 'preact';

export class FilterableGenre extends Component {

	filterByGenre = (event) => {
		event.preventDefault();
		if (this.props.sortingBy !== this.props.genre) {
			this.props.onFilterByGenre(this.props.genre);
		} else {
			this.props.onFilterByGenre(null);
		}
	}

	render ({ genre, sortingBy }) {
		const className = sortingBy === genre ? 'active' : '';
		return (
			<a href="#" onClick={this.filterByGenre} class={className}>
				{genre}
			</a>
		);
	}

}