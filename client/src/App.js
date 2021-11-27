import './App.css';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
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
import Admin from './Component/Admin/Admin';
import MyAccount from './Component/MyAccount/MyAccount';
import AgentsPerformance from './Component/Home/AgentsPerformance';
import MyProfile from './Component/Profile/MyProfile';
import ImageShowRoom from './Component/MyAccount/ImageShowRoom';
import Encoder from './Component/Encoder/Encoder';
import ForSppList from './Component/Encoder/PanelOne/ForSppList';
import Details from './Component/Encoder/PanelOne/Details';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateUser());
  }, [dispatch]);


  return (
      <Router>
          <Switch>
        <Layout path='/home'>
            <PrivateRoute exact path='/home/home/agents/:teamleader' component={AgentsPerformance} />
            <PrivateRoute exact path="/home" component={() => <Redirect to='/home/home' />} />
            <PrivateRoute exact path="/home/masterlist" component={MasterList} />
            <PrivateRoute exact path="/home/home" component={Home} />
            <PrivateRoute exact path='/home/verifiedemail/:verifyToken' component={VerifiedEmail} />
            <PrivateRoute exact path='/home/myaccount' component={MyAccount} />
            <PrivateRoute exact path='/home/myprofile' component={MyProfile} />
            <Route path='/home/encoder'>
              <Encoder path='/home/encoder'>
                <PrivateRoute exact path='/home/encoder/forspplist' component={ForSppList} />
                <PrivateRoute exact path='/home/encoder/details' component={Details} />
              </Encoder>
            </Route>
            <OMRoute exact path='/home/admin' component={Admin} />
        </Layout>
            <PrivateRoute exact path='/image/:id' component={ImageShowRoom} />
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
