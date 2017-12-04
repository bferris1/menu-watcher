import React, {Component} from 'react';
import {Button, Col, Row} from 'reactstrap';
import moment from 'moment';

import {DateStepper} from './SpecialForm';

export default class MenuWatcher extends Component {

  constructor(props){
      super (props);
      let today = moment();
      this.minDate = moment().startOf('day');
      this.maxDate = moment().endOf('day').add(3, 'days');

      this.state = {
        userID: '',
        favFoods: [{
          itemId: '',
          itemName: ''
        }],
        date: today,
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

  handleDateChange(newDate){
      console.log("date: " + newDate.format('ll'));
      this.setState({date: newDate});
  }

  render() {

    return (
      <div>
        <h1>Purdue Menu Watcher </h1>
        <hr/>
        <p>Today: {this.state.date.format('ll')}</p>
        <DateStepper name={"Enter Date:"} date={this.state.date}
          min={this.minDate} max={this.maxDate}
          onChange={newDate => {this.handleDateChange(newDate)}} />
      </div>
    );
  }

}
