import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Collapsible from 'react-collapsible';
import AccodionFeature from "../pdp/AccodionFeature";
import AccodionReview from "../pdp/AccodionReview";


import accFeature from '../../assets/images/accFeature.jpeg';

import { Link} from 'react-router-dom';
class Pdpaccordian extends Component {
constructor(props) {
super(props);
}
pdpAcc = (value) => {
   let collapses = document.getElementsByClassName('open');
   for (let i = 0 ; i < collapses.length ; i++) {
      collapses[i].click();
   }
}
render() {
   const { product, avgReview, reviews, store_locale } = this.props;
   let productData = {};
   let additional_attributes = {};
   let short_feature = [];
   if (product.product) {
      productData = product.product[0]
      additional_attributes = product.product[0].additional_attributes ? product.product[0].additional_attributes[0] : {};
      short_feature = additional_attributes.short_feature ? store_locale ===  'en' ? additional_attributes.short_feature.split(';;') : additional_attributes.short_feature.split('؛؛') : [];
      short_feature = short_feature.filter(ele =>  ele !== "");
   }
return (
<div>
   <div className="PdpAccordian">
      <div className="">
         <Collapsible trigger={
         <div onClick={() =>
            this.pdpAcc(0)} className="Collapsible_text_container">
            <div className="Collapsible_text HeadTitle">
               <div className="container">
                  <h4>
                  <FormattedMessage id='pdp.Specifications' defaultMessage='Specifications' /></h4>
               </div>
            </div>
            <div className="Collapsible_arrow_container imgTitle">
               <div className="container posRel">
                  <div className="iconOuter">
                     <div className="plusIcon"></div>
                  </div>
                  {/* <img className="Icon" src={PlusBtn} alt=""/> */}
               </div>
            </div>
         </div>
         } 
         triggerWhenOpen={
         <div className="Collapsible_text_container open">
            <div className="Collapsible_text HeadTitle">
               <div className="container">
                  <h4>
                  <FormattedMessage id='pdp.Specifications' defaultMessage='Specifications' />
                  </h4>
               </div>
            </div>
            <div className="Collapsible_arrow_container imgTitle">
               <div className="container posRel">
                  <div className="iconOuter">
                     <div className="plusIcon"></div>
                  </div>
                  {/* <img src={minusBtn} alt="" className="Icon" /> */}
               </div>
            </div>
         </div>
         }>
         <div className="container">
           <div className="SpeciContent">
               <div className="row">
               <div className="col-md-8">
                   <div className="featureInfo">
                     <p className="textinfo">{productData.description}</p>
                    {short_feature.length > 0 && <ul className="listInfo">
                        {short_feature.map(data => {
                           return (
                           <li>{data}</li>
                        )})}
                     </ul>}
                     <a target="_blank" href={`https://www.lego.com/en-us/service/buildinginstructions/search?initialsearch=42099#?text=42099`}>
                        <button className="BuildingBtn">
                           <FormattedMessage id='pdp.building' defaultMessage='Building Instructions' />
                        </button>
                     </a>
                   </div>
                </div>
                <div className="col-md-4">
                   <div className="featureImage">
                   {productData.imageUrl && <img src={productData.imageUrl.thumbnail[1]} alt="" className="Icon" />}
                   </div>
               </div>
               </div>
           </div>
      </div>
      </Collapsible>
      <Collapsible trigger={
      <div onClick={() =>
         this.pdpAcc(0)} className="Collapsible_text_container">
         <div className="Collapsible_text HeadTitle">
            <div className="container">
               <h4>
               <FormattedMessage id='pdp.DeliveryAndReturn' defaultMessage='Deliveries and Returns' />
               </h4>
            </div>
         </div>
         <div className="Collapsible_arrow_container imgTitle">
            <div className="container posRel">
               <div className="iconOuter">
                  <div className="plusIcon"></div>
               </div>
            </div>
         </div>
      </div>
      } 
      triggerWhenOpen={
      <div className="Collapsible_text_container open">
         <div className="Collapsible_text HeadTitle">
            <div className="container">
               <h4><FormattedMessage id='pdp.DeliveryAndReturn' defaultMessage='Deliveries and Returns' /></h4>
            </div>
         </div>
         <div className="Collapsible_arrow_container imgTitle">
            <div className="container posRel">
               <div className="iconOuter">
                  <div className="plusIcon"></div>
               </div>
            </div>
         </div>
      </div>
      }>
      <div>
          <div className="container">
          <div className="returnInfo">
            <ul className="listInfo">
               <li><FormattedMessage id='pdp.DeliveryAndReturnLine1' defaultMessage='Deliveries and Returns' />
               </li>
               <li><FormattedMessage id='pdp.DeliveryAndReturnLine2' defaultMessage='Deliveries and Returns' /></li>
               <li><FormattedMessage id='pdp.DeliveryAndReturnLine3' defaultMessage='Deliveries and Returns' /></li>
               <li><FormattedMessage id='pdp.DeliveryAndReturnLine4' defaultMessage='Deliveries and Returns' /></li>
            </ul>
            <p className="retunText">
            <FormattedMessage id='pdp.DeliveryAndReturnLine5' defaultMessage='Deliveries and Returns' />
            <Link to={`/${this.props.store_locale}/delivery-information`}>
            <FormattedMessage id='pdp.DeliveryAndReturn' defaultMessage='Deliveries and Returns' />
            </Link><FormattedMessage id='pdp.DeliveryAndReturnLine6' defaultMessage='Deliveries and Returns' /></p>
         </div>
      </div>
   </div>
   </Collapsible>
   <Collapsible trigger={
      <div id="AccodionReview" onClick={() =>
         this.pdpAcc(0)} className="Collapsible_text_container">
         <div className="Collapsible_text HeadTitle">
            <div className="container" >
            <h4><FormattedMessage id='pdp.CustomerReview' defaultMessage='Customer Reviews' /></h4>
            </div>
         </div>
         <div className="Collapsible_arrow_container imgTitle">
            <div className="container posRel">
               <div className="iconOuter">
                  <div className="plusIcon"></div>
               </div>
            </div>
         </div>
      </div>
      } 
      triggerWhenOpen={
      <div className="Collapsible_text_container open">
         <div className="Collapsible_text HeadTitle">
            <div className="container">
               <h4><FormattedMessage id='pdp.CustomerReview' defaultMessage='Customer Reviews' /></h4>
            </div>
         </div>
         <div className="Collapsible_arrow_container imgTitle">
            <div className="container posRel">
               <div className="iconOuter">
                  <div className="plusIcon"></div>
               </div>
            </div>
         </div>
      </div>
      }>
      <div>
          <div className="container">
              <AccodionReview avgReview={avgReview}
              reviews={reviews}
              store_locale={store_locale}
              isUserLoggedIn={this.props.isUserLoggedIn} />
          </div>
    
   </div>
   </Collapsible>
  
</div>
</div>
</div>
)
}
}
export default (Pdpaccordian);