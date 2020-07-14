import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import PlusIcon from '../../assets/images/icons/arrowDown.png';
import minusIcon from '../../assets/images/icons/arrowDown.png';
import Collapsible from 'react-collapsible';
import mapViewr from '../../assets/images/icons/mapView.png';


class storeListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: null
        }
    }

    newHandleClick = (item, index) => {
        this.setState({ activeIndex: index });
        this.props.getSelectedStore(item)
    }

    closeOther1 = (value) => {
        let collapses = document.getElementsByClassName('open');
        for (let i = 0 ; i < collapses.length ; i++) {
                 collapses[i].click();
        }
  }

    __renderLocations = (item, index) => {
        let bgcolor = null;

        if (this.state.activeIndex === index) {
            bgcolor = 'ebebeb';
        }


        return (
            <div className="card"
                 id={"loc" + item.id}
                 key={item.id}
                 style={{ 'background': bgcolor }}>

                    <div className="card-block block-1"  onClick={(el) => { this.newHandleClick(item, index) }}>
                        <div className="location-title">{item.name}</div>
                        <p className="card-text">{item.address}</p>
                    </div>
                    {/* <div className="container">
                                    <div className="row">
                                        <span className="iwt">
                                            Get Direction 
                                            <span className="pull-right"><img src={mapViewr} className="icon-size" alt="mapView" /></span>
                                        </span>
                                    </div>
                                </div>                                                                  */}
                                <div className="store_map">
                                    <Collapsible trigger={
                                            <div onClick={() =>
                                                this.closeOther1(0)} className="Collapsible_text_container">
                                                <div className="Collapsible_text footerHeading">
                                                    <FormattedMessage id="storeMain.OpeningHours" defaultMessage="Opening Hours "/>
                                                </div>
                                                <div className="Collapsible_arrow_container">
                                                     <img className="Icon" src={PlusIcon} alt=""/>
                                                </div>
                                            </div>
                                        } 
                                        triggerWhenOpen={
                                            <div className="Collapsible_text_container open">
                                                <div className="Collapsible_text footerHeading">
                                                    <FormattedMessage id="storeMain.OpeningHours" defaultMessage="Opening Hours "/>
                                                </div>
                                                <div className="Collapsible_arrow_container">
                                                    <img src={minusIcon} alt="" className="Icon" />
                                                </div>
                                            </div>
                                        }>
                                        <div style={{ textAlign: 'start' }}>
                                            <ul className="list-unstyled opening-hours hours-list">
                                            {
                                                Object.keys(this.props.locations[0].working_hours).map((key) => {
                                                    return (
                                                        <li>{key} 
                                                        <span className="pull-right">
                                                            { this.props.locations[0].working_hours[key]}
                                                        </span>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        </div>
                                    </Collapsible>
                                </div>
            </div>
            
        )
    }

    render() {
        const locations = this.props.locations;
        return (
            locations.map(this.__renderLocations)
        )
    }
}


export default (storeListView);