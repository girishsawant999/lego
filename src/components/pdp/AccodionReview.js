import React, { Suspense, Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import starYellow from '../../assets/images/icons/starYellow.png';
import starGrey from '../../assets/images/icons/starGrey.png';
import starhalf from '../../assets/images/icons/starhalf.png';
// import expRating from '../../assets/images/icons/expRating.png';
// import expRatingB from '../../assets/images/icons/expRatingB.png';
// import expRatingH from '../../assets/images/icons/expRatingH.png';
import Reviewdown from '../../assets/images/icons/arrowDown.png';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import Spinner2 from "../Spinner/Spinner";
// import ProductReview from './ProductReview';
// import ReviewRating from './ReviiewRating';
// import Progress from 'react-progressbar';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
// import AddBagAlert from '../../common/AlertBox/addToBagAlert';
const ReviewRating = React.lazy(() => import('../pdp/ReviewRating'));
const AddBagAlert = React.lazy(() => import('../../common/AlertBox/addToBagAlert'));

class AccodionReview extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showModal: false,
         showProductReviewModal: false,
         reviews: [],

			addMessagePopup: false,
         addMessage: '',
      }
   }
   openProductReviewModal = () => {
      this.setState({ showProductReviewModal: true })
   }
   closeProductReviewModal = () => {
      this.setState({ showProductReviewModal: false })
   }
   componentWillMount = () => {
      if (this.props.reviews && this.props.reviews.list) {
         this.setReviews(this.props.reviews.list);
      }
   }

   setReviews = (reviews) => {
      reviews.sort((a, b) => {
         return Date.parse(b.submited_on) - Date.parse(a.submited_on);
      });

      this.setState({
         reviews
      });
   }

   sort = (e) => {
      if (e.target.value === 'Date - newest first') {
         let reviews = this.state.reviews;
         reviews.sort((a, b) => {
            return Date.parse(b.submited_on) - Date.parse(a.submited_on);
         });

         this.setState({
            reviews
         });
      } else if (e.target.value === 'Date - oldest first') {
         let reviews = this.state.reviews;
         reviews.sort((a, b) => {
            return Date.parse(a.submited_on) - Date.parse(b.submited_on);
         });

         this.setState({
            reviews
         });
      } else if (e.target.value === 'Rating - High to Low') {
         let reviews = this.state.reviews;
         reviews.sort((a, b) => {
            return parseInt(b.rating) - parseInt(a.rating);
         });

         this.setState({
            reviews
         });
      } else if (e.target.value === 'Rating - Low to High') {
         let reviews = this.state.reviews;
         reviews.sort((a, b) => {
            return parseInt(a.rating) - parseInt(b.rating);
         });

         this.setState({
            reviews
         });
      }
   }

   openReviewModel = () => {
      if (this.props.isUserLoggedIn) {
         this.setState({
            showProductReviewModal:true
         })
      } else {
         const location = {
            pathname: `/${this.props.globals.store_locale}/login`,
            state: { from: this.props.location.pathname }
          }

        this.props.history.push(location);
      }
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.reviews && nextProps.reviews.list ) {
         this.setReviews(nextProps.reviews.list);
      }
      if (nextProps.product && nextProps.product.reviewAdded) {
         this.setState({
            addMessagePopup: true,
            addMessage: nextProps.product.reviewMsg
         });

         nextProps.product.reviewAdded = "";
      }
   }
   closeAddBag = () => {
		this.setState({
			addMessagePopup: false,
		})
	}
   render() {
      let alertBox = null;
		if (this.state.addMessagePopup) {
			alertBox = <AddBagAlert
				message={this.state.addMessage}
				alertBoxStatus={true}
				closeBox={this.closeAddBag} />
		}
      const { avgReview, reviews, store_locale } = this.props;
      if (reviews && reviews.list && reviews.list.length > 0 && this.state.reviews.length === 0) {
         this.setReviews(reviews.list);
      }
      return (
         <Suspense fallback={<div></div>}>
         <div>
            {alertBox}
            <div className="AccodionReview">
               {this.state.showProductReviewModal ?
                  <Modal modalId="newReviewModel" open={this.state.showProductReviewModal} onClose={this.closeProductReviewModal}>
                     <div>
                        <ReviewRating onClose={this.closeProductReviewModal} />
                     </div>
                  </Modal>
                  : ''}
               <div className="row">
                  <div className="col-md-9">
                     <div className="leftReview">
                        <p className="titlerating"><FormattedMessage id='reviews.overallRating' defaultMessage=' Overall Rating' /></p>
                        <ul className="list-inline main_Ul">
                           <li className="list-inline-item">
                              <ul className="list-inline starList">
                                 <li className="list-inline-item"><span>
                                 <img src={ avgReview >= 0.3 && avgReview <= 0.8 ? starhalf : avgReview > 0.8 ? starYellow : starGrey } alt="startYellow" /> </span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ avgReview >= 1.3 && avgReview <= 1.8 ? starhalf : avgReview > 1.8 ? starYellow : starGrey } alt="startYellow" /></span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ avgReview >= 2.3 && avgReview <= 2.8 ? starhalf : avgReview > 2.8 ? starYellow : starGrey } alt="startYellow" /></span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ avgReview >= 3.3 && avgReview <= 3.8 ? starhalf : avgReview > 3.8 ? starYellow : starGrey } alt="startYellow" /></span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ avgReview >= 4.3 && avgReview <= 4.8 ? starhalf : avgReview > 4.8 ? starYellow : starGrey } alt="startGrey" /></span></li>
                              </ul>
                           </li>
                           <li className="list-inline-item">
                              <Link to={`/`}>
                                 <span className="reviewPoint">{avgReview}</span>
                              </Link>
                           </li>
                           {reviews && <li className="list-inline-item">
                              <Link to={`/`}>
                                 <span className="reviewText">{`(${reviews.total_reviews})`}</span></Link>
                           </li>}
                        </ul>

                        {this.state.reviews && this.state.reviews.length > 0 && <div className="ReviewDropDown">
                           <p className="italicText">
                           <FormattedMessage id='review.msg' defaultMessage='' />
                           <Link to={`/${store_locale}/privacy-policy`}>
                           <FormattedMessage id='privacy_policy' defaultMessage='Privacy policy' /></Link></p>
                           <div className="reviewDrop">
                              <p className="reviewHead">
                              <FormattedMessage id='reviews' defaultMessage='Reviews' /> 
                              </p>
                              <div className="Review_Drop">
                                 <img src={Reviewdown} alt="" className="Icon" />
                                 <select onChange={(e) => this.sort(e)} className="form-control filter-focus">
                                    <option>{store_locale === 'en' ? 'Date - newest first' : 'Date - newest first'}</option>
                                    <option>{store_locale === 'en' ? 'Date - oldest first' : 'Date - oldest first'}</option>
                                    <option>{store_locale === 'en' ? 'Rating - High to Low' : 'Rating - High to Low'}</option>
                                    <option>{store_locale === 'en' ? 'Rating - Low to High' : 'Rating - Low to High'}</option>
                                 </select>
                              </div>
                           </div>
                        </div>}
                        <div>                           
                        </div>
                        {this.state.reviews &&  
                        this.state.reviews.map((review) => {
                        return (
                           <>
                           <div className="AbsoluteReview">
                              <p className="absText">{review.title}</p>
                              <p className="dateText"><span className="texBold">{review.name}</span>&nbsp;on&nbsp;
                              <span className="texBold">{review.submited_on}</span></p>
                              <ul className="list-inline starList">
                                 <li className="list-inline-item"><span>
                                 <img src={ review.rating >= 0.3 && review.rating <= 0.8 ? starhalf : review.rating > 0.8 ? starYellow : starGrey } alt="startYellow" /> </span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ review.rating >= 1.3 && review.rating <= 1.8 ? starhalf : review.rating > 1.8 ? starYellow : starGrey } alt="startYellow" /></span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ review.rating >= 2.3 && review.rating <= 2.8 ? starhalf : review.rating > 2.8 ? starYellow : starGrey } alt="startYellow" /></span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ review.rating >= 3.3 && review.rating <= 3.8 ? starhalf : review.rating > 3.8 ? starYellow : starGrey } alt="startYellow" /></span></li>
                                 <li className="list-inline-item"><span>
                                 <img src={ review.rating >= 4.3 && review.rating <= 4.8 ? starhalf : review.rating > 4.8  ? starYellow : starGrey } alt="startGrey" /></span></li>
                              </ul>
                              <p className="decText">{review.summary}</p>
                           </div>
                           {/* <div className="Inappropriate">
                              <p>Report as Inappropriate</p>
                           </div> */}
                           </>
                        )})}
                        
                     </div>
                  </div>
                  <div className="col-md-3">
                     <div className="WriteReview">
                        <button id="AccodionReview2"  onClick={() => this.openReviewModel() } className="WriteReviewBtn"><FormattedMessage id='review.writeReview' defaultMessage='Write a Review' /> </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         </Suspense>
      )
   }
}

const mapStateToProps = state => {
   return {
      globals: state.global,
      product: state.product
   };
}
const mapDispatchToProps = dispatch => {
   return {
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccodionReview));