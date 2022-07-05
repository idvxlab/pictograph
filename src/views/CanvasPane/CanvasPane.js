import React, { PureComponent } from 'react';
import { Layout,Button,Divider,Icon,Slider} from 'antd';
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import D3Container from "@/charts/D3/D3Container"
import './canvaspane.css';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'
// import { fabric } from 'fabric';
import { getCategories} from '@/charts/D3/PieChart/helper';
import { widgets, textColor, seriesreading, fieldsreading } from '../../selectors/canvas';
// import { window, event } from 'd3-selection';
// import { SVG } from '@svgdotjs/svg.js';
// import { subjx } from 'subjx';
// import "subjx/dist/style/subjx.css";
import html2canvas from 'html2canvas';
import $ from 'jquery';
import Panzoom from '@panzoom/panzoom';
import { func } from 'prop-types';
import * as d3 from 'd3';
import pictorialtype from '@/pictorialTypeDict';
import styleNameDict from '../../styleNameDict';
import { Select} from 'antd';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import { supportLegend } from 'vega-lite/build/src/channel';


const { Option } = Select;




const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content,Sider} = Layout;



class SketchBackground extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      currentIndex:0,
      // color: {
      //   r: '241',
      //   g: '112',
      //   b: '19',
      //   a: '1',
      // },
      color:this.props.backgroundcolor,
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
      authorization: 'authorization-text',
      },
    }
  }
 
  handleClick = () => {
    this.setState({ 
      displayColorPicker: !this.state.displayColorPicker,
      currentIndex:1
     })
  };

  handleClose = () => {
    this.setState({ 
      displayColorPicker: false ,
      currentIndex:0
    })
  };

  handleChange = (color) => {
    this.setState({ color: color.hex })
    let color1=color.hex;
    this.props.handleChangeComplete(color1)
    // this.forceUpdate();
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '8px',
          borderRadius: '2px',
          //background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
         background:`${this.state.color}`,
          position: 'fixed',
          marginTop: '-8px',
    
        },
        swatch: {
          padding: '5px',
          // background: '#fff',
          // borderRadius: '1px',
          // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          display: 'block'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className="canvasColor">
        <div  style={ styles.swatch } onClick={ this.handleClick }>
        <Icon  className={this.state.currentIndex===1?"iconactive":'icondisplay'}  type="bg-colors" style={{transform: 'scale(2)' ,padding: '10px'}}/>
        <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange }  />
        </div> : null }

      </div>
    )
  }
}


class SketchTextColor extends React.Component {
  constructor(props) {
    super(props);

    this. state = {
      displayColorPicker: false,
      currentIndex:0,
      // color: {
      //   r: '241',
      //   g: '112',
      //   b: '19',
      //   a: '1',
      // },
      color:this.props.textcolor1
    }
  }
 
  handleClick = () => {
    this.setState({ 
      displayColorPicker: !this.state.displayColorPicker ,
     currentIndex:2
    })
  };

  handleClose = () => {
    this.setState({ 
      displayColorPicker: false,
      currentIndex:0
     })
  };

  handleChange = (color) => {
    this.setState({ color: color.hex })
    this.props.handleChangeComplete1(color.hex)
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '8px',
          borderRadius: '2px',
          //background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
          background:`${this.state.color}`,
          position: 'fixed',
          marginTop: '-8px',
              
        },
        swatch: {
          padding: '5px',
          // background: '#fff',
          // borderRadius: '1px',
          // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          display: 'block'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className="canvasColor">
        <div  style={ styles.swatch } onClick={ this.handleClick }>
        <Icon className={this.state.currentIndex===2?"iconactive":'icondisplay'} type="font-colors" style={{transform: 'scale(2)' ,padding: '10px'}}/>
        <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange }  />
        </div> : null }

      </div>
    )
  }
}

// class TextBold extends PureComponent{
//   constructor(props){
//     super(props);
//     this. state = {
//       textBold:false
//     }
//   }
//   handleClick = () => {
//     this.setState({ textBold: !this.state.textBold })
//     this.props.handleChangeCompleteTextBold(this.state.textBold);
//   };

//   render(){
//     const styles = reactCSS({
//       'default': {
//         color: {
//           width: '36px',
//           height: '8px',
//           borderRadius: '2px',
//           position: 'fixed',
//           marginTop: '-8px',             
//         },
//         swatch: {
//           padding: '5px',
//           display: 'inline-block',
//           cursor: 'pointer',
//         }}})
//      return(
//       <div className="canvasColor">
//         <div style={ styles.swatch } onClick={ this.handleClick }>
//         <Icon type="bold" style={{transform: 'scale(1.5)' ,padding: '10px'}}/>
//         </div>
//       </div>
//     )
//   }
 
// }

// class TextItalic extends PureComponent{
//   constructor(props){
//     super(props)
//     this. state = {
//       textItalic:false
//     }
//   }
//   handleClick = () => {
//     this.setState({ textItalic: !this.state.textItalic })
//     this.props.handleChangeCompleteTextItalic(this.state.textItalic);
//   };
//   render(){
//     const styles = reactCSS({
//       'default': {
//         color: {
//           width: '36px',
//           height: '8px',
//           borderRadius: '2px',
//           position: 'fixed',
//           marginTop: '-8px',             
//         },
//         swatch: {
//           padding: '5px',
//           display: 'inline-block',
//           cursor: 'pointer',
//         }}})
//      return(
//       <div className="canvasColor">
//        <div style={ styles.swatch } onClick={ this.handleClick }>
//        <Icon type="italic"style={{transform: 'scale(1.5)' ,padding: '10px'}}/>
//        </div>
//       </div>
//   )
//   }
 
// }

// class TextAdd extends PureComponent{
//   constructor(props){
//     super(props)
//   }
//   render(){
//      return(
//       <div className="canvasColor">
//      <Icon type="font-size" style={{transform: 'scale(1.5)' ,padding: '10px'}}/>
//       </div>
//   )
//   }
 
// }
// class IconSelect extends PureComponent{
//   constructor(props){
//     super(props)
//   }
//   render(){
    
//      return(
//       <div className="canvasColor">
//      <Icon type="smile" style={{transform: 'scale(1.5)' ,padding: '10px'}}/>
//       </div>
//   )
//   }
 
// }

// class SvgSave extends PureComponent{
//   constructor(props){
//     super(props)
//   }
    
//   render(){
//      return(
       
//       <div className="canvasColor">
//      <Divider   style={{height:"2em"}}  type="vertical"/>
//       <Icon type="save" style={{transform: 'scale(1.5)' ,padding: '10px'}}/>
//       </div>
//   )
//   }
 
// }

//初始化colorpicker style
const popover = {
  position: 'absolute',
  //position: 'relative',
  zIndex: '9999',
  // top: '-250px',
  right: '0px',
  bottom: '0px',
  left: '200px',
  marginTop:'50px',
  marginLeft:'300px'
}

const cover = {
  position: 'fixed',
  // zIndex: '9999',
  //position:
  top: '-100px',
  right: '0px',
  bottom: '0px',
  left: '0px',
}

const defaultcolorPicker = [];
for(let i = 0; i < 40; i++){
  // let temp = false;
  defaultcolorPicker.push(false);
}

var time = 300;
var timeOut  = null;

export default class CanvasPane extends PureComponent {
    constructor(props) {
      super(props);
  
      this.state = {
        layouts: this.getFromLS("layouts") || {},
      //  displayColorPicker: false,
        // backgroundcolor:  {
        //   r: '255',
        //   g: '255',
        //   b: '255',
        //   a: '1',
        // },
        // backgroundcolor:this.props.cardColor,
        // textcolor1: this.props.textColor,
        // textfont:this.props.textfont,
        // iconcolor:this.props.iconcolor,
        backgroundcolor:'',
        textcolor1:'',
        textfont:'',
        iconcolor:'',
        icontype:'',
        categoriesreading:'',
        seriesreading:'',
        fieldsreading: '',
        AllData: [],
        fontweightflag:false,
        textitalicflag:false,
        widgets:[],
        // icontype:"",
        // icontype:this.props.icontype,
        // categoriesreading:this.props.categoriesreading,
        inputfontsize:16,
        iconNum: 9,
        currentIndex:0, //记录点击工具icon的位置
        displayColorPicker: defaultcolorPicker,

        selectedElementClass: '',

        //temp - refresh
        refresh: false,

        //推荐色盘
        presetColorsReplace: '',

      }

      this.selectChart = this.selectChart.bind(this)
      this.onLayoutChange = this.onLayoutChange.bind(this)
      // this.inputChange = this.inputChange.bind(this)
    }
    
    componentWillReceiveProps(props) {
    //  console.log('will',this.props.widgets)
     console.log('啦啦啦--2',props)
    //   console.log('canvas-props', props);
    //  if (this.props.backgroundColor !== props.backgroundColor||this.props.categoriesreading!==props.categoriesreading||this.props.seriesreading!==props.seriesreading || this.props.icondict !== props.icondict || this.props.icontype !== props.icontype){
        this.setState({
                      backgroundcolor:props.cardColor,
                      textcolor1:props.textColor,
                      iconcolor:props.iconcolor,
                      textfont:props.textfont,
                      icontype:props.icontype,
                      iconPair: props.iconPair,
                      categoriesreading:props.categoriesreading,
                      seriesreading:props.seriesreading,
                      fieldsreading: props.fieldsreading,
                      icondict: props.icondict,
                      AllData: props.AllData,
                      colorPair: props.colorPair

                    })       
  }
    // }

  
//修改背景颜色
  handleChangeComplete =(colorCode)=>{
    this.setState({
      backgroundcolor:colorCode,
      currentIndex:1
    })
  }
//修改字体颜色
  handleChangeComplete1 =(colorCode)=>{
    this.setState({
      textcolor1:colorCode,
      currentIndex:2
    })
  }
//字体加粗
  handleChangeCompleteTextBold =()=>{
    this.setState({
      fontweightflag:!this.state.fontweightflag,
      currentIndex:3
    })
  }
//字体倾斜
  handleChangeCompleteTextItalic =()=>{
    this.setState({
      textitalicflag:!this.state.textitalicflag,
      currentIndex:4
    })
  }

//获取字体大小
onChange=value=>{
 // console.log("lalallal:--",value)
  this.setState({
     inputfontsize:value
  }
  )
}

//增加显示icon
onShowMore =()=>{
  this.setState({
    iconNum: this.state.iconNum + 9
  })
}

    getJsonFiles=(iconname)=>{
      const props = this.props;
      
      // const forceUpdate1 = this.forceUpdate;
      
      const selectedElementClass = this.state.selectedElementClass;
        let res = [];
       // let iconname = this.props.dictxxx[this.props.selectFieldxxx];
        // console.log(iconname);
        let iconReplace = function(e, update) {
          console.log('props-json', props)
          let iconClass = e.target.className;
         // let repalceTarget = document.getElementsByClassName('source-' + this.state.selectedElementClass);
          let seriesData = props.seriesData;
          let FieldsData = props.FieldsData;
          let categoriesData = props.categoriesData;

          if(FieldsData === selectedElementClass) {
            let fieldsreading = iconClass;
            props.changeFieldsreading(fieldsreading);
          }else if(seriesData.indexOf(selectedElementClass) > -1) {
            // console.log('selectedElementClass = seriesData',selectedElementClass)
            let indexChange = seriesData.indexOf(selectedElementClass);
            let seriesreading = props.seriesreading;
            seriesreading[indexChange] = iconClass;
            props.changeSeriesreading(seriesreading);
            // let widgets = [...props.widgets];
            // console.log('widgets', widgets);
            // widgets[0]['animation'] = '6666666';
  
            // props.changeMapping(widgets);

           // console.log('forceUpdate1', forceUpdate1)
          }else if(categoriesData.indexOf(selectedElementClass) > -1){
            // console.log('selectedElementClass = categoriesData',selectedElementClass)
            // console.log('categoriesData',categoriesData);
            let indexChange = categoriesData.indexOf(selectedElementClass);
            let categoriesreading = props.categoriesreading;
            // console.log('before-change',categoriesreading,indexChange)
            categoriesreading[indexChange] = iconClass;
            // console.log('after-change',categoriesreading)
            props.changeCategoriesreading(categoriesreading);

          }
          
          

        }
        if(iconname!==""){

          let fs = require('fs');
          let join = require('path').join;
          let jsonFiles = [];
          let res = [];
          let iconNum = this.state.iconNum;
        
          let UpdataNum = 0;  //Add 一次 加1
          console.log('iconname',iconname);
          for(let i=0;i<iconNum;i++){
              console.log('[i+UpdataNum*iconNum]',iconname[i+UpdataNum*iconNum])
              if(iconname[i+UpdataNum*iconNum] == undefined) return null;
              // let iconSvg = d3.select("#showmore")
              // .append("svg")
              // .attr("width", 60)
              // .attr("height", 60);


              // iconSvg.append("defs")
              // .selectAll("g")
              // .data([iconname[i+UpdataNum*iconNum]])
              // .enter()
              // .append("g")
              // // .attr("class", iconname[i+UpdataNum*iconNum])
              // .attr("id",'defs'+ i+UpdataNum*iconNum)
              // .append("path")
              // .attr("d",function(d){
              //     return pictorialtype[d]
              // });

              // iconSvg.append("g")
              // .attr("id","pictoLayer")
              // .selectAll("use")
              // .data([iconname[i+UpdataNum*iconNum]])
              // .enter()
              // .append("use")
              // .attr("xlink:href", '#defs'+ i+UpdataNum*iconNum)
              // .attr("class", iconname[i+UpdataNum*iconNum])
              // .attr("id", i+UpdataNum*iconNum)
              // .attr("width", 60)
              // .attr("height", 60);

              let iconurl;
          
              //console.log("iconurl","./styleIcons/" + iconname[i+UpdataNum*iconNum] + ".svg")
              console.log('iconname[i+UpdataNum*iconNum]',iconname[i+UpdataNum*iconNum].indexOf("_"),iconname[i+UpdataNum*iconNum].indexOf("_") !== -1)
              if(iconname[i+UpdataNum*iconNum].indexOf("_") !== -1 ){
                iconurl = require("./outlineIcons/" + iconname[i+UpdataNum*iconNum].split('_')[0] + ".svg")
              }else{
                iconurl = require("./styleIcons/" + iconname[i+UpdataNum*iconNum] + ".svg")
              }
              res.push(<img src={iconurl} width="60" height="60"  className= {iconname[i+UpdataNum*iconNum]} id={i+UpdataNum*iconNum} onClick={iconReplace}/>)
            }
              // res.push(iconSvg)}
        // function findJsonFile(path){
        //     let files = fs.readdirSync(path);
        //     files.forEach(function (item, index) {
        //         let fPath = join(path,item);
        //         let stat = fs.statSync(fPath);
        //         if(stat.isDirectory() === true) {
        //             findJsonFile(fPath);
        //         }
        //         if (stat.isFile() === true) { 
        //           jsonFiles.push(fPath);
        //         }
        //     });
        // }
        // findJsonFile(jsonPath);
        return( 
          // <img src={iconurl} width="50" height="50" /> 
          res
        )
      } 
    }

    showIcons=(icondict)=>{
      // let findKey;
      // if(key === '' || key === undefined) findKey = this.props.categoriesreading[0];
      // else findKey = key;
      // console.log('this.props.icondict', this.props.icondict);
      var oDiv = document.getElementById("styleicons")
      let oDiv1 = document.getElementById("showmore")
      if (oDiv.style.display == "none"){
        oDiv.style.display = "block";
        oDiv1.style.display = "block";
        this.setState({
          currentIndex:6
        })
      }else {
      oDiv.style.display = "none";
      oDiv1.style.display = "none";
      this.setState({
        currentIndex:0
      })
    }
    

    }

    showslider=()=>{
      var oDiv1 = document.getElementById("showslider")
      if (oDiv1.style.display === "none"){
        oDiv1.style.display = "block";
        this.setState({
          currentIndex:5
        })
      }else {
      oDiv1.style.display = "none";
      this.setState({
        currentIndex:0
      })
    }
    
    }


    getFromLS(key) {
      let ls = {};
      if (global.localStorage) {
        try {
          ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
        } catch (e) {
          /*Ignore*/
        }
      }
      return ls[key];
    }
  
    saveToLS(key, value) {
      if (global.localStorage) {
        global.localStorage.setItem(
          "rgl-8",
          JSON.stringify({
            [key]: value
          })
        );
      }
    }

    selectChart = (i, spec) => {
      this.props.selectChart(i);
      this.props.openEditor(i, spec);
     
    }
    
    inputChange = (i, event) =>{

      let widgets = [...this.props.widgets];
        
        if(!event || event.target==undefined){
          widgets[i].inputvalue = "Add some text11";
          
        }else{
          widgets[i].inputvalue = event.target.value;
        }
        this.props.changeMapping(widgets)
        
    }

    handleColorClick = (colorItem) => {
      console.log('colorstyleclick', colorItem)
      let colorIndex = this.props.AllData.indexOf(colorItem);
      let displayColorPicker = this.state.displayColorPicker;
        displayColorPicker[colorIndex] = true;
      this.setState({
        displayColorPicker: displayColorPicker
      });

      console.log('Object.values(this.props.colorPair)', Object.values(this.props.colorPair));

      //颜色推荐
      let colorsetData = _.cloneDeep(Object.values(this.props.colorPair));

        for(let i=0; i < colorsetData.length; i++){
            let temp1 = colorsetData[i].replace(/rgb\(/, " ")
            let temp2 = temp1.replace(/\)/, " ")
            let temp3 = temp2.split(",")
            let temp4 = []
            temp4=temp3.map(function(data){
                return +data;
            });
            colorsetData[i] = temp4;
        }

        //前后端传输

        var data = []
        // setTimeout(()=> console.log('成功',data))

        HttpUtil.post(ApiUtil.API_COLOR_SUGESSTION, colorsetData)
            .then(re=>{
              console.log('presetColorsReplace-re.data', re.data);
                data = re.data
                this.setState({
                    presetColorsReplace: data,
                });
                
            })
            .catch(error=>{
              
                console.log(error.message);
            })
            // .then(re =>this.props.changeLoading(false));



      //层级过深无法触发渲染时需要强制渲染
      this.forceUpdate();
    }
  
    handleColorChange = (colorItem, value) => {
      console.log('colorchange', colorItem)
      console.log('colorchange', value)

      let colorPair = this.props.colorPair;
      colorPair[colorItem] = 'rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ')';
      console.log('colorPair----', colorPair)

      this.props.changeColorPair(colorPair);
      this.forceUpdate();
    }
  
    handleColorClose = (colorItem) => {
      console.log('colorClose', colorItem)
      let colorIndex = this.props.AllData.indexOf(colorItem);
      let displayColorPicker = this.state.displayColorPicker;
      displayColorPicker[colorIndex] = false;

      console.log('displayColorPicker-close', displayColorPicker)
      this.setState({
        displayColorPicker: displayColorPicker
      })
      this.forceUpdate();
    }

   
    generateDOM = (e) => {

      let widgets = [...this.props.widgets];
      console.log('canvs-state', widgets)

      return _.map(widgets, (item, i) => {



      //Get categories
      // const dataCategories = getCategories(this.props.dataList[item.dataIndex], item.spec.encoding);
      // const categories = Object.keys(dataCategories);
      // const colorset = item.spec.style.colorset;

      console.log('this.state.seriesreding', this.props);
    
      // let backgroundcolor1= `rgba(${ this.state.backgroundcolor.r }, ${ this.state.backgroundcolor.g }, ${ this.state.backgroundcolor.b }, ${ this.state.backgroundcolor.a })`
        
      // let categoriesreadingTest = ["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
      // let seriesreadingTest = ["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
      // let icontypeTest =  ["add-list","creek--v1"];

      // console.log('this.state.catergroi', this.props.categoriesreading)

      const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '8px',
            borderRadius: '2px',
            //background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
           background:`${this.state.color}`,
            position: 'fixed',
            marginTop: '-8px',
      
          },
          swatch: {
            padding: '5px',
            // background: '#fff',
            // borderRadius: '1px',
            // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            zIndex: '2',
            display: 'block'
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
      });

      console.log('widgets-canvaspane', widgets)
      console.log('this.props.styleLayout', this.props.styleLayout)
      console.log('styleName', styleNameDict[this.props.styleLayout.replace(' ', '')])
      console.log('this.props', this.props.layoutMode)
      // let styleLayout = styleNameDict[this.props.styleLayout.replace(' ', '')] != item.type ? item.spec['style'].layout[0] : this.props.styleLayout;

      let itemType ;
      let styleLayout; 
      if(this.props.layoutMode=='sugess') {
//         styleLayout = styleNameDict[this.props.styleLayout.replace(' ', '')] != item.type ? item.spec['style'].layout[0] : this.props.styleLayout;
            styleLayout = this.props.styleLayout;        
            itemType = item.type;
      } else {
        styleLayout = this.props.styleLayout;
        itemType = styleNameDict[this.props.styleLayout.replace(' ', '')];
      }

       //推荐的颜色组
       const presetColorsReplace = this.state.presetColorsReplace;
       let maxNum;
       if(presetColorsReplace.length<18){
         maxNum = presetColorsReplace.length
       }else{
         maxNum =18
       }
       console.log('presetColorsReplace', presetColorsReplace)
       let suggestion = []
         for(let i=0; i < maxNum; i++){
             let rgb = '';
             rgb = 'rgb(' + presetColorsReplace[i][0] + ','+ presetColorsReplace[i][1] + ','+presetColorsReplace[i][2] +')';       
             suggestion.push(rgb);       
             
         }

         console.log('suggestion', suggestion)
         console.log('Object.values(this.props.colorPair)', Object.values(this.props.colorPair))

      let component = (
          <D3Container
            // type = {item.type}
            type={itemType} //因为inspire的时候 可能会有不同的chartType，所以这里利用style的名字反推type类型 
            // // item.dataIndex,
            // // item.category, // category
            // // item.type, //type
            //stylelayout={"piechart"}
            stylelayout={styleLayout}
            chartId={'chart'+item['i']}
            data={this.props.dataList[item.dataIndex]}
            spec={item.spec} //spec
            // categories = {Object.keys(dataCategories)}
            // colormap={this.state.colormap}
            colormap={this.props.colormap}
            colorPair={this.props.colorPair}
            size={!widgets[i]? {w:0,h:0}:{w:widgets[i].w,h:widgets[i].h}}
            // textcolor={this.props.textcolor}
            // cardcolor={this.props.cardcolor}
            textcolor={this.state.textcolor1}
            cardcolor={this.state.backgroundcolor}
            fontweight={this.state.fontweightflag}
            textfont={this.state.textfont}
            iconcolor={this.state.iconcolor}
            // option={option}
            // notMerge={true}
            // lazyUpdate={true}
            style={{width: '100%',height:'100%'}}
            colormap={this.props.colormap}
            // colorPair = {this.state.colorPair}
            categoriesreading={this.state.categoriesreading}
            // categoriesreading={categoriesreadingTest}
            icontype={this.props.icontype}
            iconPair={this.state.iconPair}

            // icontype={icontypeTest}
            seriesreading={this.state.seriesreading}
            fieldsreading={this.state.fieldsreading}
            icondict={this.state.icondict}
            AllData={this.state.AllData}
            // seriesreading={seriesreadingTest}

            changeElementColor = {this.handleColorClick.bind(this)}
           
          />
        )
     // return {component}
        return (
          <div ref='carddiv' id="mycard" className="carddiv" style={{ textAlign: 'center',borderRadius:"6px"}} key={item.i} data-grid={item} onClick={()=>this.selectChart(i, item.spec)}>
            <input autoComplete="off" type="text" id="myVal" placeholder={!this.props.widgets[i].type? "Add some text": (this.props.widgets[i].type == 'marix' ? 'unit chart' : this.props.widgets[i].type)} style={{ background:'rgba(0,0,0,0)' ,borderColor:this.state.backgroundcolor,fontSize:this.state.inputfontsize ,fontFamily:this.state.textfont, color: this.state.textcolor1,fontWeight:this.state.fontweightflag?"bold":"normal",fontStyle:this.state.textitalicflag?"italic":"normal"}}></input>
            {/* <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span> */}
           {component}
           {console.log('this.state.AllData', this.state.AllData)}
           {
             
              this.state.AllData.map((dataName, dataIndex) => {
              
                  return(
                    this.state.displayColorPicker[dataIndex]==true ?
                    <div style={ popover } className={'colorPicker_' + `${dataName}`}>
                    <div style={ cover } onClick={ this.handleColorClose.bind(this, dataName) } />
                      <SketchPicker width={150} color={ this.props.colorPair[dataName] } presetColors = {suggestion} presetColors2 = {Object.values(this.props.colorPair)} style={{marginTop:'50px', marginLeft:'-160px', width:'150px'}} onChange={this.handleColorChange.bind(this, dataName)} />
                    </div>
                  :null 
                  )
                  
      
              })
           }
           
         
          </div>
        );
      });
    };
  
    // addChart(type) {
    //   const addItem = {
    //     x: (this.state.widgets.length * 3) % (this.state.cols || 12),
    //     y: Infinity, // puts it at the bottom
    //     w: 3,
    //     h: 2,
    //     i: new Date().getTime().toString(),
    //   };
    //   this.setState(
    //     {
    //       widgets: this.state.widgets.concat({
    //         ...addItem,
    //         type,
    //       }),
    //     },
    //   );
    // };
  
    onRemoveItem(i) {
      // this.props.selectChart(-1);
      // this.props.removeChart(this.props.widgets.filter((item,index) => index !=i));
      let widgets = this.props.widgets;
      this.props.initState(widgets);
  
    }
  
    onLayoutChange = (layout, layouts) =>{
     
      //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
      let widgets = JSON.parse(JSON.stringify(this.props.widgets));
    
      widgets.forEach((item,index)=>{

          item.w = layouts.xs[index].w;
          item.h = layouts.xs[index].h;
          item.x = layouts.xs[index].x;
          item.y = layouts.xs[index].y;
      })
      
      this.props.changeMapping(widgets);

      this.saveToLS("layouts", layouts);
      this.setState({ layouts });
    }

    showelements=(e)=>{
      console.log('timeOut',timeOut,time,e);
      clearTimeout(timeOut); // 清除第一个单击事件
      console.log('s1timeOut',timeOut);
        if(!e){
          var e=window.event;
        }
        console.log('e',e);
        var selectedElement=e.target;
        console.log('elements', selectedElement);
       // var tname=targ.tagName;
        // alert(tname);
  
        //获取修改的icon href值
        // console.log("啦啦啦--:",$(selectedElement).attr("href"));
        // console.log("啦啦啦--:",selectedElement);
        //替换icon
        //$(selectedElement).attr("href","#car")
  
        // const elem = document.querySelector('.drag-svg')
      let events = (selectedElement) => {
        if(selectedElement.tagName=="use"){
          // const panzoom = Panzoom(selectedElement, {
          //   maxScale: 5
          // })
          // selectedElement.addEventListener('wheel', panzoom.zoomWithWheel)
  
          console.log('selectel', selectedElement.className.baseVal.split(' ')[1].split('-')[1])
          this.props.changeIcontype(this.props.icondict[selectedElement.className.baseVal.split(' ')[1].split('-')[1]])
          // this.props.changeIcontype(this.props.icondict[selectedElement.className.baseVal.split(' ')[1].split('-')[1]])
          console.log("selectedElement",selectedElement);
          if(selectedElement.style.fill.includes('url')){
            selectedElement.style.setProperty('fill', 'rgba(238,238,238,0.3)');
          }else{
            selectedElement.style.setProperty('fill', 'rgba(' + selectedElement.style.fill.split('(')[1].split(')')[0]+ ',0.3)');
          }
          // selectedElement.style.setProperty('opacity','0.3');
          // selectedElement.style.setProperty('border', '4px solid rgb(226,87,11)');
           selectedElement.style.setProperty('stroke', 'rgb(226,87,11)');
          // selectedElement.style.setProperty('strokeWidth', '3px');
          // selectedElement.style.setProperty('fillOpacity', '0.3');
  
          console.log('selectedElement.style',selectedElement.style);
  
          this.setState({
            selectedElementClass: selectedElement.className.baseVal.split(' ')[1].split('-')[1],
            // selectedElementClass: selectedElement.className.baseVal.split(' ')[1].split('-')[1]
          })
          //  Panzoom(selectedElement)
        }
    }
      timeOut = setTimeout(events,time,selectedElement);
      console.log('1timeOut',timeOut);
      
      
    }

    moveElements=(e)=>{
      console.log('2timeOut',timeOut);
      clearTimeout(timeOut); // 清除第二个单击事件
      console.log('s2timeOut',timeOut);
      if(!e){
        var e=window.event;
      }
      var selectedElement=e.target;
      console.log('elements', selectedElement);
     // var tname=targ.tagName;
      // alert(tname);

      //获取修改的icon href值
      // console.log("啦啦啦--:",$(selectedElement).attr("href"));
      // console.log("啦啦啦--:",selectedElement);
      //替换icon
      //$(selectedElement).attr("href","#car")

      // const elem = document.querySelector('.drag-svg')
      if(selectedElement.tagName=="use"){
        const panzoom = Panzoom(selectedElement, {
          maxScale: 5
        })
        selectedElement.addEventListener('wheel', panzoom.zoomWithWheel)
      }
      
    }

    
    onSaveas = event =>{
      document.getElementById("mycard").style.background=this.state.backgroundcolor;
      // console.log('mycard', $('#mycard svg'))
      // console.log('mycard', $('#mycard svg')[0].outerHTML)
      // html2canvas(document.querySelector('#mycard'),{useCORS:true})
      // .then(function (canvas) {
      //     //获取年月日作为文件名
      //     var timers=new Date();
      //     var fullYear=timers.getFullYear();
      //     var month=timers.getMonth()+1;
      //     var date=timers.getDate();
      //     var randoms=Math.random()+'';
      //     //年月日加上随机数
      //     var numberFileName=fullYear+''+month+date+randoms.slice(3,10);
      //     var imgData=canvas.toDataURL();
      //     //保存图片
      //     var saveFile = function(data, filename){
      //         var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      //         save_link.href = data;
      //         save_link.download = filename;

      //         var event = document.createEvent('MouseEvents');
      //         event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      //         save_link.dispatchEvent(event);
      //     };
      //     //最终文件名+文件格式
      //     var filename = numberFileName + '.png';
      //     saveFile(imgData,filename);
      //     //document.body.appendChild(canvas);  把截的图显示在网页上
      // })
      // document.getElementById("mycard").style.background="rgba(0,0,0,0)";


      //获取年月日作为文件名
      var timers=new Date();
      var fullYear=timers.getFullYear();
      var month=timers.getMonth()+1;
      var date=timers.getDate();
      var randoms=Math.random()+'';
      //年月日加上随机数
      var numberFileName=fullYear+''+month+date+randoms.slice(3,10);
      var imgData=$('#mycard svg')[0].outerHTML;
      //保存图片
      var saveFile = function(data, filename){
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          var urlObject = window.URL || window.webkitURL || window;

          var downloadData = new Blob([data]);
          save_link.href = urlObject.createObjectURL(downloadData);;
          save_link.download = filename;

          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
      };
      //最终文件名+文件格式
      var filename = 'sea'+numberFileName + '.svg';
      saveFile(imgData,filename);
     
  }


  handleChangeTextfont = (value) =>{
    this.props.changeTextfont(value);
  }


  onChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
//   shouldComponentUpdate(nexrProps) {
//     if (this.props.textfont === nexrProps.textfont) {
//         return false
//     }
//     return true;
// }

  


    render() {
      console.log('this.state.iconPair',this.state.iconPair);
      console.log('this.state.icontype', this.state)
      console.log('this.props.icontype', this.props)
     return(

      <div className='pane' style={{width: '100%',height: '100%'}}>
        <Divider>CANVAS</Divider>
        <Header className="canvasHead" style={{ height:'40px',background: "#fff",lineHeight:'34px',padding:0}}>
        {/* <Button type="primary" style={{'marginRight':'7px'}} onClick={ this.handleClick }>Pick Color</Button>
        <SketchPicker display={ this.state.displayColorPicker }  /> */}
        {/* <Button type="primary" style={{'marginRight':'7px'}} onClick={ this.handleClick }>Pick Color</Button>
        <SketchPicker color={this.state.backgroundcolor} onChange={this.handleChangeComplete}/> */}
       <div>

       {/* fill Color */}
        <SketchBackground handleChangeComplete={this.handleChangeComplete} backgroundcolor={this.state.backgroundcolor} />
      
      {/* font */}
      {/* <Select defaultValue={this.props.textfont.replace(' ', '')} style={{ width: 120 }} onChange={this.handleChangeTextfont}> */}
      <Select defaultValue='RobotoCondensed' style={{ width: 120 }} onChange={this.handleChangeTextfont}>
      <Option value="RobotoCondensed">Roboto Condensed</Option>
        <Option value="KirangHaerang">Kirang Haerang</Option>
        <Option value="BarlowCondensed">Barlow Condensed</Option>
        <Option value="ReemKufi">Reem Kufi</Option>
        <Option value="Lora">Lora</Option>
        <Option value="Roboto">Roboto</Option>
        <Option value="PalanquinDark">Palanquin Dark</Option>
      </Select>

      {/* <TextSize/> */}
      <div className="canvasColor">
          <Icon className={this.state.currentIndex===5?"iconactive":'icondisplay'} type="font-size" style={{transform: 'scale(1.5)' ,padding: '10px'}}  onClick={this.showslider}/>
          <div id="showslider" style={{display:"none"}}>
          <Slider className="slidertextsize"
          disable={false}
           min={14}
            max={40}
            onChange={this.onChange}
            value={this.state.inputfontsize } style={{ width: "200px", position: "absolute",  zIndex: "1000", marginTop: 22+this.state.inputfontsize ,marginLeft: "55px"}}/>
          </div>
      </div>

      {/* font color */}
      <SketchTextColor handleChangeComplete1={this.handleChangeComplete1} textcolor1={this.state.textcolor1}/>
        
        {/* <TextBold handleChangeCompleteTextBold={this.handleChangeCompleteTextBold}/> */}
        <div className="canvasColor">
       <Icon className={this.state.currentIndex===3&&this.state.fontweightflag?"iconactive":'icondisplay'}  type="bold"style={{transform: 'scale(1.5)' ,padding: '10px'}} onClick={this.handleChangeCompleteTextBold} />
      </div>

        {/* <TextItalic handleChangeCompleteTextItalic={this.handleChangeCompleteTextItalic}/> */}
        <div className="canvasColor">
       <Icon className={this.state.currentIndex===4&&this.state.textitalicflag?"iconactive":'icondisplay'} type="italic"style={{transform: 'scale(1.5)' ,padding: '10px'}} onClick={this.handleChangeCompleteTextItalic} />
        </div>
        
        
      
        {/* <IconSelect/> */}
        <div className="canvasColor">
        {/* <Icon type="smile" style={{transform: 'scale(1.5)' ,padding: '10px'}} onClick={()=>this.showIcons('plane')}/> */}
        <Icon className={this.state.currentIndex===6?"iconactive":'icondisplay'} type="smile" style={{transform: 'scale(1.5)' ,padding: '10px'}} onClick={()=>this.showIcons(this.props.icondict)}/>    
        </div>

      {/* <SvgSave /> */}
      <div className="canvasColor">
         <Divider   style={{height:"2em"}}  type="vertical"/>
     <Icon className={this.state.currentIndex===7?"iconactive":'icondisplay'} type="save" style={{transform: 'scale(1.5)' ,padding: '10px'}} onClick={this.onSaveas}/>
      </div>

      {/* delete */}
      <div className="canvasColor">
       {/* <Divider   style={{height:"2em"}}  type="vertical"/> */}
       <Icon className={this.state.currentIndex===8?"iconactive":'icondisplay'} type="delete" style={{transform: 'scale(1.5)' ,padding: '10px'}} onClick={this.onRemoveItem.bind(this, 0)}/>
      </div>

      <div className="canvasColor">
        <Upload>
          <Button style={{marginLeft:'174px',marginTop:'0px',position:'absolute',zIndex: '9999',width: '77px'}} icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>

        </div>
        </Header>
        
        <Layout>
         
          <Content>
          <div id="layoutStage" style={{ background: "#fff", padding: 6 }} onMouseDown={this.showelements} onDoubleClick={this.moveElements}> 
            {/* <canvas width="710px" height="610px" id="c" style={{ border:'1px solid #968176',borderRadius: '5px'}}> </canvas> */}
            {/* {this.generateDOM()} */}
              <ResponsiveReactGridLayout
                style={{width:'684px',height:'708px',marginTop: '20px', background:this.state.backgroundcolor, border:'1px solid #968176',borderRadius: '5px'}}
                className="layout"
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                layouts={this.state.layouts}
                onLayoutChange={(layout, layouts) =>
                  this.onLayoutChange(layout, layouts)
                }
                isDraggable={false}
                isResizable={false}
              >
                {this.generateDOM()}
                
              </ResponsiveReactGridLayout>
              
            </div>
          </Content>


          <Sider width={85}  className="iconSider" style={{overflow:"hidden"}}>
              <div className="myIcons" style={{overflowX:'hidden',overflowY:'auto'}}>
              
              <div id="styleicons" style={{display:"none"}}>  
              {this.getJsonFiles(this.props.icontype)}
              </div>
              <div id="showmore"  style={{display:"none"}}>
              <span className={"iconfont2"} onClick={this.onShowMore.bind(this, 0)}>&#xe771;</span>
              {/* <Button type="primary" block style={{  marginTop: '3px', marginLeft:'20px',backgroundColor:'#fff', fontSize:'15px', width:'30px', height:'30px',color:'#968176',borderRadius:'15px'}} type="primary" onClick={this.onShowMore.bind(this, 0)}>＋</Button> */}
              </div>
              </div>
        </Sider>

        </Layout>
      </div>
     )}
  }

  // display:'none',