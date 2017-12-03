import React, { Component } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom'
import Layout from './Layout'
import Login from './Login'
import Signup from './Signup'


export default class AppRoutes extends Component{

  render(){
    return (
      <div className={"container"}>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/" component={Layout}/>
        </Switch>
      </div>
    )
  }
}
