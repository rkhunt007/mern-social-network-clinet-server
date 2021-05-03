import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';

const PrivateRoute = props => {

    const { component: Component, auth: {isAuthenticated, loading}, ...rest} = props;

    const renderComponent = props => {
        if (!isAuthenticated && !loading) {
            return (<Redirect to='/login' />);
        } else {
            return (<Component {...props} />);
        }
    }

    return (
        <Route {...rest} render={renderComponent} />
    );

};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);