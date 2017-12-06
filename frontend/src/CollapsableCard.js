import React, { Component } from 'react';
import { Collapse, Button, CardBody, CardHeader, Card } from 'reactstrap';

class CollapsibleCard extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {

    let foodItems = this.props.diningCourt.foodItems.map((foodItem, index) => {

      return (<li>{foodItem}</li>);

    });

    return (
      <div>
        <Card>
          <CardHeader>
            <Button color="link" size="lg" onClick={this.toggle}>{this.props.diningCourt.name}</Button>
          </CardHeader>
          <Collapse isOpen={this.state.collapse}>
              <CardBody>
                {foodItems}
              </CardBody>
          </Collapse>
        </Card>

      </div>
    );
  }
}

export default CollapsibleCard;
