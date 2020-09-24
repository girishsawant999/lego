import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { buildHeader } from '../../api/helpers';
import * as actions from '../../redux/actions/index';
import { FormattedMessage, injectIntl } from 'react-intl';
import grey from '../../assets/images/emotes/grey.png';
import Yellow1 from '../../assets/images/emotes/Yellow_1.png';
import Yellow2 from '../../assets/images/emotes/Yellow_2.png';
import Yellow3 from '../../assets/images/emotes/Yellow_3.png';
import Yellow4 from '../../assets/images/emotes/Yellow_4.png';
import Yellow5 from '../../assets/images/emotes/Yellow_5.png';
import Yellow6 from '../../assets/images/emotes/Yellow_6.png';
import $ from 'jquery';

var Cryptr = require('cryptr');
let query = null;
let payfort_message = null;
let interval = null;
class paymentProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    window.scrollTo(0, 0);
    this.onPaymentProcessing();
  }
  componentWillUnmount() {
    clearInterval(interval);
  }
  animation = (failure = false) => {
    let index = 1;
    interval = setInterval(() => {
      if (index === 6) {
        $('.img__div img').attr('src', grey);
        $('#imagen1').attr('src', failure ? Yellow4 : Yellow1);
      } else if (index === 1) {
        $('.img__div img').attr('src', grey);
        $('#imagen2').attr('src', failure ? Yellow5 : Yellow2);
      } else if (index === 2) {
        $('.img__div img').attr('src', grey);
        $('#imagen3').attr('src', failure ? Yellow6 : Yellow3);
      } else if (index === 3) {
        $('.img__div img').attr('src', grey);
        $('#imagen4').attr('src', Yellow4);
      } else if (index === 4) {
        $('.img__div img').attr('src', grey);
        $('#imagen5').attr('src', failure ? Yellow5 : Yellow1);
      } else if (index === 5) {
        $('.img__div img').attr('src', grey);
        $('#imagen6').attr('src', failure ? Yellow6 : Yellow2);
      }

      index = index + 1 === 7 ? 1 : index + 1;
    }, 500);
  };

  onPaymentProcessing = () => {
    query = new URLSearchParams(this.props.location.search);
    var cryptrOrderId = new Cryptr('mihyarOrderId');
    this.props.history.push(
      `/${this.props.globals.store_locale}/paymentProcessing`
    );
    if (query.get('step') === 'PROCESSING') {
      this.animation();
    } else if (query.get('step') === 'FAILED') {
      this.animation(true);
      this.onPaymentFailed(
        cryptrOrderId.decrypt(query.get('order_id')),
        query.get('message')
      );
    } else {
      this.animation(true);
      const merchant_reference = localStorage.getItem('merchant_reference');
      if (merchant_reference) {
        // remove
        localStorage.removeItem('merchant_reference');
        this.onPaymentFailed(
          merchant_reference,
          this.props.globals.store_locale === 'en'
            ? 'The process is interrupted, please confirm your order before proceeding with the payment'
            : 'تمت مقاطعة العملية، يرجى التأكد من طلبك قبل متابعة عملية الدفع'
        );
      } else {
        this.props.history.push(`/${this.props.globals.store_locale}/cart`);
      }
    }
  };

  onPaymentFailed = (merchant_reference, message) => {
    payfort_message = message;
    this.props.payfortRestoreQuote({ merchant_reference });
    this.props.onGetCountryList();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.myCart.isPayfortFailed) {
      this.props.history.push({
        pathname: `/${this.props.globals.store_locale}/checkoutPaymentMethod`,
        state: { isPayfortFailed: true, message: payfort_message },
      });

      nextProps.myCart.isPayfortFailed = false;
    }

    if (nextProps.myCart.payfortRestoreQuoteFailed) {
      this.props.history.push(`/${this.props.globals.store_locale}/cart`);

      nextProps.myCart.payfortRestoreQuoteFailed = false;
    }

    if (nextProps.myCart.saved_card_payfort_data) {
      const SUCCESS_STATUSES = [2, 4, 14, 15, 19, 20, 28, 40, 44, 80];
      let data = nextProps.myCart.saved_card_payfort_data;
      const cryptr = new Cryptr(data.merchant_reference);
      const cryptrOrderId = new Cryptr('mihyarOrderId');
      if (parseInt(data.status) === 20) {
        window.location.href = data['3ds_url'];
      } else if (parseInt(data.status) === 14) {
        var obj = {
          command: data.command ? data.command : '',
          access_code: data.access_code ? data.access_code : '',
          merchant_identifier: data.merchant_identifier
            ? data.merchant_identifier
            : '',
          merchant_reference: data.merchant_reference
            ? data.merchant_reference
            : '',
          amount: data.amount ? data.amount : '',
          currency: data.currency ? data.currency : '',
          language: data.language ? data.language : '',
          customer_email: data.customer_email ? data.customer_email : '',
          signature: data.signature ? data.signature : '',
          fort_id: data.fort_id ? data.fort_id : '',
          payment_option: data.payment_option ? data.payment_option : '',
          eci: data.eci ? data.eci : '',
          order_description: data.order_description
            ? data.order_description
            : '',
          customer_ip: data.customer_ip ? data.customer_ip : '',
          customer_name: data.card_holder_name ? data.card_holder_name : '',
          response_message: data.response_message ? data.response_message : '',
          response_code: data.response_code ? data.response_code : '',
          status: data.status ? data.status : '',
          card_holder_name: data.card_holder_name ? data.card_holder_name : '',
          expiry_date: data.expiry_date ? data.expiry_date : '',
          card_number: data.card_number ? data.card_number : '',
          order_id: data.merchant_reference ? data.merchant_reference : '',
        };
        const ORDER_PAYMENT_URL = `https://${data.merchant_extra2}/index.php/rest/V1/app/OrderPayment`;
        axios.post(ORDER_PAYMENT_URL, obj, { headers: buildHeader() });
        this.props.history.push(
          `/${this.props.globals.store_locale}/order-summary?store_id=${
            data.merchant_extra
          }&order_id=${cryptrOrderId.encrypt(
            data.merchant_reference
          )}&status=${cryptr.encrypt(parseInt(data.status) == 14)}&type=${
            parseInt(data.status) == 14 ? 'success' : 'failure'
          }`
        );
      } else if (SUCCESS_STATUSES.includes(parseInt(data.status))) {
        var obj = {
          command: data.command ? data.command : '',
          access_code: data.access_code ? data.access_code : '',
          merchant_identifier: data.merchant_identifier
            ? data.merchant_identifier
            : '',
          merchant_reference: data.merchant_reference
            ? data.merchant_reference
            : '',
          amount: data.amount ? data.amount : '',
          currency: data.currency ? data.currency : '',
          language: data.language ? data.language : '',
          customer_email: data.customer_email ? data.customer_email : '',
          signature: data.signature ? data.signature : '',
          fort_id: data.fort_id ? data.fort_id : '',
          payment_option: data.payment_option ? data.payment_option : '',
          eci: data.eci ? data.eci : '',
          order_description: data.order_description
            ? data.order_description
            : '',
          customer_ip: data.customer_ip ? data.customer_ip : '',
          customer_name: data.card_holder_name ? data.card_holder_name : '',
          response_message: data.response_message ? data.response_message : '',
          response_code: data.response_code ? data.response_code : '',
          status: data.status ? data.status : '',
          card_holder_name: data.card_holder_name ? data.card_holder_name : '',
          expiry_date: data.expiry_date ? data.expiry_date : '',
          card_number: data.card_number ? data.card_number : '',
          order_id: data.merchant_reference ? data.merchant_reference : '',
        };
        const ORDER_PAYMENT_URL = `https://${data.merchant_extra2}/index.php/rest/V1/app/OrderPayment`;
        axios.post(ORDER_PAYMENT_URL, obj, { headers: buildHeader() });
        this.props.history.push(
          `/${this.props.globals.store_locale}/order-summary?store_id=${
            data.merchant_extra
          }&order_id=${cryptrOrderId.encrypt(
            data.merchant_reference
          )}&status=${cryptr.encrypt(parseInt(data.status) == 14)}&type=${
            parseInt(data.status) == 14 ? 'success' : 'failure'
          }`
        );
      } else {
        this.onPaymentFailed(data.merchant_reference, data.response_message);
      }

      nextProps.myCart.saved_card_payfort_data = null;
    }

    if (nextProps.myCart.placeOrderFailed) {
      this.props.history.push(`/${this.props.globals.store_locale}/cart`);
    }
  }

  render() {
    return (
      <div className="paymentProcessing">
        <FormattedMessage
          id="PaymentProcessingPleaseWait"
          defaultMessage="Payment processing please wait..."
        />
        <div className="main__div">
          <div className="img__div">
            <img className="sizeImg" id="imagen1" src={Yellow1} alt="loader" />
          </div>
          <div className="img__div">
            <img className="sizeImg" id="imagen2" src={grey} alt="loader" />
          </div>
          <div className="img__div">
            <img className="sizeImg" id="imagen3" src={grey} alt="loader" />
          </div>
          <div className="img__div">
            <img className="sizeImg" id="imagen4" src={grey} alt="loader" />
          </div>
          <div className="img__div">
            <img className="sizeImg" id="imagen5" src={grey} alt="loader" />
          </div>
          <div className="img__div">
            <img className="sizeImg" id="imagen6" src={grey} alt="loader" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    globals: state.global,
    myCart: state.myCart,
    shipping: state.shipping,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    payfortRestoreQuote: (data) => dispatch(actions.payfortRestoreQuote(data)),
    onGetCountryList: () => dispatch(actions.getCountryList()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(paymentProcessing));
