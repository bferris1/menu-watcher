import React, {Component} from 'react';
import {Input, Button, Col, Row} from 'reactstrap';
import moment from 'moment';

import {DateStepper, CollapsibleCard} from './SpecialForm';
import {LabeledInput} from './form';

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
        diningCourts: [{
          name: '',
          foodItems: []
        }]
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount(){
    this.setState({diningCourts: [
      {
        name: "Ford",
        foodItems: ["Cheese Burger", "Corn on the Cob", "Apple Pie"]
      },
      {
        name: "Wiley",
        foodItems: ["Baby Back Ribs", "Cole Slaw", "Choclate Cake"]
      }
    ]});
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

    let meals = ["breakfast","lunch","dinner"];

    let diningCourtCards = this.state.diningCourts.map((diningCourt, index) => {

      return (
        <CollapsibleCard headingId={"heading" + index} collapseId={"collapse" + index}
          diningCourt={diningCourt} />
      );

    });

    return (
      <div>
        <h1>Purdue Menu Watcher </h1>
        <hr/>
        <div className="form">
          <p>Today: {this.state.date.format('ll')}</p>
          <DateStepper name={"Enter Date:"} date={this.state.date}
            min={this.minDate} max={this.maxDate}
            onChange={newDate => {this.handleDateChange(newDate)}} />
          <p className={"mb-2"}>Enter Meal Time:</p>
          <Input label="Choose Meal:" type="select" name="mealTime"
            id="mealTime" value={this.state.mealTime}
            onChange={e => {this.handleChange(e)}}>
            <option>breakfast</option>
            <option>lunch</option>
            <option>dinner</option>
          </Input>
        </div>
        <div className="diningCourtCards" id="accordion" role="tablist">
          {diningCourtCards}
        </div>

      </div>
    );
  }

}
