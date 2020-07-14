import React, { Component } from "react";
import Slider from "react-slick";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholderSrc from '../../assets/images/plp/placeholder.png';

class SliderMobile extends Component {
	constructor(props) {
        super(props)
        this.slider=null
    }
    clickSlideImg = (key,item) => {
        const mainImage = document.getElementById(`hover${key}`)
        if(mainImage) {
            mainImage.src = item
        }
    }
	render() {
		const settings4 = {
			autoplay: false,
			beforeChange: this.beforeChange,
			autoplaySpeed: 5000,
			dots: false,
			arrows: false,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 500,
			vertical: false,
        }
        
		return (
				<div className="row slider-div-sm pt-2 pb-2">
					<div className="col-3 slide-arrow" onClick={() => {this.slider.slickPrev()}}>
						{this.props.products.json.imageUrl.primaryimage.length > 1 && <i class="fa fa-angle-left" aria-hidden="true"></i>}
					</div>
					<div className="col-6">
						<Slider ref={(c) => (this.slider = c)} {...settings4}>
							{this.props.products.json &&
								this.props.products.json.imageUrl &&
								this.props.products.json.imageUrl.primaryimage &&
								this.props.products.json.imageUrl.primaryimage.map((item, key) => (
									<LazyLoadImage
                                                    onClick={() => this.clickSlideImg(this.props.slideIndex,item)}
                                                    id={`${key}`}
													src={item}
													className="slider-div-sm-img"
													effect="blur"
													threshold={0.5}
													delayTime={700}
													placeholderSrc={placeholderSrc}
                                                    >  
                                                    </LazyLoadImage>
								))}
						</Slider>
					</div>
					<div className="col-3 slide-arrow" onClick={() => {this.slider.slickNext()}}>
                    {this.props.products.json.imageUrl.primaryimage.length > 1 && <i class="fa fa-angle-right" aria-hidden="true"></i>}
					</div>
				</div>
		)
	}
}

export default SliderMobile
