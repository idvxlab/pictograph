import React, { Component } from 'react'
import { Upload, Button, Icon, Select, Alert, Popconfirm, message, Divider  } from 'antd';
import DataPreview from '@/components/DataPreview';
import ChartEditor from '@/components/ChartEditor';
import SimpleDataPreview from '@/components/DataPreview/SimpleDataPreview';
import DataProcessor from '@/components/DataPreview/processor';
import ChartRecorderInstance from '@/recorder/innerAnimation';
import createElementUtils from "@/utils/creatElement";
import { getDefaultSpec } from '@/charts/Info';
import FieldList from '@/components/ChartEditor/MappingPanel/FieldList';
import Encoding from '@/components/ChartEditor/MappingPanel/Encoding';
import carsSchema from '@/datasets/carsSchema';
import SceneTool from './SceneTool';
import ChartType from '@/constants/ChartType';
//import _ from 'lodash'

const { Dragger } = Upload;
const { Option } = Select;
const dataProcessor = new DataProcessor();
const chartRecorderInstance = new ChartRecorderInstance();

export default class DataTool extends Component {

    constructor(props) {
        super(props);
        console.log('props');
        console.log(props);
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
        let encoding;
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
                // this.props.switchData(currentVis.dataIndex)
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

    handleChartOk = () => {
        // Update chart on canvas
        const newScene = Object.assign({}, this.props.currentScene);
        let newEle = Object.assign({}, this.props.currentElement);
        // update info dataIndex
        newEle.info().dataIndex = this.props.currentData.dataIndex;
        newEle.info().spec = this.props.displaySpec;
        // newEle.info().colorset = [];
       
        // if (this.props.displaySpec.animation.length) { //有配置动画
        //     createElementUtils.loadVideoDuration(this.props.chartAnimationVideoURL).then(duration => {
        //         //console.log("duration...", typeof duration, duration)
        //         newEle.info().src = this.props.chartAnimationVideoURL; //双击可以预览chartAnimationVideo
        //         newEle.duration(duration); //更改charteElement解析到的播放时长
        //         newEle.fragments()[0].duration(duration); //更新在轨道编辑器中的时间显示
        //         newScene.updateElement(newEle, this.props.elementIndex);
        //         this.props.updateScene(this.props.sceneIndex, newScene);
        //         const elementName = this.props.sceneIndex + '-' + this.props.elementIndex;
        //         this.props.updateElement(newEle, this.props.elementIndex, elementName);
        //         // Disable editor
        //         this.setState({
        //             chartvisible: false,
        //         });
        //     })
        // } else {
            newEle.info().src = null; //没有动画
            newScene.updateElement(newEle, this.props.elementIndex);
            this.props.updateScene(this.props.sceneIndex, newScene);
            const elementName = this.props.sceneIndex + '-' + this.props.elementIndex;
            this.props.updateElement(newEle, this.props.elementIndex, elementName);

            // this.props.cleanInterationLayer(true)
            // let encoding = this.props.currentVis.spec.encoding;
            // let hasEncoding = encoding && (JSON.stringify(encoding.x) !== "{}" || JSON.stringify(encoding.y) !== "{}")
            // let index = hasEncoding ? this.props.currentVis.dataIndex : this.props.currentData.dataIndex;

            // this.props.openEditor(index, this.props.currentVis.spec);
            // Disable editor
            this.setState({
                chartvisible: false,
            });
        // }

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
        const text = 'Are you sure to change chart data?（All the encodings will be emptied.）';
        return (
            
            <div width={260} style={{  fontSize: '14px', backgroundColor: 'white', height: this.props.contentHeight + 'px', 
            overflowY:"hidden",overflowX: "hidden",
            display:'flex',flexDirection:'column',flex:'1'
            }}>
                <div className='pane'>
                    <div className='header'>Data</div>
                    <div style={{ height: '140px',padding: '0px 10px 0px 10px' }} >
                        <Dragger
                            accept=".csv"
                            showUploadList={false}
                            beforeUpload={this.beforeUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            {/* <p className="ant-upload-text">Click or drag csv file to this area</p> */}
                            <p className="ant-upload-hint">
                                Click or drag csv file to this area
                        </p>
                        </Dragger>
                    </div>
                    <Select id="data-selection"
                        value={currentData.name}
                        defaultValue={currentData.name}
                        onChange={(e) => this.handleDataSelect(e)}
                        optionLabelProp="label"
                        style={{ marginTop: '8px', width: 254, padding: '0px 10px 10px 10px'}}
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

                {/* <SimpleDataPreview currentData={currentData} /> */}

                {/* <Button block style={{ marginTop: '8px' }} onClick={this.handleDataPreview} type="primary">Preview & Edit Data</Button> */}

                

                {/* <ChartEditor
                    currentData={currentData}
                    visible={this.state.chartvisible}
                    handleOk={this.handleChartOk}
                    handleCancel={this.handleChartEditorCancel}
                    {...this.props}
                /> */}
                 {/* <MappingPanel currentFields={carsSchema} channels={this.props.channels}  {...this.props} /> */}
                <div className='pane'style={{ height: '254px' }}>
                    <div className='header'>Fields</div>
                    <FieldList  { ...this.props }/>
                </div>

                {/* <div className='pane'style={{ height: 307 }}>
                    <div className='header'>ColorThemes</div>
                    <SceneTool {...this.props}/>
                </div> */}
                

                {/* <div className='pane' style={{ height: '350px' }}>
                    <div className='header'>Channels</div>
                    <Encoding { ...this.props } />
                </div> */}

                {/* <Popconfirm placement="top" title={text} visible={this.state.confirmVisible} onConfirm={this.changeDataConfirm} onCancel={this.changeDataCancel} okText="Yes" cancelText="No">
                    <Button block style={{ marginTop: '8px', backgroundColor:'#00aeff', borderColor:'#00aeff' }} onClick={this.handleChartOk} type="primary">Data Mapping</Button>
                </Popconfirm> */}
                {/* <MappingPanel currentFields={carsSchema} channels={this.props.channels}  {...this.props} /> */}
                {/* <Alert style={{ display: this.state.alertvisible === false ? 'none' : 'block', position: 'fixed', top: 110, width: 280 }} message="Error: Failed to load data." type="error" showIcon closable /> */}
                {/* <Alert style={{position:'fixed', top: 10}} type="error" message="Error text" banner /> */}
            </div>
        )
    }
}

