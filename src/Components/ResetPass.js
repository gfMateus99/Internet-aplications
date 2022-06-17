import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";


import { auth } from "../config/firebaseConfig";

import {
    sendPasswordResetEmail 
  } from "firebase/auth";



const theme = createTheme();

export default function ResetPass() {

    let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
    });

    const userEmail = data.get('email');

    sendPasswordResetEmail(auth, userEmail)
    .then(() => {
      // Password reset email sent!
      // 
      alert("A link to reset your password was sent to your email")
      navigate("/", { replace: true });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
      // ..
    });


     
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100%' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://evatronix.com/images/en/offer/product-design/software-development/Evatronix_Web_applications_01_1920x1080.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 16.7,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Forgot your password?
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
      
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Insert your email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset pasword
            </Button>
            <Grid container justifyContent="flex-end">

            </Grid>
          </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}