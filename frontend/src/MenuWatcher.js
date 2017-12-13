import React, {Component} from 'react';
import {Input} from 'reactstrap';
import moment from 'moment';

import {DateStepper} from './SpecialForm';
import CollapsableCard from './CollapsableCard';
import Auth from './AuthCtrl';
import {connect} from 'react-redux';
import {fetchMenus, setMeal, updateDate} from './reducer/menus/actions';

class MenuWatcher extends Component {

  constructor(props){
    super (props);
    let now = moment();
    this.minDate = now.clone().startOf('day');
    this.maxDate = now.clone().endOf('day').add(5, 'days');

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getFavorites = this.getFavorites.bind(this);
    if (!Auth.isLoggedIn()) this.props.history.push('/login');
  }

  componentDidMount(){
    this.getFavorites();
  }

  handleChange(e){
    if (e.target.name === 'mealIndex'){
      this.props.dispatch(setMeal(e.target.value))
    } else
      this.setState({[e.target.name]:e.target.value});
  }

  handleDateChange(newDate){
    console.log("date: " + newDate.format('MM-DD-YYYY'));
    this.props.dispatch(updateDate(newDate));
  }

  getFavorites(){
    this.props.dispatch(fetchMenus());
  }



  render() {


    let diningCourtCards = this.props.meals[this.props.mealIndex].map((diningCourt, index) => {
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
          <h3>Choose a Meal:</h3>
          <DateStepper name={"Enter Date:"} date={this.props.date}
                       min={this.minDate} max={this.maxDate}
                       onChange={newDate => {this.handleDateChange(newDate)}} />
          <p className={"mb-2"} style={{marginTop:'15px'}}>Meal:</p>
          <Input label="Select Meal:" type="select" name="mealIndex"
                 id="mealIndex" value={this.props.mealIndex}
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

function mapStateToProps ({menus}) {
  return {
    meals: menus.filtered,
    date: menus.date,
    mealIndex: menus.meal
  }
}

export default connect(mapStateToProps)(MenuWatcher);