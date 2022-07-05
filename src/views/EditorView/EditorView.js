import React, { Component } from 'react';
import { Spin,Layout } from 'antd';
import CanvasPane from '../CanvasPane';
import DesignPane from '../DesignPane';
import DataPane from '../DataPane';
import SuggestionPane from '../SuggestionPane';
//帮助构造拖拽接口
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import './editview.css';
import html2canvas from 'html2canvas';


const { Sider, Content, Footer } = Layout;
var index = 0;


export default class EditorView extends Component {
        state = {
            windowWidth:window.innerWidth,
            windowHeight:window.innerHeight,
            contentHeight:window.innerHeight-320,
            contentWidth:window.innerWidth-660,
            scrollLeft:0,
        };


    preCanvas=(e)=>{
        index++;
        console.log(index);
        function convertCanvasToImage(canvas){  
            //新Image对象，可以理解为DOM  
            var image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持  
            // 指定格式 PNG  
            image.src = canvas.toDataURL("image/png");
            return image;  
        } 
        // var mycanvas=document.getElementById('canvas-wrapper');
        var mycanvas=document.getElementsByClassName('konvajs-content')[0];

        html2canvas(mycanvas).then(function(canvas) {
            // var mycanvas=document.getElementById('canvas'); 

            //将转换后的img标签插入到html中  

            var img=convertCanvasToImage(canvas);  

            var pre1 = document.getElementById('pre'+ index);
            var tarcanvas = pre1.appendChild(canvas);
            tarcanvas.style.width = '100%';
            tarcanvas.style.height = '100%';
            var ctx = tarcanvas.getContext('2d');

            img.onload = function () {
                // ctx.drawImage(img, 1050,450,800,600,20, 0,256,180);
                ctx.drawImage(img, 0,0,img.width,img.height,0,0,100,50)
                // console.log('onload finish');
            }


            // document.getElementById('pre1').append(img);
        });

    } 
    downLoadCurrent=(e)=>{
        var mycanvas=document.getElementsByClassName('konvajs-content')[0];
        function fileDownload(downloadUrl) {
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = downloadUrl;
            aLink.download = "myDashBoard.png";
            // 触发点击-然后移除
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
          }
        

        html2canvas(mycanvas).then(function(canvas) {
            var imgData = canvas.toDataURL("image/png");
            fileDownload(imgData);
          });
    }

    

    render() {
   
        const {windowWidth,windowHeight,contentHeight,contentWidth} = this.state;
        const isLoading = this.props.isLoading;
 
        return (
            <Spin spinning={isLoading}>
                <div id="editview" style={{ height: windowHeight,width: windowWidth}}  >
                <DndProvider backend={HTML5Backend}>
                    <Layout>
                        <Sider width={0.3*windowWidth} style={{backgroundColor:'#fff'}}>
                            <Layout>
                                <Content width={0.3*windowWidth} style={{height:0.4*windowHeight, padding:'5px'}}>
                                    <DesignPane />
                                </Content>
                                <Footer width={0.3*windowWidth}  style={{height:0.606*windowHeight,marginBottom: '0px', padding:'5px'}}>
                                    <DataPane />
                                </Footer>
                            </Layout> 
                        </Sider>
                        <Layout style={{ height: windowHeight, backgroundColor: '#F5F5F5'}}>
                            <Content width={0.57*windowWidth} style={{ height: windowHeight , padding:'5px 0'}}>
                                <CanvasPane />
                            </Content>
                        </Layout>
                        <Sider width={0.15*windowWidth} style={{height: windowHeight, background:'#F5F5F5', padding:'5px'}}>
                            <SuggestionPane />
                        </Sider>   
                    </Layout>
                </DndProvider>     
                </div>
            </Spin>
        )
    }
}
