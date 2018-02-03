import React, {Component} from 'react';
import Auth from '../AuthCtrl';
import AddFavoriteForm from './AddFavoriteForm';
import Alerts from '../Alerts';
import {connect} from 'react-redux';
import {addFavorite, fetchFavorites} from '../reducer/favorites/actions';
import PropTypes from 'prop-types';


class Favorites extends Component {

	constructor (props) {
		super(props);
		this.state = {
			favorites: [],
			alerts: {}
		};
		this.getFavorites = this.getFavorites.bind(this);
		if (!Auth.isLoggedIn()) this.props.history.push('/login');

	}

	getFavorites () {
		this.props.dispatch(fetchFavorites());
	}



	handleDeleteFavorite (item) {
		Auth.delete('/api/favorites/' + item.itemID).then(res => {
			console.log(res);
			this.getFavorites();
		});
	}

	handleChange (e) {
		this.setState({[e.target.name]: e.target.value});
	}

	componentDidMount () {
		this.getFavorites();
	}

	render () {
		let favoritesList = this.props.favorites.map((favorite, index) => {
			return <li className="list-group-item" key={index}>
				{favorite.itemName}
				<button className="btn btn-danger float-right"
								onClick={e => {
									e.preventDefault();
									this.handleDeleteFavorite(favorite);
								}}>Delete Favorite
				</button>
			</li>;
		});

		return (
			<div>
				<h1 className="my-2">Your Favorites</h1>
				<Alerts alerts={this.state.alerts}/>
				<ul className="list-group my-2">
					{favoritesList}
				</ul>
			</div>
		);
	}
}

AddFavoriteForm.propTypes = {
	favorites: PropTypes.array
};

const mapStateToProps = ({favorites}) => {
	return {favorites};
};

const mapDispatchToProps = dispatch => {
	return {
		handleAddFavorite: favorite => dispatch(addFavorite(favorite)),
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);