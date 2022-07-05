/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:45
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-04-11 18:16:10
 */
import { connect } from 'react-redux';
import CanvasPane from './CanvasPane';
import { dataNameList, dataList, fieldsList, displaySpec, currentData, currentVis, channels } from '@/selectors/vis';
import * as canvasActions from '@/actions/canvasAction';
import * as visActions from '@/actions/visAction';
import { widgets, layout, backgroundColor, cardColor, textColor ,colormap,textfont, styleLayout,icontype, iconPair, categoriesreading,seriesreading,fieldsreading, iconcolor, colorPair, icondict, FieldsData, seriesData, categoriesData, AllData, inspireMode, layoutMode} from '../../selectors/canvas';
import { changeCategoriesreading } from '../../actions/canvasAction';
import { sample } from 'lodash';

const mapStateToProps = state => {
    return {
        //layout-grid
        widgets: widgets(state),
        layout:layout(state),
        backgroundColor: backgroundColor(state),
        cardColor: cardColor(state),
        textColor: textColor(state),
        colormap:colormap(state),
        colorPair: colorPair(state),
        textfont:textfont(state),
        styleLayout:styleLayout(state),
        icontype:icontype(state),
        categoriesreading:categoriesreading(state),
        seriesreading:seriesreading(state),
        fieldsreading: fieldsreading(state),
        FieldsData: FieldsData(state),
        seriesData: seriesData(state),
        categoriesData: categoriesData(state),
        AllData: AllData(state),
        icondict: icondict(state),
        iconcolor:iconcolor(state),
        iconPair: iconPair(state),

        inspireMode: inspireMode(state),
        layoutMode: layoutMode(state),

        // data
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
        removeChart: (widgets) => dispatch(canvasActions.removeChart(widgets)),
        selectChart: (index) => dispatch(canvasActions.selectChart(index)),
        openEditor: (dataIndex, spec) => dispatch(visActions.openEditor(dataIndex, spec)),
        changeMapping: (widgets) => dispatch(canvasActions.changeMapping(widgets)),
        addChart: (widgets) => dispatch(canvasActions.addChart(widgets)),
        changeLayout: (layout) => dispatch(canvasActions.changeLayout(layout)),
        
        //vis
        switchData : (index) => dispatch(visActions.switchData(index)),
        changeMapping: (widgets) => dispatch(canvasActions.changeMapping(widgets)),
        changeChartMode: (chartMode) => dispatch(canvasActions.changeChartMode(chartMode)),
        changeIcontype: (icontype) => dispatch(canvasActions.changeIcontype(icontype)),
        changeTextfont: (textfont) => dispatch(canvasActions.changeTextfont(textfont)),
        changeColorPair: (colorPair) => dispatch(canvasActions.changeColorPair(colorPair)),

        initState : () => dispatch(canvasActions.initState()),

        //icon replace
        changeCategoriesreading: (categoriesreading) => dispatch(canvasActions.changeCategoriesreading(categoriesreading)),
        changeSeriesreading: (seriesreading) => dispatch(canvasActions.changeSeriesreading(seriesreading)),
        changeFieldsreading: (fieldsreading) => dispatch(canvasActions.changeFieldsreading(fieldsreading))


      
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CanvasPane)