import React, { Component } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom'
import Layout from './Layout'



export default class AppRoutes extends Component{

  render(){
    return (
      <div className={"container"}>
        <Switch>
          <Route path="/" component={Layout}/>
        </Switch>
      </div>
    )
  }
}
