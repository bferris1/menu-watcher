import {getCurrentMealIndex, SET_DATE, SET_MEAL, SET_MENUS} from './actions';
import moment from 'moment';

const now = moment();
const initialState = {date: now, filtered: {[now]: [[], [], [], []]}, meal: getCurrentMealIndex()};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_DATE:
			return {...state, date: action.date};
		case SET_MENUS:
			return {...state, filtered: {...state.filtered, ...action.menus}};
		case SET_MEAL:
			return {...state, meal: action.meal};
		default:
			return state;
	}
}