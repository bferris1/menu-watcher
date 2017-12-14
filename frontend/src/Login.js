import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from './form';
import Auth from './AuthCtrl';
import Alerts from './Alerts';
import {connect} from 'react-redux';
import {getUser} from './reducer/user/actions';

class Login extends Component {

  constructor (props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {email: '', password: '', alerts: []};
    if (Auth.isLoggedIn()) {
      this.props.history.push('/menu-watcher');
    }
  }

  handleLogin (e) {
    e.preventDefault();
    console.log(this.state);
    Auth.login(this.state.email, this.state.password).then(res => {
      if (res.success) {
        this.props.onLogin();
        this.props.history.push('/menu-watcher');
      } else {
        console.error(res);
        this.setState({
          alerts: {danger: res.error}
        });
      }
    });
  }

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render () {
    return (
      <div className="row">
        <div className="col-sm-10 offset-sm-1">
          <h1 className="mt-2">Log In</h1>
          <Alerts alerts={this.state.alerts}/>
          <form onSubmit={this.handleLogin}>
            <EmailInput name={'email'} value={this.state.email} onChange={this.handleChange}/>
            <PasswordInput name={'password'} value={this.state.password} onChange={this.handleChange}/>
            <button type={'submit'} onClick={this.handleLogin} className="btn btn-block btn-primary">Log In</button>
            <div>
              <Link to="/signup">Sign Up</Link><br/>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: () => {
      dispatch(getUser());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);