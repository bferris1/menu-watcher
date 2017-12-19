import AuthCtrl from '../../AuthCtrl';

export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT_USER';


export function getUser () {
	return dispatch => {
		AuthCtrl.get('/api/account').then((res) => {
			if (res.success)
				dispatch(setUser(res.user));
			else
				dispatch(logoutUser());
		});
	};
}

export function logoutUser () {
	return {
		type: LOGOUT
	};
}

export function setUser (user) {
	return {
		type: SET_USER,
		user
	};
}