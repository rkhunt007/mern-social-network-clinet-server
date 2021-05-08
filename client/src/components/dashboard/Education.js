import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {

    const experiences = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td className="hide-sm">
                <Moment format="yyyy-MM-DD">{edu.from}</Moment> - 
                { edu.to ? (<Moment format="yyyy-MM-DD">{edu.to}</Moment>) : ' Now'}
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteEducation(edu._id)}>
                    Delete
                </button>
            </td>
        </tr>
    ))

    return (
        <div>
            <h3 className="my-1">Education Credentials</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
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

Education.propTypes = {
    deleteEducation: PropTypes.func.isRequired,
}

export default connect(null, { deleteEducation })(Education)
