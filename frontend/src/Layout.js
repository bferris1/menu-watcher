import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Route, NavLink} from 'react-router-dom';
import {Row, Col} from 'reactstrap';
import Home from './Home';
import MenuWatcher from './MenuWatcher';


export default class Layout extends Component{

  constructor(props){
    super(props);
    this.state = {user:null}
  }

  componentDidMount(){

  }

  render(){
    return(
        <div className="mt-2">
          <Row>
            <Col sm={4}>
              <h1>Navigation</h1>
              <ul className="nav flex-column nav-fill nav-pills">
                <NavLink className="nav-link" exact to="/" activeClassName="active">Home</NavLink>
              </ul>
            </Col>
            <Col sm={8}>
              <Route exact path={"/"} component={Home} />
              <Route exact path={"/menu-watcher"} component={MenuWatcher} />
            </Col>
          </Row>
        </div>
    )
  }
}
