import React, { Component } from 'react';
import 'react-web-tabs/dist/react-web-tabs.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Link } from 'react-router-dom';
import learnMoreRight from '../../assets/images/icons/learnMore.png';

class shopByTabs extends Component {
    constructor(props) {
        super(props);
    }

    closeMenu = (e) => {
        var x = document.getElementsByClassName("tabShopMenu");
        x.style.display = "none";
    }

    render() {
        const { options, store_locale } = this.props;
        const imgStyle = {
            height: "230px"
        }
        const insideStyle = {
            height: "270px"
        }
        return (
            <div>
                <div className="shopByTabs">
                {options && options[0] && options[0].info   && <Tabs defaultTab={"tab-0"} vertical>
                    <TabList>
                        {options && options.map((tab, index) => {
                            return (
                                <>
                                    {tab.info && tab.info.children && <Tab tabFor={`tab-${index}`}>{tab.info.name}</Tab>}
                                    {tab.info && !tab.info.children && < Link className="tabLink" to={`/${store_locale}/productlisting/${tab.info.url_path}`}>{tab.info.name}</ Link>}
                                </>
                            )})}
                    </TabList>
                    {options && options.map((tab, index) => {
                            return (
                                <>
                                {tab.info && tab.info.children && tab.info.children.length > 0 &&
                                <TabPanel tabId={`tab-${index}`}>
                            <div className="row">
                                        <div className="col-md-9 tabShopMenu">
                                            {tab.info.children.map((child,index) => {
                                            return (
                                            <div className="custColumn">
                                                <div className="Inside" style={tab.info.different_size === 1 ? insideStyle :{}}>
                                                    < Link id={`link-${index}`} to={(Object.values(tab.info).length < 5)? 
                                                    `/${store_locale}/productdetails/${child.url_key}` : 
                                                    `/${store_locale}/productlisting/${child.url_path}`}
                                                    >                                       
                                                    <div className="newTab">
                                                        
                                                    <img style={tab.info.different_size === 1 ? imgStyle :{}}
                                                    src={child.image ? child.image : child.imageUrl}
                                                    className="image" alt="category"/> 
                                                    <p>{child.name}</p>
                                                    </div>
                                                    </ Link>
                                                </div>
                                            </div>
                                            )})}
                                        </div>
                                        {tab.info.see_all && <div className="col-md-3 colBorLeft">
                                            <div className="MoreThemes">
                                                <div className="circleDiv">
                                                    < Link to={`/${store_locale}/productlisting/${tab.info.see_all}`} className="circle"> <img className="arrow" src={learnMoreRight} alt="learnMoreRight" /></ Link>
                                                    <p className="titleMore">See all {tab.info.name}</p>
                                                </div>
                                            </div>
                                        </div>}
                                        </div>
                                </TabPanel>
                                }
                                </>
                            )})}
                </Tabs>}
                </div>
            </div>
        )
    }
}


export default (shopByTabs);