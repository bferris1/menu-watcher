import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput, LabeledInput} from "./form";
import Auth from './AuthCtrl';
import {Form, Row, Col} from 'reactstrap';

export default class Signup extends Component{
  constructor(props){
    super(props);
    this.state = {password:"", email:""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    if (Auth.isLoggedIn()){
      this.props.history.push('/');
    }
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    console.log(this.state);
    Auth.post('/api/register', this.state).then(res => {
      console.log(res);
      if (res.success) {
        // localStorage.setItem("token", res.token);
        this.props.history.push('/login');
      } else {
        alert("An error occurred. Check your credentials.");
      }
    })

  }

  render(){
    return (
      <div className="row mt-2">
        <div className="col-sm-6 offset-sm-3">
          <h1>Sign Up</h1>
          <Form>
            <div className="row">
              <Col sm={12}>
                <EmailInput name={"email"} value={this.state.email} onChange={this.handleChange}/>
              </Col>
            </div>
            <div className="row">
              <Col sm={12}>
                <PasswordInput name={"password"} value={this.state.password} onChange={this.handleChange}/>
              </Col>
            </div>
            <div className="row">
              <Col sm={12}>
                <button onClick={this.handleSubmit} type={"submit"} className="btn btn-block btn-primary">Log In</button>
              </Col>
            </div>
          </Form>
          <Link to={"/login"}>Log In</Link>
        </div>
      </div>
    )
  }
}