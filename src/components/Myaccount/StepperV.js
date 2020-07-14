import React, { Component } from 'react';
class StepperV extends Component {
constructor(props) {
super(props);
}
render() {
return (
<div>
   <div className="verticleStepper">
      <div className="titleLabel">
         <p>
            Your order <span>T25487</span> is in transit. 
         </p>
      </div>
      <div className="stepsVerticle">
         <ul className="events">
            <li>
               <span className="timed" datetime="10:03">
                  <p className="dateLabel">22 March</p>
                  <p className="timeLabel">22:00</p>
               </span>
               <span className="dots">
                  <p className="dateLabel">In transit</p>
                  <p className="timeLabel">Hinckey ,Leicestershire(GB),United Kingdom</p>
               </span>
            </li>
            <li>
               <span className="timed" datetime="10:03">
                  <p className="dateLabel">22 March</p>
                  <p className="timeLabel">22:00</p>
               </span>
               <span className="dots">
                  <p className="dateLabel">In transit</p>
                  <p className="timeLabel">Mechelen (BE),United kingdom</p>
               </span>
            </li>
            <li>
               <span className="timed active" datetime="10:03">
                  <p className="dateLabel">22 March</p>
                  <p className="timeLabel">22:00</p>
               </span>
               <span className="dots">
                  <p className="dateLabel">Order information has been transmitted to DPD.</p>
                  <p className="timeLabel">DPD data centre</p>
               </span>
            </li>
         </ul>
         <div className="DPD">
            <p className="DLabel">DPD</p>
            <p className="DLabel">248751254</p>
         </div>
      </div>
   </div>
</div>
)
}
}
export default (StepperV);