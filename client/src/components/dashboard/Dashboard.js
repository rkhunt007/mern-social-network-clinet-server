import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';

const Dashboard = ({getCurrentProfile, auth: { user }, profile: { profile, loading }}) => {

    useEffect(() => {
        getCurrentProfile();
    }, []);

    const renderProfile = () => {
        if (profile === null) {
            return (
                <Fragment>
                <p>You haven't setup profile yet, please add some info</p>
                <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
                </Fragment>
            )
        } else {
            return (<div><DashboardActions /></div>)
        }
    }

    if (loading && profile === null) {
        return <Spinner />
    } else {
        return (
            <Fragment>
                <h1 className="text-primary large">Dashboard</h1>
                <p className="lead">
                    <i className="fa fa-user"></i> Hi {user?.name}
                </p>
                {renderProfile()}
            </Fragment>
        )
    }

}

Dashboard.propType = {
    getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        profile: state.profile
    }
}

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);