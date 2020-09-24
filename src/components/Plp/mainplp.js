import React, { Component } from "react";
import * as actions from ".././../redux/actions/index";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import ProductList from "../Plp/productlisting";
import LogoSlider from "../../components/HomeComponent/logoSlider";
import Breadcrumb from "../../common/breadcrumbNew";
import Spinner2 from "../../components/Spinner/Spinner2";
import SearchNotFound from "../../common/searchNotFound";
import MetaTags from "react-meta-tags";
import { createMetaTags } from "../utility/meta";

class mainplp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  componentWillMount() {
    let store = this.props.globals.currentStore;
    let url = this.props.location.pathname.split("/productlisting/")[1];
    if (this.props.location.pathname.includes("/productlisting/")) {
      const payload = {
        store_id: store,
        url_key: url,
        page: 1,
        customerid: this.props.user_details.isUserLoggedIn
          ? this.props.user_details.customer_details.customer_id
          : "",
      };
      this.props.onGetPlpData(payload);
    } else if (this.props.location.pathname.includes("/product/search")) {
      let query = this.props.location.search.split("query=")[1];
      const payload = {
        customerid: this.props.user_details.isUserLoggedIn
          ? this.props.user_details.customer_details.customer_id
          : "",
        storeid: this.props.globals.currentStore,
        q: query,
      };
      this.props.onSearchProduct(payload);
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      var body = document.body;
      let html = document.documentElement;
      var scroll = window.pageYOffset;
      var screen = window.screen.height;
      var curr_bottom = scroll + screen;

      var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      if (height - 1000 < curr_bottom) {
        this.callPage();
      }
    });
    window.scrollTo(0, 0);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", () => {});
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.key !== prevProps.location.key) {
      let store = this.props.globals.currentStore;
      let url = this.props.location.pathname.split("/productlisting/")[1];
      if (this.props.location.pathname.includes("/productlisting/")) {
        const payload = {
          store_id: store,
          url_key: url,
          page: 1,
          customerid: this.props.user_details.isUserLoggedIn
            ? this.props.user_details.customer_details.customer_id
            : "",
        };
        this.props.onGetPlpData(payload);
      } else if (this.props.location.pathname.includes("/product/search")) {
        let query = this.props.location.search.split("query=")[1];
        const payload = {
          customerid: this.props.user_details.isUserLoggedIn
            ? this.props.user_details.customer_details.customer_id
            : "",
          storeid: this.props.globals.currentStore,
          q: query,
        };
        this.props.onSearchProduct(payload);
      }
      window.scrollTo(0, 0);
    }
  }

  callPage = () => {
    let { page } = this.state;
    let store = this.props.globals.currentStore;
    let url = this.props.location.pathname.split("/productlisting/")[1];

    if (
      page < this.props.plpData.total_page_count &&
      !this.props.PlpNextLoader
    ) {
      const payload = {
        store_id: store,
        url_key: url,
        page: page + 1,
        customerid: this.props.user_details.isUserLoggedIn
          ? this.props.user_details.customer_details.customer_id
          : "",
      };

      this.props.onGetPlpData(payload);

      this.setState({ page: page + 1 });
    }
  };

  render() {
    if (this.props.loader || this.props.searchLoader) {
      return <Spinner2 />;
    }
    const { plpData } = this.props;
    if (
      this.props.plpSearch &&
      this.props.searchLoader === false &&
      this.props.plpSearch.searchWord &&
      Object.values(this.props.product).length < 1
    ) {
      return (
        <div className="mainplp">
          {/* <LogoSlider /> */}
          <div className="mt-4">
            <SearchNotFound searchKeyword={this.props.plpSearch.searchWord} />
          </div>
        </div>
      );
    }
    if (this.props.PlpMessage) {
      return (
        <div className="mainplp">
          {/* <LogoSlider /> */}
          <Breadcrumb breadcrumbData={plpData.breadcrumb} />
          <div className="pplPage">{this.props.PlpCategory.toUpperCase()}</div>
          <div className="container">
            <p className="CommingSoon">
              <span>{this.props.PlpMessage}</span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        {createMetaTags(
          this.props.plpData.meta_title,
          this.props.plpData.meta_description,
          this.props.plpData.meta_keywords
        )}
        <div className="mainplp">
          {/* <LogoSlider /> */}
          <Breadcrumb
            breadcrumbData={plpData.breadcrumb}
            isThemes={
              this.props.plpData &&
              this.props.plpData.category_path &&
              this.props.plpData.category_path.includes("themes/")
            }
          />
          <ProductList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    globals: state.global,
    plpData: state.plp.PlpData,
    loader: state.plp.PlpLoader,
    PlpNextLoader: state.plp.PlpNextLoader,
    PlpMessage: state.plp.PlpMessage,
    PlpCategory: state.plp.category_name,
    user_details: state.login,
    searchLoader: state.plp.searchLoader,
    plpSearch: state.plp,
    product: state.plp.product,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onGetPlpData: (payload) => dispatch(actions.getPlpData(payload)),
    onSearchProduct: (payload) => dispatch(actions.getSearchData(payload)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(mainplp));
