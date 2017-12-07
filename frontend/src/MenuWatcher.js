import React, {Component} from 'react';
import {Input, Button, Col, Row} from 'reactstrap';
import moment from 'moment';

import {DateStepper} from './SpecialForm';
import CollapsableCard from './CollapsableCard'
import Auth from './AuthCtrl';

export default class MenuWatcher extends Component {

  constructor(props){
      super (props);
      let now = moment();
      this.minDate = now.clone().startOf('day');
      this.maxDate = now.clone().endOf('day').add(4, 'days');
      let currentHour = now.hour();
      let currentMealIndex = 0;
      if (currentHour < 10) {
        currentMealIndex = 0;
      } else if(currentHour < 14) {
        currentMealIndex = 1;
      } else if (currentHour < 17) {
        currentMealIndex = 2;
      } else {
        currentMealIndex = 3;
      }

      this.state = {
        userID: '',
        date: now,
        mealIndex: currentMealIndex,
        meals: [[], [], [], []]
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleDateChange = this.handleDateChange.bind(this);
      this.getFavorites = this.getFavorites.bind(this);
      if (!Auth.isLoggedIn()) this.props.history.push('/login');
  }

  componentDidMount(){
    this.getFavorites();
  }

  handleChange(e){
      console.log(e.target.name + ": " + e.target.value);
      this.setState({[e.target.name]:e.target.value});
  }

  handleDateChange(newDate){
      console.log("date: " + newDate.format('MM-DD-YYYY'));
      this.setState({date: newDate}, this.getFavorites);
  }

  getFavorites(){
    Auth.get('/api/filtered/' + this.state.date.format('MM-DD-YYYY')).then(res => {
      if (res.success) {
        this.setState({
          meals: res.filtered
        })
      }
    })
  }



  render() {


    let diningCourtCards = this.state.meals[this.state.mealIndex].map((diningCourt, index) => {
      return (
        <CollapsableCard key={index} headingId={"heading-" + diningCourt.location.toLowerCase()}
          collapseId={"collapse-" + diningCourt.name.toLowerCase()}
          diningCourt={diningCourt} />
      );

    });

    return (
      <div>
        <h1>Purdue Menu Watcher </h1>
        <hr/>

        <div className="form">
          {/*<p>Today: {this.state.date.format('ll')}</p>*/}
          <h3>Chose a Meal:</h3>
          <DateStepper name={"Enter Date:"} date={this.state.date}
            min={this.minDate} max={this.maxDate}
            onChange={newDate => {this.handleDateChange(newDate)}} />
          <p className={"mb-2"} style={{marginTop:'15px'}}>Enter Meal Time:</p>
          <Input label="Choose Meal:" type="select" name="mealIndex"
            id="mealIndex" value={this.state.mealIndex}
            onChange={e => {this.handleChange(e)}}>
            <option value={0}>Breakfast</option>
            <option value={1}>Lunch</option>
            <option value={2}>Late Lunch</option>
            <option value={3}>Dinner</option>
          </Input>
        </div>

        <div style={{marginTop:'30px'}}>
          <h3>Your Favorites:</h3>
          <div style={{marginTop:'15px'}} className="diningCourtCards" id="accordion" role="tablist">
            {diningCourtCards}
          </div>
        </div>


      </div>
    );
  }

}
