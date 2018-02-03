import {ADD_FAVORITE, SET_FAVORITES} from './actions';

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_FAVORITES:
			return action.favorites;
		case ADD_FAVORITE:
			let newState = state.slice();
			newState.unshift(action.item);
			return newState;
		default:
			return state;
	}
}