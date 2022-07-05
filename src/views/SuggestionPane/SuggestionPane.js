import React, { Component } from 'react';
import { Divider ,Layout,Icon} from 'antd';
import html2canvas from 'html2canvas';
// import jsPDF from "jspdf";
import './suggestionpane.css';
import D3Container from "@/charts/D3/D3Container"
import _ from "lodash";
import $ from 'jquery';
import * as d3 from 'd3';
import { widgets, textColor, icondict } from '../../selectors/canvas';
import { getCategories, getAggregatedRows, getWidth } from '@/charts/D3/PieChart/helper';

import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import { html } from 'd3-fetch';
import { func } from 'prop-types';

import infoDict from '@/infoDict';


const { Header} = Layout;
export default class SuggestioMathane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //选择显示的bookmarks-index
            index: '',
            widgets:[],
            backgroundcolor:this.props.cardColor,
            textcolor1: this.props.textColor,
            textfont:this.props.textfont,
            iconcolor:this.props.iconcolor,
            icontype:this.props.icontype,
            categoriesreading:this.props.categoriesreading,
            seriesreading:this.props.seriesreading,
            fieldsreading: this.props.fieldsreading,
            icondict: this.props.icondict,
            // show:false,

            imgPixcelsArray: [],

            //存储排序名称
            targetIndex: [],

        


        };
        this.similarRanking = this.similarRanking.bind(this);
        this.beautyRanking = this.beautyRanking.bind(this);
        
    }
    // componentWillMount(){
    //     setTimeout(()=>{
    //         this.setState({
    //             show:true
    //         })
    //     },5000)
    // }
    componentWillReceiveProps(props) {
        // console.log('will',this.props.widgets)
        console.log('啦啦啦--sugess',props)
        // if (this.props.backgroundColor !== props.backgroundColor||this.props.categoriesreading!==props.categoriesreading||this.props.seriesreading!==props.seriesreading || this.props.icondict !== props.icondict){
             this.setState({
                            backgroundcolor:props.cardColor,
                            textcolor1:props.textColor,
                            iconcolor:props.iconcolor,
                            textfont:props.textfont,
                            icontype:props.icontype,
                            icoMathair: props.icoMathair,
                            categoriesreading:props.categoriesreading,
                            seriesreading:props.seriesreading,
                            fieldsreading: props.fieldsreading,
                            icondict: props.icondict,
                            ALlData: props.AllData,
      
                          })       
    //  }
       }
    generateSuggestion = (e) => {
        // console.log('rendergenDOM')       
        // console.log('e2',this.state.layouts)
        // console.log('generace',this.props.widgets);

       let widgets = [...this.props.widgets];
       
       return _.map(widgets, (item, i) => {
        console.log("DataPane -> handleChartOk -> widgets1", widgets)
        // console.log("DataPane -> handleChartOk -> widgets1", item.type)
        console.log("DataPane -> handleChartOk -> widgets1", infoDict['temp01_picto']["barchart"]['similarIndex'])
        let itemType = item.type.replace(' ', '')+""

         let sugessLayout = [];
         if(this.props.similarMode === true) {
          sugessLayout = infoDict['temp01_picto'][itemType].similarIndex;
         } else if(this.props.beautyMode === true) {
          sugessLayout = infoDict['temp01_picto'][itemType].beautyIndex;
         }
      //  console.log('widgets-change11111',infoDict['temp01_picto'][itemType].similarIndex)
      // console.log('e.1111111',this.props.widgets[i].spec['encoding'][0])
        let comArr=[];
         for(let a=0;a<sugessLayout.length;a++){
       //Get categories
      //  let dataCategories = getCategories(this.props.dataList[item.dataIndex], item.spec.encoding);
      //  let categories = Object.keys(dataCategories);
      let categoriesreadingTest = ["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
      let seriesreadingTest = ["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
      let icontypeTest =  ["add-list","creek--v1"];
      // console.log('colorPair-suggesstion',this.props.colorPair)
       let component1 = (
            <D3Container
              type={item.type}
              // type={widgets[i].spec['style'].layout[a]}
              // // item.dataIndex,
              // // item.category, // category
              // // item.type, //type
              stylelayout={sugessLayout[a]}
              chartId={'chart-sugess'+item['i']+a}
              data={this.props.dataList[item.dataIndex]}
              spec={item.spec} //spec
              // categories = {Object.keys(dataCategories)}
              // colormap={this.state.colormap}
              colormap={this.props.colormap}
              colorPair={this.props.colorPair}
              size={!widgets[i]? {w:0,h:0}:{w:4,h:4}}
              // textcolor={this.props.textcolor}
              // cardcolor={this.props.cardcolor}
              textcolor={this.state.textcolor1}
              cardcolor={this.state.backgroundcolor}
              fontweight={this.state.fontweightflag}
              textfont={this.state.textfont}
              iconcolor={this.state.iconcolor}
              icontype={this.state.icontype}
              categoriesreading={this.state.categoriesreading}
              seriesreading={this.state.seriesreading}
              fieldsreading={this.state.fieldsreading}
              icondict={this.state.icondict}
              // icontype={icontypeTest}
              // categoriesreading={categoriesreadingTest}
              // seriesreading={seriesreadingTest}
              // option={option}
              // notMerge={true}
              // lazyUpdate={true}
              style={{width: '100%',height:'100%'}}
            />           
          )
            comArr.push( <div className='preview ' id={'pre'+a} style={{background:this.state.backgroundcolor}} onClick={() => this.chooseD(a,sugessLayout[a])}  key={item.i+a}>
            {component1}
            </div>)
         }
         if(this.props.styleLayout===''){
          console.log('sugessLayout[0]', sugessLayout)
           console.log('sugessLayout[0]', sugessLayout[0])
              this.props.changeStyleLayout(sugessLayout[0]);
         }
        
       // return {component}
          return (
        //       !this.state.show?
        //      <div className='preview' id='pre1' onClick={() => this.chooseD(1)}  key={item.i}></div>:
        //     <div key={item.i+1}>
        //     <iMathut type="text" id="myVal" placeholder="nihao"/>
        //     {component1}
        //  </div>
        // <div className='preview' id='pre1' onClick={() => this.chooseD(1)}  key={item.i}>
        // {component1}
        // </div>
        comArr
          );
       });
      };
    
      generateInspire = (e) => {
        // console.log('rendergenDOM')       
        // console.log('e2',this.state.layouts)
        // console.log('generace',this.props.widgets);

       let widgets = [...this.props.widgets];
      //  console.log("DataPane -> handleChartOk -> widgets1", widgets)
       return _.map(widgets, (item, i) => {
       console.log('widgets-change11111',widgets[i].type,widgets[i].spec['style'].inspire)
      // console.log('e.1111111',this.props.widgets[i].spec['encoding'][0])
        let comArr=[];
         for(let a=0;a<widgets[i].spec['style'].inspire.length;a++){
       //Get categories
      //  let dataCategories = getCategories(this.props.dataList[item.dataIndex], item.spec.encoding);
      //  let categories = Object.keys(dataCategories);
      let categoriesreadingTest = ["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
      let seriesreadingTest = ["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
      let icontypeTest =  ["add-list","creek--v1"];
      // console.log('colorPair-suggesstion',this.props.colorPair)
       let component1 = (
            <D3Container
              type={widgets[i].spec['style'].inspireType[a]}
              // // item.dataIndex,
              // // item.category, // category
              // // item.type, //type
              stylelayout={widgets[i].spec['style'].inspire[a]}
              chartId={'chart-sugess'+item['i']+a}
              data={this.props.dataList[item.dataIndex]}
              spec={item.spec} //spec
              // categories = {Object.keys(dataCategories)}
              // colormap={this.state.colormap}
              colormap={this.props.colormap}
              colorPair={this.props.colorPair}
              size={!widgets[i]? {w:0,h:0}:{w:4,h:4}}
              // textcolor={this.props.textcolor}
              // cardcolor={this.props.cardcolor}
              textcolor={this.state.textcolor1}
              cardcolor={this.state.backgroundcolor}
              fontweight={this.state.fontweightflag}
              textfont={this.state.textfont}
              iconcolor={this.state.iconcolor}
              icontype={this.state.icontype}
              categoriesreading={this.state.categoriesreading}
              seriesreading={this.state.seriesreading}
              fieldsreading={this.state.fieldsreading}
              icondict={this.state.icondict}
              // icontype={icontypeTest}
              // categoriesreading={categoriesreadingTest}
              // seriesreading={seriesreadingTest}
              // option={option}
              // notMerge={true}
              // lazyUpdate={true}
              style={{width: '100%',height:'100%'}}
            />           
          )
            comArr.push( <div className='preview ' id={'pre'+a} style={{background:this.state.backgroundcolor}} onClick={() => this.chooseD(a,widgets[i].spec['style'].inspire[a], 'inspire')}  key={item.i+a}>
            {component1}
            </div>)
         }
         if(this.props.styleLayout===''){
              this.props.changeStyleLayout(widgets[i].spec['style'].inspire[0]);
         }
        
       // return {component}
          return (
        //       !this.state.show?
        //      <div className='preview' id='pre1' onClick={() => this.chooseD(1)}  key={item.i}></div>:
        //     <div key={item.i+1}>
        //     <iMathut type="text" id="myVal" placeholder="nihao"/>
        //     {component1}
        //  </div>
        // <div className='preview' id='pre1' onClick={() => this.chooseD(1)}  key={item.i}>
        // {component1}
        // </div>
        comArr
          );
       });
      };



    chooseD=(index,stylelayout1,layoutMode)=>{
      console.log('stylelayout1', stylelayout1)
      
      if(layoutMode == 'inspire') {
        console.log('layoutModeInspire', layoutMode)
        this.props.changeLayoutMode('inspire');
        this.forceUpdate();
      }
      else {
        console.log('layoutModeSugess', layoutMode)
        this.props.changeLayoutMode('sugess');
        this.forceUpdate();
      }
        var pre=document.getElementsByClassName('preview');
        for (var i = 0; i < pre.length; i++) {
            pre[i].style.borderColor = '#eee';
        }
        // pre.styel.borderColor = '#eee';
        var select=document.getElementById('pre'+index);
        select.style.borderColor = '#e2570b';
        select.style.borderWidth="4px"
       this.props.changeStyleLayout(stylelayout1);
        this.setState({
           index: index,
        });
    }

    similarRanking=()=>{

      // var rank=document.getElementsByClassName('rank');
      //   for (var i = 0; i < rank.length; i++) {
      //       rank[i].style.color = '#968176';
      //   }
      //   document.getElementById('similar').style.color = 'rgb(226, 87, 11)';

        this.props.changeRankMode(true, false, false);

    
    //   if(this.state.inspireMode == false) {
    //     var rank=document.getElementsByClassName('rank');
    //     for (var i = 0; i < rank.length; i++) {
    //         rank[i].style.color = '#968176';
    //     }
    //     document.getElementById('similar').style.color = 'rgb(226, 87, 11)';


    //   let widgets = [...this.props.widgets];
    //   let changeMapping = this.props.changeMapping;
    //   let changeLoading = this.props.changeLoading;
    //   let featuresList = this.props.featuresList;
    //   changeLoading(true);


    //   function getHistogram(imageData) {
    //     // console.log('imageData',imageData)
    //     var arr = [];
    //     for (var j = 0; j < 64; j++) {
    //         arr[j] = 0;
    //     }
    //     var data = _.cloneDeep(imageData.data);
    //     // console.log('data',data)
    //     var pow4 = Math.pow(4, 2);
    //     for (var i = 0; i < data.length; i += 4) {
    //         // console.log('data[i]',data[i])
    //         var red = (data[i] / 64) | 0;
    //         // console.log('red', data[i] / 64)
    //         // console.log('red', red)
    //         var green = (data[i + 1] / 64) | 0;
    //         var blue = (data[i + 2] / 64) | 0;
    //         var index = red * pow4 + green * 4 + blue;

    //         arr[index]++;
            
    //         // if(arr[index] == undefined) {
    //         //   arr[index] = 0;
    //         // }else{
    //         //   arr[index]++;
    //         // }
    //     }  
    //      return arr;
    //   } 
    //   function cosine(arr1, arr2) {
    //     var axb = 0,
    //         a = 0,
    //         b = 0;
    //     var arr1 = _.cloneDeep(arr1);
    //     var arr2 = _.cloneDeep(arr2);
    //     for (var i = 0, len = arr1.length; i < len; i++) {
    //         axb += arr1[i] * arr2[i];
    //         a += arr1[i] * arr1[i];
    //         b += arr2[i] * arr2[i];
    //     }
    //     return axb / (Math.sqrt(a) * Math.sqrt(b));
    //   }
    //   function gray(imgData) {
    //     var data = _.cloneDeep(imgData.data);
    //     for (var i = 0, len = data.length; i < len; i += 4) {
    //         var gray = parseInt((data[i] + data[i + 1] + data[i + 2]) / 3);
    //         data[i + 2] = data[i + 1] = data[i] = gray;
    //     }
    //     return imgData;
    //   }    
   
    //   //base64转blob
    //   function dataURItoBlob(dataURI) {  
    //     var byteString = atob(dataURI.split(',')[1]);  
    //     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];  
    //     var ab = new ArrayBuffer(byteString.length);  
    //     var ia = new Uint8Array(ab);  
    //     for (var i = 0; i < byteString.length; i++) {  
    //         ia[i] = byteString.charCodeAt(i);  
    //     }  
    //     return new Blob([ab], {type: mimeString});  
    //   }

     

    //   // console.log('this.state.targetIndex', this.state.targetIndex)
   
    // if(this.state.targetIndex.length === 0) {
    //   //imgPixcels array
    //   let imgPixcelsArray = [];

    //   // if(imgPixcelsArray.length === 0){
    //     //获取resize后的上传图片像素
    //   var resizeImg = 'data:image/png;base64,' + this.props.featuresList[this.props.featuresList.length - 1]['resizeImg'][0].img;
    //   var blobImg = dataURItoBlob(resizeImg);
    //   var imgUrl =  window.URL.createObjectURL(blobImg);
    //   var imgObj = new Image();
    //   imgObj.src = imgUrl;
    //   var imgPixels;

    //   var imgDiv = document.querySelectorAll(".localImg")[0];
    //   imgDiv.appendChild(imgObj);

    //   html2canvas(imgDiv,{useCORS:true})
    //   .then(function (canvas) {
    //     var imgCtx = canvas.getContext('2d');
    //     // imgCtx.drawImage(imgObj,160,160);
    //     imgPixels = imgCtx.getImageData(0,0,160,160);
    //     imgPixcelsArray.push(imgPixels);
  
       
    //   });

    //   // console.log('imgDiv',document.querySelectorAll(".localImg")[0]);
    //   imgDiv.setAttribute('style', 'display: none');
            
      
    //     var iconStatus = 'vis';
    //     var layout = [];
    //     var similarScore = [];

        
    //     var suggesstionEle = document.querySelectorAll("[class^='preview']");
    //     document.getElementById("mycard").style.background=this.state.backgroundcolor;
    //     var pixels;
    //     var imgPixelsGray;
    //     var pixelsGray;
    //     var imgPixelsHis;
    //     var pixelsHis;
    //     var delta;
    //     var deltaDict = {};

      

    //     var targetIndex = [];



    //     var i=0;
    //     function nextStep(props) {
    //       if(i>=suggesstionEle.length){
    //         changeLoading(false);
    //         var deltaKeys = [];
    //         for(var key in deltaDict) {
    //           deltaKeys.push(key);
    //         }
    //         // console.log('deltaKeys',deltaKeys)
    //         deltaKeys.sort(function(a, b) {return b-a});
    //         // targetIndex = [];
    //         // console.log('ranking-', widgets[0].spec['style'].layout[0])
    //         for (var j = 0; j < deltaKeys.length; j++){
    //           switch(deltaDict[deltaKeys[j]]){
    //             case 0:
    //               targetIndex.push(widgets[0].spec['style'].layout[0]);
    //               break;
    //             case 1:
    //               targetIndex.push(widgets[0].spec['style'].layout[1]);
    //               break;
    //             case 2:
    //               targetIndex.push(widgets[0].spec['style'].layout[2]);
    //               break;
    //             case 3:
    //               targetIndex.push(widgets[0].spec['style'].layout[3]);
    //               break;
    //             case 4:
    //               targetIndex.push(widgets[0].spec['style'].layout[4]);
    //               break;
    //             case 5:
    //               targetIndex.push(widgets[0].spec['style'].layout[5]);
    //               break;
    //             case 6:
    //               targetIndex.push(widgets[0].spec['style'].layout[6]);
    //               break;
    //             case 7:
    //               targetIndex.push(widgets[0].spec['style'].layout[7]);
    //               break;
    //             case 8:
    //               targetIndex.push(widgets[0].spec['style'].layout[8]);
    //               break;
    //             case 9:
    //               targetIndex.push(widgets[0].spec['style'].layout[9]);
    //               break;
    //           }
    //           // targetIndex.push(deltaDict[deltaKeys[j]])
    //         }
    //         // widgets[0].spec['style'].layout = targetIndex;

    //         console.log('wwww', widgets)
    //         console.log('featuresList', targetIndex)

    //         let targetIndexIsVisOrder = [];
    //         let targetIndexIsLabelOrder = [];
    //         let targetIndexNew = [];



    //         for(let i = 0; i < targetIndex.length; i++) {
    //           if(widgets[0].targetIndexIsVis.indexOf(targetIndex[i]) !== -1) {
    //             targetIndexIsVisOrder.push(targetIndex[i]);
    //           } else {
    //             targetIndexIsLabelOrder.push(targetIndex[i]);
    //           }
    //         }

            

    //         if(featuresList[featuresList.length - 1]['features'][2].isVis === 'false') { //作为label
    //           targetIndexNew = targetIndexIsLabelOrder.concat(targetIndexIsVisOrder);
    //         } else {
    //           targetIndexNew = targetIndexIsVisOrder.concat(targetIndexIsLabelOrder);
    //         }
    //         console.log('targetIndexIsVisOrder', targetIndexIsVisOrder)
    //         console.log('targetIndexIsLabelOrder', targetIndexIsLabelOrder)
    //         console.log('targetIndexNew', targetIndexNew)
    //         widgets[0].spec['style'].layout = targetIndexNew;
            



    //         // console.log('delta',delta);

    //         // console.log('featuresList-----',featuresList);

    //         changeMapping(widgets);
                
    //         return;
    //       }

    //       html2canvas(suggesstionEle[i],{useCORS:true})
    //       .then(function(canvas){
    //         var ctx = canvas.getContext('2d');
    //           pixels = ctx.getImageData(0,0,160,160);
    //           imgPixcelsArray.push(pixels);
    //         }
    //       )
    //       .then(function(){
    //           setTimeout(function() {
    //               //step1: 转为灰度图
    //               imgPixelsGray = gray(imgPixels);
    //               pixelsGray = gray(pixels);
             

    //           }, 10+i)
    //           setTimeout(function() {
    //             //step2: 计算直方图分布
    //               imgPixelsHis = getHistogram(imgPixelsGray);
    //               pixelsHis = getHistogram(pixelsGray);
    //               // console.log('imgPixelsHis', imgPixelsHis)
    //               // console.log('pixelsHis', pixelsHis)
    //           }, 20+i)
    //           setTimeout(function() {
    //               //step3:计算余弦
    //               delta = cosine(imgPixelsHis, pixelsHis);
    //               // console.log('delta',delta);
    //               deltaDict[delta] = i;
    //               i++;
    //               nextStep();
    //           }, 30+i)
              
    //         })

    //     }
    //     nextStep(this.props);
      
        
        
       
    //     this.setState({
    //       imgPixcelsArray: imgPixcelsArray,
    //       targetIndex: targetIndex
    //     })
        
        
    // }else {
    //   let imgPixcelsArray = this.state.imgPixcelsArray;
    //   let newImgPixcelsArray = [];
    //   let targetIndex = this.state.targetIndex;
    //   let newTargetIndex = [];
    //   let pixelsHis = getHistogram(gray(imgPixcelsArray[0]));
    //   let deltaDict = {};
    //   for(let i = 1; i < imgPixcelsArray.length; i++) {
    //     let imgPixelsHis = getHistogram(gray(imgPixcelsArray[i]));
    //     let delta = cosine(imgPixelsHis, pixelsHis);
    //     deltaDict[delta] = targetIndex[i - 1];
    //   }

    //   Object.keys(deltaDict).sort().forEach(function(key) {
    //     newTargetIndex.push(deltaDict[key]);
    //     newImgPixcelsArray.push(imgPixcelsArray[targetIndex.indexOf(deltaDict[key])]);
    //    });

    //    widgets[0].spec['style'].layout = newTargetIndex;

    //    console.log('delta',delta);

    //    console.log('featuresList-----',this.props.featuresList);

    //    changeMapping(widgets);

    //    this.setState({
    //     imgPixcelsArray: newImgPixcelsArray,
    //     targetIndex: newTargetIndex
    //    })

    //   }
     

    // } else {
    //   this.setState({
    //     inspireMode: false
    //   })
    // }
    

    
}

    beautyRanking=()=>{
      // var rank=document.getElementsByClassName('rank');
      //   for (var i = 0; i < rank.length; i++) {
      //       rank[i].style.color = '#968176';
      //   }
      //   document.getElementById('beauty').style.color = 'rgb(226, 87, 11)';

        this.props.changeRankMode(false, true, false);

     
    //   if(this.state.inspireMode == false) {
    //     var rank=document.getElementsByClassName('rank');
    //     for (var i = 0; i < rank.length; i++) {
    //         rank[i].style.color = '#968176';
    //     }
    //     document.getElementById('beauty').style.color = 'rgb(226, 87, 11)';

    //   function getHarmony(rgb1, rgb2) {
    //     let lab1 = d3.lab(rgb1);
    //     let lab2 = d3.lab(rgb2);

    //     //todo  
    //     var l = lab1.l
    //     var a = lab1.a
    //     var b = lab1.b
        
    //     var l2 = lab2.l
    //     var a2 = lab2.a
    //     var b2 = lab2.b
        
    //     var detaC = Math.pow((Math.pow(b - b2, 2)+ Math.pow((a - a2) / 1.46, 2)), 1/2)
    //     var HC = 0.04 + 0.53 * Math.tanh(0.8 - 0.045 * detaC)
        
    //     var HLsum = 0.28 + 0.54 * Math.tanh(-3.88 + 0.029 * (l + l2))
    //     var HdetaL = 0.14 + 0.15 * Math.tanh(-2 + 0.2 * Math.abs(l - l2))
    //     var HL = HLsum + HdetaL
        
    //     var EC1 = 0.5 + 0.5 * Math.tanh(-2 + 0.5 * a)
    //     var HS1 = -0.08 - 0.14 * Math.sin(b + 50/180 * Math.PI) - 0.07 * Math.sin(2 * b + 90/180 * Math.PI)
    //     var EY1 = (0.22 * l - 12.8)/10 * Math.exp((90/180 * Math.PI - b)/10 - Math.exp((90/180 * Math.PI - b)/10))
    //     var HSY1 = EC1 * (HS1 + EY1)
        
    //     var EC2 = 0.5 + 0.5 * Math.tanh(-2 + 0.5 * a2)
    //     var HS2 = -0.08 - 0.14 * Math.sin(b2 + 50/180 * Math.PI) - 0.07 * Math.sin(2 * b2 + 90/180 * Math.PI)
    //     var EY2 = (0.22 * l2 - 12.8)/10 * Math.exp((90/180 * Math.PI - b2)/10 - Math.exp((90/180 * Math.PI - b2)/10))
    //     var HSY2 = EC2 * (HS2 + EY2)
        
    //     var HH = HSY1 + HSY2
        
    //     var CH = HC + HL + HH
        
    //     if(CH == null || CH == Infinity || CH == -Infinity){
    //       CH = 0
    //     }   
    //     return CH
    
    //   }

    //   function getDiscriminability(rgb1, rgb2) {
    //   //   function degrees(n){
    //   //     return n * (180 / Math.PI)
    //   //   }
    //   //   function radians(n){
    //   //     return n * (Math.PI / 180)
    //   //   }
    //   //   function hpf(x, y){
    //   //       if(x === 0 && y === 0) return 0
    //   //       else{
    //   //           let tmphp = degrees(Math.atan2(x, y));
    //   //           if(tmphp >= 0) return tmphp
    //   //           else return tmphp + 360
    //   //       }   
    //   //       return null
    //   // }
    //   //   function dhpf(c1, c2, h1p, h2p){
    //   //       if(c1 * c2 === 0) return 0
    //   //       else if(Math.abs(h2p - h1p) <= 180) return h2p - h1p
    //   //       else if(h2p - h1p > 180) return (h2p - h1p) - 360
    //   //       else if(h2p - h1p < 180) return (h2p - h1p) + 360
    //   //       else return null
    //   //   }
    //   //   function ahpf(c1, c2, h1p, h2p){
    //   //       if(c1 * c2 === 0) return h1p + h2p
    //   //       else if(Math.abs(h1p - h2p) <= 180) return (h1p + h2p) / 2.
    //   //       else if(Math.abs(h1p - h2p) > 180 && h1p + h2p < 360) return (h1p + h2p + 360) / 2
    //   //       else if(Math.abs(h1p - h2p) > 180 && h1p + h2p >= 360) return (h1p + h2p - 360) / 2
    //   //       return null
    //   //   }
    //   //   let lab1 = d3.lab(rgb1);
    //   //   let lab2 = d3.lab(rgb2);

    //   //   let L1 = lab1.l
    //   //   let A1 = lab1.a
    //   //   let B1 = lab1.b
    //   //   let L2 = lab2.l
    //   //   let A2 = lab2.a
    //   //   let B2 = lab2.b
    //   //   let kL = 1
    //   //   let kC = 1
    //   //   let kH = 1
    //   //   let C1 = Math.sqrt((A1 ** 2) + (B1 ** 2))
    //   //   let C2 = Math.sqrt((A2 ** 2) + (B2 ** 2))
    //   //   let aC1C2 = (C1 + C2) / 2
    //   //   let G = 0.5 * (1 - Math.sqrt((aC1C2 ** 7) / ((aC1C2 ** 7) + (25 * 7))))
    //   //   let a1P = (1. + G) * A1
    //   //   let a2P = (1. + G) * A2
    //   //   let c1P = Math.sqrt((a1P ** 2.) + (B1 ** 2))
    //   //   let c2P = Math.sqrt((a2P ** 2.) + (B2 ** 2))
    //   //   let h1P = hpf(B1, a1P)
    //   //   let h2P = hpf(B2, a2P)
    //   //   let dLP = L2 - L1
    //   //   let dCP = c2P - c1P
    //   //   let dhP = dhpf(C1, C2, h1P, h2P)
    //   //   let dHP = 2. * Math.sqrt(c1P * c2P) * Math.sin(radians(dhP) / 2)
    //   //   let aL = (L1 + L2) / 2
    //   //   let aCP = (c1P + c2P) / 2
    //   //   let aHP = ahpf(C1, C2, h1P, h2P)
    //   //   let T = 1 - 0.17 * Math.cos(radians(aHP - 39)) + 0.24 * Math.cos(radians(2 * aHP)) + 0.32 * Math.cos(radians(3 * aHP + 6)) - 0.2 * Math.cos(radians(4 * aHP - 63))
    //   //   let dRO = 30 * Math.exp(-1 * (((aHP - 275) / 25) * 2))
    //   //   let rC = Math.sqrt((aCP ** 7) / ((aCP ** 7) + (25 ** 7)))
    //   //   let sL = 1 + ((0.015 * ((aL - 50) ** 2)) / Math.sqrt(20. + ((aL - 50) ** 2)))
    //   //   let sC = 1 + 0.045 * aCP
    //   //   let sH = 1 + 0.015 * aCP * T
    //   //   let rT = -2 * rC * Math.sin(radians(2 * dRO))
    //   //   console.log('diccccccc', Math.sqrt(((dLP / (sL * kL)) * 2) + ((dCP / (sC * kC)) * 2) + ((dHP / (sH * kH)) * 2) + rT * (dCP / (sC * kC)) * (dHP / (sH * kH))))
    //   //   return Math.sqrt(((dLP / (sL * kL)) * 2) + ((dCP / (sC * kC)) * 2) + ((dHP / (sH * kH)) * 2) + rT * (dCP / (sC * kC)) * (dHP / (sH * kH)))
    //     let lab1 = d3.lab(rgb1);
    //     let lab2 = d3.lab(rgb2);

    //     let L1 = lab1.l
    //     let A1 = lab1.a
    //     let B1 = lab1.b
    //     let L2 = lab2.l
    //     let A2 = lab2.a
    //     let B2 = lab2.b


    //     return Math.sqrt((L1 - L2) * (L1 - L2) + (A1 - A2) * (A1 - A2) + (B1 - B2) * (B1 - B2))
    //   }

    //   let widgets = [...this.props.widgets];
    //   let changeMapping = this.props.changeMapping;
    //   let changeLoading = this.props.changeLoading;
    //   // changeLoading(true);
      
    //   let imgPixcelsArray = [];
    //   let targetIndex = [];
    //   // let newTargetIndex = [];
    //   let newImgPixcelsArray = [];

   

    
    //   // if(this.state.targetIndex.length > 0) {
    //   //   imgPixcelsArray = this.state.imgPixcelsArray;
    //   //   targetIndex = this.state.targetIndex;

    //   //   console.log('imgPixcelsArray', imgPixcelsArray)
       


    //   //   let VisualScore = [];
    //   //   let background = this.props.featuresList[this.props.featuresList.length - 1]['features'][0].background[0];
    //   //   let deltaDict = {};

    //   //   var suggesstionEle = document.querySelectorAll("[class^='preview']");

    //   //   // for(let i = 0; i < suggesstionEle.length; i++) {
          
    //   //   //   let useEls = $('#pre'+i+',use')
    //   //   //   console.log('use', useEls)
    //   //   // }
        
       
  
       
    //   //     // 处理六位的颜色RGB值，转为RGB
    //   //     var RGBbackground = [];
    //   //     for (var i = 1; i < 7; i += 2) {
    //   //       RGBbackground.push(parseInt("0x" + background.slice(i, i + 2)));
    //   //     }
                
    //   //     console.log('background',RGBbackground);
    //   //     // console.log('imgPixcelsArray',imgPixcelsArray);
      
    //   //     for(let i = 1; i < imgPixcelsArray.length; i++) {
    //   //       let imgPixcels = imgPixcelsArray[i].data;
    //   //       VisualScore = 0;
    //   //       let colorDict = {}
    //   //       let discriminability = 0;
    //   //       // console.log('imgPixcels',imgPixcels)
    //   //       for(let j = 0; j < imgPixcels.length; j=j+4){
    //   //         colorDict['rgb(' + imgPixcels[j] +',' + imgPixcels[j + 1] + ',' + imgPixcels[j + 2]+')'] = 1; //存入字典
    //   //         if((j+1) / 4 % 160 <= 80) {
    //   //           let piancha = (80 - (j + 1) / 4 % 160) * 8 + j
    //   //           if(imgPixcels[j] === imgPixcels[piancha] && imgPixcels[j+1] === imgPixcels[piancha+1] && imgPixcels[j+2] === imgPixcels[piancha+2]){
    //   //             VisualScore++;
    //   //           }
    //   //         }else {
    //   //           let piancha = j - ((j + 1) / 4 % 160 - 80) * 8
    //   //           if(imgPixcels[j] === imgPixcels[piancha] && imgPixcels[j+1] === imgPixcels[piancha+1] && imgPixcels[j+2] === imgPixcels[piancha+2]){
    //   //             VisualScore++;
    //   //           }
    //   //         } 

    //   //         if(imgPixcels[j] === RGBbackground[0] && imgPixcels[j+1] === RGBbackground[1] && imgPixcels[j+2] === RGBbackground[2]) {
    //   //           VisualScore++;
    //   //         }

    //   //         discriminability += getDiscriminability('rgb(' + imgPixcels[j] + ',' + imgPixcels[j+1] + ',' + imgPixcels[j+2] +')' , 'rgb(' + RGBbackground[0] + ',' + RGBbackground[1] + ',' + RGBbackground[2] +')');

    //   //         console.log('discriminability', discriminability)
    //   //       }

    //   //       let colorPair = this.props.colorPair;
    //   //       let colorPairKeys = [];
    //   //       for(var key in colorPair) {
    //   //         colorPairKeys.push(colorPair[key]);
    //   //       }

    //   //       console.log('colorPairKeys', colorPairKeys)

    //   //       let colorKeys = [];
    //   //       for(var key in colorDict) {
    //   //         if(colorPairKeys.indexOf(key) !== -1) {
    //   //           colorKeys.push(key);
    //   //         } 
    //   //       }

    //   //       let harmony = 0;
    //   //       if(colorKeys.length >=2) {
    //   //         for(let j = 0; j < colorKeys.length - 1; j++) {
    //   //           harmony += getHarmony(colorKeys[j], colorKeys[j+1]);
    //   //         }
    //   //       }

    //   //       console.log('harmony', harmony)
            


    //   //       // console.log('imgPixcels.length/4',imgPixcels.length/4)
    //   //       console.log('VisualScore[i]', VisualScore)
    //   //       VisualScore = (imgPixcels.length/4 - VisualScore)/ (imgPixcels.length/4) + harmony + discriminability
    //   //       deltaDict[VisualScore] = targetIndex[i - 1];
    //   //     }
  
  
    //   //     Object.keys(deltaDict).sort((a, b) => {
    //   //       return b - a;
    //   //     }).forEach(function(key) {
    //   //       newTargetIndex.push(deltaDict[key]);
    //   //       newImgPixcelsArray.push(imgPixcelsArray[targetIndex.indexOf(deltaDict[key])]);
    //   //      });

    //   //      console.log('newTargetIndex', newTargetIndex)
    
    //   //      widgets[0].spec['style'].layout = newTargetIndex;
  
           
    //   //      changeLoading(false);
    //   //      changeMapping(widgets);
        

    //   // } else {

    //   //   // 处理六位的颜色RGB值，转为RGB
    //   //   let background = this.props.featuresList[this.props.featuresList.length - 1]['features'][0].background[0];
    //   //   var RGBbackground = [];
    //   //   for (var i = 1; i < 7; i += 2) {
    //   //     RGBbackground.push(parseInt("0x" + background.slice(i, i + 2)));
    //   //   }
              
    //   //   // console.log('background222',RGBbackground);


    //   //   var suggesstionEle = document.querySelectorAll("[class^='preview']");
    //   //   document.getElementById("mycard").style.background=this.state.backgroundcolor;
    //   //   let deltaDict = {}

    //   //   targetIndex = ['stacked', 'horizontalrect', 'singlebar', 'grouped', 'area', 'percent1', 'percent2', 'barchart4', 'barchart5'];
    //   //   newTargetIndex = []
    //   //   var i=0;
    //   //   let pixels;

    //   //   function nextStep(props) {
    //   //     if(i>=suggesstionEle.length){
    //   //       changeLoading(false);
    //   //       var deltaKeys = [];
    //   //       for(var key in deltaDict) {
    //   //         deltaKeys.push(key);
    //   //       }
    //   //       // console.log('deltaDict',deltaDict)
    //   //       // console.log('deltaKeys',deltaKeys)
    //   //       deltaKeys.sort(function(a, b) {return b-a});
    //   //       // targetIndex = [];
    //   //       // console.log('ranking-', widgets[0].spec['style'].layout[0])
    //   //       for (var j = 0; j < deltaKeys.length; j++){
    //   //         switch(deltaDict[deltaKeys[j]]){
    //   //           case 0:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[0]);
    //   //             break;
    //   //           case 1:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[1]);
    //   //             break;
    //   //           case 2:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[2]);
    //   //             break;
    //   //           case 3:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[3]);
    //   //             break;
    //   //           case 4:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[4]);
    //   //             break;
    //   //           case 5:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[5]);
    //   //             break;
    //   //           case 6:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[6]);
    //   //             break;
    //   //           case 7:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[7]);
    //   //             break;
    //   //           case 8:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[8]);
    //   //             break;
    //   //           case 9:
    //   //             newTargetIndex.push(widgets[0].spec['style'].layout[9]);
    //   //             break;
    //   //         }
    //   //         // targetIndex.push(deltaDict[deltaKeys[j]])
    //   //       }
          

    //   //       widgets[0].spec['style'].layout = newTargetIndex;
            



    //   //       // console.log('delta',delta);

    //   //       // console.log('featuresList-----',featuresList);

    //   //       changeMapping(widgets);
                
    //   //       return;
    //   //     }

    //   //     html2canvas(suggesstionEle[i],{useCORS:true})
    //   //     .then(function(canvas){
    //   //       var ctx = canvas.getContext('2d');
    //   //         pixels = ctx.getImageData(0,0,160,160);
    //   //         // imgPixcelsArray.push(pixels);
    //   //       }
    //   //     )
    //   //     .then(function(){
            
    //   //         // setTimeout(function() {
    //   //           let VisualScore = 0;
    //   //           // console.log('imgPixcels',imgPixcels)
    //   //           for(let j = 0; j < pixels.length; j=j+4){
    //   //             if((j+1) / 4 % 160 <= 80) {
    //   //               let piancha = (80 - (j + 1) / 4 % 160) * 8 + j
    //   //               if(pixels[j] === pixels[piancha] && pixels[j+1] === pixels[piancha+1] && pixels[j+2] === pixels[piancha+2]){
    //   //                 VisualScore++;
    //   //               }
    //   //             }else {
    //   //               let piancha = j - ((j + 1) / 4 % 160 - 80) * 8
    //   //               if(pixels[j] === pixels[piancha] && pixels[j+1] === pixels[piancha+1] && pixels[j+2] === pixels[piancha+2]){
    //   //                 VisualScore++;
    //   //               }
    //   //             }
              
                  
    //   //           }
    //   //           // console.log('imgPixcels.length/4',imgPixcels.length/4)
    //   //           // console.log('VisualScore[i]', VisualScore)
    //   //           VisualScore = (pixels.length/4 - VisualScore)/ (pixels.length/4)
    //   //           deltaDict[VisualScore] = i;

    //   //             // deltaDict[delta] = i;
    //   //             i++;
    //   //             nextStep();
    //   //         // }, 10 + i)
              
    //   //       })

    //   //   }
    //   //   nextStep(this.props);
       
    //   // }

    //   function shuffleArray(arr) {
    //     var len = arr.length;
    //     for (var i = 0; i < len - 1; i++) {
    //         var index = parseInt(Math.random() * (len - i));
    //         var temp = arr[index];
    //         arr[index] = arr[len - i - 1];
    //         arr[len - i - 1] = temp;
    //     }
    //     return arr;
    // }
    

    //   let oldIndex = widgets[0].spec['style'].layout;

    //   let newTargetIndex = shuffleArray(oldIndex)

    //   widgets[0].spec['style'].layout = newTargetIndex;

    //   // console.log('delta',delta);

    //   // console.log('featuresList-----',this.props.featuresList);

    //   changeMapping(widgets);

    

      
         
  
    //      this.setState({
    //       // imgPixcelsArray: newImgPixcelsArray,
    //       targetIndex: newTargetIndex
    //      });
    //   }else {
    //     this.setState({
    //       inspireMode: false
    //     })
    //   }

      
      

    }

    inspireRanking = () => {

      // if(this.state.inspireMode == false) {
      //   var rank=document.getElementsByClassName('rank');
      //   for (var i = 0; i < rank.length; i++) {
      //       rank[i].style.color = '#968176';
      //   }
      // document.getElementById('inspire').style.color = 'rgb(226, 87, 11)';
      // } 
      // // else {
      //   this.setState({
      //     inspireMode: true
      //   })
      // // }

      // var rank=document.getElementsByClassName('rank');
      // for (var i = 0; i < rank.length; i++) {
      //     rank[i].style.color = '#968176';
      // }
      // document.getElementById('inspire').style.color = 'rgb(226, 87, 11)';
      this.props.changeRankMode(false, false, true);
     

      

    }

    // downLoad=(e)=>{
    //     var mycanvas=document.getElementById('pre'+this.state.index).lastChild;
    //     function fileDownload(downloadUrl) {
    //         let aLink = document.createElement("a");
    //         aLink.style.display = "none";
    //         aLink.href = downloadUrl;
    //         aLink.download = "myDashBoard.png";
    //         // 触发点击-然后移除
    //         document.body.appendChild(aLink);
    //         aLink.click();
    //         document.body.removeChild(aLink);
    //     }
    //     html2canvas(mycanvas).then(function(canvas) {
    //         var imgData = canvas.toDataURL("image/png");
    //         fileDownload(imgData);
    //       });
    // }


    render() {
      console.log('this.props.similarMode', this.props.similarMode);
      console.log('this.props.beautyMode', this.props.beautyMode);
      console.log('this.props.inspireMode', this.props.inspireMode);

        return (
            <div className='pane'style={{zIndex: 5, width: '100%', height:'100%'}}>
     
                <Divider orientation="left">SUGGESTIONS</Divider>
                <Header className="canvasHead" style={{ height:'40px',background: "#fff",lineHeight:'34px',padding:0}}>
                <div className="canvasColor">
                <Icon type="apartment" className = "rank" id = "similar" style={{transform: 'scale(1.5)' ,padding: '10px', color: this.props.similarMode? 'rgb(226, 87, 11)': '#968176'}} onClick={()=>this.similarRanking()}/>
                </div>
                <div className="canvasColor">
                <Icon type="sketch"  className = "rank"  id = "beauty" style={{transform: 'scale(1.5)' ,padding: '10px', color: this.props.beautyMode? 'rgb(226, 87, 11)': '#968176'}} onClick={()=>this.beautyRanking()}/>
                </div>
                <div className="canvasColor">
                <Icon type="bulb"  className = "rank" id = "inspire" style={{transform: 'scale(1.5)' ,padding: '10px', color: this.props.inspireMode? 'rgb(226, 87, 11)': '#968176'}} onClick={()=>this.inspireRanking()}/>
                </div>
                <div class="localImg" style={{ width: '160px', height: '160px', marginTop: '10px'}}></div>
                </Header>
                <div id="pictoPreview" style={{width: '100%', height:'100%'}}>
                    {/* <div className='content' > */}
                        {/* ()=>this.chooseD(id)等效于this.chooseD.bind(this, id),this.chooseD.bind(this, id)影响性能 */}
                        {/* <div className="suggestionicon">
                        <Icon type="star" />
                        <Icon type="delete" />
                        </div> */}
                        {this.props.inspireMode == false ? this.generateSuggestion() : this.generateInspire()}
                      
                    </div>
                 </div>
                 
            // </div>
        )
    }
}
