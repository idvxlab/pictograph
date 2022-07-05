import React, { Component } from 'react'
import { Divider,Upload,Select, message, Button, Icon} from 'antd';
import { Tabs, Layout } from 'antd';
import ChartTab from './ChartTab/ChartTab';
import FieldList from '@/components/ChartEditor/MappingPanel/FieldList';
import Encoding from '@/components/ChartEditor/MappingPanel/Encoding';
// import { getCategories, getAggregatedRows, getWidth } from '@/charts/D3/PieChart/helper';
import DataProcessor from '@/components/DataPreview/processor';
import ChartRecorderInstance from '@/recorder/innerAnimation';
import { getDefaultSpec } from '@/charts/Info';
import ChartType from '@/constants/ChartType';
import './datapane.css';
import d3Channels from '@/charts/D3/channels';
import * as d3 from 'd3';
import _ from "lodash";

import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';

import{ getCategories as getPieCategories} from '@/charts/D3/PieChart/helper';
import { getSeries, getCategories as getBarCategories } from '@/charts/D3/BarChart/helper';


const { Option } = Select;
const { Sider, Content } = Layout;
const dataProcessor = new DataProcessor();
const chartRecorderInstance = new ChartRecorderInstance();


export default class DataPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datavisible: false,
            chartvisible: false,
            alertvisible: false,
            confirmVisible: false
        };
        this.handleDataPreview = this.handleDataPreview.bind(this);
        this.handleDataOk = this.handleDataOk.bind(this);
        this.handleChartOk = this.handleChartOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    };

    componentWillMount() {
        let { currentVis } = this.props;
        let encoding ;
        if(!currentVis.spec){
            let spec = getDefaultSpec("Bar", ChartType.RADARCHART);
            encoding = spec.encoding;
        }else{
            encoding = currentVis.spec.encoding;
        }
        

        let hasEncoding = encoding && (JSON.stringify(encoding.x) !== "{}" || JSON.stringify(encoding.y) !== "{}")
        if (hasEncoding) {
            this.props.switchData(currentVis.dataIndex)
        }
    }

    componentDidUpdate(preProps) {
        let encoding;
        if(!preProps.currentElement){
            let spec = getDefaultSpec("Bar", ChartType.RADARCHART);
            encoding = spec.encoding;
        }
        else if (preProps.currentElement.id !== this.props.currentElement.id) {
            let { currentVis } = this.props;
            encoding = currentVis.spec.encoding;
            let hasEncoding = encoding && (JSON.stringify(encoding.x) !== "{}" || JSON.stringify(encoding.y) !== "{}")
            if (hasEncoding) {
                this.props.switchData(currentVis.dataIndex)
            }
        }

    }

    handleDataPreview = () => {
        this.setState({
            datavisible: true,
        });
    }

    handleDataOk = (data) => {
        // TODO: Update Data

        this.setState({
            datavisible: false,
        });
    }

    handleDataUpdate = (data) => {
        this.props.updateData(this.props.currentData.dataIndex, data, this.props.fieldsList[this.props.currentData.dataIndex])
    }


    handleChartEditor = () => {
        //清除画布上正在预览的图表。再次回到画布后可以直接双击预览
        this.props.cleanInterationLayer(true)
        let encoding = this.props.currentVis.spec.encoding;
        let hasEncoding = encoding && (JSON.stringify(encoding.x) !== "{}" || JSON.stringify(encoding.y) !== "{}")
        let index = hasEncoding ? this.props.currentVis.dataIndex : this.props.currentData.dataIndex;
        if (index !== this.props.currentData.dataIndex && hasEncoding) {
            this.setState({ confirmVisible: true })
        } else {
            this.setState({ confirmVisible: false })
            this.props.openEditor(index, this.props.currentVis.spec);
            this.setState({
                chartvisible: true,
            });
        }
    }

    changeDataConfirm = () => {
        message.info('You have changed the chart data.');
        this.setState({ confirmVisible: false })
        //let spec = {}
        let elementInfo = this.props.currentElement.info();
        let defaultStyle = getDefaultSpec(elementInfo.category, elementInfo.type).style;
        let spec = {
            "encoding": {},
            "style": defaultStyle,
            "animation": []
        } //清空encoding
        this.props.openEditor(this.props.currentData.dataIndex, spec);
        this.setState({
            chartvisible: true,
        });
    }

    changeDataCancel = () => {
        let encoding = this.props.currentVis.spec.encoding;
        let hasEncoding = encoding && (JSON.stringify(encoding.x) !== "{}" || JSON.stringify(encoding.y) !== "{}")
        let index = hasEncoding ? this.props.currentVis.dataIndex : this.props.currentData.dataIndex;
        this.setState({ confirmVisible: false })
        this.props.openEditor(index, this.props.currentVis.spec);
        this.setState({
            chartvisible: true,
        });
    }

    //data-mapping
    handleChartOk = () => {

        //生成模式
        if(this.props.chartMode){
            //layout中增加chart
            
            //计算weights
            const size = {
                x: (this.props.widgets.length * 2) % (this.state.cols || 8),
                y: Infinity, // puts it at the bottom
                w: 6,
                h: 4,
                i: new Date().getTime().toString(),
            };
            const type = {
                type: this.props.chartMode
            };
            const dataIndex = {
                dataIndex: this.props.dataIndex
            }
            const category = {
                category: 'D3'
            }
            const spec = {
                spec: this.props.generateSpec
            }

          
            //异步操作！！(生成模式)
        new Promise((resolve, reject) => {
            let newWidgets = _.cloneDeep(this.props.widgets)
            this.props.addChart([{...size,...type,...dataIndex,...category,...spec}]); 
           
           
           
            let widgets = [...this.props.widgets];
                console.log("DataPane -> handleChartOk1 -> widgets", widgets)
              
                var FieldsData
                var CatogoriesData = []
                var seriesData = []

                switch (type.type) {   
                        case "pie chart": 
                            var CatogoriesPie = getPieCategories(this.props.dataList[0], spec.spec.encoding)
                            CatogoriesData = Object.keys(CatogoriesPie);
            
                            FieldsData = "" + spec.spec.encoding.size.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;
                        case "bar chart":
                            var CatogoriesBar = getBarCategories(this.props.dataList[0], spec.spec.encoding)
                            CatogoriesData = Object.keys(CatogoriesBar);

                            var hasSeries = ('color' in spec.spec.encoding);
                            if(hasSeries){
                                var SeriesBar = getSeries(this.props.dataList[0], spec.spec.encoding)
                                seriesData = Object.keys(SeriesBar);
                            }
                            
                            FieldsData = "" + spec.spec.encoding.y.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;
                        case "line chart":
                            var hasSeries = ('color' in spec.spec.encoding);
                            if(hasSeries){
                                var SeriesBar = getSeries(this.props.dataList[0], spec.spec.encoding)
                                seriesData = Object.keys(SeriesBar);
                            }
                            
                            FieldsData = "" + spec.spec.encoding.y.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;
                        case "area chart":
                            var hasSeries = ('color' in spec.spec.encoding);
                            if(hasSeries){
                                var SeriesBar = getSeries(this.props.dataList[0], spec.spec.encoding)
                                seriesData = Object.keys(SeriesBar);
                            }
                            
                            FieldsData = "" + spec.spec.encoding.y.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;
                        case "matrix":
                            var CatogoriesBar = getPieCategories(this.props.dataList[0], spec.spec.encoding)
                            CatogoriesData = Object.keys(CatogoriesBar);

                            FieldsData = "" + spec.spec.encoding.size.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;

                        case "icon number":
                            var CatogoriesBar = getPieCategories(this.props.dataList[0], spec.spec.encoding)
                            CatogoriesData = Object.keys(CatogoriesBar);

                            FieldsData = "" + spec.spec.encoding.size.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;

                        case "treemap":
                            var CatogoriesBar = getPieCategories(this.props.dataList[0], spec.spec.encoding)
                            CatogoriesData = Object.keys(CatogoriesBar);

                            FieldsData = "" + spec.spec.encoding.size.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                            break;

                        default:
            //                 FieldsData = "" + spec.spec.encoding.size.field
            //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                
                }

                            

                // console.log('CatogoriesData',CatogoriesData)
                // console.log('FieldsData',FieldsData)
                // console.log('seriesData',seriesData)

            // var AllData = FieldsData.concat(...CatogoriesData,...seriesData).unique();
            var AllData = [];
            AllData.push(FieldsData)
            var AllData = AllData.concat(CatogoriesData,seriesData);
            console.log(AllData)


            /*--------------------------------------------------------------------- */
    
            var iconType =[]
            var icondict
            var categoriesreading = []
            var seriesreading = []
            HttpUtil.post(ApiUtil.API_COLOR_SUGESSTION, AllData)
                    .then(re=>{
                        icondict = re.data;
                        iconType = icondict[FieldsData]
                        console.log('word2vec',icondict,iconType);
                        console.log("icondict",icondict)

                        categoriesreading.push(icondict[CatogoriesData[0]][0])
                        for(let i=1;i< CatogoriesData.length; i++){
                            let aindex=0 // 获取每个categories下的选取icon位置
                            for(let j=0;j<i;j++){
                                if(icondict[CatogoriesData[i]][aindex]===categoriesreading[j]) aindex++;
                            }                           
                            categoriesreading.push(icondict[CatogoriesData[i]][aindex])
                        }

                        seriesreading.push(icondict[seriesData[0]][0])
                        for(let i=1;i< seriesData.length; i++){
                            let bindex=0 //获取每个series下的选取icon的位置
                            for(let j=0;j<i;j++){
                                if(icondict[seriesData[i]][bindex]===seriesreading[j]) bindex++;
                            }
                            seriesreading.push(icondict[seriesData[i]][bindex])
                        }
                        console.log("categoriesreading",categoriesreading)
                        console.log("seriesreading",seriesreading)
                        
                    })
                    .catch(error=>{
                        console.log(error.message);
                    })
                    .then(re=>{
                       this.props.changeIcontype(iconType);
                       console.log('DataPane_Icon',iconType);
                       this.props.changeCategoriesreading(categoriesreading);
                       console.log('DataPane_categoriesreading',categoriesreading);
                         this.props.changeSeriesreading(seriesreading);
                       console.log('DataPane_seriesreading',seriesreading);
                         
                    })
                    .catch(error=>{
                        console.log(error.message);
                    });
           
            resolve('111');

          }).then((res) => {

            console.log('widgets-datapane',this.props.widgets)
            //转换模式
            //改变dataIndex
            this.props.switchData(this.props.widgets[this.props.widgets.length-1].dataIndex)

            // //改变selectChartIndex
            // this.props.selectChart(i);

            //改变edit mode
            this.props.changeEditMode(this.props.widgets.length-1);

            //改变edit channels
            let channels = d3Channels(this.props.widgets[this.props.widgets.length-1].type);
            
            //注意这里是遍历字典 要按key查找
            let channelsName = Object.keys(channels);
            
            for(let i = 0; i< channelsName.length; i++){
                channels[channelsName[i]]['isEncoding'] = true;
            }



            this.props.changeEditChannels(channels)
            // console.log('this.props.changeEditChannels', d3Channels(this.props.widgets[this.props.widgets.length-1].type))
            
            this.props.changeEditSpec(this.props.widgets[this.props.widgets.length-1].spec)

            //关闭chart mode
            this.props.changeChartMode(false);
  
           })
        
            
         }
        //编辑模式
        else{
             //异步操作！！
        new Promise((resolve, reject) => {
            let newWidgets = _.cloneDeep(this.props.widgets)
            // this.props.addChart([{...size,...type,...dataIndex,...category,...spec}]); 
           
            let editSpec = this.props.editSpec;
           
           
            let widgets = [...this.props.widgets];
                console.log("DataPane -> handleChartOk1 -> widgets", widgets)
    
                var FieldsData
                var CatogoriesData = []
                var seriesData = []
                    switch (widgets[0].type) {   
                            case "pie chart": 
                                var CatogoriesPie = getPieCategories(this.props.dataList[0], editSpec.encoding)
                                CatogoriesData = Object.keys(CatogoriesPie);
                
                                FieldsData = "" + editSpec.encoding.size.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;
                            case "bar chart":
                                var CatogoriesBar = getBarCategories(this.props.dataList[0], editSpec.encoding)
                                CatogoriesData = Object.keys(CatogoriesBar);

                                var hasSeries = ('color' in editSpec.encoding);
                                if(hasSeries){
                                    var SeriesBar = getSeries(this.props.dataList[0], editSpec.encoding)
                                    seriesData = Object.keys(SeriesBar);
                                }
                                
                                FieldsData = "" + editSpec.encoding.y.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;
                            case "line chart":
                                var hasSeries = ('color' in editSpec.encoding);
                                if(hasSeries){
                                    var SeriesBar = getSeries(this.props.dataList[0], editSpec.encoding)
                                    seriesData = Object.keys(SeriesBar);
                                }
                                
                                FieldsData = "" + editSpec.encoding.y.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;
                            case "area chart":
                                var hasSeries = ('color' in editSpec.encoding);
                                if(hasSeries){
                                    var SeriesBar = getSeries(this.props.dataList[0], editSpec.encoding)
                                    seriesData = Object.keys(SeriesBar);
                                }
                                
                                FieldsData = "" + editSpec.encoding.y.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;
                            case "matrix":
                                var CatogoriesBar = getPieCategories(this.props.dataList[0], editSpec.encoding)
                                CatogoriesData = Object.keys(CatogoriesBar);

                                FieldsData = "" + editSpec.encoding.size.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;

                            case "icon number":
                                var CatogoriesBar = getPieCategories(this.props.dataList[0], editSpec.encoding)
                                CatogoriesData = Object.keys(CatogoriesBar);

                                FieldsData = "" + editSpec.encoding.size.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;

                            case "treemap":
                                var CatogoriesBar = getPieCategories(this.props.dataList[0], editSpec.encoding)
                                CatogoriesData = Object.keys(CatogoriesBar);

                                FieldsData = "" + editSpec.encoding.size.field
                //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                break;

                            default:    
                                       

                                    
                                }
                                
    
                    // console.log('CatogoriesData',CatogoriesData)
                    // console.log('FieldsData',FieldsData)
    
    
                    var AllData = [];
                    AllData.push(FieldsData)
                    var AllData = AllData.concat(CatogoriesData,seriesData);
                    console.log(AllData)
        
        
                    /*--------------------------------------------------------------------- */
            
                    var iconType =[]
                    var icondict
                    var categoriesreading = []
                    var seriesreading = []
                    HttpUtil.post(ApiUtil.API_COLOR_SUGESSTION, AllData)
                            .then(re=>{
                                icondict = re.data;
                                iconType = icondict[FieldsData]
                                console.log('word2vec',icondict,iconType);
                                for(let i=0;i< CatogoriesData.length; i++){
                                    categoriesreading.push(icondict[CatogoriesData[i]][0])
                                }
                                for(let j=0;j< seriesData.length; j++){
                                    seriesreading.push(icondict[seriesData[j]][0])
                                }
                                console.log("categoriesreading",categoriesreading)
                                console.log("seriesreading",seriesreading)
                                
                            })
                            .catch(error=>{
                                console.log(error.message);
                            })
                            .then(re=>{
                               this.props.changeIcontype(iconType);
                               console.log('DataPane_Icon',iconType);
                                this.props.changeCategoriesreading(categoriesreading);
                               console.log('DataPane_categoriesreading',categoriesreading);
                                 this.props.changeSeriesreading(seriesreading);
                            })
                            .catch(error=>{
                                console.log(error.message);
                            });
           
           
           
           
            resolve('111');

          }).then((res) => {

            //避坑大法 - 解决改变状态却不刷新页面问题
            //https://blog.csdn.net/qq_40259641/article/details/105275819
            let widgets = [...this.props.widgets];
            console.log('widgets-datapane',widgets)


            
            //更新colormap,重新计算边界
            const rowData = this.props.dataList[widgets[this.props.editMode].dataIndex];
            // const spec = widgets[this.props.selectChartIndex].spec;
            const spec = this.props.editSpec;
            console.log('spec-tab',this.props.editSpec)
            const size = {w:widgets[this.props.editMode].w, h: widgets[this.props.editMode].h};

            widgets[this.props.editMode].spec = this.props.editSpec;
            widgets[this.props.editMode].dataIndex = this.props.dataIndex;


            this.props.changeMapping(widgets);
            this.props.widgets[this.props.editMode].spec = this.props.editSpec;
  
           })
        }
            


        
    

    }

    handleCancel = () => {
        this.setState({
            chartvisible: false,
            datavisible: false,
        });
    };
    handleChartEditorCancel = () => {
        //关闭录制
        chartRecorderInstance.stop()
        this.setState({
            chartvisible: false,
            datavisible: false,
        });
    }
    beforeUpload = (file) => {
        const fileURL = URL.createObjectURL(file);
        dataProcessor.process(fileURL)
            .then((dataItem) => {
                this.props.addData(file.name, dataItem.data, dataItem.schema);
                this.props.switchData(this.props.dataNameList.length - 1)
            }).catch((reason) => {
                this.setState({
                    alertvisible: true,
                });
                console.log(reason);
            });
    }

    handleDataSelect = (e) => {
        let dataIndex = this.props.dataNameList.indexOf(e)
        if (dataIndex + 1) {
            this.props.switchData(dataIndex)
        }
    }

    deleteData = (index) => {
        this.props.deleteData(index)
    }
        
    render() {
        let { dataNameList, currentData } = this.props;
        return (
            // <div className="card-container-tool" style={{position:'absolute', zIndex: 5, width: '100%', marginBottom:'0px'}} >
                <div className='pane' style={{width: '100%',height: '100%', marginBottom:'0px', marginTop: '-5px'}}>
                    <Divider orientation="left">DATA</Divider>
                    <div id='dataupload'>
                        <div style={{top:0, left:0}}>
                            <Select id="data-selection"
                                value={currentData.name}
                                defaultValue={currentData.name}
                                onChange={(e) => this.handleDataSelect(e)}
                                optionLabelProp="label"
                                style={{  width: 400, padding: '0px 10px 0px 0px'}}
                            >
                                {dataNameList.map((d, i) => (
                                    <Option label={d} key={d}>{d}
                                        <span aria-label={d}>
                                            {
                                                (i === 0 || i === 1 || i === 2) ? null :
                                                    <Button shape="circle" icon="close" size='small' style={{ float: 'right', fontSize: 10 }}
                                                        onClick={(e) => { this.deleteData(i); e.stopPropagation() }} />
                                            }
                                        </span>
                                    </Option>)
                                )}
                            </Select>
                        </div>
                        <div style={{ width:'30px',height: '30px',padding: '0px 0px 0px 0px',marginLeft:'400px',marginTop:'-30px', border:'1px solid #968176', borderRadius:'2px'}} >
                            <Upload
                                accept=".csv"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                            >
                                <Icon type="upload" />
                            </Upload>
                        </div>
                        <Divider orientation="center">Charts</Divider>
                        <div width={270} style={{ height: '40px',padding: '0px 0px 0px 0px', overflowX:'auto',overflowY:'hidden'}} >
                            <div style={{width:'400px',height: '30px',padding: '0px 0px 0px 0px',marginTop:'-1px',marginLeft:'15px'}} >
                                <ChartTab {...this.props} />
                            </div>

                        </div>

                    </div>
                    <Layout>
                        <Sider style={{backgroundColor: '#fff'}}>
                            <Divider orientation="center">Fields</Divider>
                            <FieldList  { ...this.props }/>
                        </Sider>
                        <Content style={{backgroundColor: '#fff'}}>
                            <Divider orientation="center">Channels</Divider>
                            <Encoding { ...this.props } />
                            <Button type="primary" block style={{ marginTop: '5px', marginLeft:'55px',backgroundColor:'#968176', fontSize:'14px', width:'150px', height:'25px'}} onClick={this.handleChartOk} type="primary">{this.props.chartMode? 'Generate':'Update'}</Button>
                        </Content>
                    </Layout>
                </div>
            // </div>
        )
    }
}
