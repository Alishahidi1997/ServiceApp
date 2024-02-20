/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Alert } from '@material-ui/lab';

import Loader from 'Shared/Loader';

import LoginPage from './Pages/Auth/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage';

import MyServices from './Pages/Services/MyServices';
import BrowseServices from './Pages/Services/BrowseServices';
import RequestedServices from './Pages/Services/RequestedServices';

const PrivateRoute = ({ children, user }) => (user ? children : (
  <Navigate
    to={{
      pathname: '/signin',
    }}
  />
));

const AuthRoute = ({ children, user }) => (!user ? children : (
  <Navigate
    to={{
      pathname: '/',
    }}
  />
));

const NotFoundPage = () => (<h1>404 Page NotFound</h1>);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    console.log("userrrrr  " + userString); 
    setLoading(false);
  }, []);

 
  const passedProps = {
    setAlert,
    setLoading,
    setUser,
    user,
  };

  return (
    <>
      <Helmet>
        <title>CPSC HW Assignment Problem 9</title>
      </Helmet>
      {loading && <Loader />}
      {alert && <Alert severity="error">{alert}</Alert>}
      <Routes>
        <Route
          path="signin"
          element={(
            <AuthRoute user={user}>
              <LoginPage {...passedProps} />
            </AuthRoute>
          )}
        />
        <Route
          path="register"
          element={(
            <AuthRoute user={user}>
              <RegisterPage {...passedProps} />
            </AuthRoute>
          )}
        />
        <Route
          path="/"
          element={(
            <PrivateRoute user={user}>
              <BrowseServices {...passedProps} />
            </PrivateRoute>
          )}
        />
        <Route
          path="my-services"
          element={(
            <PrivateRoute user={user}>
              <MyServices {...passedProps} />
            </PrivateRoute>
          )}
        />
        <Route
          path="requested-services"
          element={(
            <PrivateRoute user={user}>
              <RequestedServices {...passedProps} />
            </PrivateRoute>
          )}
        />
        <Route
          path="recommended"
          element={(
            <PrivateRoute user={user}>
              <BrowseServices {...passedProps} />
            </PrivateRoute>
          )}
        />
        <Route
          path="*"
          element={(
            <NotFoundPage />
          )}
          user={user}
        />
      </Routes>
    </>
  );
};

export default App;
