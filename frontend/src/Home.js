import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: null
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h1>Welcome. This is the home page.</h1>
      </div>
    );
  }
}