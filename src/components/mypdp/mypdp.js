import React, { Component } from "react"
import {
	Magnifier,
	GlassMagnifier,
	SideBySideMagnifier,
	PictureInPictureMagnifier,
	MOUSE_ACTIVATION,
	TOUCH_ACTIVATION,
} from "react-image-magnifiers"
import arrowDown from "../../assets/images/icons/arrowDown.png"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import "../../sass/pages/mypdp.scss"
import fullScreen from "../../assets/images/full-screen.png"
import close from "../../assets/images/close.png"
import { FormattedMessage, injectIntl } from "../../../node_modules/react-intl"
import { isMobile } from "react-device-detect"

class mypdp extends Component {
	constructor(props) {
		super(props)
		this.gallery = React.createRef()
		this._imageGallery = React.createRef()
		this.state = {
			mouseActivation: MOUSE_ACTIVATION.CLICK,
			touchActivation: TOUCH_ACTIVATION.TAP,
			dragToMove: false,
			index: 0,
			showFullscreenButton: true,
			showGalleryFullscreenButton: true,
			showPlayButton: true,
			showGalleryPlayButton: false,
			showNav: true,
			isRTL: false,
			slideDuration: 450,
			slideInterval: 2000,
			slideOnThumbnailOver: false,
			showVideo: {},
		}
	}
	previous(side) {
		let element = document.getElementsByClassName("image-gallery-thumbnails-container")
		if (element && element[0]) {
			if (side === "top") {
				element[0].scrollBy(0, -80)
			} else if (element[1]) {
				element[1].scrollBy(-95, 0)
			}
		}
	}
	next(side) {
		let element = document.getElementsByClassName("image-gallery-thumbnails-container")
		if (element && element[0]) {
			if (side === "bottom") {
				element[0].scrollBy(0, 80)
			} else if (element[1]) {
				element[1].scrollBy(95, 0)
			}
		}
	}

	slideThumbnailBarMethod = () => {}
	componentDidMount() {
		document.addEventListener("keydown", (e)=> {
			if(e.keyCode === 27) {
				const element = document.getElementsByTagName("BODY")[0];
   				element.classList.remove("overflowY-hidden");
			  }
		}, false);
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", ()=>{}, false);
	}
	

	myRenderItem(index) {
		const { mouseActivation, touchActivation, dragToMove } = this.state
		let image = index.original
		let largeImage = image
		return (
			<div className="image-container">
				<Magnifier
					className="input-position"
					imageSrc={image}
					largeImageSrc={largeImage}
					mouseActivation={mouseActivation}
					touchActivation={touchActivation}
					dragToMove={dragToMove}
				/>
			</div>
		)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.slideInterval !== prevState.slideInterval || this.state.slideDuration !== prevState.slideDuration) {
			// refresh setInterval
			this._imageGallery.pause()
			this._imageGallery.play()
		}
	}

	_onImageClick(event) {}

	_onSlide(index) {
		this._resetVideo()
	}

	_onPause(index) {}

	_onScreenChange(fullScreenElement) {}

	_onPlay(index) {}

	_handleInputChange(state, event) {
		this.setState({ [state]: event.target.value })
	}

	_resetVideo() {
		this.setState({ showVideo: {} })

		if (this.state.showPlayButton) {
			this.setState({ showGalleryPlayButton: true })
		}

		if (this.state.showFullscreenButton) {
			this.setState({ showGalleryFullscreenButton: true })
		}
	}

	_toggleShowVideo(url) {
		this.state.showVideo[url] = !Boolean(this.state.showVideo[url])
		this.setState({
			showVideo: this.state.showVideo,
		})

		if (this.state.showVideo[url]) {
			if (this.state.showPlayButton) {
				this.setState({ showGalleryPlayButton: false })
			}

			if (this.state.showFullscreenButton) {
				this.setState({ showGalleryFullscreenButton: false })
			}
		}
	}

	_renderVideo(item) {
		return (
			<div>
				{this.state.showVideo[item.embedUrl] ? (
					<div className="video-wrapper">
						<a className="close-video" onClick={this._toggleShowVideo.bind(this, item.embedUrl)}></a>
						<iframe width="560" height="315" src={item.embedUrl} frameBorder="0" allowFullScreen></iframe>
					</div>
				) : (
					<a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
						<div className="play-button"></div>
						<img className="image-gallery-image" src={item.original} />
						{item.description && (
							<span className="image-gallery-description" style={{ right: "0", left: "initial" }}>
								{item.description}
							</span>
						)}
					</a>
				)}
			</div>
		)
	}

	getThumbnail = () => {
		if (
			this.props.product &&
			this.props.product.product &&
			this.props.product.product[0] &&
			this.props.product.product[0].imageUrl &&
			this.props.product.product[0].imageUrl.thumbnail
		) {
			let thumbnail = this.props.product.product[0].imageUrl.thumbnail
			let thumbnailsArr = []
			thumbnail.forEach((url) => {
				let data = {
					original: url,
					thumbnail: url,
					originalClass: this.props.thumbnilView == "left" ? "imageTest" : "imageTestMobile",
				}
				thumbnailsArr.push(data)
			})

			return thumbnailsArr
		}
	}

	render() {
		const index = this.state.index
		const { mouseActivation, touchActivation, dragToMove } = this.state
		const { product } = this.props
		const properties = {
			thumbnailPosition: this.props.thumbnilView,
			useBrowserFullscreen: false,
			infinite: true,
			showPlayButton: false,
			slideOnThumbnailOver: false,
			renderItem: this.myRenderItem.bind(this),
			lazyLoad: false,
			onClick: this._onImageClick.bind(this),
			onImageLoad: this._onImageLoad,
			onSlide: this._onSlide.bind(this),
			onScreenChange: this._onScreenChange.bind(this),
			onPlay: this._onPlay.bind(this),
			showBullets: this.state.showBullets,
			isRTL: this.state.isRTL,
			thumbnailPosition: this.props.thumbnilView,
			items: this.getThumbnail(),
			// [
			//     {
			//         embedUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
			//         original: 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/4v.jpg',
			//         thumbnail: 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/4v.jpg',
			//         originalClass: this.props.thumbnilView == "left" ? 'imageTest' : 'imageTestMobile',
			//         renderItem: this._renderVideo.bind(this)
			//     },
			//     {
			//       original: "https://www.lego.com/cdn/cs/set/assets/bltade05f593c7f4568/10270_alt1.jpg?fit=bounds&format=jpg&quality=80&auto=webp&width=1600&height=1600&dpr=1",
			//       thumbnail: "https://www.lego.com/cdn/cs/set/assets/bltade05f593c7f4568/10270_alt1.jpg?fit=bounds&format=jpg&quality=80&auto=webp&width=1600&height=1600&dpr=1",
			//       originalClass:  this.props.thumbnilView == "left" ? 'imageTest' : 'imageTestMobile'
			//   },
			// ],
			renderFullscreenButton: (onClick, isFullscreen) => {
				const element = document.getElementsByTagName("BODY")[0];
   				element.classList.toggle("overflowY-hidden");
				return (
					<div className="image-gallery-fullscreen-button" onClick={onClick}>
						<div className="background-round">
							{!isFullscreen ? (
								<img src={fullScreen} className="full-screen-image" />
							) : (
								<img src={close} className="full-screen-image" />
							)}
						</div>
						{!isFullscreen && this.props.thumbnilView == "left" && (
							<div className="fullscreenTitle">
								<FormattedMessage id="pdp.fullscreen" defaultMessage="Full Screen" />
							</div>
						)}
					</div>
				)
			},
		}
		return (
			<div className="row">
				{isMobile ? (
					<div className="pdpSliderWeb">
						<div className="arrowUp1" onClick={() => this.previous("left")}>
							<img src={arrowDown} alt="product1" />
						</div>
						<ImageGallery ref={(i) => (this._imageGallery = i)} {...properties} />
						<div onClick={() => this.next("right")} className="arrowDn1">
							<img src={arrowDown} alt="product1" />
						</div>
					</div>
				) : (
					<div className="pdpSliderWeb">
						<div className="arrowUp" onClick={() => this.previous("top")}>
							<img src={arrowDown} alt="product1" />
						</div>
						<ImageGallery ref={(i) => (this._imageGallery = i)} {...properties} />
						<div onClick={() => this.next("bottom")} className="arrowDn">
							<img src={arrowDown} alt="product1" />
						</div>
					</div>
				)}
			</div>
		)
	}
}

export default mypdp
