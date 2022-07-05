import React, { Component } from 'react';
import { Divider ,Icon,Button,Upload,Layout,Radio} from 'antd';
import './designpane.css';
import { element } from 'prop-types';
const { Sider, Content } = Layout;



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






//console.log("elementObj:",Object.keys(elementObj))
//console.log("Vis:",Object.keys(elementObj["Vis"]))
function ChildStyle(props){

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
        if(elementlist[elementlist.length-2].isVis==="false"){
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
                Text color
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
                <div className="style1" title={elementlist[props.radiovalue-1].font}>
                    {elementlist[props.radiovalue-1].font}
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
                Text color
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
                <div className="style1" title={elementlist[1].font}>
                    {elementlist[1].font}
                </div>
            </div>


            {c}
    </div>
    )
 }
}


function ChildElements(){

  let radioPush=[];

       let result= elementlist.map((item,index)=>{
         //console.log(item+ '---'+item.img)
         if(item.picelement==="Background"){
             let a={
                backgroundColor: item.background,
                width:"100px",
                height:"20px",
                display: "inline-block",
                marginBottom: "-5px",
                marginLeft: "10px"
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
                <img className="elementsimg" src={require(`${item.img}`)} title={"Vis"}/>
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
                    <img className="elementsimg1" src={require(`${item.img}`)}  title={"Icon-lable"}/>
                   </Radio>
                   </div>
                 )
                 radioPush.push(b);
                }
         }else{
             let b=(
                <div key={"pic"+index}>
                <Radio value={index+1}  >
                <img className="elementsimg1" src={require(`${item.img}`)} title={"Text"}/>
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
            fileList:[],
            imgList:[],
            value:0,
            showUploadList:true,
        }
    }

    componentWillMount(){
        // console.log("我在这里3",this.props.cardColor)
        let cardColor=this.props.cardColor;
        let textColor=this.props.textColor;
        let colormap=this.props.colormap;
        let textfont=this.props.textfont;
        let iconcolor=this.props.iconcolor;
        cardColor=elementlist[0].background[0];
        if(elementlist[1].textcolor.length>0)  textColor=elementlist[1].textcolor[0]
        colormap=elementlist[elementlist.length-1].fillcolor.concat(colormap)
        if(elementlist[1].font!=="")  textfont=elementlist[1].font
        if(elementlist[elementlist.length-2].picelement==="icon" && elementlist[elementlist.length-2].isVis==="false") iconcolor=elementlist[elementlist.length-2].color[0]

        this.props.changeColorStyle(cardColor,cardColor,textColor,colormap,textfont,iconcolor)
    }


    beforeUpload=file=>{
        const isJpgOrPng=file.type==="image/jpeg"||file.type==="image/png";
        if(!isJpgOrPng){
            alert("You can only upload JPG/PNG file,Please delete!");
        }
        return isJpgOrPng;
    }

    onChange=({file,fileList})=>{
        //console.log('fileList:',fileList);
        console.log("myphoto:",file)
        let imgList=[];
        fileList.map(function(item,key){
            //console.log("item.response:",item.response);
            if(file.status==="done"&&item.response && item.response.success){
                console.log("item.response:",item.response);
                imgList.push({url:item.response.url,Name:item.response.name});
            }else{
                if(item.url){
                    imgList.push({url:item.url.replace('http://',""),Name:item.name});
                }
            }
        });
        this.setState({fileList,imgList});
    }

     onChange1 = e => {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
      };
    
    render() {

        const {fileList,showUploadList}=this.state;
        const props1={
            name:'Uploadimg',
           // action:'http://dfs',
            action:'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            multiple:false,
            //listType: 'picture',
            accept:"image/jpg, image/png"
        }

        return (
           
                //    design pane
               // <div className='pane' style={{zIndex: 5, width: '100%', height:'100%'}}>
               <div className='pane' style={{width: '100%',height: '100%'}}>
                    <Divider orientation="left">DESIGN</Divider>
                    <div id="imgupload">
                     <div id="biankuang"></div>
                    <Upload {...props1}
                        fileList={fileList}
                        onChange={this.onChange}
                        beforeUpload={this.beforeUpload}
                       showUploadList={showUploadList}
                    >
                        <Button>
                            <Icon type="upload" />
                        </Button>
                    </Upload>
                    </div>

  {/* <img className="elementsimg" src="https://www.w3school.com.cn/i/eg_tulip.jpg" /> */}

                    <Layout>
                        <Sider style={{backgroundColor: '#fff'}}>
                            <Divider orientation="center">Elements</Divider>
                            <Radio.Group onChange={this.onChange1} value={this.state.value}>
                            <div>
                                <Radio value={0}  >
                                 <span style={{marginLeft:"10px"}}>All</span>
                                </Radio>
                            </div>
                                    <ChildElements/>
                            </Radio.Group>


                        </Sider>
                        <Content style={{backgroundColor: '#fff' }} >
                            <Divider orientation="center">Style</Divider>                          
                              <ChildStyle radiovalue={this.state.value}/>                             
                        </Content>
                    </Layout>
                   
                </div>
                
        )
    }
}
