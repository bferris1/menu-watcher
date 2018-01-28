import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from '../form';
import PropTypes from 'prop-types';

export default class LoginForm extends Component {

	constructor (props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {email: '', password: '', alerts: []};
	}

	handleLogin (e) {
		e.preventDefault();
		this.props.onLogin(this.state);
		console.log(this.state);
	}

	handleChange (e) {
		this.setState({[e.target.name]: e.target.value});
	}

	render () {
		return (
			<form onSubmit={this.handleLogin}>
				<EmailInput name={'email'} value={this.state.email} onChange={this.handleChange}/>
				<PasswordInput name={'password'} value={this.state.password} onChange={this.handleChange}/>
				<button type={'submit'} onClick={this.handleLogin} className="btn btn-block btn-primary">Log In</button>
				<div>
					<Link to="/signup">Sign Up</Link><br/>
				</div>
			</form>
		);
	}
}

LoginForm.propTypes = {
	onLogin: PropTypes.func.isRequired
};