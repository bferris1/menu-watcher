import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import AuthCtrl from './AuthCtrl';
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
    if (AuthCtrl.isLoggedIn())
        AuthCtrl.get('/api/account').then((res)=>{
            if (res.success)
                this.setState({user:res.user});
            else
              console.log(res);
        })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(){

    let userAcc;
    let logout;
    if (this.state.user != null){
      userAcc = "Loged in as: " + this.state.user.email;
      logout = <a onClick={e => {e.preventDefault(); AuthCtrl.logout(); this.props.history.push('/login')}} href={""}>Logout</a>
    }
    else{
      userAcc = "You are not loged in"
    }

    return(

      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/"> PMW </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link" exact to="/menu-watcher" activeClassName="active">Menu Watcher</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" exact to="/favorites" activeClassName="active">Favorites</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" exact to="/import" activeClassName="active">Import</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  User Options
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>
                    {userAcc}
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    {logout}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
        <Route exact path={"/"} component={Home} />
        <Route exact path={"/menu-watcher"} component={MenuWatcher} />
        <Route path={'/favorites'} component={Favorites}/>
        <Route path={'/import'} component={Import}/>
        <Route path={'/account'} component={Account}/>
      </div>
    )
  }
}
