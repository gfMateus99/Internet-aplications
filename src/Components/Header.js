import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Avatar from '@mui/material/Avatar';

import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

import { signOut } from "firebase/auth";

export default function Header(props) {
  //const [logIn, setLogIn] = React.useState(true);

  let navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    navigate("/logIn", { replace: true });
    //setLogIn(false)
  }

  async function redirectToMainPage(event) {
    event.preventDefault();
    navigate("/", { replace: true });
  }

  const logOutAccount = async () => {
    await signOut(auth);
  };

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={redirectToMainPage}
          >
            Online tournaments
          </Typography>
          <nav>
            {props.user?.emailVerified && (
              <Link
                variant="button"
                color="text.primary"
                href="organizeTournament"
                sx={{ my: 1, mx: 1.5 }}
              >
                Organize tournament
              </Link>
            )}
            {props.user?.emailVerified && (
              <Link
                variant="button"
                color="text.primary"
                href="myTournaments"
                sx={{ my: 1, mx: 1.5, marginRight:"40px" }}
              >
                My tournaments
              </Link>
            )}
          </nav>
          {props.logIn && !props.displayLogOut && (
            <Button
              onClick={handleSubmit}
              href="#"
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
            >
              Log In
            </Button>
          )}
          {props.displayLogOut && (
            <div style={{display:"flex"}}>
              <Avatar sx={{ width: "30px", height:"30px", marginTop: "10px", marginRight: "5px" }}>{props.user?.displayName.charAt(0)}</Avatar>

              <div style={{marginTop:"13px"}}>

              {props.user?.displayName.split(" ")[0]}

              </div>
              <Button
                onClick={logOutAccount}
                href="#"
                variant="outlined"
                sx={{ my: 1, mx: 1.5 }}
              >
                Log Out
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {/*
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Pricing
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Quickly build an effective pricing table for your potential customers with
          this layout. It&apos;s built with default MUI components with little
          customization.
        </Typography>
      </Container>
      */}
    </React.Fragment>
  );
}
