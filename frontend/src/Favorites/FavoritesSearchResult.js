import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class FavoritesSearchResult extends Component {

	constructor (props) {
		super(props);
		this.handleAddFavorite = this.handleAddFavorite.bind(this);
	}

	handleAddFavorite (e) {
		e.preventDefault();
		this.props.onAdd(this.props.item);
	}


	render () {
		let addButton;
		if (this.props.isFavorite) {
			addButton = <p className={'text-right float-right'}>In Favorites</p>;
		}
		else {
			addButton = <button className={'btn btn-success float-right'}
													onClick={this.handleAddFavorite}>Add Favorite</button>;
		}

		return (

			<li className={'list-group-item'}>{this.props.item.Name} {this.props.item.IsVegetarian ?
				<img height={'14px'} width={'14px'} alt={'vegetarian indicator'}
						 src="/vegetarian-mark.svg"/> : ''} {addButton}</li>


		);
	}

}

FavoritesSearchResult.propTypes = {
	item: PropTypes.object.isRequired,
	isFavorite: PropTypes.bool.isRequired,
	onAdd: PropTypes.func.isRequired
};