import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Button, Box, TextField,
  Typography, Divider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useNavigate } from 'react-router-dom';
import { LockOpen, PersonAdd } from '@material-ui/icons';

import { registerUser } from './mapping';
import useStyles from './RegisterLoginStyle';

const RegisterPage = (props) => {
  const {
    setLoading, setUser,
  } = props;
 
  const classes = useStyles(10);

  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: {
      address: '',
    },
  });


  const handleChange = (prop, val) => {
    setData((prev) => ({ ...prev, [prop]: val }));
  };
  const handleAddress = (value) => {
    const newLocation = data.location;
    newLocation.address = value;
    handleChange('location', newLocation);
  };
  const handleLocation = async () => {
    const geoLocation = navigator.geolocation;
    const cords = (position) => {
      const newLocation = data.location;
      newLocation.lat = position.coords.latitude;
      newLocation.long = position.coords.longitude;
      handleChange('location', newLocation);
    };
    const error = (e) => {
      setAlert(e.message);
    };
    geoLocation.getCurrentPosition(cords, error, { timeout: 60000 });
  };

  return (
    <Box className={classes.cover}>
      <Box container="true" p={5} flexWrap="wrap" my="50px" borderRadius={5} className={classes.root}>
        {alert && <Alert style={{ marginBottom: '10%' }} severity="error">{alert}</Alert>}

        <Typography variant="h4" component="h4">
          <PersonAdd style={{ marginRight: '5%' }} />
          Register
        </Typography>
        <form onSubmit={(e) => {
          e.preventDefault();
          registerUser(data, { setLoading, setUser, setAlert });
        }}
        >
          <Grid item xs={12} style={{ marginTop: '8%' }}>
            <TextField
              id="FN"
              label="First Name"
              type="First Name"
              variant="outlined"
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '8%' }}>
            <TextField
              id="LN"
              label="Last Name"
              type="Last Name"
              variant="outlined"
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '8%' }}>
            <TextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '8%' }}>
            <TextField
              id="pass"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '8%' }}>
            <TextField
              multiline
              id="address"
              label="Address"
              variant="outlined"
              onChange={(e) => handleAddress(e.target.value)}
            />
            <Button style={{ marginTop: '8%' }} variant="outlined" onClick={() => handleLocation()}>
              Use Current Location
            </Button>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '8%' }}>
            <Button type="submit" variant="outlined">
              Register
            </Button>
          </Grid>
        </form>
        <Divider style={{ marginTop: '7%', marginBottom: '5%' }} />
        <Typography>
          Already have an account?
        </Typography>
        <Button onClick={() => navigate('/signin')}>
          <LockOpen style={{ marginRight: '5%' }} />
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;
