import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from "react-moment";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {

    const educations = education.map(edu => <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td><Moment format='YY/MM/DD'>{edu.from}</Moment> - {
                edu.to === null ? (' Now') : (<Moment format='YY/MM/DD'>{edu.to}</Moment>)}</td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteEducation(edu._id)}>Delete</button>
            </td>
        </tr>
    );

    return (
        <Fragment>
            <h2 className="my2">Education Credentials</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>School</th>
                    <th className='hide-sm'>Degree</th>
                    <th className='hide-sm'>Years</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                { educations }
                </tbody>
            </table>
        </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

})
export default connect(mapStateToProps, {deleteEducation} )(Education);
