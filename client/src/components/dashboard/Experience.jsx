import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profile";


const Experience = ({ experience, deleteExperience }) => {

    const experiences = experience.map(exp => <tr key={exp._id}>
        <td>{exp.company}</td>
        <td className="hide-sm">{exp.title}</td>
        <td><Moment format='YY/MM/DD'>{exp.from}</Moment> - {
        exp.to === null ? (' Now') : (<Moment format='YY/MM/DD'>{exp.to}</Moment>)
    }</td>
    <td>
        <button className="btn btn-danger" onClick={() => deleteExperience(exp._id)} >Delete</button>
    </td>
    </tr>
    );

    return (
        <Fragment>
            <h2 className="my2">Experience Credentials</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Company</th>
                    <th className='hide-sm'>Title</th>
                    <th className='hide-sm'>Years</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                    { experiences }
                </tbody>
            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

})
export default connect(mapStateToProps, {deleteExperience} )(Experience);