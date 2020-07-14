import React, { Component } from "react"
import starYellow from '../assets/images/icons/starYellow.png';
import starGrey from '../assets/images/icons/starGrey.png';
import starhalf from '../assets/images/icons/starhalf.png';

class Rating extends Component {
	constructor(props) {
		super(props)
	}
	render() {
        const {ratingValue} = this.props
		return (
			<ul className="list-inline main_Ul ratingFix">
				<li className="list-inline-item">
					<ul className="list-inline starList" id="startListPLP">
						<li className="list-inline-item">
							<span>
								<img src={ ratingValue >= 0.3 && ratingValue <= 0.8 ? starhalf : ratingValue > 0.8 ? starYellow : starGrey} alt="startYellow" />{" "}
							</span>
						</li>
						<li className="list-inline-item">
							<span>
								<img src={ ratingValue >= 1.3 && ratingValue <= 1.8 ? starhalf : ratingValue > 1.8 ? starYellow : starGrey} alt="startYellow" />
							</span>
						</li>
						<li className="list-inline-item">
							<span>
								<img src={ ratingValue >= 2.3 && ratingValue <= 2.8 ? starhalf : ratingValue > 2.8 ? starYellow : starGrey} alt="startYellow" />
							</span>
						</li>
						<li className="list-inline-item">
							<span>
								<img src={ ratingValue >= 3.3 && ratingValue <= 3.8 ? starhalf : ratingValue > 3.8 ? starYellow : starGrey} alt="startYellow" />
							</span>
						</li>
						<li className="list-inline-item">
							<span>
								<img src={ ratingValue >= 4.3 && ratingValue <= 4.8 ? starhalf : ratingValue > 4.8 ? starYellow : starGrey} alt="startGrey" />
							</span>
						</li>
					</ul>
				</li>
			</ul>
		)
	}
}

export default Rating
