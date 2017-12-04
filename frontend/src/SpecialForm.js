import React from 'react';
import {FormGroup, Input, Label} from 'reactstrap';

export const DateStepper = (props) => {
    let inc = function () {
        let newVal = Number(props.value);
        newVal += 1;
        if (props.max && newVal <= props.max)
            props.onChange(newVal);

    };

    let dec = function () {
        let newVal = props.value;
        newVal -= 1;
        if (props.min && newVal >= props.min)
            props.onChange(newVal);
    };

    return (
        <div className={"my-2"}>
            <p className={"mb-2"}>{props.name}</p>
            <div className={"d-flex justify-content-start"}>
                <button className={"btn btn-danger"} onClick={e => {e.preventDefault(); dec()}}>-</button>
                <Input className="text mx-2" type="text" value={props.date}/>
                <button className={"btn btn-success"} onClick={e => {e.preventDefault(); inc()}}>+</button>
            </div>
        </div>
    );
};
