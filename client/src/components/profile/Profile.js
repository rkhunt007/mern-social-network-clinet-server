import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfileById } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ProfileAbout from './ProfileAbout';
import ProfileTop from './ProfileTop';
import ProfileGithub from './ProfileGithub';
import Moment from 'react-moment';

const Profile = ({ match, getProfileById, auth, profile: { profile, loading} }) => {

    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, match.params.id]);

    return (
        <Fragment>
            { profile === null || loading === true ? <Spinner /> : <Fragment>
                <Link to="/profiles" className="btn btn-light">Back to Profiles</Link>
                {auth.isAuthenticated && !auth.loading && auth.user._id === profile.user._id
                && (<Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>)}

                <div className="profile-grid my-1">
                    <ProfileTop profile={profile}></ProfileTop>
                    <ProfileAbout profile={profile}></ProfileAbout>
                    <div className="profile-exp bg-white p-2">
                        <h2 class="text-primary">Experience</h2>
                        {
                            profile.experience.length > 0 ? (
                                <Fragment>
                                    {
                                        profile.experience.map((experience) => {
                                            return (<div key={experience._id}>
                                                <h3 class="text-dark">{experience.company}</h3>
                                                <p><Moment format="YYYY/MM/DD">{experience.from}</Moment> - {experience.to ? (<span><Moment format="YYYY/MM/DD">{experience.to}</Moment></span>) : (<span>Now</span>)}</p>
                                                <p><strong>Position: </strong>{experience.title}</p>
                                                <p>
                                                <strong>Description: </strong>{experience.description}
                                                </p>
                                            </div>)
                                        })
                                    }
                                </Fragment>
                            ) : (<h4>No Experience</h4>)
                        }
                    </div>
                    <div className="profile-edu bg-white p-2">
                        <h2 class="text-primary">Education</h2>
                        {
                            profile.education.length > 0 ? (
                                <Fragment>
                                    {
                                        profile.education.map((education) => {
                                            return (<div key={education._id}>
                                                <h3 class="text-dark">{education.school}</h3>
                                                <p><Moment format="YYYY/MM/DD">{education.from}</Moment> - {education.to ? (<span><Moment format="YYYY/MM/DD">{education.to}</Moment></span>) : (<span>Now</span>)}</p>
                                                <p><strong>Degree: </strong>{education.degree}</p>
                                                <p><strong>Field of Study: </strong>{education.filedofstudy}</p>
                                                <p>
                                                <strong>Description: </strong>{education.description}
                                                </p>
                                            </div>)
                                        })
                                    }
                                </Fragment>
                            ) : (<h4>No Education</h4>)
                        }
                    </div>

                    { profile.githubusername &&
                        (<ProfileGithub username={profile.githubusername}></ProfileGithub>)}
                </div>
            </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProfileById: PropTypes.func.isRequired,
}   

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile)
