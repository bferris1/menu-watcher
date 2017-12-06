import React, {Component} from 'react';
import {LabeledInput, PasswordInput} from './form';
import Auth from './AuthCtrl';
import {Col, Form} from 'reactstrap';

export default class Import extends Component{
  constructor(props) {
    super(props);
    this.state = {user: "", password: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    console.log(this.state);
    Auth.post('/api/import', this.state).then(res => {
      console.log(res);
      if (res.success) {

        this.props.history.push('/favorites');
      } else {

      }
    })

  }

  render(){
    return (
      <div className="mt-2">
        <div>
          <h1>Import Your Favorites</h1>
          <Form>
            <div className="row">
              <Col sm={12}>
                <LabeledInput name={"user"} label={"Purdue ID (not email)"} value={this.state.user} onChange={this.handleChange}/>
              </Col>
            </div>
            <div className="row">
              <Col sm={12}>
                <PasswordInput name={"password"} value={this.state.password} onChange={this.handleChange}/>
              </Col>
            </div>
            <div className="row">
              <Col sm={12}>
                <button onClick={this.handleSubmit} type={"submit"} className="btn btn-block btn-primary">Import Purdue Favorites</button>
              </Col>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}