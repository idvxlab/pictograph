import React, { Component, } from 'react';
import {  Table, Collapse, Row, Col, Button, Input, Tooltip, Radio, List, Layout } from 'antd';
import { SketchPicker, GithubPicker,BlockPicker, CompactPicker } from 'react-color';
import '../toolpane.css';
import {AccountBookOutlined,
    WifiOutlined,
    ReadOutlined,
    ControlOutlined,
    VideoCameraOutlined,
    ConsoleSqlOutlined,
    ShopOutlined,
    HeartOutlined,
    NotificationOutlined,
    DollarOutlined,
    BulbOutlined,
    BulbFilled,
    CloseCircleFilled
    } from '@ant-design/icons/lib/icons';
import { displaySpec } from '../../../selectors/vis';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import _ from 'lodash';
import colorStyle_light from '@/colorStyle_light.js'
import colorStyle_dark from '@/colorStyle_dark.js'
import Column from 'antd/lib/table/Column';

const { Sider, Content, Footer } = Layout;
// const { Column, ColumnGroup } = Table;

const defaultHighlightColor = 'rgb(129,216,247)';

// const defaultColorStyle_light = colorStyle_light;
// const defaultColorStyle_dark = colorStyle_dark;
const defaultColorStyle = colorStyle_light;

// const defaultColorStyle = [
//     {
//         industryName: "business",
//         colorset : [["rgb(74,137,160)", "rgb(4,37,74)", "rgb(196,218,219)", "rgb(254,193,78)", "rgb(255,214,137)", "rgb(247,150,38)", "rgb(218,107,114)", "rgb(228,214,167)", "rgb(136,119,14)"],
//         ["rgb(69,124,150)", "rgb(43,43,50)", "rgb(146,164,157)", "rgb(31,186,179)", "rgb(223,158,164)", "rgb(215,220,162)", "rgb(218,193,158)", "rgb(245,250,162)", "rgb(160,152,183)"]]
//     },
//     {
//         industryName: "technology",
//         colorset : [["rgb(70,105,217)", "rgb(100,141,213)", "rgb(170,203,235)", "rgb(69,165,206)", "rgb(244,184,207)", "rgb(80,80,80)", "rgb(136,96,176)", "rgb(30,54,203)", "rgb(167,159,207)"],
//         ["rgb(248,211,204)", "rgb(227,237,241)", "rgb(237,162,154)", "rgb(234,119,111)", "rgb(99,76,119)", "rgb(111,190,204)", "rgb(188,126,148)", "rgb(81,49,121)", "rgb(116,50,110)"]]
//     },
//     {
//         industryName: "education",
//         colorset : [["rgb(65,70,133)", "rgb(252,199,132)", "rgb(221,236,145)", "rgb(23,132,158)", "rgb(255,144,151)", "rgb(243,192,180)", "rgb(151,133,182)", "rgb(255,55,68)", "rgb(149,225,231)"],
//         ["rgb(248,25,171)", "rgb(160,7,247)", "rgb(160,7,247)", "rgb(254,193,78)", "rgb(243,179,245)", "rgb(212,249,221)", "rgb(236,213,242)", "rgb(175,120,209)", "rgb(150,48,213)"]]
//     },
//     {
//         industryName: "manufacturing",
//         colorset : [["rgb(129,173,241)", "rgb(188,202,240)", "rgb(77,90,150)", "rgb(209,205,208)", "rgb(100,145,240)", "rgb(244,162,78)", "rgb(216,156,69)", "rgb(197,175,140)", "rgb(247,199,108)"],
//         ["rgb(130,123,209)", "rgb(229,94,69)", "rgb(199,215,241)", "rgb(267,172,232)", "rgb(244,194,180)", "rgb(247,181,91)", "rgb(164,91,105)", "rgb(149,99,141)", "rgb(231,198,142)"]]
//     },
//     {
//         industryName: "media",
//         colorset : [["rgb(248,25,171)", "rgb(160,7,247)", "rgb(160,7,247)", "rgb(254,193,78)", "rgb(243,179,245)", "rgb(212,249,221)", "rgb(236,213,242)", "rgb(175,120,209)", "rgb(150,48,213)"],
//         ["rgb(246,208,105)", "rgb(123,142,85)", "rgb(190,168,171)", "rgb(97,60,71)", "rgb(220,223,167)", "rgb(239,142,105)", "rgb(230,136,132)", "rgb(221,152,172)", "rgb(142,209,219)"]]
//     },
//     {
//         industryName: "IT",
//         colorset : [["rgb(221,228,236)", "rgb(96,160,226)", "rgb(159,200,236)", "rgb(246,158,171)", "rgb(6,0,40)", "rgb(8,9,70)", "rgb(93,197,191)", "rgb(91,65,83)", "rgb(57,84,125)"],
//         ["rgb(114,139,146)", "rgb(101,197,191)", "rgb(59,64,84)", "rgb(247,82,77)", "rgb(251,157,50)", "rgb(203,199,164)", "rgb(171,69,68)", "rgb(235,187,134)"]]
//     },
//     {
//         industryName: "retail",
//         colorset : [["rgb(207,219,233)", "rgb(69,128,206)", "rgb(3381,190)", "rgb(147,204,167)", "rgb(235,89,101)", "rgb(246,150,46)", "rgb(216,124,137)", "rgb(237,173,113)"],
//         ["rgb(5,178,253)", "rgb(6,147,247)", "rgb(186,229,238)", "rgb(83,172,219)", "rgb(52,215,243)", "rgb(21,102,175)", "rgb(30,63,100)", "rgb(93,99,118)", "rgb(245,81,164)"]]
//     },
//     {
//         industryName: "healthcare",
//         colorset : [["rgb(231,232,246)", "rgb(93,81,184)", "rgb(189,188,224)", "rgb(143,140,191)", "rgb(235,196,202)", "rgb(149,143,221)", "rgb(212,135,145)", "rgb(223,118,132)", "rgb(250,93,96)"],
//         ["rgb(119,229,227)", "rgb(41,184,153)", "rgb(149,200,85)", "rgb(240,206,138)", "rgb(235,127,97)", "rgb(9,129,195)", "rgb(74,83,88)", "rgb(211,173,152)", "rgb(249,201,173)"]]
//     },
//     {
//         industryName: "marketing",
//         colorset : [["rgb(79,72,186)", "rgb(152,152,201)", "rgb(223,218,179)", "rgb(245,233,141)", "rgb(246,135,162)", "rgb(237,178,188)", "rgb(248,225,80)", "rgb(191,95,158)"],
//         ["rgb(249,189,36)", "rgb(67,99,238)", "rgb(247,219,130)", "rgb(91,130,218)", "rgb(242,116,57)", "rgb(227,151,100)", "rgb(207,159,176)", "rgb(167,181,224)"]]
//     },
//     {
//         industryName: "financial",
//         colorset : [["rgb(227,232,250)", "rgb(62,75,232)", "rgb(248,163,37)", "rgb(36,13,129)", "rgb(250,119,7)", "rgb(110,29,216)", "rgb(237,199,133)", "rgb(244,180,202)", "rgb(245,224,199)"],
//         ["rgb(40,56,68)", "rgb(127,187,57)", "rgb(81,114,32)", "rgb(190,208,164)", "rgb(167,208,200)", "rgb(151,155,160)", "rgb(229,127,93)", "rgb(216,159,137)", "rgb(178,212,132)"]]
//     }
// ]



//二维数组初始化
const defaultDisplayStylePicker = new Array();
for(let i = 0; i < defaultColorStyle[0].colorset.length; i++){
    let temp = new Array();
    //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    for(let j = 0; j <= defaultColorStyle[0].colorset[i].length; j++){
        temp[j] = false;
    }
    defaultDisplayStylePicker[i] = temp;
}

// const defaultDisplayStylePicker_dark = new Array();
// for(let i = 0; i < defaultColorStyle_dark[0].colorset.length; i++){
//     let temp = new Array();
//     //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
//     for(let j = 0; j <= defaultColorStyle_dark[0].colorset[i].length; j++){
//         temp[j] = false;
//     }
//     defaultDisplayStylePicker_dark[i] = temp;
// }

// const defaultDisplayStylePicker = defaultDisplayStylePicker_dark;

const defaultCurrentColorset = defaultColorStyle[0].colorset[0];

const popover = {
    position: 'absolute',
    //position: 'relative',
    zIndex: '9999',
    top: '-250px',
    right: '0px',
    bottom: '0px',
    left: '-50px',
}

const cover = {
    position: 'fixed',
    zIndex: '9999',
    //position:
    top: '-100px',
    right: '0px',
    bottom: '0px',
    left: '0px',
}


export default class SceneTool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            color : this.props.currentScene.backgroundColor(), //default

            //背景色
            value: 1,
            displayColorPicker1: false,
            displayColorPicker2: false,
            BGcolor1: this.props.currentScene.backgroundColor(),
            BGcolor2: '#090B20',


            //全局色盘库
            // colorStyle_light: defaultColorStyle_dark,
            // colorStyle_dark: defaultColorStyle_light,
            colorStyle: defaultColorStyle,

            //定位行业及行业色盘库
            industryLast: '',
            highlightColor: defaultHighlightColor,
            industryType: 'business',
            industryIndex: 0,
            spec: '',

            //更改色盘库
            // displayStylePicker_light: defaultDisplayStylePicker_light,
            // displayStylePicker_dark: defaultDisplayStylePicker_dark,
            displayStylePicker: defaultDisplayStylePicker,
            unAddColor: '',

            //定位当前颜色主题
            colorsetIndex: 0,
            currentColorset: defaultCurrentColorset, 
            
            //记录后端传递的推荐色盘
            presetColorsAdd: '',
            presetColorsReplace: '',

            //表格排序
            sortedInfo: {
                order: 'descend',
                columnKey: 'grade'
            }
            
        };
        this.handleChartOk = this.handleChartOk.bind(this); 


    }

    //
    handleColorClick1 () {
        let {displayColorPicker1} =this.state;
        displayColorPicker1 = displayColorPicker1==="none"?"block":"none";
        this.setState({displayColorPicker1})
        if(displayColorPicker1){
            //this.props.updateColor(key,color)
        }
        this.setState({ displayColorPicker1: !this.state.displayColorPicker1 })

    };

    //通过index.js调用updateScene方法, 并引起系统响应
    handleColorChange1 = (value)=>{
        let color = value.hex;
        
        // console.log('color',color)
        // if(this.state.value == 1){
        //     let bgimage = "";
        //     this.setState({bgimage,color})
        //     //新建scene, 并将其用于updateScene更新
        //     let newScene = Object.assign({},this.props.currentScene);
        //     newScene.backgroundImage("");
        //     newScene.backgroundColor(color);
        //     this.props.updateScene(this.props.sceneIndex, newScene); 
        // }

        //全局色盘库
        let colorStyle = this.state.colorStyle;
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.state.colorsetIndex;

        //现在的色盘
        let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

        //更新所有element
        // Update chart on canvas
        let newScene = Object.assign({}, this.props.currentScene);

        if(this.state.value == 1){
            let bgimage = "";
            // this.setState({bgimage,color})
            // //新建scene, 并将其用于updateScene更新
            // const newScene = Object.assign({},this.props.currentScene);
            newScene.backgroundImage("");
            newScene.backgroundColor(color);
            this.props.updateScene(this.props.sceneIndex, newScene); 
        }
        
        //对该场景下每个element都进行更新
        for(const element in this.props.currentScene.elements()){
         
            let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
            
            // const newEle = _.cloneDeep(this.props.currentScene.elements()[element]);
            if(element>0) {
                const newEle2 = this.props.currentScene.elements()[element]
            
                this.editElement(newEle, element);
    
                // console.log('newEle----------', newEle._info)
                
                //先将场景目标聚焦于该element
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
    
                // const newScene = _.cloneDeep(this.props.currentScene);
                // const newElement = _.cloneDeep(element);
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
                // const elementName = this.props.sceneIndex + '-' + element;
                // this.props.updateElement(newEle, element, elementName);
    
                // update info dataIndex
                newEle.info().dataIndex = newEle2.info().dataIndex;     
                newEle.info().spec = _.cloneDeep(newEle2.info().spec);
                // newEle.info().spec = newEle2.info().spec;
              
                // this.setState({
                //     spec: newEle2.info().spec
                // })
                
                if(this.state.value == 1){
                    newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": color};
                }else{
                    newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
                }
                // newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
                newEle.info().src = null; //没有动画

                // newScene.backgroundImage("");
                // newScene.backgroundColor(color);
    
                newScene.updateElement(newEle, element);
                this.props.updateScene(this.props.sceneIndex, newScene);
    
                //更新globalColorStyle
                this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});
                             
            }
        }
        
        this.setState({
            BGcolor1: color
        })
        // if(this.state.value==1)
        
    }
  
    handleColorClose1 = () => {
        this.setState({ displayColorPicker1: false })
    };

    //调出colorpicker
    handleColorClick2 () {
        let {displayColorPicker2} =this.state;
        displayColorPicker2 = displayColorPicker2==="none"?"block":"none";
        this.setState({displayColorPicker2})
        if(displayColorPicker2){
            //this.props.updateColor(key,color)
        }
        this.setState({ displayColorPicker2: !this.state.displayColorPicker2 })

    };

    //通过index.js调用updateScene方法, 并引起系统响应
    handleColorChange2 = (value)=>{
        let color = value.hex;
        

         //全局色盘库
         let colorStyle = this.state.colorStyle;
         let industryIndex = this.state.industryIndex;
         let colorsetIndex = this.state.colorsetIndex;
 
         //现在的色盘
         let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];
 
         //更新所有element
         // Update chart on canvas
         let newScene = Object.assign({}, this.props.currentScene);
         if(this.state.value == 2){
            let bgimage = "";
            // this.setState({bgimage,color})
            // //新建scene, 并将其用于updateScene更新
            // const newScene = Object.assign({},this.props.currentScene);
            newScene.backgroundImage("");
            newScene.backgroundColor(color);
            this.props.updateScene(this.props.sceneIndex, newScene); 
        }
      
         
         //对该场景下每个element都进行更新
         for(const element in this.props.currentScene.elements()){
          
             let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
             if(this.state.value == 2){
                let bgimage = "";
                // this.setState({bgimage,color})
                // //新建scene, 并将其用于updateScene更新
                // const newScene = Object.assign({},this.props.currentScene);
                newScene.backgroundImage("");
                newScene.backgroundColor(color);
                this.props.updateScene(this.props.sceneIndex, newScene); 
            }
            if(element>0) {
                const newEle2 = this.props.currentScene.elements()[element]
            
                this.editElement(newEle, element);
    
                // console.log('newEle----------', newEle._info)
                
                //先将场景目标聚焦于该element
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
    
                // const newScene = _.cloneDeep(this.props.currentScene);
                // const newElement = _.cloneDeep(element);
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
                // const elementName = this.props.sceneIndex + '-' + element;
                // this.props.updateElement(newEle, element, elementName);
    
                // update info dataIndex
                newEle.info().dataIndex = newEle2.info().dataIndex;     
                newEle.info().spec = _.cloneDeep(newEle2.info().spec);
                // newEle.info().spec = newEle2.info().spec;
              
                // this.setState({
                //     spec: newEle2.info().spec
                // })
                
                if(this.state.value == 2){
                    newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": color};
                }else{
                    newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
                }
                
                newEle.info().src = null; //没有动画

                // newScene.backgroundImage("");
                // newScene.backgroundColor(color);
    
                newScene.updateElement(newEle, element);
                this.props.updateScene(this.props.sceneIndex, newScene);
    
                //更新globalColorStyle
                this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});
                             
            }
         }
        this.setState({
            BGcolor2: color
        })
        
    }
  
    handleColorClose2 = () => {
        this.setState({ displayColorPicker2: false })
    };


    onChangeBackgroundMode = e => {
        console.log('e.target.value',e.target.value)
        console.log('this.state.value',this.state.value)
        let color = e.target.value == 1 ? this.state.BGcolor1:this.state.BGcolor2;

        let bgimage = "";
        this.setState({bgimage,color})
        //新建scene, 并将其用于updateScene更新
        // const newScene = Object.assign({},this.props.currentScene);
     
        // this.props.updateScene(this.props.sceneIndex, newScene); 

         //全局色盘库
         let colorStyle = this.state.industryIndex;
         let industryIndex = this.state.industryIndex;
         let colorsetIndex = this.state.colorsetIndex;
         let displayStylePicker = this.state.displayStylePicker;
         
        
         if(e.target.value != this.state.value){
            colorStyle = e.target.value == 1? colorStyle_light:colorStyle_dark;
            colorsetIndex = 0;
            console.log('colorStyle',colorStyle)
      
            displayStylePicker = new Array();
            for(let i = 0; i < colorStyle[0].colorset.length; i++){
                let temp = new Array();
                //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
                for(let j = 0; j <= colorStyle[0].colorset[i].length; j++){
                    temp[j] = false;
                }
                displayStylePicker[i] = temp;
            }
            console.log('displaypicker',displayStylePicker)


         }
         
        
 
         //现在的色盘
         let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];
 
       
                
         //更新所有element
         // Update chart on canvas
         const newScene = Object.assign({}, this.props.currentScene);
        //  if(this.state.value == 1){
            // let bgimage = "";
            // this.setState({bgimage,color})
            // //新建scene, 并将其用于updateScene更新
            // const newScene = Object.assign({},this.props.currentScene);
            newScene.backgroundImage("");
            newScene.backgroundColor(color);
            this.props.updateScene(this.props.sceneIndex, newScene); 
        // }
         
         
         //对该场景下每个element都进行更新
         for(const element in this.props.currentScene.elements()){
            let newEle = Object.assign({}, this.props.currentScene.elements()[element]);

            if(element>0) {
                const newEle2 = this.props.currentScene.elements()[element]
            
                this.editElement(newEle, element);
    
                // console.log('newEle----------', newEle._info)
                
                //先将场景目标聚焦于该element
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
    
                // const newScene = _.cloneDeep(this.props.currentScene);
                // const newElement = _.cloneDeep(element);
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
                // const elementName = this.props.sceneIndex + '-' + element;
                // this.props.updateElement(newEle, element, elementName);
    
                // update info dataIndex
                newEle.info().dataIndex = newEle2.info().dataIndex;     
                newEle.info().spec = _.cloneDeep(newEle2.info().spec);
                // newEle.info().spec = newEle2.info().spec;
              
                // this.setState({
                //     spec: newEle2.info().spec
                // })
                
                
                newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": color};
                newEle.info().src = null; //没有动画

                newScene.backgroundImage("");
                newScene.backgroundColor(color);
    
                newScene.updateElement(newEle, element);
                this.props.updateScene(this.props.sceneIndex, newScene);
    
                //更新globalColorStyle
                this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": color});
                             
            }
            
        }
          
            
        this.setState({
            colorStyle:colorStyle,
            colorsetIndex: colorsetIndex,
            value: e.target.value,
            currentColorset: currentColorset,
            displayStylePicker: displayStylePicker,
        });
    };

    editElement(eleIndex, element) {
        // this.props.displayAssistLines(false);
        const newScene = _.cloneDeep(this.props.currentScene);
        const newElement = _.cloneDeep(element);
        newScene.updateElement(element, eleIndex);
        this.props.updateScene(this.props.sceneIndex, newScene);
        const elementName = this.props.sceneIndex + '-' + eleIndex;
        this.props.updateElement(newElement, eleIndex, elementName);
    }

    //根据行业切换色盘库
    setColorStyle = (industry, e) =>{
        e.preventDefault()

        //行业icon高亮
        if(this.state.industryLast!==''){
            this.state.industryLast.style.fill = "currentColor";
        }
        e.target.style.fill = this.state.highlightColor;

        //copy现在的colorStyle字典
        let colorStyle = this.state.colorStyle;

        //更新colorStyle字典index
        let index = 0;
        switch(industry){
            case 'business':
                index = 0
                break
            case 'technology':
                index = 1
                break
            case 'education':
                index = 2
                break
            case 'manufacturing':
                index = 3
                break
            case 'media':
                index = 4
                break
            case 'IT':
                index = 5
                break
            case 'retail':
                index = 6
                break
            case 'healthcare':
                index = 7
                break
            case 'marketing':
                index = 8
                break
            case 'financial':
                index = 9
                break
            default:
                index = 0
        }

        //初始化colorsetIndex
        let colorsetIndex = 0;

        //初始化currentColorset
        let currentColorset = colorStyle[index].colorset[0];

        //初始化displayStylePicker
        let displayStylePicker = new Array();
        for(let i = 0; i < colorStyle[index].colorset.length; i++){
            let temp = new Array();
            //注意j<=, 因为要多留一位给添加颜色的colorpicker
            for(let j = 0; j <= colorStyle[index].colorset[i].length; j++){
                temp[j] = false;
            }
            displayStylePicker[i] = temp;
        }
    

        // Update chart on canvas
        // const newScene = Object.assign({}, this.props.currentScene);
        const newScene = _.cloneDeep(this.props.currentScene);
        
        //对该场景下每个element都进行更新
        for(const element in this.props.currentScene.elements()){

            // let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
            const newEle = _.cloneDeep(this.props.currentScene.elements()[element]);
            if(element>0){
                const newEle2 = this.props.currentScene.elements()[element]
            
                this.editElement(newEle, element);
    
                // console.log('newEle----------', newEle._info)
                
                //先将场景目标聚焦于该element
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
    
                // const newScene = _.cloneDeep(this.props.currentScene);
                // const newElement = _.cloneDeep(element);
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
                // const elementName = this.props.sceneIndex + '-' + element;
                // this.props.updateElement(newEle, element, elementName);
    
                // update info dataIndex
                newEle.info().dataIndex = newEle2.info().dataIndex;     
                newEle.info().spec = _.cloneDeep(newEle2.info().spec);
                // newEle.info().spec = newEle2.info().spec;
              
                // this.setState({
                //     spec: newEle2.info().spec
                // })
                
                
                newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
                newEle.info().src = null; //没有动画
    
                newScene.updateElement(newEle, element);
                this.props.updateScene(this.props.sceneIndex, newScene);
    
                //更新globalColorStyle
                this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});
                             
            }
        }
           
       
        this.setState({
            industryType: industry,
            industryLast: e.target,
            industryIndex: index,
            colorsetIndex: colorsetIndex,
            currentColorset: currentColorset,
            displayStylePicker: displayStylePicker,
        })
    }

    //选择色块，调出该色块的colorpicker
    handleStyleClick = (index, index2) =>{
        let colorStyle = this.state.colorStyle;
        let industryIndex = this.state.industryIndex;
        let colorsetData = [...colorStyle[industryIndex].colorset[index]];
        colorsetData.splice(index2, 1)
        console.log('colorsetData1', colorsetData)
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

        var data = []
        // setTimeout(()=> console.log('成功',data))

        HttpUtil.post(ApiUtil.API_COLOR_SUGESSTION, colorsetData)
            .then(re=>{
                data = re.data
                this.setState({
                    presetColorsReplace: data,
                });
                
            })
            .catch(error=>{
                console.log(error.message);
            });

        let displayStylePicker = this.state.displayStylePicker;
        displayStylePicker[index][index2] = !displayStylePicker[index][index2];
        this.setState({
            displayStylePicker: displayStylePicker,
        });
    }

    //对色盘中某个值进行修改
    handleStyleChange = (index, index2, value) => {

        //更新全局色盘库
        let colorStyle = this.state.colorStyle;
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.state.colorsetIndex;

        colorStyle[industryIndex].colorset[index][index2] = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';

        //更新现在的色盘
        let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

        //更新所有element
        // Update chart on canvas
        const newScene = Object.assign({}, this.props.currentScene);
        
        //对该场景下每个element都进行更新
        for(const element in this.props.currentScene.elements()){
         
            let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
            
            //先将场景目标聚焦于该element
            newScene.updateElement(newEle, element);
            this.props.updateScene(this.props.sceneIndex, newScene);

            // update info dataIndex
            newEle.info().dataIndex = this.props.currentData.dataIndex;
            console.log('tool-dataindex', this.props.currentData.dataIndex)
            newEle.info().spec = this.props.displaySpec;
            console.log('tool-props', this.props)
            newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
            newEle.info().src = null; //没有动画

            newScene.updateElement(newEle, element);
            this.props.updateScene(this.props.sceneIndex, newScene);

            //更新globalColorStyle
            this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});
        }


        this.setState({
            colorStyle: colorStyle,
            currentColorset: currentColorset,
        });
    }

    //对色盘中某个值进行删除
    handleStyleDelete = (index, index2)=>{
        //更新全局色盘库
        let colorStyle = this.state.colorStyle;
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.state.colorsetIndex;
        let displayStylePicker = this.state.displayStylePicker;

        //删除全局色盘库中的某个值
        colorStyle[industryIndex].colorset[index].splice(index2, 1);
        //删除displayStylePicker中的某个值
        displayStylePicker[index].splice(index2, 1);


        //下面的操作与stylechange中一致
        //更新现在的色盘
        let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

        //更新所有element
        // Update chart on canvas
        const newScene = Object.assign({}, this.props.currentScene);
        
        //对该场景下每个element都进行更新
        for(const element in this.props.currentScene.elements()){
         
            let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
            
            //先将场景目标聚焦于该element
            newScene.updateElement(newEle, element);
            this.props.updateScene(this.props.sceneIndex, newScene);

            // update info dataIndex
            newEle.info().dataIndex = this.props.currentData.dataIndex;
            console.log('tool-dataindex', this.props.currentData.dataIndex)
            newEle.info().spec = this.props.displaySpec;
            console.log('tool-props', this.props)
            newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
            newEle.info().src = null; //没有动画

            newScene.updateElement(newEle, element);
            this.props.updateScene(this.props.sceneIndex, newScene);

            //更新globalColorStyle
            this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});
        }


        this.setState({
            colorStyle: colorStyle,
            currentColorset: currentColorset,
        });



    }

    //调出添加颜色的colorpicker/关闭添加颜色的colorpicker+更新添加后的颜色
    handleStyleAddClick = (index) =>{
        let colorStyle = this.state.colorStyle;
        let industryIndex = this.state.industryIndex;
        let colorsetData = [...colorStyle[industryIndex].colorset[index]];
        console.log('colorsetData2', colorsetData)
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

        var data = []
        // setTimeout(()=> console.log('成功',data))

        HttpUtil.post(ApiUtil.API_COLOR_SUGESSTION, colorsetData)
            .then(re=>{
                data = re.data
                this.setState({
                    presetColorsAdd: data,
                });
                
            })
            .catch(error=>{
                console.log(error.message);
            });

        

        let displayStylePicker = this.state.displayStylePicker;
      
        displayStylePicker[index][-1] = !displayStylePicker[index][-1];
        
        

        
        
        
        this.setState({
            displayStylePicker: displayStylePicker,
        });

    }

    //更换unAddColor
    handleStyleAddChange = (value) =>{
        let unAddColor = this.state.unAddColor;
        unAddColor = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';
        this.setState({
            unAddColor: unAddColor,
        })
    }


    //关闭colorpicker
    handleStyleClose = (index, index2) =>{
        let displayStylePicker = this.state.displayStylePicker;
        displayStylePicker[index][index2] = false;
        this.setState({
            displayStylePicker: displayStylePicker,
        });
    }

    handleStyleAddClose = (index) =>{
        let displayStylePicker = this.state.displayStylePicker;
        displayStylePicker[index][-1] = false;


        //更新全局色盘库
        let colorStyle = this.state.colorStyle;
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.state.colorsetIndex;
        let unAddColor = this.state.unAddColor;

        //更新现在的色盘
        let currentColorset = this.state.currentColorset;
            
        //增加全局色盘库中的某个值
        colorStyle[industryIndex].colorset[index].push(unAddColor);

        //下面的操作与stylechange中一致

        currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

        //更新所有element
        // Update chart on canvas
        const newScene = Object.assign({}, this.props.currentScene);
        
        //对该场景下每个element都进行更新
        for(const element in this.props.currentScene.elements()){
        
            let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
            
            //先将场景目标聚焦于该element
            newScene.updateElement(newEle, element);
            this.props.updateScene(this.props.sceneIndex, newScene);

            // update info dataIndex
            newEle.info().dataIndex = this.props.currentData.dataIndex;
            console.log('tool-dataindex', this.props.currentData.dataIndex)
            newEle.info().spec = this.props.displaySpec;
            console.log('tool-props', this.props)
            newEle.info().spec.style = {"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()};
            newEle.info().src = null; //没有动画

            newScene.updateElement(newEle, element);
            this.props.updateScene(this.props.sceneIndex, newScene);

            //更新globalColorStyle
            this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});
        }
        displayStylePicker[index][-1] = false;

        //增加一位false
        displayStylePicker.push(false);
        
        this.setState({
            displayStylePicker: displayStylePicker,
            colorStyle: colorStyle,
            currentColorset: currentColorset,
        })
    }


    //更新所有element颜色
    handleChartOk = (e) => {
    // handleChartOk = (selectedRowKeys) => {
        // console.log('selectedRows',selectedRowKeys)
        let colorStyle = this.state.colorStyle;
        let colorsets =  colorStyle[this.state.industryIndex].colorset;     

        // Update chart on canvas
        const newScene = Object.assign({}, this.props.currentScene);
        
        //对该场景下每个element都进行更新
        for(const element in this.props.currentScene.elements()){
         
            // let newEle = Object.assign({}, this.props.currentScene.elements()[element]);
            
            // //先将场景目标聚焦于该element
            // newScene.updateElement(newEle, element);
            // this.props.updateScene(this.props.sceneIndex, newScene);

            // // update info dataIndex
            // newEle.info().dataIndex = this.props.currentData.dataIndex;
            // // console.log('tool-dataindex', this.props.currentData.dataIndex)
            // newEle.info().spec = this.props.displaySpec;
            // // console.log('tool-props', this.props)
            // newEle.info().spec.style = {"colorset": colorsets[selectedRowKeys], "backgroundColor": this.props.currentScene.backgroundColor()};
            // newEle.info().src = null; //没有动画

            // newScene.updateElement(newEle, element);
            // this.props.updateScene(this.props.sceneIndex, newScene);

            // //更新globalColorStyle
            // this.props.updateGlobalColorStyle({"colorset": colorsets[selectedRowKeys], "backgroundColor": this.props.currentScene.backgroundColor()});
            const newEle = _.cloneDeep(this.props.currentScene.elements()[element]);
            if(element>0){
                const newEle2 = this.props.currentScene.elements()[element]
            
                this.editElement(newEle, element);
    
                // console.log('newEle----------', newEle._info)
                
                //先将场景目标聚焦于该element
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
    
                // const newScene = _.cloneDeep(this.props.currentScene);
                // const newElement = _.cloneDeep(element);
                // newScene.updateElement(newEle, element);
                // this.props.updateScene(this.props.sceneIndex, newScene);
                // const elementName = this.props.sceneIndex + '-' + element;
                // this.props.updateElement(newEle, element, elementName);
    
                // update info dataIndex
                newEle.info().dataIndex = newEle2.info().dataIndex;     
                newEle.info().spec = _.cloneDeep(newEle2.info().spec);
                // newEle.info().spec = newEle2.info().spec;
              
                // this.setState({
                //     spec: newEle2.info().spec
                // })
                
                
                // newEle.info().spec.style = {"colorset": colorsets[selectedRowKeys], "backgroundColor": this.props.currentScene.backgroundColor()};
                newEle.info().spec.style = {"colorset": colorsets[e.target.value], "backgroundColor": this.props.currentScene.backgroundColor()};
                newEle.info().src = null; //没有动画
    
                newScene.updateElement(newEle, element);
                this.props.updateScene(this.props.sceneIndex, newScene);
    
                //更新globalColorStyle
                // this.props.updateGlobalColorStyle({"colorset": colorsets[selectedRowKeys], "backgroundColor": this.props.currentScene.backgroundColor()});
                this.props.updateGlobalColorStyle({"colorset": colorsets[e.target.value], "backgroundColor": this.props.currentScene.backgroundColor()});            
            }            
        }

           
            this.setState({
                colorsetIndex: e.target.value,
                currentColorset: colorsets[e.target.value],
            });
        // }

    }

    //色盘分数排序
    handleTableChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
          sortedInfo: sorter,
        });
      };
    
    
    
    
      

    

    render() {

        const colorStyle = this.state.colorStyle;
        const industryIndex = this.state.industryIndex;
        const colorsets = colorStyle[industryIndex].colorset;
        console.log('display',this.state.displayStylePicker)
        const currentColorset = this.state.currentColorset;
        const presetColorsAdd = this.state.presetColorsAdd;
        const presetColorsReplace = this.state.presetColorsReplace;
        const grades = colorStyle[industryIndex].grade;
        const sortedInfo = this.state.sortedInfo ;
        // sortedInfo = sortedInfo || {};

        const colorStyleTable = []
        for(let i=0; i < colorsets.length; i++){
            let grade;
            let colorsetData = colorsets[i].concat()
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
            HttpUtil.post(ApiUtil.API_COLOR_JUDGE, colorsetData)
                .then(re=>{
                    grade = re.data
                    console.log('grade',grade)
                    
                })
                .catch(error=>{
                    console.log(error.message);
                });
            colorStyleTable.push({"colorset": colorsets[i], "grade": grades[i], "key": i, "backgroundColor": this.props.currentScene.backgroundColor()})
        }

        let suggestion1 = []
        for(let i=0; i < presetColorsReplace.length; i++){
            let rgb = '';
            rgb = 'rgb(' + presetColorsReplace[i][0] + ','+ presetColorsReplace[i][1] + ','+presetColorsReplace[i][2] +')';       
            suggestion1.push(rgb);       
            
        }
        console.log('成功',suggestion1);

        let suggestion2 = []
        for(let i=0; i < presetColorsAdd.length; i++){
            let rgb = '';
            rgb = 'rgb(' + presetColorsAdd[i][0] + ','+ presetColorsAdd[i][1] + ','+presetColorsAdd[i][2] +')';       
            suggestion2.push(rgb);       
            
        }
        console.log('成功',suggestion2);


        //色盘单选框style
        const radioStyle = {
            display: 'block',
            height: '30px',
            width: '280px',
            lineHeight: '35px',
            marginBottom: '10px',
            // padding: "0 5px"
            // color: 'rgb(89,89,89)',
            // border: '1px solid #ddd'
          };

        //更新globalColorStyle
        this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});

        const rowSelection = {
            type: 'radio',
            width: '5px',
            onChange: (selectedRowKeys, selectedRows) => {
                this.handleChartOk(selectedRowKeys)
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
              console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              console.log(selected, selectedRows, changeRows);
            },
          };

        return (
            
            <div style={{padding: '0px 10px 0px 10px', fontSize: '14px',height:this.props.contentHeight-80+'px',overflow: 'auto'}}>

            <Layout style={{backgroundColor: '#fff', height: '180px'}}>
                <Sider style={{backgroundColor: '#fff', height: '180px'}}>
                <br />
                <Row>
                    <Col span={1}></Col>
                    <Col span={5}>
                        <Tooltip title="Finance">
                            <DollarOutlined onClick={this.setColorStyle.bind(this ,"financial")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Marketing">
                            <NotificationOutlined onClick={this.setColorStyle.bind(this ,"marketing")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Technology">
                            <WifiOutlined onClick={this.setColorStyle.bind(this ,"technology")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Healthcare">
                        <HeartOutlined onClick={this.setColorStyle.bind(this ,"healthcare")}/>
                        </Tooltip>
                    </Col>                                 
                </Row>
                <Row >
                    <Col span={1}></Col>
                    <Col span={5}>
                        <Tooltip title="Project Management">
                             <ReadOutlined onClick={this.setColorStyle.bind(this ,"education")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Web Analytics">
                             <ReadOutlined onClick={this.setColorStyle.bind(this ,"IT")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Retail">
                            <ShopOutlined onClick={this.setColorStyle.bind(this ,"retail")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Manufacturing">
                            <ControlOutlined onClick={this.setColorStyle.bind(this ,"manufacturing")}/>
                        </Tooltip>
                    </Col>                    
                </Row>
                <Row>
                    <Col span={1}></Col>
                    <Col span={5}>
                        <Tooltip title="Sports and Music">
                            <VideoCameraOutlined onClick={this.setColorStyle.bind(this ,"media")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Social Media">
                            <VideoCameraOutlined onClick={this.setColorStyle.bind(this ,"media")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5} >
                        <Tooltip title="Business">
                            <AccountBookOutlined style={{color: this.state.industryIndex==0? this.state.highlightColor: null}} onClick={this.setColorStyle.bind(this ,"business")}/>
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <Tooltip title="Education">
                             <ReadOutlined onClick={this.setColorStyle.bind(this ,"education")}/>
                        </Tooltip>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}></Col>
                    <Radio.Group value={this.state.value} onChange={this.onChangeBackgroundMode}>
                        <Radio value={1} style={{marginLeft: '-10px', marginRight: '15px'}}>
                            <BulbOutlined />
                            <Button size='small' onClick={ this.handleColorClick1.bind(this) } style={{width: '20px',height:'20px', margin: '0px 5px 0px 5px',background: this.state.BGcolor1,border:"#ffffff"}}></Button> 
                            {this.state.displayColorPicker1 ? 
                            <div style={ popover }>
                                {/* handleColorClose再次点击，关闭colorpicker */}
                                <div style={ cover } onClick={ this.handleColorClose1.bind(this) } />
                                    {/* canvas backgroundColor赋予sketcher Color,  并且让sketcher Color掌握handleColorChange方法，从而改变canvas background Color*/}
                                    <SketchPicker color={this.state.BGcolor1}  presetColors = {[ '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB']}style={{'left':'20px','top':'15px'}}onChange={this.handleColorChange1.bind(this)}  />
                            </div>
                            :null }
                        </Radio>
                        <Radio value={2}>
                            <BulbFilled />
                            <Button size='small' onClick={ this.handleColorClick2.bind(this) } style={{width: '20px',height:'20px',margin: '0px 5px 0px 5px',background: this.state.BGcolor2,border:"#ffffff"}}></Button> 
                            {this.state.displayColorPicker2 ? 
                            <div style={ popover }>
                                {/* handleColorClose再次点击，关闭colorpicker */}
                                <div style={ cover } onClick={ this.handleColorClose2.bind(this) } />
                                    {/* canvas backgroundColor赋予sketcher Color,  并且让sketcher Color掌握handleColorChange方法，从而改变canvas background Color*/}
                                    <SketchPicker color={this.state.BGcolor2} presetColors = {['#423457', '#0E022A', '#20787C', '#0B0F28', '#4D305E', '#524741', '#476E2D', '#2B363A', '#3F728F']}  style={{marginLeft: '200px'}}onChange={this.handleColorChange2.bind(this)}  />
                            </div>
                            :null }
                        </Radio>
                    </Radio.Group>
                </Row>
                </Sider>
            
                <Content style={{backgroundColor: '#fff', height: '180px', marginLeft: '-10px', overflowY: "auto"}}>
                
                {/* radio模式 */}
                <Radio.Group value={this.state.colorsetIndex} size="small" style={{ marginTop: 16, marginLeft: '10px' }}>
                    {/* 双层嵌套列表，读入colorsets */}
                    {
                        colorsets.map((item, index) =>{
                            return (
                                <Radio.Button value={index} style={radioStyle} onChange = {this.handleChartOk}>
                                    <Row justify="space-around" align="middle" style={{marginBottom:'8px'}}>
                                    {
                                        item.map((item2, index2) =>{
                                            console.log('item2',item2,index2)
                                            return (
                                                <Col span={2} style={{marginRight: '2px'}}> 
                                                    <CloseCircleFilled onClick={this.handleStyleDelete.bind(this, index, index2)}/>
                                                    <Button size='small'  onClick={ this.handleStyleClick.bind(this, index, index2)} style={{width: '90%', height: '20px', background: item2, border:"#ffffff"}}></Button>
                                                     {this.state.displayStylePicker[index][index2] ? <div style={ popover }>
                                                    <div style={ cover } onClick={ this.handleStyleClose.bind(this, index, index2) } />
                                                    <SketchPicker color={colorsets[index][index2]}  presetColors = {suggestion1}  onChange={this.handleStyleChange.bind(this, index, index2)} />
                                                    </div>:null }
                                                </Col>
                                            );
                                        })
                                    }
                                    <Col span={2} style={{marginTop:'-1px'}}> 
                                        <Button type = "dashed primary" icon="plus" onClick={ this.handleStyleAddClick.bind(this, index)} style={{width: '90%', height: '20px',marginTop:'-2px'}}></Button>
                                        {this.state.displayStylePicker[index][-1] ? <div style={ popover }>
                                                    <div style={ cover } onClick={ this.handleStyleAddClose.bind(this, index)}/>
                                                    <SketchPicker presetColors = {suggestion2} onChange={this.handleStyleAddChange} />
                                                    </div>:null }
                                    </Col>
                                    </Row>
                                </Radio.Button>
                            );
                        })
                    } 

                    
                </Radio.Group>
                
                {/* Table模式 */}
                {/* <Table dataSource={colorStyleTable} rowSelection={rowSelection} onChange={this.handleTableChange}>
                    
                    <Column 
                        title="Colorset" 
                        dataIndex="colorset" 
                        key="grade"
                        style={{padding: "6px 6px"}}
                        width='500'
                        sorter={(a, b) => a.grade - b.grade}
                        sortOrder={sortedInfo.columnKey === "grade" && sortedInfo.order}
                        ellipsis={true}
                        render={(colorset,record,index) => {
                                // colorset.map((item, index) =>{
                                    
                                    return (
                                        
                                        // <Radio.Button value={index} style={radioStyle} onChange = {this.handleChartOk}>
                                            <Row justify="space-around" align="right" style={{marginBottom:'0px', width:'220px'} }>
                                            {
                                                colorset.map((item2, index2) =>{
                                                    return (
                                                        <Col span={3} > 
                                                            <CloseCircleFilled onClick={this.handleStyleDelete.bind(this, record.key, index2)}/>
                                                            <Button size='small'  onClick={ this.handleStyleClick.bind(this, index, index2)} style={{width: '20px', height: '20px', background: item2, border:"#ffffff"}}></Button>
                                                             {this.state.displayStylePicker[record.key][index2] ? <div style={ popover }>
                                                            <div style={ cover } onClick={ this.handleStyleClose.bind(this, index, index2) } />
                                                            <SketchPicker color={colorsets[record.key][index2]}  presetColors = {suggestion1}  onChange={this.handleStyleChange.bind(this,record.key, index2)} />
                                                            </div>:null }
                                                        </Col>
                                                    );
                                                })
                                            }
                                            <Col span={3} style={{marginTop:'4px'}}> 
                                                <Button type = "dashed primary" icon="plus" onClick={ this.handleStyleAddClick.bind(this, record.key)} style={{width: '20px', height: '20px',marginTop:'-2px'}}></Button>
                                                {this.state.displayStylePicker[record.key][-1] ? <div style={ popover }>
                                                            <div style={ cover } onClick={ this.handleStyleAddClose.bind(this, record.key)}/>
                                                            <SketchPicker presetColors = {suggestion2} onChange={this.handleStyleAddChange} />
                                                            </div>:null }
                                            </Col>
                                            </Row>
                                        // </Radio.Button>
                                    );
                                // }) 
                        }}
                    />
                    <Column 
                        title="" 
                        dataIndex="grade" 
                        key="grade"
                        width="20px"
                        sorter={(a, b) => a.grade - b.grade}
                        sortOrder={sortedInfo.columnKey === "grade" && sortedInfo.order}
                        ellipsis={true}
                        style={{padding: "6px 6px", display:'none'}}/>

                </Table> */}
               
                </Content>
                </Layout>
            </div>
        )
    }
}