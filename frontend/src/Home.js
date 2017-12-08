import React, { Component } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const items = [
  {
    src: 'Purdue.jpg',
    altText: 'WELCOME TO PURDUE MENU WATCHER!',
    caption: 'Track all of your dining court favorites.'
  },
  {
    src: 'Purdue.jpg',
    altText: 'ADD TO YOUR FAVES!',
    caption: 'Click on the Favorites tab to view and add to your favorites.'
  },
  {
    src: 'Purdue.jpg',
    altText: 'GET STARTED TODAY!',
    caption: 'Click on the Import tab to login with your PurdueID.'
  }
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: null,
      activeIndex: 0
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  componentDidMount() {

  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }


  render() {

    const { activeIndex } = this.state;

    const slides = items.map((item, index) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={index}
          src={item.src}
          altText={item.altText}
        >
          <CarouselCaption className="text" captionText={item.caption} captionHeader={item.altText} />
        </CarouselItem>
      );
    });

    return (
      <div>
        <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
      </div>
    );
  }
}
