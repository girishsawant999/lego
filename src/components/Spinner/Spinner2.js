import React, { Component } from 'react';
import './Spinner.css';
import { createMetaTags } from "../utility/meta"
import { connect } from "react-redux"


class Spinner2 extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (<div  className="alignCenter">
           {createMetaTags(
							this.props.globals.store_locale === "en"
								? "Home | Official LEGO® Online Store Saudi Arabia"
								: "الصفحة الرئيسية | متجر ليغو أونلاين الرسمي بالسعودية ",
							this.props.globals.store_locale === "en"
								? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
								: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
							this.props.globals.store_locale === "en"
								? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
								: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
						)}
            <div className="loader"></div>
        </div>);
    }
}
const mapStateToProps = (state) => {
	return {
		globals: state.global,
	}
}


export default connect(mapStateToProps)(Spinner2)