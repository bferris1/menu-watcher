import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthCtrl from './AuthCtrl';
import {Link, NavLink, Route} from 'react-router-dom';
import {Collapse, Dropdown, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarToggler, NavItem} from 'reactstrap';


import Home from './Home';
import MenuWatcher from './MenuWatcher';
import Favorites from './Favorites/Favorites';
import Import from './Import';
import Account from './Account';
import Login from './Login';
import Signup from './Signup';
import {connect} from 'react-redux';
import {logoutUser} from './reducer/user/actions';


class Layout extends Component {

  constructor (props) {
    super(props);
    this.state = {
      user: null,
      isOpen: false,
      isSecondaryOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.toggleSecondary = this.toggleSecondary.bind(this);
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleSecondary () {
    this.setState({
      isSecondaryOpen: !this.state.isSecondaryOpen
    });
  }


  render () {

    let userAcc;
    let logout = null;
    if (this.props.user != null) {
      userAcc = this.props.user.email;
      logout = <Link to='/login' className="dropdown-item"
                     onClick={e => {
                       this.toggleSecondary();
                       this.props.onLogoutClick();
                       AuthCtrl.logout();
                     }}
      >

        Logout
      </Link>;
    }
    else {
      userAcc = 'You are not logged in';
    }

    return (

      <div>
        <Navbar color="faded" light expand="md">
          <Link className='navbar-brand' to='/'>PMW</Link>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.user == null ||
              [
                <NavItem>
                  <NavLink className="nav-link" exact to="/menu-watcher" activeClassName="active">Menu Watcher</NavLink>
                </NavItem>,
                <NavItem>
                  <NavLink className="nav-link" exact to="/favorites" activeClassName="active">Favorites</NavLink>
                </NavItem>,
                <NavItem>
                  <NavLink className="nav-link" exact to="/import" activeClassName="active">Import</NavLink>
                </NavItem>
              ]
              }

              {logout != null ?
                <Dropdown isOpen={this.state.isSecondaryOpen} toggle={this.toggleSecondary} nav inNavbar>
                  <DropdownToggle nav caret
                                  onClick={this.toggleSecondary}
                                  data-toggle="dropdown"
                                  aria-expanded={this.state.isSecondaryOpen}>
                    {userAcc}
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link onClick={this.toggleSecondary} className="dropdown-item" to="/account">Account</Link>
                    {logout}

                  </DropdownMenu>

                </Dropdown>
                :
                <Dropdown isOpen={this.state.isSecondaryOpen} toggle={this.toggleSecondary} nav inNavbar>
                  <DropdownToggle nav caret
                                  onClick={this.toggleSecondary}
                                  data-toggle="dropdown"
                                  aria-expanded={this.state.isSecondaryOpen}>
                    Not Logged In
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link onClick={this.toggleSecondary} className="dropdown-item" to="/login">Log In</Link>
                    <Link onClick={this.toggleSecondary} className="dropdown-item" to="/signup">Sign Up</Link>

                  </DropdownMenu>

                </Dropdown>
              }
            </Nav>
          </Collapse>
        </Navbar>
        <Route exact path={'/'} component={Home}/>
        <div className="col-sm-8 offset-sm-2">
          <Route exact path={'/menu-watcher'} component={MenuWatcher}/>
          <Route path={'/favorites'} component={Favorites}/>
          <Route path={'/import'} component={Import}/>
          <Route path={'/account'} component={Account}/>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

const mapDispatchToProps = dispatch => {
  return {
    onLogoutClick: () => {
      dispatch(logoutUser());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout);