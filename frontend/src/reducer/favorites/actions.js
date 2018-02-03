import Auth from '../../AuthCtrl';

export const ADD_FAVORITE = 'ADD_FAVORITE';
export const DELETE_FAVORITE = 'DELETE_FAVORITE';
export const SET_FAVORITES = 'SET_FAVORITES';

export function fetchFavorites () {
	return dispatch => {
		Auth.get('/api/favorites').then(res => {
			if (res.success) {
				dispatch(setFavorites(res.favorites));
			}
		});
	};
}

export function addFavorite (item) {
	return dispatch => {
		console.log('adding favorite');
		Auth.post('/api/favorites',
			{
				itemName: item.Name,
				itemID: item.ID
			}).then(res => {
			console.log(res);
			if (res.success) {
				dispatch(addFavoriteItem(res.favorite));
			} else {
				console.err('error adding favorite');
			}
		});
	};
}

export function deleteFavorite (index) {
	return {
		type: DELETE_FAVORITE,
		index
	};
}

export function setFavorites (favorites) {
	return {
		type: SET_FAVORITES,
		favorites
	};

}

export function addFavoriteItem (item) {
	return {
		type: ADD_FAVORITE,
		item
	};
}