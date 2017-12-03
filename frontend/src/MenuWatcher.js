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
        date : '',
        mealTime: '',
        foodList: [{
          dinningCourt: '',
          foodItems: []
        }]
      };
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
      this.setState({[e.target.name]:e.target.value});
  }

  render() {

    return (
      <div>
        <h1>Purdue Menu Watcher </h1>
        </hr>
      </div>
    );
  }

}
