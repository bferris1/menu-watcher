import React, {Component} from 'react';
import {Form} from 'reactstrap';
import {LabeledInput} from '../form';
import {DebounceInput} from 'react-debounce-input'
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

  search(){
    Auth.get('/api/search/' + this.state.query).then(res => {
      if (res.success){
        console.log(res);
        this.setState({
          results: res.searchResults.Results
        })
      }
    })
  }

  handleChange (e) {
    if (e.target.value == ''){
      this.setState({
        results: []
      });
      return;
    }
    this.setState({[e.target.name]:e.target.value}, this.search);
  }


  render () {
    let resultsList = this.state.results.slice(0,10).map((item, index)=>{
      return <li className="list-group-item" key={index}>{item.Name}
      <button className="btn btn-success float-right" onClick={e => {e.preventDefault(); this.props.onAdd(item)}}>Add Favorite</button>
      </li>
    });
    return (
      <div>
        <Form>
          <DebounceInput className="form-control"
                         name={"query"}
                         debounceTimeout={500}
                         onChange={this.handleChange}/>
        </Form>
        <br/><br/><br/>
        <ul className="list-group my-2">
          {resultsList.length > 0 ? resultsList: <p>No results</p>}
        </ul>
        <br/><br/>
      </div>
    );
  }

}