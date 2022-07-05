import React, { Component } from 'react';
import ChartImage from '../ChartImage';
import { AnimationCreator } from '@/animation';
import canvg from 'canvg';
import _ from 'lodash'

export default class D3Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            specString: '',
            chartImageUrl: '',
            pointx: 0,
            pointy: 0,
            isSelecting: false,
            isAnimating: false,
            isCleanAnimation :false,
            visSource: '',
            backgroundcolor:'',
            textcolor:'',
            colormap:'',
            textfont:'',
            categoriesreading:'',
            seriesreading:'',
            fieldsreading: '', 
            colorPair: {},
            AllData: [],
            icontype:'',
            styleLayout:'',
            sizeW:0,
            sizeH:0,
            widgets: '',

            // categoriesreading:[],
        };
        this._animations = [];
        this.drawFramesTimer = 0;
        this.recorderTimer = 0;
    }

    componentDidMount() {
        // if (this.props.showChartAnimation && this.props.spec.animation.length > 0) {
        //     this.renderAnimation();
        // } else {
            this.renderChart();
        // }
    }

    componentDidUpdate() {

        console.log('this.state.colorPair', this.state)
        console.log('this.props.colorPair', this.props)
        console.log('xxx', this.state.categoriesreading!==this.props.categoriesreading)


         if ((this.state.backgroundcolor !== this.props.cardcolor||this.state.textcolor!==this.props.textcolor
            ||this.state.sizeH!==this.props.size.h||this.state.sizeW!==this.props.size.w||JSON.stringify(this.state.widgets)!==JSON.stringify(this.props.widgets)||this.state.textfont!==this.props.textfont||this.state.categoriesreading!==this.props.categoriesreading ||this.state.seriesreading!==this.props.seriesreading ||this.state.fieldsreading!==this.props.fieldsreading ||JSON.stringify(this.state.colorPair)!==JSON.stringify(this.props.colorPair))) {
            //&& (this.props.categoriesreading!==''&&this.props.categoriesreading!==undefined) &&(this.props.icontype!==''&&this.props.icontype!==undefined)&& (this.props.seriesreading!==''&&this.props.seriesreading!==undefined)&& (this.props.fieldsreading!==''&&this.props.fieldsreading!==undefined) && (this.props.colorPair!==''&&this.props.colorPair!==undefined)) {
                
            //seriesreading可以为空，piechart就是空的
            //          if((Array.isArray(this.props.categoriesreading)&&this.props.categoriesreading.length>0)&&((Array.isArray(this.props.icontype)&&this.props.icontype.length>0))&&((Array.isArray(this.props.seriesreading)&&this.props.seriesreading.length>0)) )  {
                if((Array.isArray(this.props.categoriesreading)&&this.props.categoriesreading.length>0)&&((Array.isArray(this.props.icontype)&&this.props.icontype.length>0)))  {
                        console.log('renderchartDidupdate',this.state.colorPair)
                        console.log('renderchartDidupdate',this.props.colorPair)
                        this.renderChart();
                        
                        this.setState({
                            backgroundcolor: this.props.cardcolor,
                            textcolor:this.props.textcolor,
                            sizeH:this.props.size.h,
                            sizeW:this.props.size.w,
                            textfont:this.props.textfont,
                            categoriesreading:this.props.categoriesreading,
                            seriesreading:this.props.seriesreading,
                            fieldsreading: this.props.fieldsreading,
                            colorPair: _.cloneDeep(this.props.colorPair),
                            AllData: this.props.AllData,
                            widgets: this.props.widgets
                          })
                       
                    } 
        }
            if(this.props.chartId.indexOf("sugg")<0){
                if(this.state.styleLayout!== this.props.stylelayout){
                    this.renderChart();
                        this.setState({
                         styleLayout:this.props.stylelayout
                        })
                }
            }
        // if (this.state.specString !== JSON.stringify(this.props.spec)) {
        //     if (this.props.showChartAnimation && this.props.spec.animation.length > 0) {
        //         this.renderAnimation();
        //     } else {
        //         this.renderChart();
        //     }
        // } else if (this.props.pointx !== this.state.pointx && this.props.pointy !== this.state.pointy) {
        //     // dragging animation
        //     this.props.hover(this.props);
        //     this.setState({
        //         pointx: this.props.pointx,
        //         pointy: this.props.pointy,
        //     })
        // } else if (this.props.isSelectingChartElement && !this.state.isSelecting) {
        //     // start selecting chart element
        //     this.props.select(this.props);
        //     this.setState({
        //         isSelecting: true,
        //     })
        // } else if (!this.props.isSelectingChartElement && this.state.isSelecting) {
        //     // finish selecting chart element
        //     this.renderAnimation();
        //     this.setState({
        //         isSelecting: false,
        //     })
        // }else if (this.props.startAnimation && this.state.isAnimating) {
        //     //console.log("播放动画...")
        //     this.renderAnimation();
        //     this.setState({
        //         isAnimating: false,
        //         isCleanAnimation : true
        //     })
        // }else if (this.props.cleanAnimation && this.state.isCleanAnimation) {
        //     //console.log("取消动画...")
        //     this.renderChart();
        //     this.setState({
        //         isCleanAnimation: false,
        //         isAnimating : true
        //     })
        // }
    }
    
    renderChart = () => {
        
      
        const newProps = _.cloneDeep(this.props);
        newProps.width = 600; //为了分辨率
        newProps.height = 600;
        const svg = this.props.draw(newProps);

        console.log('newProps',newProps)

        if (svg) {
            const visSource = svg.node().parentNode.innerHTML;
            // console.log('visSource',visSource)
            // console.log("SVG====:",svg)
            const chartImageUrl = this.getImageUrl(visSource);
            this.setState({
                specString: JSON.stringify(this.props.spec),
                chartImageUrl: chartImageUrl,
                visSource: visSource,
            });
        }
    }
    getSvg2ImageUrl = () => {
        if (!document.getElementsByClassName(this.props.chartId)[0]) {
            return;
        }
        let svg = document.getElementsByClassName(this.props.chartId)[0].getElementsByTagName('svg')[0] 
        if (svg) {
            let visSourc = svg.innerHTML
            return this.getImageUrl(visSourc);
        }
    }


    getImageUrl = (source) => {
        var canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        var pixelRatio = window.devicePixelRatio || 1;
        let width = 600;
        let height = 600;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        canvg(canvas, source);
        return canvas.toDataURL('image/png',1.0);
    }

    getImageRef = (ref) => {
        if (!this.imageref && ref) {
            this.imageref = ref;
            const animations = this.props.animations;
            if (this.props.showAnimation && animations.length !== 0) {
                let animationCreator = new AnimationCreator(ref);
                for (let index = 0; index < animations.length; index++) {
                    let current = this.props.current;
                    if (this.props.isVideoPerforming) {
                        current = 0;
                    }
                    const animation = animations[index];
                    animationCreator.fromModel(animation).play(current);
                }
            }
        }
    }

    createMarkup = () => {
        return {__html: 'First &middot; Second'};
    }
   
    render() {
        console.log('this.props.onCanvas',this.props.onCanvas)
        if (this.props.onCanvas) {
            // return 
        //     <Portal><input
        //     style={{
        //       position: 'absolute',
        //       top: 10,
        //       left: 10,
        //       width: '200px'
        //     }}
        //     placeholder="DOM input from Konva nodes"
        //   /></Portal>;
            return <ChartImage name={this.props.name} src={this.state.chartImageUrl} getImageRef={this.getImageRef} visSource={this.state.visSource} {...this.props} />;
        } else {
            return <div className={this.props.chartId} />;
        }
    }
}
