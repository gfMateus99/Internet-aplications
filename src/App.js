import React, { useState } from 'react';

import './App.css';
import Header from './Components/Header';
import { Routes, Route, Link } from "react-router-dom";

import LogInPage from './Components/LogInPage';
import SignUpPage from './Components/SignUp';
import PresentTournaments from './Components/PresentTournaments';
import ResetPass from './Components/ResetPass';
import Footer from './Components/Footer';
import OrganizeTournmentClass from './Components/OrganizeTournmentClass';
import MyTournmentsClass from './Components/MyTournmentsClass';

import {
  onAuthStateChanged
} from "firebase/auth";

import { ref, onValue } from "firebase/database";
import {auth} from './config/firebaseConfig';
import db from './config/firebaseConfig';


function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    console.log(currentUser?.emailVerified)
  });

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="logIn" element={<LogIn user={user}/>} />
        <Route path="signUp" element={<SignUp user={user}/>} />
        <Route path="resetPass" element={<Reset user={user}/>} />    
        <Route path="organizeTournament" element={<OrganizeTournament key={new Date().getMilliseconds()} user={user}/>} />       
        <Route path="myTournaments" element={<MyTournaments user={user}/>} />       
      </Routes>
    </div>
  );
}

function Home(props) {

  return (
    <>
      <Header logIn={true} user={props.user} displayLogOut={props.user?.emailVerified ? true: false} ></Header>
      <main>
        {/*<h2>{props.user?.email}</h2>
        <h2>{props.user?.emailVerified ? "verificado":"nao verificado"}</h2>
  {console.log(props.user)}*/}

        <PresentTournaments user={props.user} displayLogOut={props.user?.emailVerified ? true: false}></PresentTournaments>
      </main>
      <Footer
        title="Online tournaments Website"
        description="Done in the scope of the Internet Applications course!"
      />



    </>
  );
}


function LogIn(props) {
  return (
    <>
      <Header logIn={false} user={props.user}  displayLogOut={props.user?.emailVerified ? true: false}></Header>
      <LogInPage></LogInPage>
    </>
  );
}

function SignUp(props) {
  return (
    <>
      <Header logIn={false} user={props.user}  displayLogOut={props.user?.emailVerified ? true: false}></Header>
      <SignUpPage></SignUpPage>
    </>
  );
}

function Reset(props) {
  return (
    <>
      <Header logIn={false} user={props.user}  displayLogOut={props.user?.emailVerified ? true: false}></Header>
      <ResetPass user={props.user}></ResetPass>
    </>
  );
}

function OrganizeTournament(props) {
 
  return (
    <>
      <Header logIn={true} user={props.user}  displayLogOut={props.user?.emailVerified ? true: false}></Header>
      <OrganizeTournmentClass user={props.user}></OrganizeTournmentClass>
      <Footer
        title="Online tournaments Website"
        description="Done in the scope of the Internet Applications course!"
      />
    </>
  );
}

function MyTournaments(props) {
  return (
    <>
      <Header logIn={true} user={props.user}  displayLogOut={props.user?.emailVerified ? true: false}></Header>
      <MyTournmentsClass title={"My Tournaments"} user={props.user}></MyTournmentsClass>
      <Footer
        title="Online tournaments Website"
        description="Done in the scope of the Internet Applications course!"
      />
    </>
  );
}




export default App;
