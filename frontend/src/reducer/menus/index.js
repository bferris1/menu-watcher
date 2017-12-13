import {SET_DATE, SET_MENUS} from './actions'
import moment from 'moment'

const initialState = {date: moment(), filtered: [[], [], [], []]};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATE:
      return {...state, date: action.date};
    case SET_MENUS:
      return {...state, filtered: action.menus};
    default:
      return state;
  }
}