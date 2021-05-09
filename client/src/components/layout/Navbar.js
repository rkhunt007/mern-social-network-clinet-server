import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth';

const Navbar = ({auth, logout}) => {

    const authLinks = (
        <ul>
            <li>
                <Link to="/profiles">
                    Developers
                </Link>
            </li>
            <li>
                <Link to="/posts">
                    Posts
                </Link>
            </li>
            <li>
                <Link to="/dashboard">
                    <i className="fa fa-user"></i>{' '}
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <a href="#!" onClick={logout}>
                    <i className="fa fa-sign-out-alt"></i>{' '}
                    <span className="hide-sm">Logout</span>
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i>DevConnector</Link>
            </h1>
            { !auth.loading && (auth.isAuthenticated ? authLinks : guestLinks) }
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
