import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput} from './form';
import Auth from './AuthCtrl';
export default class Login extends Component {

  constructor(props){
    super (props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {email:"", password:""};
    if (Auth.isLoggedIn()){
      this.props.history.push('/');
    }

  }

  handleLogin(){
    console.log(this.state);
    Auth.login(this.state.email, this.state.password).then(res => {
      if (res.success){
        this.props.history.push('/account');
      }
    });
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="form-group" onSubmit={this.handleLogin}>
            <EmailInput value={this.state.email} onChange={this.handleChange}/>
            <PasswordInput value={this.state.password} onChange={this.handleChange}/>
            <button type={"submit"} className="btn btn-block btn-primary">Log In</button>
            <div>
              <Link to="/signup">Sign Up</Link><br/>
              <Link to="/forgot">Forgot Password?</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}