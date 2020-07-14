import React, { Component } from 'react';
import Storefilter from '../storeLocator/storeFilter.js';
import StoreListView from '../storeLocator/storeListView.js';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import * as actions from ".././../redux/actions/index";
import ProductView from './productView';
import Filter from './filters';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import minusIcon from '../../assets/images/icons/arrowDown.png';
import circleTop from "../../assets/images/icons/circleTop.png"
import StickyFilter from '../Plp/stickyFilter';
import Spinner2 from "../../components/Spinner/Spinner2"

var _ = require('lodash');

var products = [];
// let allProduct = '';
let availableFilterArr = [];
let filterCopy = {};
let allProdFilterArr = [];
class Productlisting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageOnHover: null,
            showOverSlider: false,
            index: 0,
            currentProduct: '',
            mainFilter: [],
            priceFilter: [],
            priceMax: [],
            priceMin: [],
            sort: '',
            loading: false,
            products: [],
            filterCopy: {},
            load: false,
            selectedSort: '1', 
            totalProducts: 0,
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    componentDidMount() {
        if (this.state.products.length === 0 && products.length > 0) {
            let total = products.length
            this.setState({
                products,
                totalProducts: total
            });
        }

        this.getAvailableFilters([]);

        $(function () {
            var _top1 = $(window).scrollTop();
            $(window).scroll(function () {
                var scroll = $(window).scrollTop();
                var _cur_top1 = $(window).scrollTop();
                if (document.getElementById('webFilter')) {
                    if (_top1 < _cur_top1 && scroll >= 515) {
                        document.getElementById("webFilter").style.transform = "translateY(0px)";
                    }
                    else if (scroll >= 525) {
                        document.getElementById("webFilter").style.transform = "translateY(110px)";
                    }
                    else {
                        document.getElementById("webFilter").style.transform = "translateY(0px)";
                    }
                    _top1 = _cur_top1;
                    var doc = document.documentElement;
                    if (document.getElementById('productsElement') && document.getElementById('productsElement').offsetHeight < $(window).scrollTop()) {
                        document.getElementById('webFilter').classList.remove("positionStickey");
                    }
                }
            });
        });
        if (document.getElementById('webFilter')) {
            if (window.pageYOffset > 515 && document.getElementById('webFilter')) {
                document.getElementById('webFilter').classList.add("positionStickey")
            } else if (window.pageYOffset < 515) {
                if (document.getElementById('webFilter') && document.getElementById('webFilter').getAttribute('class').includes("positionStickey")) {
                    document.getElementById('webFilter').classList.remove("positionStickey")
                }
            }
            window.addEventListener("scroll", () => {
                var body = document.body;
                let html = document.documentElement;
                var scroll = window.pageYOffset;
                var screen = window.screen.height;
                var curr_bottom = scroll + screen;

                var height = Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight);
                if (height -300 < curr_bottom) {
                    if (document.getElementById('webFilter') && document.getElementById('webFilter').getAttribute('class').includes("positionStickey")) {
                        document.getElementById('webFilter').classList.remove("positionStickey")
                    }
                }
                else if (window.pageYOffset > 515 && document.getElementById('webFilter')) {
                    document.getElementById('webFilter').classList.add("positionStickey")
                } else if (window.pageYOffset < 515) {
                    if (document.getElementById('webFilter') && document.getElementById('webFilter').getAttribute('class').includes("positionStickey")) {
                        document.getElementById('webFilter').classList.remove("positionStickey")
                    }
                }
            });
        }

        window.addEventListener("scroll", () => {
			const mybutton = document.getElementById("scrollToTop")
			if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
				if (mybutton) mybutton.style.display = "block"
			} else {
				if (mybutton) mybutton.style.display = "none"
			}
		})
    }
    next() {
        this.slider.slickNext();
    }
    previous() {
        this.slider.slickPrev();
    }
    showSliderImage = (product) => {
        this.setState({ currentProduct: product.json.sku, showOverSlider: true })
    }

    _onMouserLeave = () => {
        this.setState({ currentProduct: '', showOverSlider: false, imageOnHover: null })
    }
    _onMouserHoverImage = (value) => {
        this.setState({ imageOnHover: value })
    }
    closeOtherSide = (value) => {
        let collapses = document.getElementsByClassName('open');
        for (let i = 0; i < collapses.length; i++) {
            collapses[i].click();
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({productsList : nextProps.product})
        if (this.state.products.length === 0 && products.length > 0) {
            this.setState({
                products
            });

            this.filterProducts('');
        }
    }

    getAvailableFilters = (ALlMainFilter) => {
        let currentFilter = ALlMainFilter[ALlMainFilter.length-1];
        let category = '';
        let subCat = '';
        if (currentFilter) {
            let splitedArr = currentFilter.split('/');
            category = splitedArr[0];
            subCat = splitedArr[1];
        }
        availableFilterArr = [];
        filterCopy = {};
        _.forEach(products, prod => {
            _.forEach(prod.json.filtersdata, (value, key) => {
                _.forEach(value, (value1, key1) => {
                    if (key !== 'ratingfilters') {
                        availableFilterArr.push(key + '/' + value1);
                    }
                });
            });

            if (this.props.plpData.filters && (this.props.plpData.filters.Price || this.props.plpData.filters['السعر'])) {
                let priceFil = this.props.plpData.filters.Price ? this.props.plpData.filters.Price : this.props.plpData.filters['السعر'];
                _.forEach(priceFil, priceFilter => {
                    let splitedArr = priceFilter.name.split('-');
                    let first = splitedArr[0];
                    let second = parseInt(splitedArr[1]);
                    if (first.includes('above')) {
                        let least = first.split('and')[0];
                        if(prod.price >= parseInt(least)){
                            availableFilterArr.push(priceFilter.code + '/' + priceFilter.name);
                        }
                    }
                    if(prod.price <= second && prod.price >= parseInt(first)) {
                        availableFilterArr.push(priceFilter.code + '/' + priceFilter.name);
                    }
                })
            }

            if (this.props.plpData.filters && (this.props.plpData.filters.rating || this.props.plpData.filters['التقييم'])) {
                let ratingFil = this.props.plpData.filters.rating || this.props.plpData.filters['التقييم'];
                _.forEach(ratingFil, ratingFilter => {
                    let splitedArr = ratingFilter.name.split('-');
                    let first = splitedArr[0];
                    let second = parseInt(splitedArr[1]);
                    
                    if(prod.json.filtersdata && prod.json.filtersdata.ratingfilters &&
                        parseInt(prod.json.filtersdata.ratingfilters.ratingfilters) <= second && 
                        parseInt(prod.json.filtersdata.ratingfilters.ratingfilters) > parseInt(first)) {
                        availableFilterArr.push(ratingFilter.code + '/' + ratingFilter.name);
                    }
                })
            }

            // if (this.props.plpData.filters && this.props.plpData.filters.availability) {
            //     _.forEach(this.props.plpData.filters.availability, availabilityFilter => {
            //         availableFilterArr.push(availabilityFilter.code + '/' + availabilityFilter.name);
            //     });
            // }
        });

        availableFilterArr = Array.from(new Set(availableFilterArr).values());
        _.forEach(availableFilterArr, filterCatSubCat => {
            _.forEach(this.props.plpData.filters, (filter, key) => {
                _.forEach(filter, specificCat => {
                    let isFind = false;
                    if (category === specificCat.code) {
                        isFind = _.find(allProdFilterArr, fil => {
                            return fil === specificCat.code + '/' + specificCat.name;
                        });
                    }
                    if (filterCatSubCat === specificCat.code + '/' + specificCat.name) {
                        if (filterCopy[key]) {
                            let isAlready = _.find(filterCopy[key], subCat => {
                                return subCat.name === specificCat.name;
                            });
                            if (!isAlready) {
                                filterCopy[key].push(specificCat);
                            }
                        } else {
                            filterCopy[key] = [];
                            filterCopy[key].push(specificCat);
                        }
                    }
                });
            });
        });

        if (allProdFilterArr.length === 0) {
            allProdFilterArr = availableFilterArr;
        }

        _.forEach(filterCopy, (filter, key) => {
            let fil = filter.sort(this.compareValues('name'));
        });

        // filterCopy = Array.from(new Set(filterCopy).values());
        this.setState({
            filterCopy
        });
    }

    filterProducts = (filter)=> {
        let filterCode = filter.code;
        let dataPush = `${filter.code}/${filter.name}`;
       // products = [];
        // let allProd = [];
        // if (allProduct === "") {
        //     if (this.props.product) {
        //         allProd = Object.values(this.props.product);
        //     }
        // } else {
        //     allProd = Object.values(allProduct);
        // }
        let allProd = this.props.product && Object.values(this.props.product);
        let start = filter.start && filter.code === 'price' ? parseInt(filter.start) : 0;
        let end = filter.end && filter.code === 'price'? parseInt(filter.end) : 9999999999999;
        let { mainFilter, priceFilter , priceMax , priceMin} = this.state
        if(this.state.priceFilter.includes(filter.name)){
            var index = priceFilter.indexOf(filter.name);
            priceFilter.splice(index, 1);
            index = priceMax.indexOf(end);
            priceMax.splice(index, 1);
            index = priceMin.indexOf(start);
            priceMin.splice(index, 1);
        }
        else{
            priceFilter.push(filter.name)
            priceMin.push(start);
            priceMax.push(end);
        }

        end = Math.max(...priceMax);
        start = Math.min (...priceMin)

        if (!mainFilter.includes(dataPush))
            mainFilter.push(dataPush)
        else {
            var index = mainFilter.indexOf(dataPush);
            mainFilter.splice(index, 1);
        }

        let ALlMainFilter = [];
        for (var filter in mainFilter) {
            let data = mainFilter[filter];
            ALlMainFilter.push(data);
        }

        let filterCategory = [];
        for (let categrayData in ALlMainFilter) {
            let splitData = ALlMainFilter[categrayData].split('/');
            filterCategory.push(splitData[0]);
        }
        filterCategory = Array.from(new Set(filterCategory).values());
        if (filterCategory.length === 0) {
            this.resetFilter();
        } else {
            _.forEach(filterCategory, category => {
                products = [];
                _.forEach(ALlMainFilter, specificFilter => {
                for (var Prod in allProd) {
                    let filter = allProd[Prod].json && allProd[Prod].json.filtersdata;
                    let allFilters = []
                    _.forEach(filter, filterData => {
                        allFilters = allFilters.concat(Object.values(filterData))
                    })
                    let alreadyPushed = false;
        
                        let filterName = specificFilter.split('/')[1];
                        let filterCodeInAll = specificFilter.split('/')[0];
                        if (allFilters.includes(filterName) && filterCodeInAll !== 'price' &&
                        filterCodeInAll !== 'ratingfilters' && category === filterCodeInAll) {
                            products.push(allProd[Prod]);
                            // alreadyPushed = true;
                        } else if ((filterCodeInAll === 'price' || filterCodeInAll === 'السعر') &&
                         category === filterCodeInAll) {
                            let splitedArr = filterName.split('-');
                            let first = splitedArr[0];
                            let second = parseInt(splitedArr[1]);
                            if (first.includes('above')) {
                                let least = first.split('and')[0];
                                if(allProd[Prod].price >= parseInt(least)){
                                    products.push(allProd[Prod]);
                                }
                            }
                            if(allProd[Prod].price <= second && allProd[Prod].price >= parseInt(first)) {
                                products.push(allProd[Prod]);
                            }
                        } else if (filterCodeInAll === 'ratingfilters' && category === filterCodeInAll) {
                            let splitedArr = filterName.split('-');
                            let first = splitedArr[0];
                            let second = parseInt(splitedArr[1]);
                            if(allProd[Prod].json.filtersdata.ratingfilters &&
                                allProd[Prod].json.filtersdata.ratingfilters.ratingfilters &&
                                parseInt(allProd[Prod].json.filtersdata.ratingfilters.ratingfilters) <= second &&
                                parseInt(allProd[Prod].json.filtersdata.ratingfilters.ratingfilters) > parseInt(first)) {
                                products.push(allProd[Prod]);
                            }
                        } 
                        // else if (filterCodeInAll === 'availability' && category === filterCodeInAll) {
                        //     if (filterName === 'Available Now' &&
                        //     allProd[Prod].json.filtersdata.availability &&
                        //     allProd[Prod].json.filtersdata.availability.availability) {
                        //         products.push(allProd[Prod]);
                        //     } else if (filterName === 'Notify Me' && 
                        //     allProd[Prod].json.filtersdata.availability &&
                        //     !allProd[Prod].json.filtersdata.availability.availability) {
                        //         products.push(allProd[Prod]);
                        //     }
                        // }

                    // if (this.compareArr(allFilters, ALlMainFilter) && filterCode !== 'price') {
                        
                    // }
                    // if(filterCode === 'price' && !alreadyPushed && allProd[Prod].price < end && allProd[Prod].price > start ){
                    //     products.push(allProd[Prod]);
                    // }
                }
            }); 
    
            allProd = Object.values(products);
            });
    
            allProd = Array.from(new Set(allProd).values());
            products = Array.from(new Set(products).values());

            // allProduct = products;
            this.setState({ mainFilter, products });
            this.getAvailableFilters(ALlMainFilter);
        }

        this.onSort(this.state.selectedSort, true);
    }

    resetFilter = () => {
        products = Object.values(this.props.product)
        this.setState({
            mainFilter:[],
            products
        });

        this.getAvailableFilters([]);
        this.onSort(this.state.selectedSort, true);
    }

    compareArr = (arr1, arr2) => {
        return arr1.some(item =>arr2.includes(item));
    }

    beforeChange = (prev, next) => {
        this.setState({ index: next });
    };

    onSort = (attribute, callFromFilter = false) => {
        let sort = 1;
        if (callFromFilter) {
            sort = attribute;
        } else {
            sort = attribute.currentTarget.value
            
        }
            // this.setState({
            //     load: true
            // })
        if(sort === "1"){
            products.sort(this.compareValues('sequence_id'))
        }
        if(sort === "2"){
            products.sort(this.compareValues('price','desc'))
        }
        if(sort === "3"){
            products.sort(this.compareValues('price'))
        }
        if(sort === "4"){
            products.sort(this.compareValues('ratingValue','desc'))
        }

        this.setState({
            products
        });

        // setTimeout(() => {
        //     this.setState({
        //         load: false
        //     })
        //  }, 3000);


        // this.setState({ loading: true })
        // setTimeout(() => {
        //     this.setState({ loading: false })
        //  }, 1500);
        // this.forceUpdate();
    }

	compareValues = (key, order = "asc") => {
		return function innerSort(a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// property doesn't exist on either object
				return 0
			}

			const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key]
			const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key]

			let comparison = 0
			if (varA > varB) {
				comparison = 1
			} else if (varA < varB) {
				comparison = -1
			}
			return order === "desc" ? comparison * -1 : comparison
		}
	}

	scrollToTop = () => {
		this.setState({ showScrollToTop: false })
		window.scrollTo(0, 0)
    }
    
    setProducts = () => {
        this.setState({
            products
        })
    }

    render() {
        if (this.props.loader || this.props.searchLoader || this.state.load) {
            return <Spinner2 />
        }
        const index = this.state.index;
        const settings3 = {
            autoplay: false,
            beforeChange: this.beforeChange,
            autoplaySpeed: 5000,
            dots: false,
            arrows: false,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            speed: 500,
            vertical: false,

        }
        if (this.state.mainFilter.length < 1 && this.state.priceFilter.length < 1) {
            products = this.props.product && Object.values(this.props.product);
        }

        if (this.state.products.length === 0 && products.length > 0) {
            this.setProducts();
        }

        let totalCount = products.length;
        let filters = this.props.plpData && this.props.plpData.filters;
        let filterTitle = filters && Object.keys(filters);
        const { globals } = this.props
        const { plpData } = this.props
        
        let showRating  = false
        if (products && products.length > 0 ) {
            showRating = products.filter(product => product.json.ratingValue > 0).length > 0 
        }

        return (
            <div>
                {plpData.category_name ? (
					<div
						className="pplPage"
						style={{
							backgroundImage: `url(${plpData.category_banner})`,
							backgroundSize: "cover",
						}}>
                        {plpData.category_img && <img className="category-img" src={plpData.category_img} alt="category"/>}
						{plpData.category_name}
					</div>
				) : (
					this.props.plpSearch.searchWord &&
					this.props.product && <div className="pplPage"><FormattedMessage id ="plp.ShowingResultsFor" defaultMessage="Showing results for "/> {this.props.plpSearch.searchWord}</div>
				)}
                <section className="search-banner py-3" id="search-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <p className="text-center pt-2 top-des"> {ReactHtmlParser(plpData.category_desc)}</p>
                            </div>
                            <div className="col-md-12">
                                <div className="table-filter d-none d-sm-block">
                                    <div className="row">
                                        <div className="col-sm-3 d-none d-sm-block">
                                            <div className="show-entries">
                                                <span>{totalCount > 0 ? totalCount : this.state.totalProducts }{" "}<FormattedMessage id ="plp.Result"/></span>

                                            </div>
                                        </div>
                                        <div className="col-sm-9">
                                            <div className="filter-group d-none d-md-block d-lg-block d-xl-block">
                            <div className="select-side">
                                <i className="glyphicon blue"> <img src={minusIcon} alt="" className="Icon selectSortImg" /></i>
                            </div>
							<select className="form-control filter-focus" onChange={(e) => this.onSort(e, this.setState({selectedSort: e.target.value}))}>
								<option value = "1" selected = {this.state.selectedSort === "1"} >{globals.store_locale === 'en' ? 'Sort By Featured' : 'فرز حسب المميز'}</option>
								<option value = "2" selected = {this.state.selectedSort === "2"} >{globals.store_locale === 'en' ? 'Price: High to Low' : 'السعر الاعلى الى الادنى'}</option>
								<option value = "3" selected = {this.state.selectedSort === "3"} >{globals.store_locale === 'en' ? 'Price: Low to High' : 'السعر من الارخص للاعلى'}</option>
								{showRating===true && <option value = "4" selected = {this.state.selectedSort === "4"} >{globals.store_locale === 'en' ? 'Rating' : 'تقييم'}</option>}
							</select>
                            
						</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-md-12">
                                <div className="serch-page-title">1 - 2 Yeras</div>
                                <hr/>
                            </div> */}
                        </div>


                        <div className="content pt-3" id="nearView">
                            <div className="">
                                <div className="row">
                                    <div className="col-md-3">
                                        <Filter resetFilter={this.resetFilter} filterCopy={this.state.filterCopy} filterProducts={this.filterProducts}/>
                                    </div>
                                    <div className="col-md-9 plpPaddingMobile">
                                        <StickyFilter resetFilter={this.resetFilter} filterCopy={this.state.filterCopy} filterProducts={this.filterProducts} count={products.length} onSort={this.onSort} />

                                    {/*
                                        {Object.values(this.props.product).length > 1 && products.length < 1 ?
                                            <div className='no-product-message CommingSoon'><FormattedMessage id="plp.NewProductComingSoon" /></div> :
                                            <ProductView mainFilter={this.state.mainFilter} showProducts={this.state.products} loading = {this.state.loading}/>}
                                    */}
                                        {Object.values(this.props.product).length > 0 && 
                                            <ProductView mainFilter={this.state.mainFilter} showProducts={this.state.products} loading = {this.state.loading}
                                            showRating={showRating}/>}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
					<img id="scrollToTop" src={circleTop} alt="" onClick={this.scrollToTop} className="circleTop" />
                </section>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        globals: state.global,
        plpData: state.plp.PlpData,
        loader: state.plp.PlpLoader,
        product: state.plp.product,
        wishListResult: state.wishList.wishResult,
        plpSearch: state.plp,
        searchLoader: state.plp.searchLoader

    };
}
const mapDispatchToProps = dispatch => {
    return {
        onGetPlpData: (payload) => dispatch(actions.getPlpData(payload)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Productlisting));