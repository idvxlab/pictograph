/*
 * @Descripttion: 
 * @version: 
 * @Author: Siji Chen
 * @Date: 2020-09-21 12:48:30
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-04-11 18:17:22
 */
import { createSelector } from 'reselect';

export const isElementSelected = state => state.canvas.isElementSelected;
export const isCleanInterationLayer = state => state.canvas.isCleanInterationLayer;
export const elementIndex = state => state.canvas.elementIndex;
export const elementName = state => state.canvas.elementName;
export const actionHistory = state => state.canvas.actionHistory;
export const dragPos = state => state.canvas.dragPos;
export const transformInfo = state => state.canvas.transformInfo;

//layout-grid widgets
export const widgets = state => state.canvas.widgets;

export const selectChartIndex = state => state.canvas.selectChartIndex;
export const layout = state => state.canvas.layout;
export const backgroundColor = state => state.canvas.backgroundColor;
export const cardColor = state => state.canvas.cardColor;
export const textColor = state => state.canvas.textColor;
export const colormap = state => state.canvas.colormap;
export const colorPair = state => state.canvas.colorPair;
export const iconPair = state => state.canvas.iconPair;
export const textfont = state => state.canvas.textfont;
export const iconcolor = state=> state.canvas.iconcolor;
export const styleLayout=state=>state.canvas.styleLayout; 
export const icontype = state => state.canvas.icontype;
export const categoriesreading = state => state.canvas.categoriesreading;
export const seriesreading = state => state.canvas.seriesreading;
export const fieldsreading = state => state.canvas.fieldsreading;
export const FieldsData = state => state.canvas.FieldsData;
export const categoriesData = state => state.canvas.categoriesData;
export const seriesData = state => state.canvas.seriesData;
export const AllData = state => state.canvas.AllData;
export const icondict = state => state.canvas.icondict;
export const highlightindex=state=>state.canvas.highlightindex;

export const inspireMode = state => state.canvas.inspireMode;
export const similarMode = state => state.canvas.similarMode;
export const beautyMode = state => state.canvas.beautyMode;
export const layoutMode = state => state.canvas.layoutMode;

//desgin-panel
export const featuresList = state => state.canvas.featuresList;


//data-panel
export const chartMode = state => state.canvas.chartMode;
export const generateChannels = state => state.canvas.generateChannels;
export const generateSpec = state => state.canvas.generateSpec;

export const editMode = state => state.canvas.editMode;
export const editChannels = state => state.canvas.editChannels;
export const editSpec = state => state.canvas.editSpec;

//suggetion
export const isLoading = state => state.canvas.isLoading;



const scenes = state => state.video.scenes;
const sceneIndex = state => state.video.index;

export const currentElements = createSelector(
    scenes,
    sceneIndex,
    function(scenes, sceneIndex) {
        return scenes[sceneIndex].elements();
    }
)

export const currentElement = createSelector(
    currentElements,
    elementIndex,
    function(currentElements, elementIndex) {
        return currentElements[elementIndex];
    }
)