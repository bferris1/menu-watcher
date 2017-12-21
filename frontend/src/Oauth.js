import React, {Component} from 'react';
import Auth from './AuthCtrl';
import Alerts from './Alerts';
import {connect} from 'react-redux';
import {getUser} from './reducer/user/actions';
import LoginForm from './Auth/LoginForm';
import OauthForm from './Auth/OauthForm';

class Oauth extends Component {

	constructor (props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleOauth = this.handleOauth.bind(this);
		this.state = {email: '', password: '', alerts: []};
		if (Auth.isLoggedIn() && this.props.user) {
			// this.props.history.push('/menu-watcher');
		}
	}

	componentDidMount () {

		console.log(this.props.user);
		setTimeout(() => {
			console.log(this.props.user);
		}, 2000);
	}

	handleLogin (formState) {
		console.log(formState);
		Auth.login(formState.email, formState.password).then(res => {
			if (res.success) {
				this.props.onLogin();
			} else {
				console.error(res);
				this.setState({
					alerts: {danger: res.error}
				});
			}
		});
	}

	handleOauth (result) {
		if (!result) return;
		let params = new URLSearchParams(this.props.location.search);
		console.log(result);
		let redirectURL = params.get('redirect_uri');
		let state = params.get('state');
		let authToken = Auth.getToken();
		let finalURL = redirectURL + `#access_token=${authToken}&token_type=bearer&state=${state}`;
		// this.props.history.push('https://google.com');
		window.location = finalURL;
	}

	render () {

		let params = new URLSearchParams(this.props.location.search);
		let clientID = params.get('client_id');
		let redirectURI = params.get('redirect_uri');
		let state = params.get('state');
		let responseType = params.get('response_type');
		let isValid = (clientID && redirectURI && state && responseType);
		//todo: check redirectURI against clientID
		if (!isValid) {
			// this.props.history.push('/');
		}


		let form;
		if (!this.props.user) {
			form = <LoginForm onLogin={this.handleLogin}/>;
		} else {
			form = <OauthForm service={clientID} onResult={this.handleOauth}/>;
		}


		return (
			<div className="row">
				<div className="col-sm-10 offset-sm-1">
					<h1 className="mt-2">Authenticate</h1>
					<Alerts alerts={this.state.alerts}/>
					{form}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({user}) => {
	return {user};
};

const mapDispatchToProps = dispatch => {
	return {
		onLogin: () => {
			dispatch(getUser());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Oauth);