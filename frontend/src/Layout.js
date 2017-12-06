import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Route, NavLink} from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';


import Home from './Home';
import MenuWatcher from './MenuWatcher';
import Favorites from './Favorites/Favorites';
import Import from './Import';
import Account from './Account';


export default class Layout extends Component{

  constructor(props){
    super(props);
    this.state = {
      user:null,
      isOpen: false
    }
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount(){

  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(){
    return(

      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/"> PMW </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link" exact to="/" activeClassName="active">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" exact to="/menu-watcher" activeClassName="active">Menu Watcher</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>
                    Option 1
                  </DropdownItem>
                  <DropdownItem>
                    Option 2
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
        <Route exact path={"/"} component={Home} />
        <Route exact path={"/menu-watcher"} component={MenuWatcher} />
      </div>
    )
  }
}
