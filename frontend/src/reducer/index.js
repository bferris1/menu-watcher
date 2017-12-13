import {combineReducers} from 'redux'
import user from './user'
import favorites from './favorites'
import menus from './menus'

export default combineReducers({
  user,
  favorites,
  menus
});