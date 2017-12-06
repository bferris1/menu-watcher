import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from './form';
import Auth from './AuthCtrl';
export default class Favorites extends Component {

  constructor(props){
    super (props);
    this.state = {
      favorites: []
    };
    this.getFavorites = this.getFavorites.bind(this);
  }

  getFavorites(){
    Auth.get('/api/favorites').then(res => {
      if (res.success){
        this.setState({
          favorites: res.favorites
        })
      }
    })
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  componentDidMount(){
    this.getFavorites();
  }

  render() {
    let favoritesList = this.state.favorites.map((favorite, index)=>{
      return <li className="list-group-item" key={index}>{favorite.itemName}</li>
    });

    return (
      <div>
        <h1>Favorites</h1>
        <ul className="list-group">
          {favoritesList}
        </ul>
      </div>
    )
  }
}