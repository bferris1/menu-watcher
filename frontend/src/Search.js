import React from 'react';
import {connect} from 'react-redux';
import {addFavorite} from './reducer/favorites/actions';
import AddFavoriteForm from './Favorites/AddFavoriteForm';

const Search = props => {

	return (
		<div>
			<h2>Search for items:</h2>
			<AddFavoriteForm onAdd={props.handleAddFavorite}
											 favorites={props.favorites.map(favorite => favorite.itemID)}/>
		</div>
	);
};


const mapStateToProps = ({favorites}) => {
	return {favorites};
};

const mapDispatchToProps = dispatch => {
	return {
		handleAddFavorite: favorite => dispatch(addFavorite(favorite)),
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);