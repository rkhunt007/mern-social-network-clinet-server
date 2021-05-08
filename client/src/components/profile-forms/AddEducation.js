import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { addEducation } from '../../actions/profile';

const AddEducation = props => {

    const {addEducation, history} = props;

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        filedofstudy: '',
        from: '',
        to: '',
        current: '',
        description: ''
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { school, degree, filedofstudy, from, to, current, description } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        addEducation(formData, history);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Add Your Education
            </h1>
            <p className="lead">
                <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that you have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                <input
                    type="text"
                    placeholder="* School or Bootcamp"
                    name="school"
                    required
                    value={school} onChange={onChange}
                />
                </div>
                <div className="form-group">
                <input
                    type="text"
                    placeholder="* Degree or Certificate"
                    name="degree"
                    required
                    value={degree} onChange={onChange}
                />
                </div>
                <div className="form-group">
                <input type="text" placeholder="Field Of Study" name="filedofstudy" value={filedofstudy} onChange={onChange} />
                </div>
                <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={onChange} />
                </div>
                <div className="form-group">
                <p>
                    <input type="checkbox" name="current" checked={current} value={current} onChange={e => {
                    toggleDisabled(!toDateDisabled);
                    setFormData({ ...formData, current: !current})
                }} /> Current School or Bootcamp
                </p>
                </div>
                <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={onChange} disabled={toDateDisabled ? 'disabled': ''} />
                </div>
                <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Program Description"
                    value={description} onChange={onChange}
                ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
};

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
}

export default connect(null, { addEducation })(withRouter(AddEducation));