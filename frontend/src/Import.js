import React, {Component} from 'react';
import {LabeledInput, PasswordInput} from './form';
import Auth from './AuthCtrl';
import {Col, Form} from 'reactstrap';
import {Alerts} from './Alerts';

export default class Import extends Component {
	constructor (props) {
		super(props);
		this.state = {user: '', password: '', alerts: []};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		if (!Auth.isLoggedIn()) this.props.history.push('/login');
	}


	handleChange (e) {
		this.setState({[e.target.name]: e.target.value});
	}

	handleSubmit (e) {
		e.preventDefault();
		Auth.post('/api/import', this.state).then(res => {
			console.log(res);
			if (res.success) {
				this.setState({alerts: {success: 'Imported successfully!'}});
				setTimeout(() => {
					this.props.history.push('/favorites');
				}, 3000);
			} else {
				this.setState({alerts: {danger: res.error}});
				setTimeout(() => {
					this.setState({alerts: []});
				}, 5000);
			}
		});

	}

	render () {
		return (
			<div className="mt-2">
				<div>
					<h1>Import Your Favorites</h1>
					<Alerts alerts={this.state.alerts}/>
					<h6>Enter your Purdue credentials to import your favorites from the Purdue menu system.</h6>
					<p style={{fontSize: '14px'}} className="text-sm">
						Your Purdue credentials are not stored and are only used to retrieve your favorites from the Purdue dining
						favorites system
						(<a target={'_blank'} href={'https://github.com/moufee/menu-watcher/blob/develop/routes/api.js#L192'}>See
						for yourself</a>).
					</p>
					<Form>
						<div className="row">
							<Col sm={12}>
								<LabeledInput name={'user'} label={'Purdue ID (username, not full email)'} value={this.state.user}
															onChange={this.handleChange}/>
							</Col>
						</div>
						<div className="row">
							<Col sm={12}>
								<PasswordInput name={'password'} value={this.state.password} onChange={this.handleChange}/>
							</Col>
						</div>
						<div className="row">
							<Col sm={12}>
								<button onClick={this.handleSubmit} type={'submit'} className="btn btn-block btn-primary">Import Purdue
									Favorites
								</button>
							</Col>
						</div>
					</Form>
				</div>
			</div>
		);
	}
}