import React, { Component } from 'react';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Button, Row, Col, Label, FormGroup, CustomInput } from 'reactstrap';
import reviewTitle from '../../assets/images/review-title.png';
import bookShop from '../../assets/images/bookShop.jpg';
import ratingStrip from '../../assets/images/rating-strip.png';
import expRating from '../../assets/images/expRating.png';
import range from '../../assets/images/range.png';
import grayratingbox from '../../assets/images/grayratingbox.png';
import yellowsmall from '../../assets/images/yellowsmall.png';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import graysmall from '../../assets/images/graysmall.png';
import browseRight from '../../assets/images/rightArrow1.png';
import backArrow from '../../assets/images/leftArrow1.png';
import tower from '../../assets/images/tower.png';
import shanghai from '../../assets/images/shanghai.png';
import london from '../../assets/images/london.png';
import paris from '../../assets/images/paris.png';
import remove from '../../assets/images/remove.png';
import cancelUpload from '../../assets/images/cancelUpload.png';
import videoUploadWait from '../../assets/images/videoUploadWait.gif';
import Modal from 'react-responsive-modal';
import Rating from 'react-rating'
import { Link } from 'react-router-dom';




class ProductReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productRecommModal: false,
            imageUrl: [],
            videoUrl: null,
            overall_rating_value: '',
            play_experiance_value: '',
            value_for_money_value: '',
            isShowVideoUploadProcessDiv: false,
            isShowVideoRemoveSection: false,
            levelofdiffculty: 50,
            productreviewData: {
                rating_custom_icon: 0,

                recom_product_to_friend: '',
                levelofdiffculty_value: 50,
                your_nickname: '',
                email: '',
                city: '',
                country: '',
                age: 0,
                gender: '',
                describe_your_self_select_box_value: '',
                build_experience_check_box_value: '',
                review_title: '',
                reviewDescription: '',
                where_did_you_purchase_this_product_vale: '',
                who_did_you_purchase_this_for_value: '',
                product_recom_array: [],
                imageUrl: [],
                videoUrl: {
                    videoUrl: '',
                    video_caption: ''
                }
            },
            errors: {}
        }
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
    }

    openProductRecommModal = () => {
        this.setState({ productRecommModal: true })
    }

    handleProductReviewValidation = () => {
        let fields = this.state.productreviewData;
        let errors = {};
        let formIsValid = true;
        if (this.state.overall_rating_value === 0) {
            formIsValid = false;
            errors["overall_rating_value"] = <li>You must enter a value for overall rating.</li>;
        }
        if (fields["recom_product_to_friend"] === '') {
            formIsValid = false;
            errors["recom_product_to_friend"] = <li>You must indicate if you would recommend this product to a friend.</li>
        }
        if (!fields["your_nickname"]) {
            formIsValid = false;
            errors["your_nickname"] = <li>You must enter a nickname.</li>
        }
        if (!fields["country"]) {
            formIsValid = false;
            errors["country"] = <li>Country is required.</li>
        }
        if (!fields["age"]) {
            formIsValid = false;
            errors["age"] = <li>Age is required.</li>
        }
        if (!fields["gender"]) {
            formIsValid = false;
            errors["gender"] = <li>Gender is required.</li>
        }
        if (!fields["reviewDescription"]) {
            formIsValid = false;
            errors["reviewDescription"] = <li>You must enter review text..</li>
        }

        if (fields["email"].length > 0) {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2 && !fields["email"].includes(' '))) {
                formIsValid = false;
                errors["email"] = <li>Your email address is not in the proper format</li>;
            }
        }
        this.setState({ errors: errors });
        return formIsValid;


    }
    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    submitProductReviewData = () => {
        if (this.handleProductReviewValidation()) {

        }
    }

    closeProductRecommModal = () => {
        this.setState({ productRecommModal: false })
    }


    fileChangedHandler = e => {

        e.preventDefault();
        let files = Array.from(e.target.files);

        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    imageUrl: [...this.state.imageUrl, reader.result]
                });
            }
            reader.readAsDataURL(file);
        });
        //   reader.readAsDataURL(file)
    }
    onRemoveImageReview = (index) => {
        let data = this.state.imageUrl;
        data.splice(index, 1)
        this.setState({ imageUrl: data })
    }
    videoUploadHandler = (e) => {
        this.setState({ isShowVideoUploadProcessDiv: true })
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        this.setState({
            videoUrl: e.target.files[0]
        });
        if (this.state.videoUrl) {
            this.setState({ isShowVideoUploadProcessDiv: false, isShowVideoRemoveSection: true })
        }

        // reader.readAsDataURL(file)
    }
    removeVideo = () => {

    }
    onStarClickCustomIcon(nextValue, prevValue, name) {
        this.setState({ rating_custom_icon: nextValue });
    }
    handleSliderChange = (value) => {
        this.setState({
            levelofdiffculty: value
        })
    }
    setOverAllRating = (rate) => {
        this.setState({ overall_rating_value: rate })
    }
    setPlayExperienceRating = (rate) => {
        this.setState({ play_experiance_value: rate })
    }
    setValueForMoneyRating = (rate) => {
        this.setState({ value_for_money_value: rate })
    }
   
    render() {
        let { levelofdiffculty } = this.state
        const errorsObj = this.state.errors;
        let over_all_rating_empty_error = null;
        let your_nickname_error = null;
        let recom_product_to_friend_error = null;
        let emailaddressErrorTag = null;
        let countryErrorSpan = null;
        let ageErrorSpan = null;
        let genderErrorSpan = null;
        let reviewTextAreaErrorSpan = null;
        let error_span_block = null;

        if ('overall_rating_value' in errorsObj) {
            over_all_rating_empty_error = errorsObj["overall_rating_value"]
        } else if ('recom_product_to_friend' in errorsObj) {
            recom_product_to_friend_error = errorsObj["recom_product_to_friend"]
        } else if ('email' in errorsObj) {
            emailaddressErrorTag = errorsObj["email"];
        } else if ('country' in errorsObj) {
            countryErrorSpan = errorsObj["country"];
        } else if ('your_nickname' in errorsObj) {
            your_nickname_error = errorsObj["your_nickname"]
        } else if ('age' in errorsObj) {
            ageErrorSpan = errorsObj["age"];
        } else if ('gender' in errorsObj) {
            genderErrorSpan = errorsObj["gender"];
        } else if ('reviewDescription' in errorsObj) {
            reviewTextAreaErrorSpan = errorsObj["reviewDescription"];
        }

        error_span_block = <div className="BVErrors">
            <div className="BVErrorsHeader BVHeader"><span className="BVMESectionHeader">We're sorry, but we have encountered the following issue(s):</span></div>
            <div className="BVErrorsBody BVBody">
                <ul>
                    {over_all_rating_empty_error}
                    {recom_product_to_friend_error}
                    {your_nickname_error}
                    {emailaddressErrorTag}
                    {countryErrorSpan}
                    {ageErrorSpan}
                    {genderErrorSpan}
                    {reviewTextAreaErrorSpan}
                </ul>
            </div>
        </div>

        return (
            <div style={{overflowY:'scroll'}}>
                <div className="reviewGrid">
                    <div className="reviewTitle"><img className="wishIcon" src={reviewTitle} alt="reviewTitle" /> <span>Customer Reviews</span></div>
                    {/* <div>{error_span_block}</div> */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="left-side-img">
                                <img className="bookShop" src={bookShop} alt="bookShop" />
                                <div className="bookshop-img-title">Bookshop</div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="productDetail">
                                <div className="rating-dec">
                                    <span className="rating-title">Product Ratings</span>
                                </div>
                                <div className="reviewSectionBody">
                                    <div className="reviewField">
                                        <div className="overall-rating">
                                            <span className="RatingLabel">Overall Rating </span>
                                            <ul className="list-inline starList">
                                                <Rating
                                                    start={0}
                                                    stop={5}
                                                    onHover={(rate) =>{ 
                                                        if(rate===1){
                                                        rate='Poor'
                                                        }else if(rate===2){
                                                            rate='Fair'  
                                                        }
                                                        else if(rate===3){
                                                            rate='Good'  
                                                        }
                                                        else if(rate===4){
                                                            rate='Average'  
                                                        }
                                                        else if(rate===5){
                                                            rate='Excellent'  
                                                        }else{
                                                            rate=''
                                                        }
                                                        document.getElementById('ratingoverall').innerHTML = rate || ''}}
                                                    onChange={(rate) => this.setOverAllRating(rate)}
                                                    initialRating={this.state.overall_rating_value}
                                                    emptySymbol={<img src={grayratingbox} className="starRatingPadding" />}
                                                    fullSymbol={<img src={ratingStrip} className="starRatingPadding" />}
                                                />
                                                
                                            </ul>
                                           <span className="overall_hover_title" id="ratingoverall"></span>

                                        </div>
                                        <div className="reviewRadioField">
                                            <div className="play-exp-sec">
                                                <div className="left-dec d-none d-sm-block">I would recommend this product to a friend</div>
                                                <div className="right-rating">
                                                    <span className="right-ret-title">Play Experience (Optional)</span>

                                                    <ul className="list-inline starList">
                                                        <li className="list-inline-item">
                                                            <ul className="list-inline starList">
                                                                <Rating
                                                                    start={0}
                                                                    stop={5}
                                                                    onHover={(rate) =>{ 
                                                                        if(rate===1){
                                                                        rate='Poor'
                                                                        }else if(rate===2){
                                                                            rate='Fair'  
                                                                        }
                                                                        else if(rate===3){
                                                                            rate='Good'  
                                                                        }
                                                                        else if(rate===4){
                                                                            rate='Average'  
                                                                        }
                                                                        else if(rate===5){
                                                                            rate='Excellent'  
                                                                        }else{
                                                                            rate=''
                                                                        }
                                                                        document.getElementById('playexperience').innerHTML = rate || ''}}
                                                                    onChange={(rate) => this.setPlayExperienceRating(rate)}
                                                                    initialRating={this.state.play_experiance_value}
                                                                    emptySymbol={<img src={graysmall} className="starRatingPadding" />}
                                                                    fullSymbol={<img src={yellowsmall} className="starRatingPadding" />}
                                                                />
                                                            </ul>
                                                        </li>
                                                        <li className="list-inline-item"><span  id="playexperience" className="ml-4 range-title"></span> </li>


                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="play-exp-sec">
                                                <div className="left-dec pt-2 d-none d-sm-block">
                                                    <span className="radio-strip">
                                                        <input type="radio" name="recommend" value="true" className="" />
                                                        <label className="">Yes</label>
                                                    </span><br />
                                                    <span className="radio-strip">
                                                        <input type="radio" name="recommend" value="true" className="" />
                                                        <label className="">No</label>
                                                    </span>
                                                </div>
                                                <div className="right-rating">
                                                    <div className="extra-space">
                                                        <span className="right-ret-title">Value for Money (Optional)</span>
                                                        <ul className="list-inline starList">
                                                            <li className="list-inline-item">
                                                                <ul className="list-inline starList">
                                                                    <Rating
                                                                        start={0}
                                                                        stop={5}
                                                                        onHover={(rate) =>{ 
                                                                            if(rate===1){
                                                                            rate='Poor'
                                                                            }else if(rate===2){
                                                                                rate='Fair'  
                                                                            }
                                                                            else if(rate===3){
                                                                                rate='Good'  
                                                                            }
                                                                            else if(rate===4){
                                                                                rate='Average'  
                                                                            }
                                                                            else if(rate===5){
                                                                                rate='Excellent'  
                                                                            }else{
                                                                                rate=''
                                                                            }
                                                                            document.getElementById('valueformoney').innerHTML = rate || ''}}
                                                                        onChange={(rate) => this.setValueForMoneyRating(rate)}
                                                                        initialRating={this.state.value_for_money_value}
                                                                        emptySymbol={<img src={graysmall} className="starRatingPadding" />}
                                                                        fullSymbol={<img src={yellowsmall} className="starRatingPadding" />}
                                                                    />
                                                                </ul>
                                                            </li>
                                                            <li className="list-inline-item"><span id="valueformoney" className="ml-4 range-title"></span> </li>


                                                        </ul>
                                                    </div>
                                                    <div className="pb-2">
                                                        <span className="right-ret-title">Level of Difficulty (Optional)</span>
                                                        <Slider
                                                            value={levelofdiffculty}
                                                            orientation="horizontal"
                                                            onChange={this.handleSliderChange}
                                                            tooltip={false}
                                                        />

                                                        <img className="ratinrangegStrip" src={range} alt="range" /> <span className="ml-4 range-title">Challenging</span>
                                                    </div>
                                                    <div className="mobile-view-radio d-lg-none d-md-none d-sm-none d-xl-none d-xs-block pt-3 pb-3">
                                                        <span className="right-ret-title">Value for Money (Optional)</span>
                                                        <div className="left-dec pt-2">
                                                            <span className="radio-strip">
                                                                <input type="radio" name="recommend" value="true" className="" />
                                                                <label className="">Yes</label>
                                                            </span><br />
                                                            <span className="radio-strip">
                                                                <input type="radio" name="recommend" value="true" className="" />
                                                                <label className="">No</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="pb-2 build-time">
                                                        <AvForm>
                                                            <Row>
                                                                <Col xs="12"><span className="birth-title">Build Time:</span></Col>
                                                                <Col xs="4" sm="4">
                                                                    <div className="select-down"></div>
                                                                    <AvField type="select" name="select" label="Days">
                                                                        <option>00</option>
                                                                        <option>01</option>
                                                                        <option>02</option>
                                                                        <option>03</option>
                                                                        <option>04</option>
                                                                    </AvField>
                                                                </Col>
                                                                <Col xs="4" sm="4">
                                                                    <div className="select-down"></div>
                                                                    <AvField type="select" name="select" label="Hours">
                                                                        <option>00</option>
                                                                        <option>01</option>
                                                                        <option>02</option>
                                                                        <option>03</option>
                                                                        <option>04</option>
                                                                    </AvField>
                                                                </Col>
                                                                <Col xs="4" sm="4">
                                                                    <div className="select-down"></div>
                                                                    <AvField type="select" name="select" label="Minutes">
                                                                        <option>00</option>
                                                                        <option>01</option>
                                                                        <option>02</option>
                                                                        <option>03</option>
                                                                        <option>04</option>
                                                                    </AvField>
                                                                </Col>
                                                            </Row>
                                                        </AvForm>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="aboutme-section">
                    <div className="aboutHeader">
                        <span>About Me</span>
                    </div>
                    <div className="about-form">
                        <AvForm>
                            <Col xs="12">
                                <AvField name="yournickname" label="Your Nickname" required />
                            </Col>
                            <Col xs="12">
                                <AvField name="email" label="Email (Optional)" required />
                            </Col>
                            <Col xs="12">
                                <AvField name="city" label="City (Optional)" required />
                            </Col>
                            <Col xs="12">
                                <div className="select-down"></div>
                                <AvField type="select" name="select" label="Country">
                                    <option>Please select</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                </AvField>
                            </Col>
                            <Col xs="12">
                                <div className="select-down"></div>
                                <AvField type="select" name="select" label="Age">
                                    <option>Please select</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                </AvField>
                            </Col>
                            <Col xs="12">
                                <div className="select-down"></div>
                                <AvField type="select" name="select" label="Gender">
                                    <option>Please select</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                </AvField>
                            </Col>
                        </AvForm>
                    </div>
                    <div className="about-subsection">
                        <AvForm>
                            <Col xs="12">
                                <div className="select-down"></div>
                                <AvField type="select" name="select" label="How would you best describe yourself? (Optional)">
                                    <option>Please select</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                </AvField>
                            </Col>
                            <Col xs="12">
                                <div className="select-down"></div>
                                <AvField type="select" name="select" label="Building Experience (Optional)">
                                    <option>Please select</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                </AvField>
                            </Col>
                        </AvForm>
                    </div>
                </div>
                <div className="share-option">
                    <div className="share-heading">
                        <span>Share Your Opinion With Others and Write a Detailed Review</span>
                    </div>
                    <div className="share-body-section">
                        <div className="share-body-start">
                            <AvForm>
                                <Col xs="12">
                                    <AvField name="yournickname" label="Review Title" />
                                </Col>
                                <Col xs="12">
                                    <div className="tooltip-icon"></div>
                                    <AvField type="textarea" name="select-multiple" label="Review" helpMessage="You must write at least 50 characters for this field." multiple>

                                    </AvField>
                                </Col>
                            </AvForm>

                        </div>
                        <div className="share-sub-option">
                            <AvForm>
                                <Col xs="12">
                                    <div className="select-down"></div>
                                    <AvField type="select" name="select" label="How would you best describe yourself? (Optional)">
                                        <option>Please select...</option>
                                        <option>01</option>
                                        <option>02</option>
                                        <option>03</option>
                                        <option>04</option>
                                    </AvField>
                                </Col>
                                <Col xs="12">
                                    <div className="select-down"></div>
                                    <AvField type="select" name="select" label="Building Experience (Optional)">
                                        <option>Please select...</option>
                                        <option>01</option>
                                        <option>02</option>
                                        <option>03</option>
                                        <option>04</option>
                                    </AvField>
                                </Col>
                            </AvForm>
                        </div>

                    </div>
                </div>
                <div className="recommendations-section">
                    <div className="recommendations-head">
                        <span>Product Recommendations (Optional)</span>
                    </div>
                    <div className="full-width">
                        <button onClick={() => this.setState({ productRecommModal: true })} type="button" className="btn product-add">Add</button>
                    </div>
                    {this.state.productRecommModal ?
                        <Modal modalId="productRecommModal" open={this.state.productRecommModal} onClose={this.closeProductRecommModal}>
                            <div className="aaaaaa">
                                <div className="recommendationsmodel">Product Recommendations Modal</div>
                                <div className="modal-body">
                                    <div className="form-group has-search">
                                        <span className="fa fa-search form-control-feedback"></span>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <span className="browse-product">Browse all products</span>
                                </div>
                                <div className="browse-title">
                                    Navigate through the categories to find a product.
                                    </div>
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Architecture (12)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        BOOST (5)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        BrickHeadz (8)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Architecture (12)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        BOOST (5)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        BrickHeadz (8)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Architecture (12)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        BOOST (5)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        BrickHeadz (8)
                                            <span className="badge badge-pill"><img className="expRating" src={browseRight} alt="browseRight" /></span>
                                    </li>
                                </ul>
                                <ul className="list-group backlist">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span className="pull-left "><img className="expRating mr-3" src={backArrow} alt="backArrow" />
                                    Browse all categories</span>    
                                    </li>
                                        <div className="container">
                                            <div className="product-list-grid">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-3"><img className="tower" src={tower} alt="tower" /></div>
                                                        <div className="col-5">
                                                            <div className="product-name">Empire State Building</div></div>
                                                        <div className="col-4 text-right">
                                                            <div className="mt-3">
                                                                <button type="button" className="btn add-btn" data-dismiss="modal">Add</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>     
                                            </div>
                                            <hr />
                                            <div className="product-list-grid">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-3"><img className="tower" src={shanghai} alt="shanghai" /></div>
                                                        <div className="col-5">
                                                            <div className="product-name">Shanghai</div></div>
                                                        <div className="col-4 text-right">
                                                            <div className="mt-3">
                                                                <button type="button" className="btn add-btn" data-dismiss="modal">Add</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div>
                                            <hr />
                                            <div className="product-list-grid">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-3"><img className="tower" src={london} alt="london" /></div>
                                                        <div className="col-5">
                                                            <div className="product-name">London</div></div>
                                                        <div className="col-4 text-right">
                                                            <div className="mt-3">
                                                                <button type="button" className="btn add-btn" data-dismiss="modal">Add</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>                       
                                            </div>
                                            <hr />
                                            <div className="product-list-grid">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-3"><img className="tower" src={paris} alt="paris" /></div>
                                                        <div className="col-5">
                                                            <div className="product-name">Paris</div></div>
                                                        <div className="col-4 text-right">
                                                            <div className="mt-3">
                                                                <button type="button" className="btn add-btn" data-dismiss="modal">Add</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>                      
                                            </div>
                                            <hr />
                                        </div>
                                    </ul> 
                                <div className="modal-footer">
                                    <button type="button" className="btn browse-btn" data-dismiss="modal">DONE</button>
                                </div>
                            </div>

                        </Modal>
                        : ''}
                </div>
                <div className="uploadimg-section">
                    <div className="uploadimg-heading">
                        <span>Add an Image: Pictures Speak a Thousand Words (Optional)</span>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <span className="upload-img-title d-none d-sm-block"> Upload an Image</span>
                            <div className="full-width">
                                <div className="uploader">
                                    <input multiple ref="uploadImg" onChange={this.fileChangedHandler} type="file" size="25" name="photo" className="BVFieldFile BVFieldInput BVField BVPhotoFileFieldInput" />
                                    <span className="action"><span className="BVRRPhotoUploadImage">choose file</span></span>
                                </div>
                                {this.state.imageUrl !== undefined && this.state.imageUrl.map((item, index) =>
                                    <div className="uploadContainerUploadedImage">
                                        <div className="BVPhotoButtonRemove">
                                            <img className="remove" onClick={() => this.onRemoveImageReview(index)} src={remove} alt="remove" />
                                        </div>
                                        <span className="UploadedImageThumbnail">
                                            <img src={item} alt="Image_Thumbnail" title="Image Thumbnail" />
                                        </span>
                                        <input type="text" className="is-touched is-pristine av-valid form-control box-aa" placeholder="Add Caption (Optional)" />
                                    </div>
                                )}
                                {/* <button type="button" className="btn product-add">Choose File</button> */}
                            </div>
                        </div>
                        <div className="col-8 d-none d-sm-block">
                            <span className="guidline-title">Guidelines for uploading photos</span>
                            <div className="guidline-list">
                                <ul className="">
                                    <li>Images must be in BMP, PNG, GIF or JPEG format.</li>
                                    <li>File size must be 5 MB or less.</li>
                                    <li>Image must be at least <span className="BVMENumber">533</span> pixels tall.</li>
                                    <li>Image must be at least <span className="BVMENumber">533</span> pixels wide.</li>
                                    <li>If you are not the copyright holder, you may not submit copyrighted images.</li>
                                    <li>Objectionable images will be rejected.</li>
                                    <li>Uploaded images become the property of LEGO.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="video-share d-none d-sm-block">
                        <div className="share-title">
                            Share a Video With Your Review (Optional)
                        </div>
                        <div className="uplod-fix">
                            <div className="row">
                                <div className="col-6">
                                    <span className="upload-img-title"> Upload a Video</span>
                                    <div className="full-width">
                                        <div className="uploader">
                                            <input type="file" onChange={(e) => this.videoUploadHandler(e)} name="photo" className="BVFieldFile BVFieldInput BVField BVPhotoFileFieldInput" />
                                            <span className="action"><span className="BVRRPhotoUploadImage">choose file</span></span>
                                        </div>
                                        {this.state.isShowVideoUploadProcessDiv ?
                                            <div>
                                                <div className="videoTag">Uploading video...</div>
                                                <span className="UploadedImageThumbnail">
                                                    <img className="videoUploadWait" src={videoUploadWait} alt="videoUploadWait" />
                                                </span>
                                                <p className="uploadVideoComment">This could take several minutes depending on file size and connection speed.</p>
                                                <div className="BVPhotoButtonRemove">
                                                    <a href="#"> <img className="cancelUpload" src={cancelUpload} alt="cancelUpload" /> Cancel Upload</a>
                                                </div>
                                            </div> : ''}
                                    </div>

                                </div>

                                <div className="col-6">
                                    <div className="upload-caption">
                                        <AvForm>
                                            <Col xs="12">
                                                <AvField name="yournickname" label="Video Caption" />
                                            </Col>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="review-footer">
                        <div className="review-footer-title">
                            <div className="row">
                                <div className="col-12 col-md-5">
                                    <div className="full-width full-widtt-mob">
                                        <button type="button" onClick={() => this.submitProductReviewData} className="btn product-add">Preview</button>
                                    </div>
                                </div>
                                <div className="col-12 col-md-7">
                                    <div className="upload-caption">
                                        <span onClick={()=>this.props.cancelReviewModel('true')}  className="review-cancel"> Cancel</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="FooterLinks">
                                        <span className="review-link"> TERMS AND CONDITIONS</span>
                                        <span className="review-link"> REVIEW GUIDELINES</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>


        )
    }
}

export default ProductReview
