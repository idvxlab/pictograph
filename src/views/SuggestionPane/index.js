/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:55
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-04-06 12:42:26
 */
import { connect } from 'react-redux';
import SuggestionPane from './SuggestionPane';
import {scenes, sceneIndex} from '@/selectors/video';
import {uimode} from '@/selectors/ui';
import { dataList } from '@/selectors/vis';
import * as videoActions from '@/actions/videoAction';
import * as uiActions from '@/actions/uiAction';
import * as canvasActions from '@/actions/canvasAction';
import { widgets, layout, backgroundColor, cardColor, textColor ,colormap,colorPair,textfont,styleLayout, iconcolor,categoriesreading,seriesreading, fieldsreading, icontype, isLoading, featuresList, icondict, FieldsData, seriesData, categoriesData, inspireMode, similarMode, beautyMode} from '../../selectors/canvas';
import { dataNameList, fieldsList, displaySpec, currentData, currentVis, channels } from '@/selectors/vis';


const mapStateToProps = state => {
    return {
        widgets: widgets(state),
        layout:layout(state),
        backgroundColor: backgroundColor(state),
        cardColor: cardColor(state),
        textColor: textColor(state),
        colormap:colormap(state),
        colorPair: colorPair(state),
        textfont:textfont(state),
        iconcolor:iconcolor(state),
        categoriesreading:categoriesreading(state),
        seriesreading:seriesreading(state),
        icondict: icondict(state),
        fieldsreading: fieldsreading(state),
        icontype:icontype(state),
        styleLayout:styleLayout(state),

        icondict: icondict(state),
        FieldsData: FieldsData(state),
        seriesData: seriesData(state),
        categoriesData: categoriesData(state),

        scenes: scenes(state),
        sceneIndex: sceneIndex(state),
        uimode: uimode(state),
        // vis
        dataList: dataList(state),

        isLoading: isLoading(state),

        featuresList: featuresList(state),

        inspireMode: inspireMode(state),
        similarMode: similarMode(state),
        beautyMode: beautyMode(state)




        
    }
}

const mapDispatchToProps = dispatch => {
    return {
        unselectElement: () => dispatch(canvasActions.unselectElement()),
        selectScene: (index) => dispatch(videoActions.selectScene(index)),
        addScene: (scene) => dispatch(videoActions.addScene(scene)),
        removeScene: (index) => dispatch(videoActions.removeScene(index)),
        updateScene: (index, scene) => dispatch(videoActions.updateScene(index, scene)),
        reorderScene: (sourceIndex, destinationIndex) => dispatch(videoActions.reorderScene(sourceIndex, destinationIndex)),
        addProject: (source) => dispatch(videoActions.addProject(source)),
        removeProject: () => dispatch(videoActions.removeProject()),
        displayTrackEditor: () => dispatch(uiActions.displayTrackEditor()),

        changeStyleLayout:(styleLayout)=>dispatch(canvasActions.changeStyleLayout(styleLayout)),

        changeRankMode: (similarMode, beautyMode, inspireMode) => dispatch(canvasActions.changeRankMode(similarMode, beautyMode, inspireMode)),
        changeLayoutMode: (layoutMode) => dispatch(canvasActions.changeLayoutMode(layoutMode)),

        changeLoading: (isLoading) => dispatch(canvasActions.changeLoading(isLoading)),

        changeMapping: (widgets) => dispatch(canvasActions.changeMapping(widgets))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SuggestionPane)