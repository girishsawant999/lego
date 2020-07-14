import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import * as actions from "../../redux/actions/index"
import { injectIntl } from "../../../node_modules/react-intl"
import LogoSlider from "../../components/HomeComponent/logoSlider"
import HomeBanner from "../../components/HomeComponent/homeBanner"
import QuickLogos from "../../components/HomeComponent/quickLogos"
import TrendingNow from "../../components/HomeComponent/trendingNow"
import FeatureSet from "../../components/HomeComponent/featureSet"
import SpotLight from "../../components/HomeComponent/spotLight"
import RecommandedForYou from "../../components/HomeComponent/recommandedForYou"
import { isMobile } from "react-device-detect"
import Spinner2 from "../Spinner/Spinner2"
import AlertBox from '../../common/AlertBox/QTYAlert';
import AddBagAlert from '../../common/AlertBox/addToBagAlert';
import cookie from "react-cookies"
import SpotLight2 from "../../components/HomeComponent/spotlight2"
import { createMetaTags } from "../utility/meta"


let wishlistClick = false;
let removeWishlistClick = false;
class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			alertModalFlag: false,
			message: '',
			addMessagePopup: false,
         	addMessage: '',
		}
	}
	componentWillMount() {
		const payload = { 
			store: this.props.globals.currentStore,
			cid: this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.customer_id : ''
		}
		this.props.onGetHomePageData(payload)
		const payloadForRecommended = {
			...payload,
			categories : cookie.load('visitedProducts') ? cookie.load('visitedProducts').toString(',') : '',
		}
		this.props.onGetRecommendedData(payloadForRecommended)
	}
	componentDidMount() {
		window.scrollTo(0,0)
	}

	isEmptyObject = (object) => {
		let isEmpty = true
		Object.keys(object).forEach((key) => {
			if (object[key] != null && object[key] !== "0") {
				isEmpty = false
			}
		})
		return isEmpty
	}
	addToWishList = (product) => {
		wishlistClick = true
		const { globals, wishList, user_details } = this.props
		//let wishListProduct = wishList.products;
		let data = {
			customer_id: user_details.customer_details.customer_id,
			product_id: product.id,
			super_attribute: {},
		}
		this.props.onAddToWishList(data);
	}
	removeFromWishlist = (product) => {
		removeWishlistClick = true
		let data = {
			wishilistitemid: product.wishListId,
		}

		this.props.onRemoveWishList(data)
	}
	closeAddBag = () => {
		this.setState({
			addMessagePopup: false
		})
		}
   
		componentWillReceiveProps = (nextProps) => {
			if (nextProps.user_details.isUserLoggedIn) {
				if (nextProps.wishList && !nextProps.wishList.wishLoader &&  nextProps.wishList.productWishDetail && nextProps.wishList.productWishDetail.is_in_wishlist
				   && wishlistClick) {
					wishlistClick = false;
				  this.setState({
					 addMessagePopup: true,
					 addMessage: nextProps.globals.currentStore == 2 ? ' Item has been Added To Wish List ' : 'تم إضافة المنتج إلى قائمة الأمنيات'
				  });
			   } else if ((nextProps.wishList && nextProps.wishList.productWishDetail && removeWishlistClick &&
				(nextProps.wishList.productWishDetail.is_in_wishlist ==='' || !nextProps.wishList.productWishDetail.is_in_wishlist))) {
					removeWishlistClick = false;
					this.setState({
						is_wishlist: false,
						wishlistId: '',
						Spinner: false,
						addMessagePopup: true,
						addMessage: nextProps.globals.currentStore == 2 ? ' Item has been removed from Wish List ' : 'تم إزالة المنتج من  قائمة الأمنيات'
					});
			   }
			}
			if (nextProps.notify.message) {    
				this.setState({
					notified :true
				})
				if(this.props.globals.store_locale === 'en') {
					this.setState({
					addMessagePopup: true,
					addMessage: nextProps.notify.notified ? "Notification alert already saved" :  "Notification alert saved"
					})
				} else {
					this.setState({
					addMessagePopup: true,
					addMessage: nextProps.notify.notified ? "تم حفظ التنبيه مسبقا" :  "تم حفظ التنبيه "
					})
				}
				
			}
		}
	render() {
		let {  globals } = this.props;
		if (this.props.globals.homeLoader || globals.loading) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
		}
		let alertBox = null;
		if (this.state.alertModalFlag) {
            alertBox = <AlertBox
                message={this.state.message}
                alertBoxStatus={true}
                closeBox={this.closeErrorBox} />
        }

		let alertBoxWIshlist = null;
		if (this.state.addMessagePopup) {
			alertBoxWIshlist = <AddBagAlert
				message={this.state.addMessage}
				alertBoxStatus={true}
				closeBox={this.closeAddBag} />
		}
		return (
			<div>
				{alertBox}
				{alertBoxWIshlist}
				{this.props.home_page_data && (
					<div>
						{createMetaTags(
							this.props.globals.store_locale === "en"
								? "Home | Official LEGO® Online Store Saudi Arabia"
								: "الصفحة الرئيسية | متجر ليغو أونلاين الرسمي بالسعودية ",
							this.props.globals.store_locale === "en"
								? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
								: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
							this.props.globals.store_locale === "en"
								? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
								: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
						)}
						<LogoSlider />
						<HomeBanner data={this.props.home_page_data.SECTION1} isEmptyObject={this.isEmptyObject} />
						<QuickLogos data={this.props.home_page_data.SECTION2} />
						<TrendingNow data={this.props.home_page_data.SECTION3} />
						{this.props.home_page_data.SECTION4 && (
							<FeatureSet
								data={this.props.home_page_data.SECTION4}
								isEmptyObject={this.isEmptyObject}
								addToWishList={this.addToWishList}
								removeFromWishlist={this.removeFromWishlist}
							/>
						)}
						{/* <SpotLight data={this.props.home_page_data.SECTION5} /> */}
						{this.props.home_page_data.SECTION5 && <SpotLight2 data={this.props.home_page_data.SECTION5} />}
						{/* <ShopAgeRange /> */}
						{this.props.recommended_data && (
							<RecommandedForYou
								data={this.props.recommended_data.SECTION6}
								addToWishList={this.addToWishList}
								removeFromWishlist={this.removeFromWishlist}
							/>
						)}
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		home_page_data: state.global.home_page_data,
		recommended_data: state.global.recommended_data,
		globals: state.global,
		user_details :state.login,
		wishList: state.wishList,
		notify:state.notify,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetHomePageData: (payload) => dispatch(actions.getHomePageData(payload)),
		onGetRecommendedData: (payload) => dispatch(actions.getRecommendedData(payload)),
		onAddToWishList: payload => dispatch(actions.addToWishlist(payload)),
      	onRemoveWishList: (payload) => dispatch(actions.removeWishList(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Home)))
