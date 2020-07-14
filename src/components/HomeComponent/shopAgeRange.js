import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import shopeAge2 from '../../assets/images/shopeAge2.png';
import shopeAge1 from '../../assets/images/shopeAge1.png';
import ButtonrightArrow from '../../assets/images/icons/rightArrow.png';


class ShopAge extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
      
        return (
            <div>
                
                <div className="ShopAgeRange">
                    <div className="container">
                    <p className="headTitle"> Shop by Age Range</p>
                  <div className="row">
                  <div className="col-md-2 width-20">
                      <div className="p_Image">
                      <img src={shopeAge1} alt="shopeAge1" />
                      <p className="years">3-5 yrs</p>
                      <a href="" className="shopNow">Shop now  <img src={ButtonrightArrow} alt="ButtonrightArrow" /></a>
                      </div>
                   </div>
                   <div className="col-md-2 width-20">
                   <div className="p_Image">
                      <img src={shopeAge2} alt="shopeAge1" />
                      <p className="years">3-5 yrs</p>
                      <a href="" className="shopNow">Shop now  <img src={ButtonrightArrow} alt="ButtonrightArrow" /></a>
                      </div>
                   </div>
                   <div className="col-md-2 width-20">
                   <div className="p_Image">
                      <img src={shopeAge2} alt="shopeAge1" />
                      <p className="years">3-5 yrs</p>
                      <a href="" className="shopNow">Shop now  <img src={ButtonrightArrow} alt="ButtonrightArrow" /></a>
                      </div>
                   </div>
                   <div className="col-md-2 width-20">
                   <div className="p_Image">
                      <img src={shopeAge2} alt="shopeAge1" />
                      <p className="years">3-5 yrs</p>
                      <a href="" className="shopNow">Shop now  <img src={ButtonrightArrow} alt="ButtonrightArrow" /></a>
                      </div>
                   </div>
                   <div className="col-md-2 width-20">
                   <div className="p_Image">
                      <img src={shopeAge2} alt="shopeAge1" />
                      <p className="years">3-5 yrs</p>
                      <a href="" className="shopNow">Shop now  <img src={ButtonrightArrow} alt="ButtonrightArrow" /></a>
                      </div>
                   </div>
                  
                  </div>
                  </div>
                
                </div>
  
            </div>
        )
    }
}


export default (ShopAge);