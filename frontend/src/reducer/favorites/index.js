import {SET_FAVORITES} from './actions';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVORITES:
      return action.favorites;
    default:
      return state;
  }
}