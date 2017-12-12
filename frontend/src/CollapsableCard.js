import React, { Component } from 'react';
import { Collapse, Button, CardBody, CardHeader, Card } from 'reactstrap';

class CollapsibleCard extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: true };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {

    let foodItems = this.props.diningCourt.favorites.map((favorite, index) => {

      return (<li key={favorite.ID}>{favorite.Name}</li>);

    });

    return (
      <div>
        <Card>
          <CardHeader>
            <Button color="link" size="lg" onClick={this.toggle}>
            {this.props.diningCourt.location} - {this.props.diningCourt.favorites.length} {this.props.diningCourt.favorites.length == 1 ? "Favorite" : "Favorites"}
            </Button>
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
