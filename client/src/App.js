import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Fragment } from 'react';
import './App.css';
import { Landing } from './components/layout/Landing';
import { Navbar } from './components/layout/Navbar';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
// Redux
import { Provider } from 'react-redux';
import store from './store';


const App = () => (
    <Provider store={store}>
        <Router>
            <Fragment>
                <Navbar />
                <Route exact path="/" component={Landing} />
                <section className="container">
                    <Switch>
                        <Route exact path="/login" component={Login}></Route>
                        <Route exact path="/register" component={Register}></Route>
                    </Switch>
                </section>
            </Fragment>
        </Router>
    </Provider>
);

export default App;
