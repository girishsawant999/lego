import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import { JSONModel, OBJModel, GLTFModel, AmbientLight, DirectionLight } from 'react-3d-viewer'
import './Three3DView.css'
import Slider from "react-slick";
import {isMobile} from 'react-device-detect';
// import * as THREE from "three";
// import React3 from "react-three-renderer";
// import ObjectModel from 'react-three-renderer-objects';
import carModel from "../../../src/3dview/TechnicLEGO_CAR_1.obj"
import carMaterial from "../../../src/3dview/TechnicLEGO_CAR_1.mtl";
import gtlfObj from "../../../src/3dview/scene.gltf"
import fbxObj from "../../../src/3dview/LEGO_Engine_to_Skfb.fbx"
import zooom from '../../assets/images/zoom-icon1.png';
import mouse from '../../assets/images/zoom-icon.png';
var FBXLoader = require('three-fbx-loader');
var THREE = require('three');
var loader = new FBXLoader();
var scene = new THREE.Scene();
 

class ThreeDViewDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            scene: {},
            index: 0,
            showModalOfControlModelHelp:false
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }
    next() {
        this.slider.slickNext();
    }
    previous() {
        this.slider.slickPrev();
    }
    componentDidMount() {
        const { scene } = this.refs;
        this.setState({ scene });
    }
    openModal = () => {
        this.setState({ showModal: true })
    }
    closeModal = () => {
        this.setState({ showModal: false })
    }

    openshowModalOfControlModelHelp=()=>{
       this.setState({showModalOfControlModelHelp:true})
    }
    closeshowModalOfControlModelHelp=()=>{
        this.setState({showModalOfControlModelHelp:false})
    }
    applyFullScreen = (width, height) => {

    }
    render() {

        let fbxObjShow=loader.load(fbxObj,  (object3d)=> {
            scene.add(object3d);
          });

        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };
        const { showModal } = this.state
        const settings3 = {
            autoplay: true,
            autoplaySpeed: 5000,
            dots: false,
            arrows: true,
            infinite: true,
            slidesToShow: isMobile ? 3:7,
            slidesToScroll: 1,
            speed: 500,
            vertical: false,

        }

        return (
            <div>
                {/* <div className="button-view">
                    <button onClick={(e) => this.openModal()} >3DImageViewModal</button>
                </div>
                <Modal
                    isOpen={showModal}
                    onAfterOpen={this.openModal()}
                    onRequestClose={this.closeModal()}
                    // style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div>
                        <button className="_3d_c-controls__btn  js--control-fullscreen" data-di-id="di-id-33f3977e-4f0f7c21">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" data-di-res-id="a192b4d9-26a16435" data-di-rand="1586241173387"> <g fill="none" fill-rule="evenodd"> <path className="path-fill-3d" fill="#000" fill-rule="nonzero" d="M15 30a15 15 0 110-30 15 15 0 010 30z"></path> <g fill="#FFF"> <path d="M12.89 22.31l-.15-.15-.58-.48c-.04-.04-.13.02-.19.02H9.61c-.06 0-.08-.11-.04-.17l3.35-3.39c.04-.03.04-.13 0-.16l-.87-.88c-.04-.03-.11-.05-.15 0l-3.43 3.33c-.04.04-.17.02-.17-.03v-2.37c0-.05.06-.15.02-.18l-.52-.58-.13-.15-.56-.58c-.04-.03-.07-.01-.07.04v6.27c0 .06.05.11.1.11h6.27c.05 0 .07-.03.04-.07l-.56-.58zM17.13 22.31l.15-.15.58-.48c.04-.04.13.02.19.02h2.36c.06 0 .08-.11.04-.17l-3.35-3.39c-.04-.03-.04-.13 0-.16l.87-.88c.04-.03.11-.05.15 0l3.24 3.33c.04.04-.02.02-.02-.03v-2.37c0-.05.13-.15.17-.18l.62-.58.16-.15.58-.58c.04-.03.08-.01.08.04v6.27c0 .06-.04.11-.12.11h-6.26c-.05 0-.07-.03-.03-.07l.6-.58zM12.89 7.69l-.15.15-.58.67c-.04.03-.13.16-.19.16H9.61c-.06 0-.08-.07-.04-.01l3.35 3.29c.04.04.04.1 0 .13l-.87.85a.11.11 0 01-.15 0L8.47 9.6c-.04-.04-.17-.04-.17.01v2.35c0 .05.06.15.02.18l-.52.58-.13.15-.56.58c-.04.03-.07.02-.07-.04V7.13c0-.06.05-.11.1-.11h6.27c.05 0 .07.04.04.07l-.56.6zM17.13 7.69l.15.15.58.67c.04.03.13.16.19.16h2.36c.06 0 .08-.07.04-.01l-3.35 3.29a.09.09 0 000 .13l.87.85c.04.04.11.04.15 0l3.24-3.33c.04-.03-.02-.03-.02.04V12c0 .05.13.14.17.18l.62.58.16.15.58.57c.04.04.08.02.08-.03V7.17c0-.06-.04-.11-.12-.11h-6.26c-.05 0-.07.03-.03.07l.6.56z"></path> </g> </g></svg>
                        </button>
                    </div>

                </Modal> */}
                <div>


                    <div className="jumbotron">
                        <div className="zooming-btn">
                            <span><img src={zooom} className="signman-icon" alt="account" /></span>
                            <span onClick={()=>this.setState({showModalOfControlModelHelp:true})} className="pl-1"><img src={mouse} className="signman-icon" alt="account" /></span>
                        </div>
                        <div className="container">
                            <div>
                                {this.state.showModalOfControlModelHelp ? <Modal modalId="showModalOfControlModelHelp" open={this.state.showModalOfControlModelHelp} onClose={this.closeshowModalOfControlModelHelp}>

                                <div className="_3d_c-help-screen  js--help-screen  _3d_c-help-screen--floating">
                                    <div className="modelCenterTitle">
                                                    How to control the model
                                                </div>

                                    <div className="modelGrid">
                                        <div className="leftMouse">
                                            <div className="mediaObj">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="63" viewBox="0 0 42 63">
                                                    <g fill="none" fill-rule="evenodd">
                                                        <path fill="#000" d="M20.5 60.14a17.72 17.72 0 01-17.67-17.9V26.49h35.35v15.75c0 9.94-7.86 17.9-17.67 17.9m-1.42-57.2v20.68H2.83v-2.86c0-9.45 7.12-17.1 16.26-17.83m19.1 17.83v2.86H21.91V2.93a17.73 17.73 0 0116.26 17.83M20.51 0C9.17 0 0 9.28 0 20.76v21.48C0 53.72 9.17 63 20.5 63c11.34 0 20.51-9.28 20.51-20.76V20.76C41.01 9.28 31.84 0 20.51 0"></path>
                                                        <path fill="#000" d="M20.5 60.14a17.72 17.72 0 01-17.67-17.9V26.49h35.35v15.75c0 9.94-7.86 17.9-17.67 17.9m-1.42-57.2v20.68H2.83v-2.86c0-9.45 7.12-17.1 16.26-17.83m19.1 17.83v2.86H21.91V2.93a17.73 17.73 0 0116.26 17.83M20.51 0C9.17 0 0 9.28 0 20.76v21.48C0 53.72 9.17 63 20.5 63c11.34 0 20.51-9.28 20.51-20.76V20.76C41.01 9.28 31.84 0 20.51 0"></path>
                                                        <path fill="#006DB7" d="M19.1 2.93v20.7H2.82v-2.87c0-9.45 7.12-17.1 16.26-17.83"></path>
                                                    </g>
                                                </svg>
                                            </div>
                                            <p className="mouseText">
                                                Click &amp; move to rotate
                                            </p>
                                        </div>

                                        <div className="rightMouse">
                                            <div className="mediaObj">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="63" viewBox="0 0 43 63">
                                                    <g fill="none" fill-rule="evenodd">
                                                        <path fill="#000" d="M23 3c9.3.7 16.6 8.3 16.6 17.8v21.4c0 10-8 18-18.1 18a18 18 0 01-18.1-18V20.8c0-9.5 7.3-17.1 16.7-17.9M21.5 0C9.9 0 .5 9.3.5 20.8v21.4C.5 53.7 9.9 63 21.5 63s21-9.3 21-20.8V20.8C42.5 9.3 33.1 0 21.5 0"></path>
                                                        <path fill="#006DB7" d="M21.5 10.5c1.7 0 3 1.4 3 3.3v11.4c0 1.9-1.3 3.3-3 3.3s-3-1.4-3-3.3V13.8c0-1.9 1.3-3.3 3-3.3"></path>
                                                    </g>
                                                </svg>
                                            </div>

                                            <p className="_3d_o-media__content">
                                                Scroll mouse to zoom
                                            </p>
                                        </div>
                                    </div>
                                </div>  

                                </Modal> :''}
                            </div>
                        </div>
                    </div>

                    <div className="thumb-slider-section">
                        <div className="row">
                            <div className="col-12">
                                <p className="scroll-title"> Select a model to explore in 3D</p>
                            </div>

                            <div className="image-grid-scroll">
                                <div className="container">
                                    <div className="col-xs-12 col-sm-12">
                                        <div className="d-flex flex-row">
                                            <div onClick={this.previous} className="left-arrow-bottom">
                                            <svg className="arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="28" viewBox="0 0 18 28"> <path fill="#757575" fill-rule="nonzero" d="M16.2 0L0 14l16.2 14 1.8-1.7L3.8 14 18 1.7z"></path></svg>
                                            </div>
                                            <Slider ref={c => (this.slider = c)} {...settings3} style={{ width: '100%',overflowX:'auto' }}>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Appartment/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://lc-imageresizer-live-s.legocdn.com/resize?width=400&height=200&imageUrl=https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Figure2/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Appartment/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://lc-imageresizer-live-s.legocdn.com/resize?width=400&height=200&imageUrl=https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Figure2/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Appartment/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://lc-imageresizer-live-s.legocdn.com/resize?width=400&height=200&imageUrl=https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Figure2/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Appartment/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://lc-imageresizer-live-s.legocdn.com/resize?width=400&height=200&imageUrl=https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Figure2/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Appartment/cover.png" />
                                                    </div>
                                                </div>
                                                <div className="image-grid-box">
                                                    <div className="thumbnail">
                                                        <img src="https://lc-imageresizer-live-s.legocdn.com/resize?width=400&height=200&imageUrl=https://www.lego.com/cdn/model-viewer/assets/v1/10270/sm01/Figure2/cover.png" />
                                                    </div>
                                                </div>
                                            </Slider>
                                        </div>
                                        <div  onClick={this.next} className="right-arrow-bottom">
                                            <svg className="arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="28" viewBox="0 0 18 28" data-di-res-id="6115979a-2bd43819" data-di-rand="1586929384498"> <path fill="#757575" fill-rule="nonzero" d="M1.8 0L18 14 1.8 28 0 26.3 14.2 14 0 1.7z"></path></svg>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <React3
                    mainCamera="camera"
                    width={width}
                    height={height}
                    alpha={true}
                >
                    <scene ref="scene">
                        <perspectiveCamera
                            key={`perspectiveCamera`}
                            name="camera"
                            fov={75}
                            aspect={width / height}
                            near={0.1}
                            far={1000}
                            position={new THREE.Vector3(0, 0, 25)}
                            lookAt={new THREE.Vector3(0, 0, 0)}
                        />
                        <group name="carGroup">
                            <ObjectModel
                                name="boat"
                                model={carModel}
                                material={carMaterial}
                                scene={this.state.scene}
                                group="carGroup"
                            />
                        </group>
                    </scene>
                </React3> */}
                {/* <OBJModel src={carModel} texPath="" /> */}
                {/* <div>{fbxObjShow}</div> */}
                {/* <GLTFModel
                    src={gtlfObj}
                >
                    <AmbientLight color={0xffffff} />
                    <DirectionLight color={0xffffff} position={{ x: 100, y: 200, z: 100 }} />
                    <DirectionLight color={0xff00ff} position={{ x: -100, y: 200, z: -100 }} />
      </GLTFModel> */}

            </div>
        )
    }
}

export default (ThreeDViewDemo);