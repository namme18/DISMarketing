import './App.css';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Auth from '../src/Component/Auth/Auth';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { validateUser } from './redux/reducers/authActions/validateUser';
import AuthRoute from './helper/AuthRoute';
import PrivateRoute from './helper/PrivateRoute';
import MasterList from './Component/MasterList/MasterList';
import ResetPassword from './Component/Auth/ResetPassword';
import Layout from './Component/Layout/Layout';
import Home from './Component/Home/Home';
import VerifiedEmail from './Component/Auth/VerifiedEmail';
import OMRoute from './helper/OMRoute';
import ApprovedUser from './Component/ApprovedUser/ApprovedUser';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateUser());
  }, [dispatch]);

  return (
      <Router>
          <Switch>
        <Layout path='/home'>
            <PrivateRoute exact path="/home" component={() => <Redirect to='/home/home' />} />
            <PrivateRoute exact path="/home/masterlist" component={MasterList} />
            <PrivateRoute exact path="/home/home" component={Home} />
            <PrivateRoute exact path='/home/verifiedemail/:verifyToken' component={VerifiedEmail} />
            <OMRoute exact path='/home/approveduser' component={ApprovedUser} />
        </Layout>
            <AuthRoute exact path="/" component={() => <Redirect to="/auth/login" />} />
            <AuthRoute exact path="/auth" component={() => <Redirect to="/auth/login" />} />
            <AuthRoute exact path="/auth/login" component={Auth} />
            <AuthRoute exact path="/auth/register" component={Auth} />
            <AuthRoute exact path="/auth/forgotpassword" component={Auth} />
            <AuthRoute exact path="/auth/resetpassword/:resetToken" component={ResetPassword} />
          </Switch>
      </Router>
  );
}

export default App;
