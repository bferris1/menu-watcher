import React, {Component} from 'react';
import {Button, Col, Row} from 'reactstrap';

export default class MenuWatcher extends Component {

  constructor(props){
      super (props);
      this.state = {
        userID: '',
        favFoods: [{
          itemId: '',
          itemName: ''
        }],
        date: moment.add(-1, 'days').format('ll'),
        mealTime: '',
        foodList: [{
          dinningCourt: '',
          foodItems: []
        }]
      };
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
      console.log(e.target.name + ": " + e.target.value);
      this.setState({[e.target.name]:e.target.value});
  }

  render() {

    return (
      <div>
        <h1>Purdue Menu Watcher </h1>
        </hr>
        <p>Today: {moment.format('ll')}</p>
        <p>Yesterday: {this.state.date}</p>
      </div>
    );
  }

}
