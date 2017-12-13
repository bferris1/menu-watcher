import {SET_DATE, SET_MEAL, SET_MENUS, getCurrentMealIndex} from './actions';
import moment from 'moment'

const initialState = {date: moment(), filtered: [[], [], [], []], meal: getCurrentMealIndex()};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATE:
      return {...state, date: action.date};
    case SET_MENUS:
      return {...state, filtered: action.menus};
    case SET_MEAL:
      return {...state, meal: action.meal};
    default:
      return state;
  }
}