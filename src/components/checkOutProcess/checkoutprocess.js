import React, { Suspense, Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
// import CartList from '../checkOutProcess/cartListView';
// import Shipping from '../checkOutProcess/shipping';
//import Breadcrumb from '../../common/breadcrumb';
// import orderSummary from '../../components/checkOutProcess/checkOutProcessorderSummary';
import * as actions from "../../redux/actions/index";
import Spinner2 from "../Spinner/Spinner2";
import { createMetaTags } from '../utility/meta';

const CartList = React.lazy(() => import('../checkOutProcess/cartListView'));
const Shipping = React.lazy(() => import('../checkOutProcess/shipping'));
const Ordersummary = React.lazy(() => import('../checkOutProcess/checkOutProcessorderSummary'));

class CheckOutprocess extends Component {
   constructor(props) {
       super(props);
       this.state = {
           guestCheckout: false
       }
   }

   componentDidMount = () => {
        window.scrollTo(0,0)
        if ((!this.props.country.countryList) || (this.props.country.countryList && 
            this.props.country.countryList.length === 0)) {
            this.props.onGetCountryList();
        }
    }

    guestCheckoutStart = () => {
        this.props.startGuestCheckout();
        // this.setState({
        //     guestCheckout: true
        // });

        this.props.history.push(`/${this.props.globals.store_locale}/shipping`);
    }

   render() {
        const { globals, user_details } = this.props;
        const { guestCheckout } = this.state;
        if (globals.loading) {
            return (
                <div className="mobMinHeight">
                    <Spinner2 />
                 {   createMetaTags(
            this.props.globals.store_locale === "en"
                ? "Checkout | Official LEGO® Online Check Saudi Arabia"
                : "الدفع | متجر ليغو أونلاين الرسمي بالسعودية ",
            this.props.globals.store_locale === "en"
                ? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
                : "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
            this.props.globals.store_locale === "en"
                ? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
                : "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
        )}
                </div>
            )
        }
       return (
           <div>
            <Suspense fallback={<div></div>}>
                <div className="CheckOutProcess">
                <orderSummary />  
                {!user_details.isUserLoggedIn && !guestCheckout && <CartList guestCheckoutStart={this.guestCheckoutStart}/>}
                {(user_details.isUserLoggedIn || guestCheckout) && <Shipping />}
			    </div>
           </Suspense>
           </div>
       )
   }
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		user_details: state.login,
        myCart: state.myCart,
        country: state.country
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
        onGetCountryList: () => dispatch(actions.getCountryList()),
        startGuestCheckout: () => dispatch(actions.startGuestCheckout()),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CheckOutprocess)));