import {LOGOUT, SET_USER} from './actions';

const initialState = null;


export default (state = initialState, action) => {
	switch (action.type) {
		case LOGOUT:
			return null;
		case SET_USER:
			return action.user;
		default:
			return state;
	}
}