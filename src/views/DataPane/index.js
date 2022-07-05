/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:54
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-04-11 18:08:13
 */
import { connect } from 'react-redux';
import DataPane from './DataPane';
import * as canvasActions from '@/actions/canvasAction';
import * as visActions from '@/actions/visAction';
import { dataIndex, dataNameList, dataList, fieldsList, displaySpec, currentData, currentVis, channels} from '@/selectors/vis';
import { widgets,chartMode, generateChannels, generateSpec, editMode, editChannels, editSpec, colorPair, colormap, seriesData } from '../../selectors/canvas';

const mapStateToProps = state => {

    return {
        //layout-grid
        widgets: widgets(state),

        chartMode: chartMode(state),
        generateChannels: generateChannels(state),
        generateSpec: generateSpec(state),
        editMode: editMode(state),
        editChannels: editChannels(state),
        editSpec: editSpec(state),
        colormap: colormap(state),
        colorPair: colorPair(state),

        // data
        dataIndex: dataIndex(state),
        dataNameList: dataNameList(state),
        dataList: dataList(state),
        fieldsList: fieldsList(state),
        currentData: currentData(state),
        // vis
        displaySpec: displaySpec(state),
        currentVis: currentVis(state),
        channels: channels(state),

    }
}

const mapDispatchToProps = dispatch => {
    return {
        //layout-grid
        addChart: (widgets) => dispatch(canvasActions.addChart(widgets)),
        removeChart: (widgets) => dispatch(canvasActions.removeChart(widgets)),
        selectChart: (index) => dispatch(canvasActions.selectChart(index)),
        changeMapping: (widgets) => dispatch(canvasActions.changeMapping(widgets)),

        changeColorPair: (colorPair) => dispatch(canvasActions.changeColorPair(colorPair)),

        changeIcontype: (icontype) => dispatch(canvasActions.changeIcontype(icontype)),
        changeCategoriesreading: (categoriesreading) => dispatch(canvasActions.changeCategoriesreading(categoriesreading)),
        changeSeriesreading: (seriesreading) => dispatch(canvasActions.changeSeriesreading(seriesreading)),
        changeFieldsData: (FieldsData) => dispatch(canvasActions.changeFieldsData(FieldsData)),
        changeSeriesData: (seriesData) => dispatch(canvasActions.changeSeriesData(seriesData)),
        changeAllData: (AllData) => dispatch(canvasActions.changeAllData(AllData)),
        changeIconDict: (icondict, FieldsData, categoriesData, seriesData) => dispatch(canvasActions.changeIconDict(icondict, FieldsData, categoriesData, seriesData)),
        changeIconPair: (iconPair) => dispatch(canvasActions.changeIconPair(iconPair)),


        changeChartMode: (chartMode) => dispatch(canvasActions.changeChartMode(chartMode)),
        changeGenerateChannels: (generateChannels) => dispatch(canvasActions.changeGenerateChannels(generateChannels)),
        changeGenerateSpec: (generateSpec) => dispatch(canvasActions.changeGenerateSpec(generateSpec)),

        changeEditMode: (editMode) => dispatch(canvasActions.changeEditMode(editMode)),
        changeEditChannels: (editChannels) => dispatch(canvasActions.changeEditChannels(editChannels)),
        changeEditSpec: (editSpec) => dispatch(canvasActions.changeEditSpec(editSpec)),

        changeStyleLayout:(styleLayout)=>dispatch(canvasActions.changeStyleLayout(styleLayout)),

        changeRankMode: (similarMode, beautyMode, inspireMode) => dispatch(canvasActions.changeRankMode(similarMode, beautyMode, inspireMode)),
        
         // vis
         switchData : (index) => dispatch(visActions.switchData(index)),
         addData: (dataName, data, dataSchema) => dispatch(visActions.addData(dataName, data, dataSchema)),
         deleteData: (index) => dispatch(visActions.deleteData(index)),
         encoding: (channel, field, isEncoded) => {
             if (isEncoded) {
                 return dispatch(visActions.modifyEncoding(channel, fieldsList))
             } else {
                 return dispatch(visActions.encoding(channel, field))
             }
         },
         removeEncoding: (channel, field) => dispatch(visActions.removeEncoding(channel, field)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DataPane)