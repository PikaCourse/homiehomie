import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {getLeads} from '../../actions/leads'

export class Leads extends Component {
    static propTypes = {
        leads:PropTypes.array.isRequired
    }

    componentDidMount() {
        this.props.getLeads();
    }

    render() {
        return (
            <Fragment>
                <h2>Leads List</h2>
                <table className="table table-striped">
                <thead>
                    <tr>
                    <th>Major</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th />
                    </tr>
                </thead>
                <tbody>
                    {this.props.leads.map((lead) => (
                    <tr key={lead.major}>
                        <td>{lead.major}</td>
                        <td>{lead.name}</td>
                        <td>{lead.description}</td>
                        <td>
                        <button className="btn btn-danger btn-sm">
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </Fragment>
        )
    }
}

const mapStateToProps = state =>({
    leads: state.leads.leads
});
export default connect(mapStateToProps, {getLeads})(Leads);
