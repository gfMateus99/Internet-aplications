import React, { Component } from "react";

import db from '../config/firebaseConfig'
import { ref, onValue} from "firebase/database";

import OrganizeTournment from './OrganizeTournment';

class OrganizeTournmentClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: []
    };
  }
 
  componentDidMount() {
    const starCountRef = ref(db);
    var data = {}
    onValue(starCountRef, (snapshot) => {
      data = snapshot.val();
      console.log(data)
      this.setState({ database: data });
    });
  }
 

  render() {
    return (
      <OrganizeTournment title={"Organize Tournament"} database={this.state.database} user={this.props.user}></OrganizeTournment>
    );
  }
}

export default OrganizeTournmentClass;
