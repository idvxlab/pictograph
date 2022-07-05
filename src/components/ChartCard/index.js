import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import DNDType from '@/constants/DNDType';
import ElementType from '@/constants/ElementType';
import {AreaChartOutlined,
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    RadarChartOutlined,
    DotChartOutlined,
    HeatMapOutlined,
    } from '@ant-design/icons/lib/icons';
import _ from 'lodash';
import './chartcard.css';
import {Tooltip} from 'antd'
import {Element, ChartInfo} from '@/models/Element';
import {getDefaultSpec} from '@/charts/Info';
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';
import ChartCategory from '@/constants/ChartCategory';
import { editMode } from '../../selectors/canvas';




//img size
let w = 400;
let h = 400;
//drag end pos
let x = 240;
let y = 100;

//初始化chartmode icon-highlightcolor
const defaultHighlightColor = '#e2570b';

// const chartSource = {

// 	beginDrag(props) {
//         props.cleanInterationLayer(true);
//         props.displayResourceTargetArea(true);
//         let dataIndex = 0
//         if (props.charttype === 'scatterplot') {
//             props.switchData(1); //countrys.csv
//             dataIndex = 1
//         }else if(props.charttype === 'map'){
//             props.switchData(2); //china.csv
//             dataIndex = 2
//         }else{
//             props.switchData(0); //car.csv
//         }
       
// 		return {
//             category: props.chartcategory,
//             type: props.charttype,
//             dataIndex: dataIndex
//         };
// 	},

// 	endDrag(props, monitor) {
//         props.displayResourceTargetArea(false);
// 		const item = monitor.getItem();
//         const dropResult = monitor.getDropResult();
        
//         ////获取鼠标结束拖拽的位置，基于canvas基点计算位置
//         let e = window.event;       //Firefox下是没有event这个对象的！！

//         //更改
//         let canvas=document.getElementsByClassName("react-grid-layout layout")[0];
//         let pos = canvas.getBoundingClientRect();//获取canvas基于父页面的位差
//         if((Number(e.clientX)-Number(pos.left))>0){
//             x = Number(e.clientX)-Number(pos.left)-w/2; //根据鼠标位置计算画布上元素位置,强制类型转换
//             y = Number(e.clientY)-Number(pos.top)-h/2;
//         }
//         console.log('dropResult-pan',dropResult);
// 		if (dropResult) {
//             console.log('dropResult',dropResult);
//             if (dropResult.target === "canvas") {
//                 //add element to scene
//                 const newScene = _.cloneDeep(dropResult.currentScene);
//                 const newChart = new ChartInfo(
//                     item.dataIndex,
//                     item.category, // category
//                     item.type, //type
//                     getDefaultSpec(item.category, item.type), //spec
//                     x,
//                     y,
//                     w,
//                     h,
//                     0,
//                 )
//                 const newElement = new Element(ElementType.CHART, newChart);
//                 newScene.addElement(newElement);
//                 props.addElement(newElement);
//                 props.updateScene(dropResult.sceneIndex, newScene);
//                 // props.displayTrackEditor();
//             } 
// 		}
//     },
// }



export default class ChartCard extends Component {
    static defaultProps = {
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 30,
      };
      constructor(props) {
          super(props);
          this.state = {
            //   activeKey: ChartCategory.VEGALITE,
              widgets: [],
              //currentIndex: 0,
              highlightcolor:"#b95d2b"
          }
          this.handlechart = this.handlechart.bind(this);
      }
      
  
      handlechart(charttype) {

      
        //改变dataset
        let dataindex = this.props.dataList.length-1;
        //改变dataIndex
        // this.props.switchData(dataindex);

        
        //打开chart mode
        this.props.changeChartMode(charttype);  
        
    
        // //改变selectChartIndex
        // this.props.selectChart(i);

        //关闭edit mode
        this.props.changeEditMode(false);

    //    // 改变generate channels
    //    let channels = d3Channels(charttype);
    //    //注意这里是遍历字典 要按key查找
    //    let channelsName = Object.keys(channels);
                        
    //    for(let i = 0; i< channelsName.length; i++){
    //        //清空mapping
    //        channels[channelsName[i]]['isEncoding'] = false;
    //    }

        this.props.changeGenerateChannels(d3Channels(charttype))
        this.props.changeGenerateSpec(d3DefaultSpec(charttype))
        };

    chooseChart=(e)=> {
        const chartMode = this.props.chartMode;
        const editType = chartMode? false: this.props.widgets[this.props.editMode].type;
        
         switch(this.props.charttype){  

                case 'marix':
                return <Tooltip title='block'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='marix'|| (!chartMode && editType=='marix')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='marix'|| (!chartMode && editType=='marix')?
                        <div style={{marginTop:'-7px',cursor: 'pointer'}} onClick={()=> this.handlechart('marix')}><span className="iconfont" style={{fontSize:'32px', color:defaultHighlightColor}}>&#xeafc;</span></div>
                        :
                        <div style={{marginTop:'-7px',cursor: 'pointer'}} onClick={()=> this.handlechart('marix')}><span className="iconfont" style={{fontSize:'36px', color:'#968176'}}>&#xeafc;</span></div>
                        
                    }
                    {
                        chartMode=='marix'?
                        <div style={{marginTop:'-20px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='marix'?
                            <div style={{marginTop:'-22px',marginLeft:'-2px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }          
                </div>
                </Tooltip>


            case 'icon number':
            return <Tooltip title='number'>
                <div style={{width:'40px',height:'40px',border:chartMode=='icon number'|| (!chartMode && editType=='icon number')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                
                {
                    chartMode=='icon number'|| (!chartMode && editType=='icon number')?
                    <div style={{marginTop:'0px',cursor: 'pointer'}} onClick={()=> this.handlechart('icon number')}><span className="iconfont" style={{fontSize:'26px', color:defaultHighlightColor}}>&#xe641;</span></div>
                    :
                    <div style={{marginTop:'-2px',cursor: 'pointer'}} onClick={()=> this.handlechart('icon number')}><span className="iconfont" style={{fontSize:'30px', color:'#968176'}}>&#xe641;</span></div>
                }
                {
                    chartMode=='icon number'?
                    <div style={{marginTop:'-19px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                    :
                        !chartMode&&editType=='icon number'?
                        <div style={{marginTop:'-22px',marginLeft:'-2px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                        :
                        null
                }
                
            </div>
            </Tooltip>


            case 'area chart':
                //这里一定是()=> 不然会产生死循环报错
                return <Tooltip title='area chart'>
                    
                    <div style={{width:'40px',height:'40px',border:chartMode=='area chart'|| (!chartMode && editType=='area chart')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                        {
                            chartMode=='area chart'|| (!chartMode && editType=='area chart')?
                            <AreaChartOutlined  onClick={()=> this.handlechart('area chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                            :
                            <AreaChartOutlined  onClick={()=> this.handlechart('area chart')}/>  
                            

                        }
                        {
                            chartMode=='area chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                            :
                                !chartMode&&editType=='area chart'?
                                <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                                :
                                null
                        }
                        
                    </div>
                    </Tooltip>
                    
            
            case 'bar chart':
                return <Tooltip title='bar'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='bar chart'|| (!chartMode && editType=='bar chart')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='bar chart'|| (!chartMode && editType=='bar chart')?
                        <BarChartOutlined  onClick={()=> this.handlechart('bar chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <BarChartOutlined  onClick={()=> this.handlechart('bar chart')}/>  
                        

                    }
                    {
                        chartMode=='bar chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='bar chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    
                    
                    </Tooltip>
                
            case 'line chart':
                return <Tooltip title='line'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='line chart'|| (!chartMode && editType=='line chart')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='line chart'|| (!chartMode && editType=='line chart')?
                        <LineChartOutlined  onClick={()=> this.handlechart('line chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <LineChartOutlined  onClick={()=> this.handlechart('line chart')}/>  
                        

                    }
                    {
                        chartMode=='line chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='line chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>

                   
                    </Tooltip>
                
            case 'scatterplot':
                return <Tooltip title='scatterplot'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='scatterplot'|| (!chartMode && editType=='scatterplot')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='scatterplot'|| (!chartMode && editType=='scatterplot')?
                        <DotChartOutlined  onClick={()=> this.handlechart('scatterplot')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <DotChartOutlined  onClick={()=> this.handlechart('scatterplot')}/>  
                        

                    }
                    {
                        chartMode=='scatterplot'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='scatterplot'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    
                   
                    </Tooltip>

                
            case 'proportion chart':
                return <Tooltip title='proportion chart'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='proportion chart'|| (!chartMode && editType=='proportion chart')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='proportion chart'|| (!chartMode && editType=='proportion chart')?
                        <DotChartOutlined  onClick={()=> this.handlechart('proportion chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <DotChartOutlined  onClick={()=> this.handlechart('proportion chart')}/>  
                        

                    }
                    {
                        chartMode=='proportion chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='proportion chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }


                    
                    
                </div>
                    </Tooltip>
                    
                
            case 'pie chart':
                return <Tooltip title='circle'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='pie chart'|| (!chartMode && editType=='pie chart')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='pie chart'|| (!chartMode && editType=='pie chart')?
                        <PieChartOutlined  onClick={()=> this.handlechart('pie chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <PieChartOutlined  onClick={()=> this.handlechart('pie chart')}/>  
                        

                    }
                    {
                        chartMode=='pie chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='pie chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    </Tooltip>
                
            case 'map':
                return <Tooltip title='map'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='map'|| (!chartMode && editType=='map')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='map'|| (!chartMode && editType=='map')?
                        <div style={{marginTop:'-6px',cursor: 'pointer'}} onClick={()=> this.handlechart('map')}><span className="iconfont" style={{fontSize:'30px', color:defaultHighlightColor}}>&#xe62e;</span></div>
                        :
                        <div style={{marginTop:'-8px',cursor: 'pointer'}} onClick={()=> this.handlechart('map')}><span className="iconfont" style={{fontSize:'34px', color:'#968176'}}>&#xe62e;</span></div>
                        

                    }
                    {
                        chartMode=='map'?
                        <div style={{marginTop:'-20px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='map'?
                            <div style={{marginTop:'-13px',marginLeft:'-2px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>      
                </Tooltip>
            
            case 'treemap':
                return <Tooltip title='treemap'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='treemap'|| (!chartMode && editType=='treemap')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='treemap'|| (!chartMode && editType=='treemap')?
                        <div style={{marginTop:'3px',cursor: 'pointer'}} onClick={()=> this.handlechart('treemap')}><span className="iconfont" style={{fontSize:'17px',color:defaultHighlightColor}}>&#xe6c0;</span></div>
                        :
                        <div style={{marginTop:'2px',cursor: 'pointer'}} onClick={()=> this.handlechart('treemap')}><span className="iconfont" style={{fontSize:'21px',color:'#968176'}}>&#xe6c0;</span></div>
                        

                    }
                    {
                        chartMode=='treemap'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='treemap'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }      
                </div>
                </Tooltip>

            case 'proportional area':
                return <Tooltip title='area'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='proportional area'|| (!chartMode && editType=='proportional area')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='proportional area'|| (!chartMode && editType=='proportional area')?
                        <div style={{marginTop:'3px',cursor: 'pointer'}} onClick={()=> this.handlechart('proportional area')}><span className="iconfont" style={{fontSize:'17px',color:defaultHighlightColor}}>&#xe6c7;</span></div>
                        :
                        <div style={{marginTop:'2px',cursor: 'pointer'}} onClick={()=> this.handlechart('proportional area')}><span className="iconfont" style={{fontSize:'21px',color:'#968176'}}>&#xe6c7;</span></div>
                        

                    }
                    {
                        chartMode=='proportional area'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='proportional area'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }      
                </div>
                </Tooltip>

            case 'fraction':
                {console.log('faction')}
                return <Tooltip title='fraction'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='fraction'|| (!chartMode && editType=='fraction')?'2px solid #e2570b':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='fraction'|| (!chartMode && editType=='fraction')?
                        <div style={{marginTop:'5px',cursor: 'pointer'}} onClick={()=> this.handlechart('fraction')}><span className="iconfont" style={{fontSize:'17px',color:defaultHighlightColor}}>&#xf238;</span></div>
                        :
                        <div style={{marginTop:'2px',cursor: 'pointer'}} onClick={()=> this.handlechart('fraction')}><span className="iconfont" style={{fontSize:'21px',color:'#968176'}}>&#xf238;</span></div>
                        

                    }
                    {
                        chartMode=='fraction'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='fraction'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }      
                </div>
                </Tooltip>
        
          
        }
    }

    render() {
        
 
        return <div className="chartcard" align="center" >
                {this.chooseChart()}
            </div>
        
    }
}
