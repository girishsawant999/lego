import React, { Component } from 'react';
import StarRatingComponent from 'react-rating';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { injectIntl } from "../../../node_modules/react-intl"
import * as actions from ".././../redux/actions/index"
import { FormattedMessage } from '../../../node_modules/react-intl';
import AddBagAlert from '../../common/AlertBox/addToBagAlert';

let reviewSubmited = false;
class ReviewRating extends Component {
   constructor(props) {
      super(props);
      this.state = {
         nameErr: false,
         name: '',
         email: '',
         emailErr: false,
         titleErr: false,
         ratingErr: false,
         title: '',
         rating: 0,
         summary: '',
         summaryErr: false,
         addMessagePopup: false
      }
   }

    validateName = (e) => {
      var name = e ? e.target.value : this.state.name
		if (name.length > 0) {
			this.setState({ name, nameErr: false })
			return true
		} else {
         this.props.globals.store_locale==='en' 
         ?  this.setState({ nameErr: "Name should not be empty!" }) 
         : this.setState({ nameErr: "لاينبغي أن يكون حقل الإسم فارغًا!" })

			return false
		}
   }

   validateEmail = (e) => {
      var email = e ? e.target.value : this.state.email
		if (email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
			this.setState({email, emailErr: false })
			return true
		} else {
			email.length > 0
            ?  this.props.globals.store_locale==='en' 
               ?  this.setState({ emailErr: "Email is invalid!" })
               :  this.setState({ emailErr: "البريد الإلكتروني غير صحيح! " })

            : this.props.globals.store_locale==='en' 
              ?  this.setState({ emailErr: "Email should not be empty!" })
              :  this.setState({ emailErr: "لاينبغي أن يكون حقل البريد الإلكتروني فارغًا!" })
			return false
		}
   }
   
   validateTitle = (e) => {
      var title = e ? e.target.value : this.state.title
		if (title.length > 0) {
			this.setState({ title, titleErr: false })
			return true
		} else {
			this.props.globals.store_locale==='en' 
         ?  this.setState({ titleErr: "Title should not be empty!" })
         :  this.setState({ titleErr: "لاينبغي أن يكون العنوان فارغًا!" })
			return false
		}
   }

   validateRating = (rate) => {
      if(rate > 0) {
			this.setState({ ratingErr: false })
			return true
		} else {
			this.props.globals.store_locale==='en' 
         ?  this.setState({ ratingErr: "Rating should not be empty!" })
         :  this.setState({ ratingErr: "لاينبغي أن يكون حقل التقييم فارغًا!" })
			return false
		}
   }
   validateSummary = () => {
      if(this.state.summary) {
			this.setState({ summaryErr: false })
			return true
		} else {
			this.props.globals.store_locale==='en' 
         ?  this.setState({ summaryErr: "Summary should not be empty!" })
         :  this.setState({ summaryErr: "لاينبغي أن يكون الملخص فارغًا "})
			return false
		}
   }

   onStarClick = (rating) => {
      this.validateRating(rating)
      this.setState({rating})
   }

   setSummary = (e) => {
      this.setState({
         summary: e.target.value
      });
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.product && nextProps.product.reviewAdded) {
         this.setState({
            addMessagePopup: true
         });

         setTimeout(() => {
            this.props.onClose();
         }, 2500);
      }
   }

   submitReview =() => {
      reviewSubmited = true;
      var name = this.validateName();
      var title = this.validateTitle();
      var email = this.validateEmail();
      var rate = this.validateRating(this.state.rating);
      var summary = this.validateSummary();

      if (name && title && email && rate && summary && this.props.user_details.isUserLoggedIn) {
         let requestData = {
            "productid": this.props.product.product[0].id,
            "customerid": this.props.user_details.customer_details.customer_id,
            "name": this.state.name,
            "email":this.state.email,
            "rating": this.state.rating,
            "title": this.state.title,
            "summary": this.state.summary,
            "storeid": this.props.globals.currentStore 
         }

         this.props.addReview(requestData);
      }
   }

   closeAddBag = () => {
      this.setState({
          addMessagePopup: false
      })
  }

    render() {
      let alertBox = '';
      if (this.state.addMessagePopup) {
         alertBox = <AddBagAlert
             message = {this.props.product.reviewMsg}
             alertBoxStatus={true}
             closeBox={this.closeAddBag} />
     }
        return (
            <div>
               {alertBox}
              <div className="NewReviewRating">
               <p className="TitleR textCenter"><FormattedMessage id="review.writeReview" defaultMessage="Write a review" /></p>
               <div className="reviewForm">
                  <form >
                     <div class="form-group">
                        <label for="pwd">
                        <FormattedMessage id="review.name" defaultMessage="Name" />
                        </label>
                        <input 
                        onChange={(e) => this.validateName(e)}
                        type="text" className="form-control" placeholder={ this.props.globals.store_locale==='en' ? "Enter your name": "أدخل اسمك " } id="pwd" />
                        {this.state.nameErr && <span className="error">{this.state.nameErr}</span>}
                     </div>
                     <div className="form-group">
                        <label for="email">
                        <FormattedMessage id="review.email" defaultMessage="Email address:" /></label>
                        <input onChange={(e) => this.validateEmail(e)}  type="text" className="form-control" placeholder={ this.props.globals.store_locale==='en' ? "Enter email": "أدخل بريدك الإلكتروني" } id="email" />
                        {this.state.emailErr && <span className="error">{this.state.emailErr}</span>}
                     </div>
                     <div className="form-group">
                        <label for="pwd"><FormattedMessage id="review.rating" defaultMessage="Rating" /></label>
                        <div className="">
                        <StarRatingComponent 
                           emptySymbol="fa fa-star-o fa-2x"
                           fullSymbol="fa fa-star fa-2x"
                           fractions={1}
                           initialRating={parseInt(this.state.rating)}
                           onChange={(e) => this.onStarClick(e)}
                        />
                        {this.state.ratingErr && <span className="error">{this.state.ratingErr}</span>}
                        </div>
                     </div>
                     <div className="form-group">
                        <label for="pwd"><FormattedMessage id="review.title" defaultMessage="Review Title" /></label>
                        <input 
                        onChange={(e) => this.validateTitle(e)}
                        type="text" className="form-control" placeholder={ this.props.globals.store_locale==='en' ? "Give your review a title": "أعط تقييمك عنوانا " } id="pwd" />
                        {this.state.titleErr && <span className="error">{this.state.titleErr}</span>}
                     </div>
                     <div claclassNamess="form-group">
                        <label for="exampleFormControlTextarea1"> 
                        <FormattedMessage id="review.body" defaultMessage="Body of Review (1492)" />
                        </label>
                        <textarea onChange={(e) => this.setSummary(e)} onBlur={this.validateSummary} className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder={ this.props.globals.store_locale==='en' ? "Write your comments here": "اكتب تعليقاتك هنا" }></textarea>
                        {this.state.summaryErr && <span className="error">{this.state.summaryErr}</span>}
                     </div>
                     <button onClick={() => this.submitReview()} type="button" className="btnSubmit">
                        <FormattedMessage id="review.submit" defaultMessage="Submit Review" /></button>
                  </form>
               </div>
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
      globals: state.global,
      user_details: state.login,
      product: state.product
	}
}
const mapDispatchToProps = (dispatch) => {
	return { addReview: (payload) => dispatch(actions.addReview(payload)) }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ReviewRating)))

