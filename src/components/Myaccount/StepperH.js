import React, { Component } from 'react';
import upArrow from '../../assets/images/icons/upArrow.png';
class StepperH extends Component {
constructor(props) {
super(props);
}
render() {
return (
<div>
   <div className="StepperH">
      <div className="stripeDiv">
         <p className="greentext"> Your order is in transit. </p>
         <div className="greyColor">
            <div className="greenColor">
            </div>
         </div>
         <div className="custRow">
            <div className="First">
               <div className="circle">
               </div>
               <img src={upArrow} />
               <p className="circleTitle">Dispatched</p>
            </div>
            <div className="Second">
               <div className="circle CircleCenter ">
               </div>
               <img src={upArrow} />
               <p className="circleTitle TitleCenter">In transit</p>
            </div>
            <div className="third">
               <div className="circle CircleCenter">
               </div>
               <img src={upArrow} />
               <p className="circleTitle TitleCenter">Out for delivery</p>
            </div>
            <div className="fourth">
               <div className="circle">
               </div>
               <img src={upArrow} />
               <p className="circleTitle">Delivered</p>
            </div>
         </div>
      </div>
   </div>
</div>
)
}
}
export default (StepperH);