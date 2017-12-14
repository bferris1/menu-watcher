import React from 'react';
import {Input} from 'reactstrap';


export const DateStepper = (props) => {
  let inc = function () {
    let newDate = props.date;
    newDate = props.date.clone().add(1, 'days');
    if (props.max && newDate.isSameOrBefore(props.max))
      props.onChange(newDate);

  };

  let dec = function () {
    let newDate = props.date;
    newDate = props.date.clone().add(-1, 'days');
    if (props.min && newDate.isSameOrAfter(props.min))
      props.onChange(newDate);
  };

  return (
    <div className={'my-2'}>
      <p className={'mb-2'}>{props.name}</p>
      <div className={'d-flex justify-content-start'}>
        <button className={'btn btn-danger'} onClick={e => {
          e.preventDefault();
          dec();
        }}>-
        </button>
        <Input readonly className="text mx-2" type="text" value={props.date.format('ddd MMM Do')}/>
        <button className={'btn btn-success'} onClick={e => {
          e.preventDefault();
          inc();
        }}>+
        </button>
      </div>
    </div>
  );
};

export const CollapsibleCard = (props) => {

  let foodList = props.diningCourt.foodItems.map((foodItem, index) => {

    return (<li>{foodItem}</li>);

  });

  return (
    <div className="card">
      <div className="card-header" role="tab" id={props.headingId}>
        <h5 className="mb-0">
          <a data-toggle="collapse" href={'#' + props.collapseId} aria-expanded="false"
             aria-controls={props.collapseId}>
            {props.diningCourt.name}
          </a>
        </h5>
      </div>

      <div id={props.collapseId} className="collapse show" role="tabpanel" aria-labelledby={props.headingId}
           data-parent="#accordion">
        <div className="card-body">
          {foodList}
        </div>
      </div>
    </div>
  );

};
