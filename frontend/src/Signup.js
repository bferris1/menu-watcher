import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {EmailInput, PasswordInput, LabeledInput} from "./form";
import Auth from './AuthCtrl';
import {Form, Row, Col} from 'reactstrap';

export default class Signup extends Component{
  constructor(props){
    super(props);
    this.state = {firstName:"", lastName:"", password:"", email:""};
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
    console.log(this.state);

  }

  render(){
    return (
      <div className="row mt-2">
        <div className="col-sm-6 offset-sm-3">
          <Form>
            <Row>
              <Col sm={6}>
                <LabeledInput name="firstName" label={"First Name"} value={this.state.firstName} onChange={this.handleChange}/>
              </Col>
              <Col sm={6}>
                <LabeledInput name="lastName" label={"Last Name"} value={this.state.lastName} onChange={this.handleChange} />
              </Col>
            </Row>
            <div className="row">
              <Col sm={12}>
                <EmailInput value={this.state.email} onChange={this.handleChange}/>
              </Col>
            </div>
            <div className="row">
              <Col sm={12}>
                <PasswordInput value={this.state.password} onChange={this.handleChange}/>
              </Col>
            </div>
            <div className="row">
              <Col sm={12}>
                <button type={"submit"} className="btn btn-block btn-primary">Log In</button>
              </Col>
            </div>
          </Form>
          <Link to={"/login"}>Log In</Link>
        </div>
      </div>
    )
  }
}