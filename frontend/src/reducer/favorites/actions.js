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

export function addFavorite () {

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