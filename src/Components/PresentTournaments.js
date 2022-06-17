import React, { Component } from "react";
//import ReactGA from "react-ga";
//import "./App.css";

import db from "../config/firebaseConfig";
import { ref, onValue, push, child, update } from "firebase/database";

import PresentTournmentAux from "./PresentTournmentAux";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

class PresentTournaments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: [],
    };

    //    ReactGA.initialize("UA-110570651-1");
    //    ReactGA.pageview(window.location.pathname);
  }

  componentDidMount() {
    const starCountRef = ref(db);
    var data = {};
    onValue(starCountRef, (snapshot) => {
      data = snapshot.val();
      console.log(data);
      this.setState({ database: data});
    });

  }

  writeNewPost(objecto, id) {

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates["/" + id + "/"] = objecto;
    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return update(ref(db), updates);
  }

  render() {
    return (
      <>
        {this.props.user === null ? (
          <PresentTournmentAux
          key={23123123}
            database={this.state.database}
            user={this.props.user}
            writeNewPost={this.writeNewPost}
          ></PresentTournmentAux>
        ) : (
          <PresentTournmentAux
          key={2312553}

            database={this.state.database}
            user={this.props.user}
            writeNewPost={this.writeNewPost}
          ></PresentTournmentAux>
        )}
      </>
    );
  }
}

export default PresentTournaments;
