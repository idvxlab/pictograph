import React, { Component } from 'react'
import { Divider,Upload,Select, Button, Icon, Layout} from 'antd';
import ChartTab from './ChartTab/ChartTab';
import FieldList from '@/components/ChartEditor/MappingPanel/FieldList';
import Encoding from '@/components/ChartEditor/MappingPanel/Encoding';
// import { getCategories, getAggregatedRows, getWidth } from '@/charts/D3/PieChart/helper';
import DataProcessor from '@/components/DataPreview/processor';
import { getDefaultSpec } from '@/charts/Info';
import ChartType from '@/constants/ChartType';
import './datapane.css';
import d3Channels from '@/charts/D3/channels';
import * as d3 from 'd3';
import _ from "lodash";

import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';

import{ getCategories as getPieCategories} from '@/charts/D3/PieChart/helper';
import { getSeries as getBarSeries, getCategories as getBarCategories } from '@/charts/D3/BarChart/helper';
import { getSeries as getLineSeries, getCategories as getLineCategories } from '@/charts/D3/LineChart/helper';
import { getSeries as getAreaSeries } from '@/charts/D3/AreaChart/helper';

const { Option } = Select;
const { Sider, Content } = Layout;
const dataProcessor = new DataProcessor();

export default class DataPane extends Component {

    constructor(props) {
        super(props);
        this.handleChartOk = this.handleChartOk.bind(this);
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

    //data-mapping
    handleChartOk = () => {

        this.props.changeRankMode(true, false, false)


        //生成模式
        if(this.props.chartMode){
            //layout中增加chart
            
            //计算weights
            const size = {
                x: (this.props.widgets.length * 2) % ( 8),
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

            var targetIndexIsVis = {};
            var targetIndexIsLabel = {};

          
            //异步操作！！(生成模式)
            var colorPair = this.props.colorPair;
            new Promise((resolve, reject) => {
                // this.props.changeStyleLayout(this.props.widgets[this.props.widgets.length-1].spec['style'].layout[0])
                
                
                          
                var FieldsData; 
                var categoriesData = []
                var seriesData = []

                console.log('this.props.dataList', this.props.generateSpec);
                console.log('type.type',type.type);

                switch (type.type) {   
                                case "pie chart": 
                                    var CatogoriesPie = getPieCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesPie);
                                    FieldsData = "" + spec.spec.encoding.size.field;
                                    targetIndexIsVis = {targetIndexIsVis :[]}
                                    targetIndexIsLabel = {targetIndexIsLabel : ["piechart","donutchart","mappingbarpie","donuts"]}
                                    
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
                                case "bar chart":
                                    var CatogoriesBar = getBarCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesBar);
        
                                    var hasSeries = ('color' in spec.spec.encoding);
                                    if(hasSeries){
                                        var SeriesBar = getBarSeries(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                        seriesData = Object.keys(SeriesBar);
                                    }
                                    
                                    FieldsData = "" + spec.spec.encoding.y.field
                                    targetIndexIsVis = {targetIndexIsVis :["percent2","percent1","area","barchart5","flex","barchart4"]}
                                    targetIndexIsLabel = {targetIndexIsLabel : ["horizontalrect","singlebar","stacked","grouped"]}
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
                                case "line chart":
                                    var CatogoriesLine = getLineCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    console.log('categories-line', CatogoriesLine)
                                    categoriesData = Object.keys(CatogoriesLine);
                                    
        
                                    var hasSeries = ('color' in spec.spec.encoding);
                                    if(hasSeries){
                                        var SeriesLine = getLineSeries(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                        // var SeriesLine = getLineSeries(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                        console.log('SeriesLine', SeriesLine);
                                        seriesData = Object.keys(SeriesLine);
                                    }
                                    
                                    FieldsData = "" + spec.spec.encoding.y.field
                                    targetIndexIsVis = {targetIndexIsVis :[]}
                                    targetIndexIsLabel = {targetIndexIsLabel : ["MultiSeriesLine","SingleLine","BarLine"]}
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
                                case "area chart":
                                    var hasSeries = ('color' in spec.spec.encoding);
                                    if(hasSeries){
                                        var SeriesBar = getAreaSeries(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                        seriesData = Object.keys(SeriesBar);
                                    }
                                    
                                    FieldsData = "" + spec.spec.encoding.y.field
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
                                case "marix":
                                    var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesBar);
        
                                    FieldsData = "" + spec.spec.encoding.size.field
                                    console.log('FieldsData',FieldsData);
                                    targetIndexIsVis = {targetIndexIsVis :["unit","unit2","percent2","percent1"]}
                                    targetIndexIsLabel = {targetIndexIsLabel : []}
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
        
                                case "icon number":
                                    var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesBar);
        
                                    FieldsData = "" + spec.spec.encoding.size.field
                                    targetIndexIsVis = {targetIndexIsVis :[]}
                                    targetIndexIsLabel = {targetIndexIsLabel : ["iconnumber3","background"]}
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
        
                                case "treemap":
                                    var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesBar);
        
                                    FieldsData = "" + spec.spec.encoding.size.field
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
        
                                case "proportional area":
                                    var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesBar);
        
                                    FieldsData = "" + spec.spec.encoding.size.field
                                    FieldsData = FieldsData.toLowerCase().split('_')[0];
                    //                 var CatogoriesBar = getBarCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                    //                 categoriesData = Object.keys(CatogoriesBar);
        
                    //                 var hasSeries = ('color' in spec.spec.encoding);
                    //                 if(hasSeries){
                    //                     var SeriesBar = getBarSeries(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                    //                     seriesData = Object.keys(SeriesBar);
                    //                 }
                                    
                    //                 FieldsData = "" + spec.spec.encoding.y.field
                    //                 targetIndexIsVis = {targetIndexIsVis :["area"]}
                    //                 targetIndexIsLabel = {targetIndexIsLabel : []}
                                    
                                    break;
        
                                case "fraction": 
                                    var CatogoriesPie = getPieCategories(this.props.dataList[this.props.dataIndex], spec.spec.encoding)
                                    categoriesData = Object.keys(CatogoriesPie);
                                    FieldsData = "" + spec.spec.encoding.size.field;
                                    targetIndexIsVis = {targetIndexIsVis :["picstacked"]}
                                    targetIndexIsLabel = {targetIndexIsLabel : ["mappingbarpie"]}
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                    break;
        
                                default:
                    //                 FieldsData = "" + spec.spec.encoding.size.field
                    //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                                        
                        }         
                   


                // var AllData = FieldsData.concat(...categoriesData,...seriesData).unique();
                var AllData = [];
                AllData.push(FieldsData);
                var AllData = AllData.concat(categoriesData,seriesData);
               
                /*--------------------------------------------------------------------- */
    
                let iconType =[]
                let iconPair = []
                var icondict
                let categoriesreading = []
                let seriesreading = []

                HttpUtil.post(ApiUtil.API_WORDTOVEC, AllData)
                        .then(re=>{
                            console.log("autoLayout",re.data);
                            icondict = re.data;
                            iconType = icondict[FieldsData]
                            for(let key in icondict) {
                                let obj = {};
                                obj[key] = icondict[key][0];
                                iconPair.push(obj); 
                            }
                           console.log('iconPair-http', iconPair)
                            
                            
                            console.log('word2vec',icondict,iconType);
                            console.log("icondict",icondict);

                            categoriesreading.push(icondict[categoriesData[0]][0])
                            for(let i=1;i< categoriesData.length; i++){
                                let aindex=0 // 获取每个categories下的选取icon位置
                                for(let j=0;j<i;j++){
                                    if(icondict[categoriesData[i]][aindex]===categoriesreading[j]) aindex++;
                                }                           
                                categoriesreading.push(icondict[categoriesData[i]][aindex])
                            }

                            seriesreading.push(icondict[seriesData[0]][0])
                            for(let i=1;i< seriesData.length; i++){
                                let bindex=0 //获取每个series下的选取icon的位置
                                for(let j=0;j<i;j++){
                                    if(icondict[seriesData[i]][bindex]===seriesreading[j]) bindex++;
                                }
                                seriesreading.push(icondict[seriesData[i]][bindex])
                            }
                            
                        })
                        .catch(error=>{
                            console.log(error.message);
                        })
                        .then(re=>{
                            // this.props.changeStyleLayout(spec.spec['style'].layout[0])
               
                            //后端test
            //                 console.log('DataPane_Icon',iconType);
            //                this.props.changeIcontype(iconType);
            //               console.log('DataPane_categoriesreading',categoriesreading);
                           this.props.changeCategoriesreading(categoriesreading);
            //                console.log('DataPane_seriesreading',seriesreading);
                           this.props.changeSeriesreading(seriesreading);
                            console.log('categoriesreading-chan', categoriesreading)
                            console.log('seriesreading-chan', seriesreading)
            //                 this.props.changeFieldsData(FieldsData);
            //                 this.props.changeAllData(AllData);
            //                 console.log('datapane-FieldsData', FieldsData);
                            console.log('changeIconDict',icondict, FieldsData, categoriesData, seriesData)

                            this.props.changeIconDict(icondict, FieldsData, categoriesData, seriesData);

                            this.props.changeMapping(this.props.widgets);

                            this.props.changeAllData(AllData);
                        

                            // this.forceUpdate(); 


                             
                        })
                        .catch(error=>{
                            console.log(error.message);
                        });

                //var needColorNum = AllData.length();
                var colorset = this.props.colormap;

                var colorExtendInput = {FieldsData: FieldsData, categoriesData: categoriesData, seriesData: seriesData, colorset: colorset}
                // console.log('colorExtendInput',colorExtendInput)
                // var colorPair = [...this.props.colorPair];

                // colorPair = {'Acceleration': 'rgb(254,254,254)', '1970': 'rgb(254,254,254)', '1971': 'rgb(207,208,218)', '1972': 'rgb(150,164,182)', '1973': 'rgb(90,96,129)', '1974': 'rgb(91,135,124)', '1975': 'rgb(129,143,127)', '1976': 'rgb(178,137,145)', '1977': 'rgb(188,141,165)', '1978': 'rgb(220,143,145)', '1979': 'rgb(225,187,182)', '1980': 'rgb(227,192,228)', '1982': 'rgb(237,203,255)', 'USA': 'rgb(254,254,254)', 'Europe': 'rgb(207,208,218)', 'Japan': 'rgb(150,164,182)'}
                // this.props.changeColorPair(colorPair);
                // this.props.addChart([{...size,...type,...dataIndex,...category,...spec}]); 

                HttpUtil.post(ApiUtil.API_COLOR_EXTEND,colorExtendInput)
                        .then(re=>{
                            console.log('colorextend', colorExtendInput)
                            
                            colorPair= re.data;
                            this.props.changeColorPair(colorPair);
                            // this.props.changeColorPair(colorPair);
                            console.log('colorPair-Datapane', this.props.colorPair)           
                        })
                        .catch(error=>{
                            console.log(error.message);
                        })
                        .then(re=>{
                            
                            this.props.changeMapping([{...size,...type,...dataIndex,...category,...spec, ...targetIndexIsVis, ...targetIndexIsLabel}]); 
                           
                        })
                        .catch(error=>{
                            console.log(error.message);
                        }).then((res) => {

                console.log('this.props.widgets[this.props.widgets.length-1].spec', this.props.widgets[this.props.widgets.length-1].spec['style'].layout[0])

                
                
                

                //转换模式
                //改变dataIndex
                // this.props.switchData(this.props.widgets[this.props.widgets.length-1].dataIndex)
    
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
    
                        }).catch(error=>{
                            console.log(error.message);
                        }) ;
            
            resolve('111');

            })
     
            
         }
        //编辑模式
        else{

            console.log('编辑模式')
             //异步操作！！
            new Promise((resolve, reject) => {
            let newWidgets = _.cloneDeep(this.props.widgets)
            // this.props.addChart([{...size,...type,...dataIndex,...category,...spec}]); 
           
            let editSpec = this.props.editSpec;
           
           
            let widgets = [...this.props.widgets];
                console.log("DataPane -> handleChartOk1 -> widgets", widgets)
    
                var FieldsData
                var categoriesData = []
                var seriesData = []

    
            
                console.log('this.props.dataList', this.props.dataList);
            switch (widgets[0].type) {   
                    case "pie chart": 
                        var CatogoriesPie = getPieCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesPie);
        
                        FieldsData = "" + editSpec.encoding.size.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;
                    case "bar chart":
                        var CatogoriesBar = getBarCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesBar);

                        var hasSeries = ('color' in editSpec.encoding);
                        if(hasSeries){
                            var SeriesBar = getBarSeries(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                            seriesData = Object.keys(SeriesBar);
                        }
                        
                        FieldsData = "" + editSpec.encoding.y.field;
                    
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;
                    case "line chart":
                        var CatogoriesLine = getLineCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                            categoriesData = Object.keys(CatogoriesLine);

                        var hasSeries = ('color' in editSpec.encoding);
                        if(hasSeries){
                            var SeriesLine = getLineSeries(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                            seriesData = Object.keys(SeriesLine);
                        }
                        
                        FieldsData = "" + editSpec.encoding.y.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;
                    case "area chart":
                        var hasSeries = ('color' in editSpec.encoding);
                        if(hasSeries){
                            var SeriesBar = getAreaSeries(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                            seriesData = Object.keys(SeriesBar);
                        }
                        
                        FieldsData = "" + editSpec.encoding.y.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;
                    case "marix":
                        var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesBar);

                        FieldsData = "" + editSpec.encoding.size.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;

                    case "icon number":
                        var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesBar);

                        FieldsData = "" + editSpec.encoding.size.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;

                    case "treemap":
                        var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesBar);

                        FieldsData = "" + editSpec.encoding.size.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;

                    case "proportional area":
                        var CatogoriesBar = getPieCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesBar);

                        FieldsData = "" +  editSpec.encoding.size.field
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;
        //                 var CatogoriesBar = getBarCategories(this.props.dataList[this.props.dataIndex], editSpec.encoding)
        //                 categoriesData = Object.keys(CatogoriesBar);

        //                 var hasSeries = ('color' in editSpec.encoding);
        //                 if(hasSeries){
        //                     var SeriesBar = getBarSeries(this.props.dataList[this.props.dataIndex], editSpec.encoding)
        //                     seriesData = Object.keys(SeriesBar);
        //                 }
                        
        //                 FieldsData = "" + editSpec.encoding.y.field;
        //                 break;

                    case "fraction": 
                        var CatogoriesPie = getPieCategories(this.props.dataList[this.props.dataIndex],  editSpec.encoding)
                        categoriesData = Object.keys(CatogoriesPie);
                        FieldsData = "" +  editSpec.encoding.size.field;
                        
        //                 FieldsData = FieldsData.toLowerCase().split('_')[0];
                        break;

                    default:    
                               

                            
                        }
                        

            // console.log('categoriesData',categoriesData)
            // console.log('FieldsData',FieldsData)


            var AllData = [];
            AllData.push(FieldsData)
            var AllData = AllData.concat(categoriesData,seriesData);
            console.log(AllData)


            /*--------------------------------------------------------------------- */
    
            var iconType =[]
            var icondict
            var categoriesreading = []
            var seriesreading = []
            let iconPair = [];
            HttpUtil.post(ApiUtil.API_WORDTOVEC, AllData)
                    .then(re=>{
                        console.log("autoLayout",re.data);  
                        icondict = re.data;
                        iconType = icondict[FieldsData]

                        for(let key in icondict) {
                            let obj = {};
                            obj[key] = icondict[key][0];
                            iconPair.push(obj); 
                        }


                        for(let i=0;i< categoriesData.length; i++){
                            categoriesreading.push(icondict[categoriesData[i]][0])
                        }
                        for(let j=0;j< seriesData.length; j++){
                            seriesreading.push(icondict[seriesData[j]][0])
                        }
                        console.log('antoLayout-dict', icondict)

                    })
                    .catch(error=>{
                        console.log(error.message);
                    })
                    .then(re=>{
                        
            // 后端test
                        this.props.changeIcontype(iconType);
        //                console.log('DataPane_Icon',iconType);
                        this.props.changeCategoriesreading(categoriesreading);
        //                console.log('DataPane_categoriesreading',categoriesreading);
                        this.props.changeSeriesreading(seriesreading);
                        console.log('icondict', icondict)
                        console.log('FieldsData', FieldsData)
                        console.log('categoriesData', categoriesData)
                        console.log('seriesData', seriesData)
                        this.props.changeIconDict(icondict, FieldsData, categoriesData, seriesData);
                        this.props.changeIconPair(iconPair);    
                        this.props.changeAllData(AllData);
                        // this.forceUpdate(); 
                    })
                    .catch(error=>{
                        console.log(error.message);
                    });

        // this.props.changeStyleLayout(this.props.editSpec['style'].layout[0])
           
         
            resolve('111');

          }).then((res) => {

            //避坑大法 - 解决改变状态却不刷新页面问题
            //https://blog.csdn.net/qq_40259641/article/details/105275819
            let widgets = [...this.props.widgets];
            
            //更新colormap,重新计算边界
            const rowData = this.props.dataList[widgets[this.props.editMode].dataIndex];
            // const spec = widgets[this.props.selectChartIndex].spec;
            const spec = this.props.editSpec;

            const size = {w:widgets[this.props.editMode].w, h: widgets[this.props.editMode].h};

            widgets[this.props.editMode].spec = this.props.editSpec;
            widgets[this.props.editMode].dataIndex = this.props.dataIndex;
            // widgets[this.props.editMode].targetIndexIsVis = this.props.targetIndexIsVis;
            // widgets[this.props.editMode].targetIndexIsLabel = this.props.targetIndexIsLabel;


          
            this.props.changeMapping(widgets);
            this.props.widgets[this.props.editMode].spec = this.props.editSpec;


  
           })
        }

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
        console.log('datapane-props', this.props);
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
                                style={{  width: "93%"}}
                            >
                                {dataNameList.map((d, i) => (
                                    <Option label={d} key={d}>{d.length>30? d.slice(0, 29)+'...    ':d+'    ' }
                                        <span aria-label={d}>
                                            {
                                                (i === 0 || i === 1 || i === 2) ? null :
                                                    <Button shape="circle" icon="close" size='small' style={{ float: 'right', fontSize: 10, marginTop:'-20px' }}
                                                        onClick={(e) => { this.deleteData(i); e.stopPropagation() }} />
                                            }
                                        </span>
                                    </Option>)
                                )}
                            </Select>
                        </div>
                        <div style={{ width:'30px',height: '30px',padding: '0px 0px 0px 0px',marginLeft:'94%',marginTop:'-30px', border:'1px solid #968176', borderRadius:'2px'}} >
                            <Upload
                                accept=".csv"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                            >
                                <Icon type="upload" />
                            </Upload>
                        </div>
                        <Divider orientation="center">Visualizations</Divider>
                        <div width={270} style={{ height: '40px',padding: '0px 0px 0px 0px', overflowX:'auto',overflowY:'hidden'}} >
                            <div style={{width:'380px',height: '30px',padding: '0px 0px 0px 0px',marginTop:'-1px',marginLeft:'15px'}} >
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
                            <Button type="primary" block style={{ marginTop: '48px', marginLeft:'35px',backgroundColor:'#968176', fontSize:'14px', width:'150px', height:'25px'}} onClick={this.handleChartOk} type="primary">{this.props.chartMode? 'Generate':'Update'}</Button>
                        </Content>
                    </Layout>
                </div>
            // </div>
        )
    }
}
