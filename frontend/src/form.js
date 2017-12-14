import React from 'react';

export const EmailInput = (props) => {
  return (
    <div className="form-group">
      <label>Email Address:</label>
      <input className="form-control" type="email"
             value={props.value}
             onChange={props.onChange}
             placeholder="Email Address"
             name={props.name}
             autoFocus={props.autofocus}
      />
    </div>
  );
};

export const PasswordInput = (props) => {
  return (
    <div className="form-group">
      <label>Password</label>
      <input className="form-control" type={'password'}
             value={props.value}
             onChange={props.onChange}
             placeholder={'Password'}
             name={props.name}
             autoFocus={props.autofocus}/>
    </div>
  );
};

export const LabeledInput = (props) => {
  return (
    <div className="form-group">
      <label>{props.label}</label>
      <input className="form-control"
             name={props.name} type={props.type} id={props.id}
             value={props.value} onChange={props.onChange}
             placeholder={props.label} autoFocus={props.autofocus}>
        {props.children}
      </input>
    </div>
  );
};