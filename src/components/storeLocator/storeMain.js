import React, { Component } from 'react';
import Storefilter from '../storeLocator/storeFilter.js';
import StoreListView from '../storeLocator/storeListView.js';
import { FormattedMessage, injectIntl,defineMessages,intlShape } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import { withRouter } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import 'bootstrap/dist/css/bootstrap.css';
import nearMe from '../../assets/images/icons/nearMe.png';
import listView from '../../assets/images/icons/listView.png';
import mapViewr from '../../assets/images/icons/mapView.png';
import rightArrow1 from '../../assets/images/icons/rightArrow1.png';
import PlusIcon from '../../assets/images/icons/arrowDown.png';
import minusIcon from '../../assets/images/icons/arrowDown.png';
import leftArrow from '../../assets/images/icons/leftArrow.png';
import location from '../../assets/images/map.png';
import MapContainer from "./map";
import StoreList from './storeListView';
import Breadcrumb from '../../common/breadcrumb';
import Spinner2 from "../../components/Spinner/Spinner"


const messages = defineMessages({
  searchBox: {
      id: 'storeMain.searchBox',
      defaultMessage: 'E.g. Jeddah',
  }
});
const google = window.google;
let selectedMarker = {};
let overId = null;
let sortedStores = [];
let leftStores = [];
let rightStores = [];
class StoreMain extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.country_codes = {
      uae: 'AE',
      saudi: 'SA',
      kuwait: 'KW',
      bahrain: 'BH',
      qatar: 'QA',
      oman: 'OM',
      morocco: 'MA',
    }

    this.state = {
      selectedLoc: {},
      lat: null,
      long: null,
      zoom: 3,
      isDisplay: false,
      activeMarker: {},
      showingInfoWindow: false,
      selectedPlace: {},
      showError: false,
      selectedMarker: {},
      selectedCountry: this.country_codes[this.props.location.pathname.split('/')[2].split('-')[2]],
      selectedCity: '',
      storeList: this.props.storeList,
      userLat: null,
      userLang: null
    }
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          userLat: position.coords.latitude,
          userLang: position.coords.longitude,
        }, () => {
          //this.sortStoresOnDistance(this.props.storeList);
        })
      }, (error) => {
        //this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }
  
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this)
  }

  closeOther1 = (value) => {
    let collapses = document.getElementsByClassName('open');
    for (let i = 0; i < collapses.length; i++) {
      collapses[i].click();
    }
  }


  calcDistance = (p1, p2) => {
    var loc1 = new google.maps.LatLng(p1.lat, p1.lng);
    var loc2 = new google.maps.LatLng(p2.lat, p2.lng);
    var d = (google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2) / 1000).toFixed(2);
    return d;
  }

  sortStores = (a, b) => {
    const genreA = a.distFromUserLocation;
    const genreB = b.distFromUserLocation;
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  sortStoresOnDistance = stores => {
    const userLat = this.state.userLat;
    const userLang = this.state.userLang;
    const userLocation = {
      lat: userLat,
      lng: userLang
    }
    if ((userLat !== null) && (userLang !== null)) {
      let newStoreList = stores.map((store, index) => {
        const storeLocation = {
          lat: store.lattitude,
          lng: store.longitude
        }
        return {
          ...store,
          distFromUserLocation: this.calcDistance(userLocation, storeLocation)
        }

      }).filter(function (store) {
        return parseFloat(store.distFromUserLocation) <= 30;
      });
      this.setState({
        storeList : newStoreList
      });
      this.props.onSortStoreListOnDistance(newStoreList);
    } else {
     // this.props.onSortStoreListOnDistance(stores);
    }
  }

  // handlePlaceChanged = () => {
  //   const place = this.autocomplete.getPlace();
  //   console.log("-=-place-=-=",place)
  //   const latLong = {
  //     lat: place.geometry.location.lat(),
  //     long: place.geometry.location.lng(),
  //     userLat: place.geometry.location.lat(),
  //     userLang: place.geometry.location.lng(),
  //   }

  //   this.setState({
  //     ...this.state,
  //     ...latLong,
  //     zoom: 10
  //   })
  // }

  onNearMeClick = () => {
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        this.zoomToNewLocation(position.coords.latitude, position.coords.longitude);
      }, (error) => {
      })
    }
  }


  onMouseoverMarker = (props, marker, e, item) => {
    selectedMarker = item;
    if (overId !== item.id) {
      overId = item.id;
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
    }

  }


  onMarkerClick = (props, marker, e, item) => {
    this.setState({ showError: false });
    this.zoomToNewLocation(item.lattitude, item.longitude);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      isDisplay: true,
      selectedLoc: { ...item }
    });

  }
  zoomToNewLocation = (lat, long) => {
    this.setState({
      lat: lat,
      long: long,
      zoom: 17
    });
  }

  getSelectedStore = (el) => {
    this.setState({ showError: false });
    this.zoomToNewLocation(el.lattitude, el.longitude);
    this.setState({ isDisplay: true, selectedLoc: { ...el } });
  }

  componentWillReceiveProps(nextProps){
   this.setState({
      storeList : nextProps.storeList
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    const obj = this.props.storeList;
    const store_id = this.props.globals.currentStore ? this.props.globals.currentStore : 2;
    this.props.onGetStoreList({
      country_id: "",
      city: "",
      store_id: store_id
    });

    for (var i = 0; i < this.props.storeList.length; i++) {
      this.props.storeList[i].lat = parseFloat(this.props.storeList[i].lattitude);
      this.props.storeList[i].lng = parseFloat(this.props.storeList[i].longitude);
    }
    this.setState({ storeList: this.props.storeList });
    let map = ((m, a) => (a.forEach(s => {
      let a = m.get(s.name[0]) || [];
      m.set(s.name[0], (a.push(s), a));
    }), m))(new Map(), this.props.storeList);


    sortedStores = [];
    map.forEach(function (value, key) {
      let object = { key: key, data: value };
      sortedStores.push(object);
    })

    sortedStores = sortedStores.sort(this.compare_item);
    leftStores = [];
    rightStores = [];
    if(sortedStores.length){
      //console.log(parseInt(sortedStores.length/2))
      for(var i = 0; i <= parseInt(sortedStores.length/2) ; i++){
        leftStores.push(sortedStores[i]);
      }
      for(var j = parseInt(sortedStores.length/2) + 1; j < sortedStores.length ; j++){
        rightStores.push(sortedStores[j]);
      }
    }
    const searchInput = document.getElementById('autocomplete');
    this.autocomplete = new google.maps.places.Autocomplete(searchInput);
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    // GoogleMaps API custom eventlistener method
    google.maps.event.addDomListener(searchInput, 'keydown', (e) => {
      if (e.keyCode === 13 || e.keyCode === 9) {
          e.preventDefault(); 
      }
    });
  }


  handlePlaceChanged = () => {
    const place = this.autocomplete.getPlace();
    if(place.geometry){
      this.setState({
        lat: place.geometry.location.lat(),
        long:  place.geometry.location.lng(),
        zoom: 6
      });
    }
  }

  nearMe = () => {
    document.getElementById("nearView").style.display = "block";
    document.getElementById("listView").style.display = "none";
    document.getElementById("mapView").style.display = "none";
    this.sortStoresOnDistance(this.props.storeList);
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        this.zoomToNewLocation(position.coords.latitude, position.coords.longitude);
      }, (error) => {
      })
    }
    /* Temporary solution */
    // $.getJSON('https://ipinfo.io/geo?token=f46f8baeee500f', (response) => { 
    //   const loc = response.loc.split(',');
    //   this.zoomToNewLocation(loc[0],  loc[1]);
    //   });
    /* Temperory solution */

  }
  listVie = () => {
    if(this.state.storeList.length == 0){
      this.getStoreList();
    }
    document.getElementById("nearView").style.display = "none";
    document.getElementById("listView").style.display = "block";
    document.getElementById("mapView").style.display = "none";
  }

  getStoreList=()=>{
    const store_id = this.props.globals.currentStore ? this.props.globals.currentStore : 2;
    this.props.onGetStoreList({
      country_id: "",
      city: "",
      store_id: store_id
    });
  }
  mapView = () => {
    if(this.state.storeList.length == 0){
      this.getStoreList();
    }
    document.getElementById("nearView").style.display = "none";
    document.getElementById("listView").style.display = "none";
    document.getElementById("mapView").style.display = "block";
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          zoom: 4
        });
      }, (error) => {
      })
    }
  }

  showSelectedStore = (item) => {
    this.getSelectedStore(item);
    document.getElementById("listView").style.display = "none";
    document.getElementById("mapView").style.display = "block";
  }


  // getResults = () => {
  //   let searchResult = document.getElementsByClassName('pac-container')[0];
  //   console.log(searchResult);
  //   // width: 321px;
  //   // position: absolute;
  //   // left: 0;
  //   // top: 0px;
  //   // display: block;

  //   document.getElementsByClassName('pac-container')[0].style.display = 'none';
  //   let resultDiv = document.getElementById('searchResult');
  //   searchResult.style.left = 0;
  //   searchResult.style.top = 0;
  //   resultDiv.appendChild(searchResult);
  // }

  compare_item=(a, b)=>{
    // a should come before b in the sorted order
    if(a.key < b.key){
            return -1;
    // a should come after b in the sorted order
    }else if(a.key > b.key){
            return 1;
    // and and b are the same
    }else{
            return 0;
    }
}

  render() {
    const {formatMessage} = this.props.intl;
		let breadcrumbData = []

    let pdpUrl = window.location.pathname;
    pdpUrl = pdpUrl.split("/")

    let pdpage = pdpUrl[pdpUrl.length-1]
    breadcrumbData.push(pdpage)

    return (
      <div>
        <div className="storeLocatorPage">
          <Storefilter title= {<FormattedMessage id="storeMain.storeLocator" defaultMessage="Store locator"/>}  />
        </div>
        <Breadcrumb breadcrumbData={breadcrumbData} />                                     
        <section className="search-banner py-3" id="search-banner">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="serch-page-title"><FormattedMessage id="storeMain.findStores" defaultMessage="Find Stores"/></div>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="row pt-2">
                  <div className="col-md-2 pb-2">
                    <button onClick={() => this.nearMe()} type="button" className="serchbar-orange-btn w-100"> <img src={nearMe} className="icon-size" alt="NearMe" />&nbsp;&nbsp;&nbsp; <FormattedMessage id="storeMain.nearme" defaultMessage="Near me"/></button>
                  </div>
                  <div className="col-md-1 nopadding d-none d-sm-none d-md-none d-lg-none d-xl-block">
                    <p className="find-title"><FormattedMessage id="storeMain.findStoresNear" defaultMessage="Find stores near"/></p>
                  </div>
                  <div className="col-md-6">
                    <div className="search-container">
                      <form action="/action_page.php">
                        <div className="w-100">
                          {/* <input type="text" placeholder="eg. Dubai" className="w-92" name="search"/>
                                            <button type="submit"><i className="fa fa-search"></i></button> */}
                          <input type="text" ref={this.autocompleteInput}  id="autocomplete" className="w-92" placeholder={formatMessage(messages.searchBox)} autoComplete="off" />
                          <div id="searchResult" style={{ position: 'absolute' }}></div>
                          <svg className="storeLocator-searchIcon" xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="23.888" height="16px" viewBox="0 0 23.888 24.117">
                            <g fill="none" stroke="#989697" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
                              <circle cx="10.12" cy="10.12" r="8.12" />
                              <path d="M15.849 16.077l6.039 6.04" />
                            </g>
                          </svg>

                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-4 pr-0 pl-0">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                      <div className="btn-group col-md-6" role="group" aria-label="Second group">
                        <button onClick={() => this.listVie()} type="button" className="serchbar-white-btn btn-block"><img src={listView} className="icon-size" alt="listView" /><FormattedMessage id="storeMain.listView" defaultMessage=" List View"/></button>
                      </div>
                      <div className="btn-group col-md-6" role="group" aria-label="Third group">
                        <button onClick={() => this.mapView()} type="button" className="serchbar-white-btn btn-block"><img src={mapViewr} className="icon-size" alt="mapView" /><FormattedMessage id="storeMain.mapView" defaultMessage=" Map View"/></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="content pt-3" id="nearView">
          <div className="container">
            <div className="row">
              <div className={`${this.state.storeList.length == 0 ? "col-md-3" : "col-md-3 secondClass"}`}>
                <div className="control-box sidebar">
                  <section id="what-we-do">
                    <div className="row">
                      {
                       this.props.storeLoader && this.state.storeList.length === 0 &&
                        <div className="col-12 text-center">
                          <Spinner2/>
                        </div>
      
                      }
                      {this.state.storeList.length > 0 &&
                        <StoreList locations={this.state.storeList}
                          getSelectedStore={this.getSelectedStore} directionText="DIRECTIONS" />

                      }
                       {!this.props.storeLoader && this.state.storeList.length === 0 &&
                       <span className="noStores"><FormattedMessage id="storeMain.noStores" defaultMessage="No stores available"/></span>
                      }
                    </div>
                  </section>
                </div>
              </div>
              <div className="col-md-9 mainClass pb-5">
                <div className="mapGrid">
                <div className="google-map">

                  {/*<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.652931849224!2d55.7665570143073!3d24.253914775272815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8ab404d39995e7%3A0xa8fbc926bfa012d5!2sAl%20Buraimi%20Oman!5e0!3m2!1sen!2sin!4v1585890988155!5m2!1sen!2sin" width="100%" height="600" frameborder="0"  allowfullscreen="" aria-hidden="false" tabindex="0"></iframe> */}

                  {this.state.lat && this.state.long && (
                    <MapContainer
                      onMouseoverMarker={this.onMouseoverMarker}
                      onMarkerClick={this.onMarkerClick}
                      markars={this.state.storeList}
                      lat={this.state.lat}
                      long={this.state.long}
                      zoom={this.state.zoom}
                      activeMarker={this.state.activeMarker}
                      selectedPlace={this.state.selectedPlace}
                      selectedMarker={selectedMarker}
                      showingInfoWindow={this.state.showingInfoWindow}
                      language={this.props.language}
                      iconSize={new google.maps.Size(50, 50)}
                    />)}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content" id="listView" style={{display:"none"}}>
          <div className="container">
            <div className="row">
            
              <div className="col-md-12">
                <p className="search-list-sel"><FormattedMessage id="storeMain.storeDetails" defaultMessage="Select a store to see details"/></p>
              </div>
              <div className="searchListScroll">
              <div className="row">
									<div className={`col-lg-6 col-sm-6 col-md-6 col-12 ${ rightStores.length<1 ? '' : 'mycontent-left'}`}>
                  <div className="search-list-box">
                    <div className="">
                      {Object.keys(leftStores).map((key) => (
                        <div key={key} className="wrap">
                          <div className="ico-wrap">
                            <span className="mbr-iconfont fa">{leftStores[key].key}</span>
                          </div>
                          <div className="text-wrap">
                            {Object.keys(leftStores[key].data).map((index) => (
                              <p key={index} className="display-6 pt-0 pb-0 mb-1" onClick={(el) => { this.showSelectedStore(leftStores[key].data[index]) }}>{leftStores[key].data[index].name}<span className="pull-right d-sm-none d-md-none d-lg-none d-xs-block"><img src={rightArrow1} className="icon-size" alt="mapView" /></span></p>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6 col-md-6 col-12">
                  <div className="search-list-box">
                  {Object.keys(rightStores).map((key) => (
                        <div className="wrap">
                          <div className="ico-wrap">
                            <span className="mbr-iconfont fa">{rightStores[key].key}</span>
                          </div>
                          <div className="text-wrap">
                            {Object.keys(rightStores[key].data).map((index) => (
                              <p className="display-6 pt-0 pb-0 mb-1" onClick={(el) => { this.showSelectedStore(rightStores[key].data[index]) }}>{rightStores[key].data[index].name}<span className="pull-right d-sm-none d-md-none d-lg-none d-xs-block"><img src={rightArrow1} className="icon-size" alt="mapView" /></span></p>
                            ))}
                          </div>

                        </div>
                      ))}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content" id="mapView" style={{display:"none"}}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <p className="search-list-sel"><FormattedMessage id="storeMain.storeDetails" defaultMessage="Select a store to see details"/></p>
              </div>
              <div className="col-md-12 mainClass">
                <div className="google-map">

                  {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.652931849224!2d55.7665570143073!3d24.253914775272815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8ab404d39995e7%3A0xa8fbc926bfa012d5!2sAl%20Buraimi%20Oman!5e0!3m2!1sen!2sin!4v1585890988155!5m2!1sen!2sin" width="100%" height="600" frameborder="0"  allowfullscreen="" aria-hidden="false" tabindex="0"></iframe> */}
                  {this.state.lat && this.state.long && (
                    <MapContainer
                      onMouseoverMarker={this.onMouseoverMarker}
                      onMarkerClick={this.onMarkerClick}
                      markars={this.state.storeList}
                      lat={this.state.lat}
                      long={this.state.long}
                      zoom={this.state.zoom}
                      activeMarker={this.state.activeMarker}
                      selectedPlace={this.state.selectedPlace}
                      selectedMarker={selectedMarker}
                      showingInfoWindow={this.state.showingInfoWindow}
                      language={this.props.language}
                      iconSize={new google.maps.Size(50, 50)}
                    />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    language: state.global.language,
    globals: state.global,
    storeList: state.global.storeList,
    intl: intlShape.isRequired,
    storeLoader: state.global.storeLoader,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetStoreList: (payload) => dispatch(actions.getStoreList(payload)),
    onSortStoreListOnDistance: (payload) => dispatch(actions.sortStoreList(payload)),
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(StoreMain)));