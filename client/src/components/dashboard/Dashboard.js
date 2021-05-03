import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import PropTypes from 'prop-types';
import store from '../../store';

const Dashboard = ({getCurrentProfile}) => {

    console.log('Dashboard comp', getCurrentProfile)

    useEffect(() => {
        getCurrentProfile();
    }, []);

    return (
        <div>
            Dashboard
        </div>
    );
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