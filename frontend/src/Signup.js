import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from './form';
import Auth from './AuthCtrl';
import {Col, Form} from 'reactstrap';
import Alerts from './Alerts';
import {getUser} from './reducer/user/actions';
import {connect} from 'react-redux';

class Signup extends Component {
	constructor (props) {
		super(props);
		this.state = {password: '', email: '', alerts: []};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		if (Auth.isLoggedIn()) {
			this.props.history.push('/');
		}
	}

	handleChange (e) {
		this.setState({[e.target.name]: e.target.value});
	}

	handleSubmit (e) {
		e.preventDefault();
		console.log(this.state);
		Auth.post('/api/register', this.state).then(res => {
			console.log(res);
			if (res.success) {
				localStorage.setItem('token', res.token);
				this.props.onLogin();
				this.props.history.push('/favorites');
			} else {
				this.setState({
					alerts: {danger: res.error}
				});
				setTimeout(() => {
					this.setState({alerts: []});
				}, 5000);
			}
		});

	}

	render () {
		return (
			<div className="row mt-2">
				<div className="col-sm-10 offset-sm-1">
					<h1>Sign Up</h1>
					<p>Your are signing up for an account on this website, which is not affiliated with Purdue. Please do not use
						your Purdue credentials.</p>
					<Alerts alerts={this.state.alerts}/>
					<Form>
						<div className="row">
							<Col sm={12}>
								<EmailInput name={'email'} value={this.state.email} onChange={this.handleChange}/>
							</Col>
						</div>
						<div className="row">
							<Col sm={12}>
								<PasswordInput autoComplete={'new-password'} name={'password'} value={this.state.password}
															 onChange={this.handleChange}/>
							</Col>
						</div>
						<div className="row">
							<Col sm={12}>
								<button onClick={this.handleSubmit} type={'submit'} className="btn btn-block btn-primary">Sign Up
								</button>
							</Col>
						</div>
					</Form>
					<Link to={'/login'}>Log In</Link>
				</div>
			</div>
		);
	}
}

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		onLogin: () => {
			dispatch(getUser());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);