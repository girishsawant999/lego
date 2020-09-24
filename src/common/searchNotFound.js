import React, { Component } from "react"
import { FormattedMessage } from 'react-intl';

class SearchNotFound extends Component {

	render() {
		return (
			<div>
                <div className="container SearchNotFoundContainer">
                <div className="SearchNotFound">
                    <h3 className="headTextSearch">
                    <FormattedMessage id="SearchNotFound.sentence1" defaultMessage="We couldn't find any results for" />
                     &nbsp;<span>"{this.props.searchKeyword}"</span>.</h3>
                    <span><p> <FormattedMessage id="SearchNotFound.sentence2" defaultMessage="Try again with one of these tips:" /></p>
                    <p>- <FormattedMessage id="SearchNotFound.sentence3"/></p>
                    <p>- <FormattedMessage id="SearchNotFound.sentence4"/></p>
                    <p>- <FormattedMessage id="SearchNotFound.sentence5"/></p>
                    </span>
                
                  </div>
                </div>
				
			</div>
		)
	}
}



export default SearchNotFound
