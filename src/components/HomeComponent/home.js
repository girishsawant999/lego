import React, { Suspense, Component } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import * as actions from "../../redux/actions/index"
import { injectIntl } from "../../../node_modules/react-intl"
import { isMobile } from "react-device-detect"
import Spinner2 from "../Spinner/Spinner2";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "bootstrap/dist/css/bootstrap.css"
// import AlertBox from '../../common/AlertBox/QTYAlert';
// import AddBagAlert from '../../common/AlertBox/addToBagAlert';
import cookie from "react-cookies"
// import SpotLight2 from "../../components/HomeComponent/spotlight2"
import { createMetaTags } from "../utility/meta";

// import LogoSlider from "../../components/HomeComponent/logoSlider"
// import HomeBanner from "../../components/HomeComponent/homeBanner"
const HomeBanner = React.lazy(() => import('../../components/HomeComponent/homeBanner'))
const QuickLogos = React.lazy(() => import('../../components/HomeComponent/quickLogos'))
const TrendingNow = React.lazy(() => import('../../components/HomeComponent/trendingNow'))
const FeatureSet = React.lazy(() => import('../../components/HomeComponent/featureSet'))
const SpotLight = React.lazy(() => import('../../components/HomeComponent/spotLight'))
const RecommandedForYou = React.lazy(() => import('../../components/HomeComponent/recommandedForYou'))
// const Spinner2 = React.lazy(() => import('../Spinner/Spinner2'))
const AlertBox = React.lazy(() => import('../../common/AlertBox/QTYAlert'))
const AddBagAlert = React.lazy(() => import('../../common/AlertBox/addToBagAlert'))
const SpotLight2 = React.lazy(() => import('../../components/HomeComponent/spotlight2'))

// import QuickLogos from "../../components/HomeComponent/quickLogos"
// import TrendingNow from "../../components/HomeComponent/trendingNow"
// import FeatureSet from "../../components/HomeComponent/featureSet"
// import SpotLight from "../../components/HomeComponent/spotLight"
// import RecommandedForYou from "../../components/HomeComponent/recommandedForYou"

const LogoSlider = React.lazy(() => import('../../components/HomeComponent/logoSlider'));

let wishlistClick = false;
let removeWishlistClick = false;
let isScroll = false;
class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			alertModalFlag: false,
			message: '',
			addMessagePopup: false,
			 addMessage: '',
			 isScroll: false
		}

		isScroll = false;
	}

	componentWillMount() {
		const payload = { 
			store: this.props.globals.currentStore,
			cid: this.props.user_details.isUserLoggedIn ? this.props.user_details.customer_details.customer_id : ''
		}
		this.props.onGetHomePageData(payload)
		const payloadForRecommended = {
			...payload,
			categories : this.props.globals.recommendedCategories.toString(',') ,
		}
		this.props.onGetRecommendedData(payloadForRecommended)
	}
	componentDidMount = () => {
		window.scrollTo(0,0);

		// if (this.state.isScroll === false && isScroll === false) {
			// window.addEventListener("scroll", () => {
				if(this.state.isScroll === false && isScroll === false) {
					isScroll = true;
					this.setState({
						isScroll: true
					});
				}
			// });
		// }
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
			product_id:product.product_id
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
				if (nextProps.wishlistUpdated.wishlistMessage && nextProps.wishlistUpdated.wishlistItemRemoved ) {
					this.setState({
					   addMessagePopup: true,
					   addMessage: nextProps.wishlistUpdated.wishlistMessage,
					})
					nextProps.wishlistUpdated.wishlistMessage = ""
					nextProps.wishlistUpdated.wishlistItemRemoved =false
				 }
				 if (nextProps.wishlistUpdated.wishlistMessage && nextProps.wishlistUpdated.wishlistItemAdded ) {
					this.setState({
					   addMessagePopup: true,
					   addMessage: nextProps.wishlistUpdated.wishlistMessage,
					})
					nextProps.wishlistUpdated.wishlistMessage = ""
					nextProps.wishlistUpdated.wishlistItemAdded =false
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
						<Suspense fallback={<div></div>}>
						<LogoSlider />
						</Suspense>
						<Suspense fallback={<div></div>}>
						<HomeBanner data={this.props.home_page_data.SECTION1} isEmptyObject={this.isEmptyObject} />
						</Suspense>
						<Suspense fallback={<div></div>}>
						<QuickLogos data={this.props.home_page_data.SECTION2} />
						</Suspense>
						{this.state.isScroll && isScroll && <>
						<Suspense fallback={<div></div>}>

						<TrendingNow data={this.props.home_page_data.SECTION3} />
						</Suspense>
						{this.props.home_page_data.SECTION4 && (
						<Suspense fallback={<div></div>}>

							<FeatureSet
								data={this.props.home_page_data.SECTION4}
								isEmptyObject={this.isEmptyObject}
								addToWishList={this.addToWishList}
								removeFromWishlist={this.removeFromWishlist}
							/>
						</Suspense>
						)}
						{/* <SpotLight data={this.props.home_page_data.SECTION5} /> */}
						{this.props.home_page_data.SECTION5 && 
						<Suspense fallback={<div></div>}>
							<SpotLight2 data={this.props.home_page_data.SECTION5} />
						</Suspense>
						}
						{/* <ShopAgeRange /> */}
						{this.props.recommended_data && (
						<Suspense fallback={<div></div>}>

							<RecommandedForYou
								data={this.props.recommended_data.SECTION6}
								addToWishList={this.addToWishList}
								removeFromWishlist={this.removeFromWishlist}
							/>
						</Suspense>
						)}
						</>}
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
		wishlistUpdated: state.wishlistUpdated,
		notify:state.notify,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetHomePageData: (payload) => dispatch(actions.getHomePageData(payload)),
		onGetRecommendedData: (payload) => dispatch(actions.getRecommendedData(payload)),
		onAddToWishList: payload => dispatch(actions.addToWishlistUpdated(payload)),
      	onRemoveWishList: (payload) => dispatch(actions.removeWishListUpdated(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Home)))
