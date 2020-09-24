import React, { Component } from "react"
import { isMobile } from "react-device-detect"
import { LazyLoadImage } from "react-lazy-load-image-component"
import placeholderSrc from "../../assets/images/plp/placeholder.png"

let incInterval = null
let buttonPressTimer = null
export default class OnHoverImageChange extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imgIndex: 0,
		}
	}

	incrementIndex = () => {
		if (this.state.imgIndex < this.props.images.length - 1) {
			this.setState({ imgIndex: this.state.imgIndex + 1 })
		} else {
			this.setState({ imgIndex: 0 })
			if(isMobile) {
				clearInterval(incInterval)
				clearTimeout(buttonPressTimer)
			}
		}
	}

	mouseHover = () => {
		if (!isMobile) {
			this.incrementIndex()
			incInterval = setInterval(() => this.incrementIndex(), 1000)
		}
	}

	mouseLeave = () => {
		if (!isMobile) {
			clearInterval(incInterval)
			this.setState({ imgIndex: 0 })
		}
	}
	handleButtonPress = () => {
		clearInterval(incInterval)
		buttonPressTimer = setTimeout(() => {
			this.incrementIndex()
			incInterval = setInterval(() => this.incrementIndex(), 1000)
		}, 200)
	}

	handleButtonRelease = () => {
		clearTimeout(buttonPressTimer)
	}

	render() {
		const { images, productId, touchedProduct } = this.props
		return (
			<div>
				<LazyLoadImage
					id="productImage"
					src={!isMobile? images[this.state.imgIndex] :productId===touchedProduct ? images[this.state.imgIndex]:images[0] }
					effect="blur"
					threshold={0.5}
					delayTime={700}
					placeholderSrc={placeholderSrc}
					onMouseOver={this.mouseHover}
					onMouseOut={this.mouseLeave}
					onTouchStart={this.handleButtonPress}
					onTouchEnd={this.handleButtonRelease}
					onMouseDown={this.handleButtonPress}
					onMouseUp={this.handleButtonRelease}
					onMouseLeave={this.handleButtonRelease}></LazyLoadImage>
			</div>
		)
	}
}
