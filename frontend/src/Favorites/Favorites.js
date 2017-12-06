import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from '../form';
import Auth from '../AuthCtrl';
import AddFavoriteForm from './AddFavoriteForm';
export default class Favorites extends Component {

  constructor(props){
    super (props);
    this.state = {
      favorites: []
    };
    this.getFavorites = this.getFavorites.bind(this);
    this.handleAddFavorite = this.handleAddFavorite.bind(this);
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

  handleAddFavorite(item){
    console.log(item);
    Auth.post('/api/favorites',
      {
        itemName: item.Name,
        itemID: item.ID
    }).then(res => {
      console.log(res);
      if (res.success){
        alert("Added successfully");
        this.getFavorites();
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
        <h1 className="my-2">Favorites</h1>
        <h2>Add favorite:</h2>
        <AddFavoriteForm onAdd={this.handleAddFavorite}/>

        <ul className="list-group my-2">
          {favoritesList}
        </ul>
      </div>
    )
  }
}