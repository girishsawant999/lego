import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import acF1 from '../../assets/images/accF1.jpeg';
import accF1 from '../../assets/images/homeBanner1.jpeg';

import preOrder1 from '../../assets/images/preOrder1.jpeg';
import preOrder2 from '../../assets/images/preOrder2.jpeg';
import ButtonrightArrow from '../../assets/images/icons/rightArrow.png';


class AccodionFeature extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
    
        return (
            <div>
                
                <div className="accFeature">                   
            <div className="PreOrder">
                <div className=""> 
                <div className="topImage">
                <img className="t-img" src={accF1} alt="accF1" />
                    </div>                 
                <p className="headTitleMain">Arendelle Castle Village</p>  
                    <div className="trendImages">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4">
                            <a href="" className="LinkTo">
                           <div className="images">
                           <img src={preOrder1} alt="logoSlider2" />
                           <p className="imagesTitle">Epic new sets from the Marvel Universe</p>
                           <p className="imagesText">Help your young superheroes save the world with all-new LEGO® Marvel sets.</p>
                           
                           </div>
                           </a>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4">
                        <a href="" className="LinkTo">
                        <div className="images">
                           <img src={preOrder2} alt="logoSlider2" />
                           <p className="imagesTitle">Ciao Bella!</p>
                           <p className="imagesText">Embrace the iconic moments with the exclusive new LEGO® Fiat 500.</p>
                           
                           </div>
                           </a>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4">
                        <a href="" className="LinkTo">
                        <div className="images">
                           <img src={preOrder2} alt="logoSlider2" />
                           <p className="imagesTitle">Ciao Bella!</p>
                           <p className="imagesText">Embrace the iconic moments with the exclusive new LEGO® Fiat 500.</p>
                           
                           </div>
                           </a>
                        </div>
                     
                     </div>
                  </div>
                  <div className="topImage">
                <img className="t-img" src={acF1} alt="accF1" />
                    </div>
                
                </div>
  
            </div>
  
            </div>


            </div>
        )
    }
}


export default (AccodionFeature);