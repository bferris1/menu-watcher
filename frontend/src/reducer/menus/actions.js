import Auth from '../../AuthCtrl';

export const SET_MENUS = 'SET_MENUS';
export const SET_DATE = 'SET_DATE';

export function fetchMenus () {
  return (dispatch, getState) => {
    Auth.get('/api/filtered/' + getState().menus.date.format('MM-DD-YYYY')).then(res => {
      if (res.success) {
        dispatch(setMenus(res.filtered));
      }
    })
  }
}

export function setDate(date){
  return {
    type: SET_DATE,
    date
  }
}

export function setMenus (menus) {
  return {
    type: SET_MENUS,
    menus
  }
}