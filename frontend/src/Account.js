import React, { Component } from 'react';
import {Row, Col, Button, Form} from 'reactstrap';
import {PasswordInput, LabeledInput, EmailInput} from './form'
import Auth from './AuthCtrl';

export default class Account extends Component{

  constructor(props){
    super(props);
    this.state={email:'', password:"", pushoverKey: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //fetch account information to populate form
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    // Auth.post('/api/account/profile', this.state).then(console.log);
  }

  render(){
    return (<div>
        <h1>Your Account</h1>
        <Form>
          <Row>
            <Col sm={12}>
              <EmailInput name={"email"} value={this.state.email} onChange={this.handleChange}/>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <PasswordInput name={"password"} value={this.state.password} onChange={this.handleChange}/>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <LabeledInput label={"Pushover Key"}
                            value={this.state.pushoverKey}
                            name={"pushoverKey"}
                            onChange={this.handleChange}/>
            </Col>
          </Row>
          <Button type={"submit"} block={true} color={"primary"}>Save Changes</Button>
        </Form>
      </div>
    )
  }
}

