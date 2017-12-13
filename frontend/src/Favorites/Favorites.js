import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from '../form';
import Auth from '../AuthCtrl';
import AddFavoriteForm from './AddFavoriteForm';
import Alerts from '../Alerts';
import {connect} from 'react-redux'
import {fetchFavorites} from '../reducer/favorites/actions';


class Favorites extends Component {

  constructor(props){
    super (props);
    this.state = {
      favorites: [],
      alerts: {}
    };
    this.getFavorites = this.getFavorites.bind(this);
    this.handleAddFavorite = this.handleAddFavorite.bind(this);
    if (!Auth.isLoggedIn()) this.props.history.push('/login');

  }

  getFavorites(){
    this.props.dispatch(fetchFavorites())
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
        this.setState({alerts: {}});
        this.getFavorites();
      }else {
        this.setState({alerts: {danger: res.error}});
      }
    })
  }

  handleDeleteFavorite(item){
    Auth.delete('/api/favorites/'+item.itemID).then(res => {
      console.log(res);
      this.getFavorites();
    })
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  componentDidMount(){
    this.getFavorites();
  }

  render() {
    let favoritesList = this.props.favorites.map((favorite, index)=>{
      return <li className="list-group-item" key={index}>
        {favorite.itemName}
        <button className="btn btn-danger float-right"
                onClick={e => {e.preventDefault(); this.handleDeleteFavorite(favorite)}}>Delete Favorite</button>
      </li>
    });

    return (
      <div>
        <h1 className="my-2">Favorites</h1>
        <Alerts alerts={this.state.alerts}/>
        <h2>Add favorite:</h2>
        <AddFavoriteForm onAdd={this.handleAddFavorite}
                         onDelete={this.handleDeleteFavorite}
                         favorites={this.props.favorites.map(favorite => favorite.itemID)}/>
                         <br/>
        <h2>Your Favorites</h2>
        <ul className="list-group my-2">
          {favoritesList}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ({favorites}) => {
  return {favorites}
};

export default connect(mapStateToProps)(Favorites);