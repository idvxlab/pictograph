import React, { Component } from 'react';
import { Divider ,Icon, Upload,Layout,Radio,Modal,Select} from 'antd';
import './designpane.css';
import _ from 'lodash';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import {None} from 'vega';
import $ from 'jquery';
import infoDict from '@/infoDict';
// import { PNG } from 'pngjs/browser';


const { Sider, Content } = Layout;
const { Option } = Select;


let elementObj={
    Background:{
        color:"#FF5C3C",
        img:require("./demo1/1.png")
    },
  
    Text:{
        font:"roboto",
        textcolor:"#FFFFFF",
        img:require("./demo1/3.png")
    },
    Vis:{
        fillcolor:"#FF5C3C",
        strokecolor:"#FFFFFF",
        img:require("./demo1/2.png")
    },
}

let elementlist1=[
    {
        picelement:"Background",
        background:["#f6f6f5"],
        img:require("./demo1/4.png") //获取图片
    },
    {
        picelement:"Vis",
        fillcolor:["#2b476f"],
        strokecolor:["#FFFFFF"],  //若无则strokecolor：[],
        texture:null,
        img:require("./demo1/5.png")
    }, //这个例子暂时只有icon，然后颜色是#2b476f
    {
        picelement:"Text",
        font:"century-gothic",
        textcolor:["#fbf3e7"], //如果多种则用逗号在后面添加 ["#FFFFFF","#eeeee"]

        img:"./demo1/6.png",
    },   
]


// let elementlist2=[
// {picelement: "Background", 
// background: ["#f6f6f5"]}, 
// {picelement: "Vis",
//  fillcolor: ["#2191d7", "#f53230", "#e5a27b", "#eadad7", "#85c2e8"], 
//  strokecolor: ["white"], 
//  img: require("./outputs/VIS_Graphs-and-Charts-Picture-Graphs-Barrie-Population82.png")
// }, 
// {picelement: "Text", 
// font: "century-gothic", 
// textcolor: ["#000"],
//  img: []}]


//  let elementlist=[
//      {'background': ['#0e194a'], 'picelement': 'Background'},
//  {'fillcolor': ['#fefefe', '#cfd0da', '#96a4b6', '#5a6081'],
//   'img': './outputs/VIS_TIM截图20200323124249.png',
//   'picelement': 'Vis',
//   'strokecolor': ''},

//  {'font': 'frutigerltstd-roman',
//   'picelement': 'Text',
//   'img': './outputs/textbox_TIM截图20200323124249.png',      
//   'textcolor': ['#495177']
// },
// //   {'picelement':'icon',
// //   'img':'./outputs/icon_TIM截图20200323124249.png',
// //   'background':'#fafdfd',
// //   'color':'#2dd4d6'}
// ]

let elementlist=[
    {'background': ['#0e194a'], 'picelement': 'Background'},     
    {'font': 'frutigerltstd-roman',
    'img':'./outputs/textbox_TIM截图20200323124249.png',
    'picelement': 'Text',
    'textcolor': ['#495177']
    },
    {'picelement':'icon',
    'img':'./outputs/icon_TIM截图20200323124249.png',
    'background':['#fafdfd'],
    'color':['#2dd4d6'],
    'isVis':"false"
    },
    {'fillcolor': ['#fefefe', '#cfd0da', '#96a4b6', '#5a6081'],
    'img': './outputs/VIS_TIM截图20200323124249.png',
    'picelement': 'Vis',
    'strokecolor': ''
    },
]




function ChildStyle(props){
    
    let elementlist = props.featuresList[props.featuresList.length - 1]['features'];

     
    if(props.radiovalue===1){
       let background=[];
        return(
            <div className="picStyle" style={{overflowX:'hidden',overflowY:'auto',height: "120px"}}>
                <div className="styleElements">
                Background
                    <div className="style1">                    
                    {
                        elementlist[props.radiovalue-1].background.map((item,index)=>{
                            background.push({backgroundColor: item})
                            return(
                                <div key={index} className="colorTheme" style={background[index]} title={item}>           
                                </div>
                            )
                        })  
                    }                                
                    </div>
                </div>
            </div>
        )
    }else if(props.radiovalue===elementlist.length-1&&elementlist[elementlist.length-2].picelement==="icon"){
        if(elementlist[elementlist.length-2].isVis==="false" || elementlist[elementlist.length-2].isVis===""){
            let fillcolor =[];
            let a=(
            <div className="styleElements">
            Icon color
            <div className="style1">
            {
                    elementlist[elementlist.length-2].color.map((item,index)=>{
                        fillcolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={fillcolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }
            </div>
            </div>
            )

            return(
                <div className="picStyle" style={{overflowX:'hidden',overflowY:'auto',height: "120px"}}>
                   {a}     
                </div>
               )
        } else return null;
        
    }
    else if(props.radiovalue===elementlist.length){
        let fillcolor =[];
        let strokecolor=[];
        let a=(
            <div className="styleElements">
            Fill color
            <div className="style1">
            {
                    elementlist[props.radiovalue-1].fillcolor.map((item,index)=>{
                        fillcolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={fillcolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }

            </div>
        </div>
        )
        let b;
        if(elementlist[props.radiovalue-1].strokecolor.length>0){
            b=(   <div className="styleElements">
            Stroke color
            <div className="style1">
                 {
                    elementlist[props.radiovalue-1].strokecolor.map((item,index)=>{
                        strokecolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={strokecolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }
            </div>
        </div>)
        }else{
            b=null;
        }

        let c;
        if(!elementlist[props.radiovalue-1].texture){
           c=null;
        }else{
            c=(   <div className="styleElements">
            Texture
            <div className="style1">                                  
                <img className="elementsimg"  src={require(`${elementlist[props.radiovalue-1].texture}`)} />                 
            </div>
        </div>)
        }

       return(
        <div className="picStyle" style={{overflowX:'hidden',overflowY:'auto',height: "120px"}}>
           {a}
           {b}  
           {c}      
        </div>
       )
    }else if(props.radiovalue===2){
        let textcolor=[];
        return(
         <div className="picStyle" style={{overflowX:'hidden',overflowY:'auto',height: "120px"}}>
            <div className="styleElements">
                Font color
                <div className="style1">
                {
                        elementlist[props.radiovalue-1].textcolor.map((item,index)=>{
                            textcolor.push({backgroundColor: item})                   
                            return(
                                <div key={index} className="colorTheme" style={textcolor[index]} title={item}>           
                                </div>
                            )
                        })  
                    }                 
                </div>
            </div>
    
            <div className="styleElements">
                Font
                <div className="style1" title={infoDict['temp01_picto']['font']}>
                    {infoDict['temp01_picto']['font']}
                </div>
            </div>
         </div>
        )
     } else{
        let background =[];      
        let fillcolor =[];
        let strokecolor=[];
        let textcolor=[];

        let b;
        if(elementlist[elementlist.length-1].strokecolor.length>0){
            b=(   <div className="styleElements">
            Stroke color
            <div className="style1">
                 {
                    elementlist[elementlist.length-1].strokecolor.map((item,index)=>{
                        strokecolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={strokecolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }
            </div>
        </div>)} else { b=null}
        let c;
        if(!elementlist[elementlist.length-1].texture){
        c=null;
        }else{
            c=(   <div className="styleElements">
            Texture
            <div className="style1">
            <img className="elementsimg"  src={require(`${elementlist[elementlist.length-1].texture}`)}  />
                
            </div>
        </div>)
        }
       let d;
        if(elementlist[elementlist.length-2].isVis==="false" && elementlist[elementlist.length-2].picelement==="icon"){
            let fillcolor =[];
            d=(
            <div className="styleElements">
            Icon color
            <div className="style1">
            {
                    elementlist[elementlist.length-2].color.map((item,index)=>{
                        fillcolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={fillcolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }
            </div>
            </div>
            )
        } else d=null;


    return (
        <div className="picStyle"  style={{overflowX:'hidden',overflowY:'auto',height: "120px"}}>
            <div className="styleElements">
                Background
                <div className="style1">
                {
                    elementlist[0].background.map((item,index)=>{
                        background.push({backgroundColor: item})
                        return(
                            <div key={index} className="colorTheme" style={background[index]} title={item}>           
                            </div>
                        )
                    })  
                }
                </div>
            </div>

            <div className="styleElements">
                Fill color
                <div className="style1">
                {
                    elementlist[elementlist.length-1].fillcolor.map((item,index)=>{
                        fillcolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={fillcolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }
                </div>
            </div>

                {b}
                {d}
            <div className="styleElements">
                Font color
                <div className="style1">
                {
                    elementlist[1].textcolor.map((item,index)=>{
                        textcolor.push({backgroundColor: item})                   
                        return(
                            <div key={index} className="colorTheme" style={textcolor[index]} title={item}>           
                            </div>
                        )
                    })  
                }
                </div>
            </div>

            <div className="styleElements">
                Font
                <div className="style1" title={infoDict['temp01_picto']['font']}>
                    {infoDict['temp01_picto']['font']}
                </div>
            </div>


            {c}
    </div>
    )
 }
}


function ChildElements(props){

  let radioPush=[];
  let elementlist = props.featuresList[props.featuresList.length - 1]['features'];
  

       let result= elementlist.map((item,index)=>{
         //console.log(item+ '---'+item.img)
         if(item.picelement==="Background"){
             let a={
                backgroundColor: item.background,
                width:"80px",
                height:"20px",
                display: "inline-block",
                marginBottom: "-5px",
                marginLeft: "10px",
                border: "1px solid rgb(150, 129, 118)",
                borderRadius: "5px"
             }
             let b=(
                <div key={"pic"+index} >
                <Radio value={index+1}  >
                    <div style={a} title={"Background"}></div>
               </Radio>
               </div>
             )
            radioPush.push(b);
         } else if(item.picelement==="Vis"){
            let b=(
                <div key={"pic"+index}>
                <Radio value={index+1}  >
                <img className="elementsimg" style={{border: "0px solid rgb(150, 129, 118)", borderRadius: "5px", width: "80px", marginLeft: "10px"}} src={'data:image/png;base64,'+item.img} title={"Vis"}/>
               </Radio>
               </div>
             )
             radioPush.push(b);
        }
             else if(item.picelement==="icon"){
                 if(item.isVis==="false"){
                let b=(
                    <div key={"pic"+index}>
                    <Radio value={index+1}  >
                    <img className="elementsimg1" style={{border: "0px solid rgb(150, 129, 118)", borderRadius: "5px", width: "80px", marginLeft: "10px"}} src={'data:image/png;base64,'+item.img}  title={"Icon-lable"}/>
                   </Radio>
                   </div>
                 )
                 radioPush.push(b);
                }
         }else{
             let b=(
                <div key={"pic"+index}>
                <Radio value={index+1}  >
                <img className="elementsimg1" style={{border: "0px solid rgb(150, 129, 118)", borderRadius: "5px", width: "80px", marginLeft: "10px"}} src={'data:image/png;base64,'+item.img} title={"Text"}/>
               </Radio>
               </div>
             )
          radioPush.push(b);
         }
         return null;
   
        })

        return radioPush;
    
}


export default class DesignPane extends Component {
    constructor(props){
        super(props);
        this.state={
            changeFileList: false, //DidUpdate校验-数组的prevState和this.state总是一致
            flushCount: 0,
            // fileList:[
            //     {
            //         uid: '-1',
            //         name: '【4】TIM截图20200626193304.png',
            //         status: 'done',
            //         url: 'http://10.11.50.48:5000/home/sdq/Pictogram/demo/test1.png',
            //       },
            //       {
            //         uid: '-2',
            //         name: '【11】TIM截图20200622215512.png',
            //         status: 'done',
            //         url: 'http://10.11.50.48:5000/home/sdq/Pictogram/demo/test2.png',
            //       },
            //       {
            //         uid: '-3',
            //         name: '【11】TIM截图20200622215624.png',
            //         status: 'done',
            //         url: 'http://10.11.50.48:5000/home/sdq/Pictogram/demo/test3.png',
            //       }
            // ],
            fileList:[],
            childStyleValue:0,
            showUploadList:true,

            previewVisible: false,
            previewImage: '',
            // fileList: [],
            currentImgData: '',

            // featuresList: []
        }
    }

    // componentWillMount(){
    //     let cardColor=this.props.cardColor;
    //     let textColor=this.props.textColor;
        
    //     let textfont=this.props.textfont;
    //     let iconcolor=this.props.iconcolor;
    //     cardColor=elementlist[0].background[0];
       

    //     if(elementlist[1].textcolor.length>0)  textColor=elementlist[1].textcolor[0]
        
    //     if(elementlist[1].font!=="")  textfont=elementlist[1].font
    //     if(elementlist[elementlist.length-2].picelement==="icon" && elementlist[elementlist.length-2].isVis==="false") iconcolor=elementlist[elementlist.length-2].color[0]

    //     var data = []
    //     let colormap=[];

        
    //     //颜色拓展 - 这里先不进行颜色拓展 - datapane中进行
    //     let fillColor = elementlist[elementlist.length-1].fillcolor;
    //     function hexToRgb(hex) {
    //         return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
    //                 + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
        
    //     }
    //     let colorsetData = _.cloneDeep(fillColor);
    //     for(let i=0; i < colorsetData.length; i++){
    //         console.log('colorsetData[i]',colorsetData)
    //         if(colorsetData[i][0] == '#'){
    //             let tempRGB = hexToRgb(colorsetData[i])  
    //             colormap.push(tempRGB)
    //             let temp1 = tempRGB.replace(/rgb\(/, " ")
    //             let temp2 = temp1.replace(/\)/, " ")
    //             let temp3 = temp2.split(",")
    //             let temp4 = []
    //             temp4=temp3.map(function(data){
    //                 return +data;
    //             });
    //             colorsetData[i] = temp4;
    //         }
    //     }
    //     colormap =  _.cloneDeep(colorsetData);


    //     this.props.changeColorStyle(cardColor,cardColor,textColor,colormap,textfont,iconcolor)

        

       

        
        
    //     // //前后端传输

    //     // data = []
    //     // // setTimeout(()=> console.log('成功',data))

    //     // HttpUtil.post(ApiUtil.API_COLOR_EXTEND, colorsetData)
    //     //     .then(re=>{
    //     //         data = re.data
    //     //         for(let i=0; i < data.length; i++){
    //     //             let rgb = '';
    //     //             rgb = 'rgb(' + data[i][0] + ','+ data[i][1] + ','+data[i][2] +')';       
    //     //             colormap.push(rgb);          
    //     //         }
           
    //     //         this.props.changeColorStyle(cardColor,cardColor,textColor,colormap,textfont,iconcolor)
                
    //     //     })
    //     //     .catch(error=>{
    //     //         console.log(error.message);
    //     //     });      
    // }

    // componentDidUpdate(prevProps,prevState,spanshot){
    //     console.log('this.state',this.state);
    //     console.log('this.prevState',prevState);
        // let fileList = this.state.fileList;
        // if(this.state.changeFileList) {
        //     this.setState({
        //         changeFileList: false
        //     })
        //     let featureImage = this.state.fileList[this.state.fileList.length - 1].thumbUrl;
        //     HttpUtil.post(ApiUtil.API_FEATURES_EXTRACT,featureImage.split(',')[1])
        //     .then(re=>{
        //         // featuresList = this.props.featuresList;
        //         // featuresList.push(re.data);
        //         this.props.featuresList.push(re.data);
        //         // result = re.data;
        //         console.log('re.data',re.data)
                
        //     })
        //     .catch(error=>{
        //         console.log(error.message);
        //     })
        //     .then(re=>{
                
        //     })

        // }
        
       
    // }

    uploadImg = ({ fileList }) => {
        console.log('fileList-upload', fileList)
        
        this.setState({ 
            fileList : fileList,
            changeFileList: true
        });

        
        
        
    };

    selectImgData = (imgName) => {
        let fileList = this.state.fileList;
        
        

        let currentImgData;
        for(let i = 0; i < fileList.length; i++) {
            if(fileList[i].name === imgName) currentImgData = i;
        }
        this.props.changeLoading(true);
        let featureImage = this.state.fileList[this.state.fileList.length - 1].thumbUrl;
        
        // var png = new PNG(featureImage.split(',')[1]); // data is the base64 encoded data
        // var line;
        // var y = 0;
        // var pixcels = [];
        // while(line = png.readLine())
        // {
        //     for (var x = 0; x < line.length; x++){
        //         pixcels.push(x, y, '#' + line[x].toString(16).padRight('0', 6));
        //     }
        //     y++;
        // }
        // console.log('design-fileList',pixcels);

        // this.props.featuresList.push({
        //     'features': re.data,
        //     'resizeImg': re.resize_data
        // });
        // this.setState({
        //     flushCount: this.state.flushCount + 1
        // })//强制刷新 不然childStyle不更新

        // this.props.changeLoading(false);
            
        // let elementlist = this.props.featuresList[this.props.featuresList.length - 1]['features'];
        // console.log('elementlist', elementlist)

        // //颜色逻辑

        // let cardColor;
        // let textColor;
        
        // let textfont ;
        // let iconcolor;

        // cardColor=elementlist[0].background[0];
        

        // if(elementlist[1].textcolor.length>0)  {
        //     textfont = infoDict['temp01_picto']['font']
        //     textColor=elementlist[1].textcolor[0]
        // }
        
        // if(elementlist[1].font!=="")  {
        //     textfont = infoDict['temp01_picto']['font']
        //     // textfont=elementlist[1].font
        // }
        // if(elementlist[elementlist.length-2].picelement==="icon" && elementlist[elementlist.length-2].isVis==="false") iconcolor=elementlist[elementlist.length-2].color[0]

        // var data = []
        // let colormap=[];
        // //颜色拓展 - 这里先不进行颜色拓展 - datapane中进行
        // let fillColor = elementlist[elementlist.length-1].fillcolor;
        // function hexToRgb(hex) {
        //     return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
        //             + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
        
        // }
        // let colorsetData = _.cloneDeep(fillColor);
        // for(let i=0; i < colorsetData.length; i++){
        //     console.log('colorsetData[i]',colorsetData)
        //     if(colorsetData[i][0] == '#'){
        //         let tempRGB = hexToRgb(colorsetData[i])  
        //         colormap.push(tempRGB)
        //         let temp1 = tempRGB.replace(/rgb\(/, " ")
        //         let temp2 = temp1.replace(/\)/, " ")
        //         let temp3 = temp2.split(",")
        //         let temp4 = []
        //         temp4=temp3.map(function(data){
        //             return +data;
        //         });
        //         colorsetData[i] = temp4;
        //     }
        // }
        // colormap =  _.cloneDeep(colorsetData);

        // this.props.changeColorStyle(cardColor,cardColor,textColor,colormap,textfont,iconcolor);

        // const imgData = {title: imgName,base: featureImage.split(',')[1]};
        const imgData = featureImage.split(',')[1]+" "+imgName;

        HttpUtil.post(ApiUtil.API_FEATURES_EXTRACT, imgData)
        .then(re=>{
            // featuresList = this.props.featuresList;
            // featuresList.push(re.data);
            
            this.props.featuresList.push({
                'features': re.data,
                'resizeImg': re.resize_data
            });
            this.setState({
                flushCount: this.state.flushCount + 1
            })//强制刷新 不然childStyle不更新
            // result = re.data;
            console.log('re.data',re)
            
        })
        .catch(error=>{
            console.log(error.message);
        })
        .then(re=>{
            this.props.changeLoading(false);
            
            let elementlist = this.props.featuresList[this.props.featuresList.length - 1]['features'];
            console.log('elementlist', elementlist)

            //颜色逻辑

            let cardColor;
            let textColor;
            
            let textfont ;
            let iconcolor;

            cardColor=elementlist[0].background[0];
            

            if(elementlist[1].textcolor.length>0)  {
                textfont = infoDict['temp01_picto']['font']
                textColor=elementlist[1].textcolor[0]
            }
            
            if(elementlist[1].font!=="")  {
                textfont = infoDict['temp01_picto']['font']
                // textfont=elementlist[1].font
            }
            if(elementlist[elementlist.length-2].picelement==="icon" && elementlist[elementlist.length-2].isVis==="false") iconcolor=elementlist[elementlist.length-2].color[0]

            var data = []
            let colormap=[];
            //颜色拓展 - 这里先不进行颜色拓展 - datapane中进行
            let fillColor = elementlist[elementlist.length-1].fillcolor;
            function hexToRgb(hex) {
                return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
                        + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
            
            }
            let colorsetData = _.cloneDeep(fillColor);
            for(let i=0; i < colorsetData.length; i++){
                console.log('colorsetData[i]',colorsetData)
                if(colorsetData[i][0] == '#'){
                    let tempRGB = hexToRgb(colorsetData[i])  
                    colormap.push(tempRGB)
                    let temp1 = tempRGB.replace(/rgb\(/, " ")
                    let temp2 = temp1.replace(/\)/, " ")
                    let temp3 = temp2.split(",")
                    let temp4 = []
                    temp4=temp3.map(function(data){
                        return +data;
                    });
                    colorsetData[i] = temp4;
                }
            }
            colormap =  _.cloneDeep(colorsetData);

            this.props.changeColorStyle(cardColor,cardColor,textColor,colormap,textfont,iconcolor);
        })


    


        this.props.changeLoading(true);

        new Promise((resolve,reject)=>{
            fetch(ApiUtil.API_FEATURES_EXTRACT,{ 
                method: 'POST',
                headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'responseType': 'application/json'
                    // 'refer': 'http://10.11.50.48',
                    // 'host': '10.11.50.48'
                },
                mode: 'cors',
                credentials: 'include',
                // mode: 'no-cors',
                // cache: 'default',
                body:  JSON.stringify(featureImage.split(',')[1]),
            })
                .then(response=>response.json())
                .catch(err => console.error(err))
                .then(result=>{
                    console.log('featuresList',this.props.featuresList);
                    this.props.featuresList.push(result);
                    this.props.changeLoading(false);
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
 

        
        
            

        this.setState({
            currentImgData: imgName
        })
        
    }

    deleteImgData = (imgIndex) => {
        let fileList = this.state.fileList;
        fileList.splice(imgIndex);

        let featuresList = this.state.featuresList;
        featuresList.splice(imgIndex);
        
        this.setState({
            fileList: fileList,
            featuresList: featuresList,
            changeFileList: true
        })
    }

    showImgPreview = (imgIndex) => {
        let fileList  = this.state.fileList;
        let previewImage = fileList[imgIndex].thumbUrl;
        // console.log('previewImage',previewImage)
        this.setState({
            previewImage: previewImage,
            previewVisible: true
        })
    }

    cancelImgPreview = () => {
        // console.log('previewcanel')
        this.setState({
            previewVisible: false
        })
    }
    changeChildStyle = e => {
        
        this.setState({
            childStyleValue: e.target.value,
        });
    };
    
    render() {
        const { previewVisible, previewImage, fileList, currentImgData } = this.state;
        // console.log('featuresList-conmpont',this.props.featuresList);

        return (
               <div className='pane' style={{width: '100%',height: '100%'}}>
                    <Divider orientation="left">DESIGN</Divider>
                    <div id="imgupload">
                        <div className="clearfix">
                            <div style={{top:0, left:0}}>
                                <Select id="data-selection"
                                    value={(fileList.length > 0 && currentImgData == None)? fileList[0].name : currentImgData}
                                    defaultValue={(fileList.length > 0 && currentImgData == None)? fileList[0].name : currentImgData}
                                    onChange={(e) => this.selectImgData(e)}
                                    optionLabelProp="label"
                                    style={{  width: 380, padding: '0px 10px 0px 0px'}}
                                >
                                    {    
                                        fileList.map((d,i) => (
                                            <Option label={d.name} key={d.name} style={{height:80}}>
                                                {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}> */}
                                                    <img alt={d.name} style={{ width: 60, height: 60, marginTop:'6px'}} src={fileList[i].thumbUrl} />
                                                    <div style={{float: 'right'}}>
                                                        {d.name.length>30? d.name.slice(0, 29)+'...    ':d.name+'    ' }
                                                        <Icon type='eye' style={{transform: 'scale(1.5)', fontSize: 10, margin:'-30px 5px 10px 10px' }}
                                                            onClick={(e) => { this.showImgPreview(i); e.stopPropagation() }} />
                                                        <Icon type='delete' style={{transform: 'scale(1.5)', fontSize: 10, margin:'-30px 10px 10px 5px' }}
                                                            onClick={(e) => { this.deleteImgData(i); e.stopPropagation() }} />
                                                        
                                                    </div>

                                                    
                                                {/* </Modal> */}
                                            </Option>
                                        ))
                                    }
                                </Select>

                                <Modal
                                    footer={null}
                                    visible={previewVisible}
                                    onCancel={this.cancelImgPreview}
                                >
                                    <img src={previewImage} />
                                </Modal>
                            </div>
                            <div style={{ width:'30px',height: '30px',padding: '0px 0px 0px 0px',marginLeft:'380px',marginTop:'-30px', border:'1px solid #968176', borderRadius:'2px'}} >
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    // listType="picture-card"
                                    listType="picture"
                                    fileList={fileList}
                                    onChange={this.uploadImg}
                                >
                                    {fileList.length >= 8 ? null : <Icon type="upload" />}
                                </Upload>
                            </div>
                        </div>
                    </div>

  {/* <img className="elementsimg" src="https://www.w3school.com.cn/i/eg_tulip.jpg" /> */}

                    <Layout>
                        <Sider style={{backgroundColor: '#fff'}}>
                            <Divider orientation="center">Elements</Divider>
                            <Radio.Group onChange={this.changeChildStyle} value={this.state.childStyleValue}>
                                <div>
                                    <Radio value={0}  >
                                        <span style={{marginLeft:"10px"}}>All</span>
                                    </Radio>
                                </div>
                                {
                                  this.props.featuresList.length !== 0 ? <ChildElements  featuresList ={this.props.featuresList}/>: null
                              }  
                            </Radio.Group>


                        </Sider>
                        <Content style={{backgroundColor: '#fff' }} >
                            <Divider orientation="center">Styles</Divider>                          
                              {
                                  this.props.featuresList.length !== 0 ? <ChildStyle radiovalue={this.state.childStyleValue} featuresList ={this.props.featuresList} changeColorStyle={this.props.changeColorStyle}/>: null
                              }                             
                        </Content>
                    </Layout>
                   
                </div>
                
        )
    }
}
