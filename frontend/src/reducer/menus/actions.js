import Auth from '../../AuthCtrl';
import moment from 'moment';

export const SET_MENUS = 'SET_MENUS';
export const SET_DATE = 'SET_DATE';
export const SET_MEAL = 'SET_MEAL';


export const getCurrentMealIndex = () => {
  let now = moment();
  let currentHour = now.hour();
  let currentMealIndex = 0;
  if (currentHour < 10) {
    currentMealIndex = 0;
  } else if (currentHour < 14) {
    currentMealIndex = 1;
  } else if (currentHour < 17 && now.day() !== 6 && now.day() !== 0) {
    currentMealIndex = 2;
  } else {
    currentMealIndex = 3;
  }
  return currentMealIndex;
};

export function fetchMenus (date) {

  return (dispatch, getState) => {
    let actualDate = getState().menus.date || date;
    Auth.get('/api/filtered/' + actualDate.format('MM-DD-YYYY')).then(res => {
      if (res.success) {
        dispatch(setMenus(res.filtered));
      }
    });
  };
}

export function updateDate (date) {
  return dispatch => {
    dispatch(setDate(date));
    dispatch(fetchMenus(date));
  };
}

export function setDate (date) {
  return {
    type: SET_DATE,
    date
  };
}

export function setMenus (menus) {
  return {
    type: SET_MENUS,
    menus
  };
}

export function setMeal (index) {
  return {
    type: SET_MEAL,
    meal: index
  };
}