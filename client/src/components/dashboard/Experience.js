import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';
import PropTypes from 'prop-types'

const Experience = ({ experience, deleteExperience }) => {

    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.title}</td>
            <td className="hide-sm">{exp.company}</td>
            <td className="hide-sm">
                <Moment format="yyyy-MM-DD">{exp.from}</Moment> - 
                { exp.to ? (<Moment format="yyyy-MM-DD">{exp.to}</Moment>) : ' Now'}
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteExperience(exp._id)}>
                    Delete
                </button>
            </td>
        </tr>
    ))

    return (
        <div>
            <h3 className="my-1">Experience Credentials</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th className="hide-sm">Company</th>
                        <th className="hide-sm">Duration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {experiences}
                </tbody>
            </table>
        </div>
    )
}

Experience.propTypes = {
    deleteExperience: PropTypes.func.isRequired,
}

export default connect(null, { deleteExperience })(Experience)
