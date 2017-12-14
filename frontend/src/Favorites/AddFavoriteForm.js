import React, {Component} from 'react';
import {Form} from 'reactstrap';
import {DebounceInput} from 'react-debounce-input';
import Auth from '../AuthCtrl';

export default class AddFavoriteForm extends Component {

  constructor (props) {
    super(props);
    this.state = {
      query: '',
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  search () {
    Auth.get('/api/search/' + this.state.query).then(res => {
      if (res.success) {
        console.log(res);
        this.setState({
          results: res.searchResults.Results
        });
      }
    });
  }

  handleChange (e) {
    if (e.target.value === '') {
      this.setState({
        results: [],
        query: ''
      });
    } else {
      this.setState({[e.target.name]: e.target.value}, this.search);
    }
  }


  render () {
    let favorites = this.props.favorites;
    let resultsList = this.state.results.slice(0, 10).map((item, index) => {
      let addButton;
      if (!favorites.includes(item.ID))
        addButton = <button className="btn btn-success float-right" onClick={e => {
          e.preventDefault();
          this.props.onAdd(item);
        }}>Add Favorite</button>;
      else
        addButton = <p className="text-right float-right">In Favorites</p>;
      return <li className="list-group-item" key={index}>{item.Name}
        {addButton}
      </li>;
    });
    return (
      <div>
        <Form>
          <DebounceInput className="form-control"
                         name={'query'}
                         debounceTimeout={500}
                         minLength={3}
                         onChange={this.handleChange}/>
        </Form>
        <br/><br/>
        <ul className="list-group my-2">
          {resultsList.length > 0 ? resultsList : <p>No results</p>}
        </ul>
      </div>
    );
  }

}