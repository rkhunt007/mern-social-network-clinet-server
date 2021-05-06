import { Fragment, useEffect } from 'react';
// Redux
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { loadUser } from './actions/auth';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashBoard from './components/dashboard/Dashboard';
import Alert from './components/layout/Alert';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import CreateProfile from './components/profile-forms/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import store from './store';
import setAuthToken from './utils/setAuthToken';


if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {

    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <section className="container">
                        <Alert></Alert>
                        <Switch>
                            <Route exact path="/login" component={Login}></Route>
                            <Route exact path="/register" component={Register}></Route>
                            <PrivateRoute exact path="/dashboard" component={DashBoard}></PrivateRoute>
                            <PrivateRoute exact path="/create-profile" component={CreateProfile}></PrivateRoute>
                        </Switch>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
