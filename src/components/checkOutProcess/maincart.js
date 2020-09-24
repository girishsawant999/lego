import React, { Component } from 'react';
import CartListView from './checkoutprocess';

class Maincart extends Component {
   constructor(props) {
       super(props);
       
   }

   render() {
       return (
           <div>
               <div className="Maincart">
                    <CartListView />
               </div>
           </div>
       )
   }
}


export default (Maincart);