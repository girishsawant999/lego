import React, { Component } from "react"

class SearchNotFound extends Component {

	render() {
		return (
			<div>
                <div className="container SearchNotFoundContainer">
                <div className="SearchNotFound">
                    <h3 className="headTextSearch">
                    We couldn't find any results for <span>"{this.props.searchKeyword}"</span>.</h3>
                    <span><p>Try again with one of these tips:</p>
                    <p>- Simplify your search: instead of "how do I build a Minecraft tower?" try something simpler, like "Minecraft."</p>
                    <p>- Check your spelling! We try to catch spelling mistakes, but we don't catch them all. Double-check and search again.</p>
                    <p>- Are you searching in the right language? Make sure you select your country and language by clicking the flag in the top left corner of the Home page or Shop page.</p>
                    </span>
                
                  </div>
                </div>
				
			</div>
		)
	}
}



export default SearchNotFound
