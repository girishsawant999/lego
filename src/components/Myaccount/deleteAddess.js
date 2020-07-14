import React, { Component } from "react"
import { Link } from "react-router-dom"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import * as actions from "../../redux/actions/index"
import Spinner2 from "../../components/Spinner/Spinner2"

import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { css } from "glamor"

class DeleteAddress extends Component {
	constructor(props) {
		super(props)
		this.state = {
			call: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.state.call) {
			this.setState({ call: false })
			this.props.callRemove(true)
		}
		
	}
	deleteAddress = () => {
		this.setState({ call: true })
		this.props.onDeleteAddress({
			addressId: this.props.deleteAddessId,
		})
		
	}
	render() {
		const { deleteAddressLoader } = this.props.account
		if (deleteAddressLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		return (
			<div>
				<div className="deleteModelpop">
					<p><FormattedMessage id="myAccountInfo.askDelete" defaultMessage="Are you sure you want to delete this address?" /></p>

					<div className="ButtonDiv">
						<button className="cancelbtn" onClick={(param) => this.props.onClose(false)}>
							<FormattedMessage id="myAccountInfo.Cancel" defaultMessage="Cancel" />
						</button>
						<button className="okbtn" onClick={this.deleteAddress}>
							<FormattedMessage id="cart.removePopupOk" defaultMessage="OK" />
						</button>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		account: state.account,
		login: state.login.customer_details,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteAddress: (payload) => dispatch(actions.deleteAddress(payload)),
		onGetAddressBook: (payload) => dispatch(actions.getAddressBook(payload)),

	}
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(DeleteAddress)))
