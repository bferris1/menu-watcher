import React from 'react';
import {connect} from 'react-redux';
import {addFavorite, fetchFavorites} from './reducer/favorites/actions';
import AddFavoriteForm from './Favorites/AddFavoriteForm';

class Search extends React.Component {


	componentDidMount () {
		this.props.fetchFavorites();
	}

	render () {
		return (
			<div>
				<h2>Search for items:</h2>
				<AddFavoriteForm onAdd={this.props.handleAddFavorite}
												 favorites={this.props.favorites.map(favorite => favorite.itemID)}/>
			</div>
		);
	}

}

const mapStateToProps = ({favorites}) => {
	return {favorites};
};

const mapDispatchToProps = dispatch => {
	return {
		handleAddFavorite: favorite => dispatch(addFavorite(favorite)),
		fetchFavorites: () => dispatch(fetchFavorites())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);