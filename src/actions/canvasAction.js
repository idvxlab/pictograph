import { seriesData } from '../selectors/canvas';
import ActionType from './types';

export const initState = () => ({
    type: ActionType.INIT_STATE
})

export const addChart = (widgets) => ({
    type: ActionType.ADD_CHART,
    widgets
})

export const removeChart = (widgets) => ({
    type: ActionType.REMOVE_CHART,
    widgets

})
export const selectChart = (index) => ({
    type: ActionType.SELECT_CHART,
    index
})
export const changeMapping = (widgets) => ({
    type: ActionType.CHANGE_MAPPING,
    widgets
})
export const changeTextfont = (textfont) => ({
    type: ActionType.CHANGE_TEXTFONT,
    textfont
})
export const changeLayout = (layout) => ({
    type: ActionType.CHANGE_LAYOUT,
    layout
})
export const changeColorStyle = (backgroundColor, cardColor, textColor,colormap,textfont,iconcolor) => ({
    type: ActionType.CHANGE_COLORSTYLE,
    backgroundColor,
    cardColor,
    textColor,
    colormap,
    textfont,
    iconcolor
})
export const changeColorPair = (colorPair) => ({
    type: ActionType.CHANGE_COLORPAIR,
    colorPair
})

export const changeIconPair = (iconPair) => ({
    type: ActionType.CHANGE_ICONPAIR,
    iconPair
})

export const changeStyleLayout=(styleLayout)=>({
    type:ActionType.CHANGE_STYLELAYOUT,
    styleLayout
})

export const changeRankMode=(similarMode, beautyMode, inspireMode)=>({
    type:ActionType.CHANGE_RANKMODE,
    similarMode,
    beautyMode,
    inspireMode
})

export const changeLayoutMode=(layoutMode) => ({
    type: ActionType.CHANGE_LAYOUTMODE,
    layoutMode
})

export const changeIcontype = (icontype) => ({
        type: ActionType.CHANGE_ICONTYPE,
        icontype
    })

export const changeCategoriesreading = (categoriesreading) => ({
        type: ActionType.CHANGE_CATEGORIESREADING,
        categoriesreading,
    })

export const changeSeriesreading = (seriesreading) => ({
        type: ActionType.CHANGE_SERIESREADING,
        seriesreading,
    })

export const changeFieldsreading = (fieldsreading) => ({
        type: ActionType.CHANGE_FIELDSREADING,
        fieldsreading,
    })

export const changeFieldsData = (FieldsData) => ({
        type: ActionType.CHANGE_FIELDSDATA,
        FieldsData,
    })

export const changeSeriesData = (seriesData) => ({
        type: ActionType.CHANGE_SERIESDATA,
        seriesData
})

export const changeAllData = (AllData) => ({
        type: ActionType.CHANGE_ALLDATA,
        AllData,
    })

export const changeIconDict = (icondict, FieldsData, categoriesData, seriesData) => ({
    type: ActionType.CHANGE_ICONDICT,
    icondict,
    FieldsData, 
    categoriesData, 
    seriesData
})
/**************************************** */
export const changeHighlightIndex=(highlightindex)=>({
    type:ActionType.CHANGE_HIGHLIGHTINDEX,
    highlightindex,
})

//design-panel
export const changeFeaturesList = (featureslist) => ({
    type: ActionType.CHANGE_FEATURESLIST,
    featureslist
})

//data panel
export const changeChartMode = (chartMode) => ({
    type: ActionType.CHANGE_CHARTMODE,
    chartMode
})

export const changeGenerateChannels = (generateChannels) =>({
    type: ActionType.CHANGE_GENERATECHANNELS,
    generateChannels
})

export const changeGenerateSpec = (generateSpec) =>({
    type: ActionType.CHANGE_GENERATESPEC,
    generateSpec
})

export const changeEditMode = (editMode) => ({
    type: ActionType.CHANGE_EDITMODE,
    editMode
})

export const changeEditChannels = (editChannels) =>({
    type: ActionType.CHANGE_EDITCHANNELS,
    editChannels
})

export const changeEditSpec = (editSpec) =>({
    type: ActionType.CHANGE_EDITSPEC,
    editSpec
})

export const selectElement = (elementIndex, elementName) => ({
    type: ActionType.SELECT_ELEMENT,
    elementIndex,
    elementName,
})

export const unselectElement = () => ({
    type: ActionType.UNSELECT_ELEMENT,
})

export const cleanInterationLayer =(isCleanInterationLayer)=>({
    type:ActionType.CLEAN_INTERACTION_LAYER,
    isCleanInterationLayer
})

export const addElement = (element) => ({
    type: ActionType.ADD_ELEMENT,
    element,
})

export const updateElement = (element, elementIndex, elementName, updateInfo) => ({
    type: ActionType.UPDATE_ELEMENT,
    element,
    elementIndex,
    elementName,
    updateInfo,
})

export const removeElement = (element, elementIndex) => ({
    type: ActionType.REMOVE_ELEMENT,
    element,
    elementIndex,
})

export const reorderElement = (sourceIndex, destinationIndex) => ({
    type: ActionType.REORDER_ELEMENT,
    sourceIndex,
    destinationIndex,
})


export const dragElement = (dragPos) => ({ 
    type: ActionType.DRAG_ELEMENT,
    dragPos,
})

export const transformElement = (transformInfo) => ({ 
    type: ActionType.TRANSFORM_ELEMENT,
    transformInfo,
})

export const changeLoading = (isLoading) =>({
    type: ActionType.CHANGE_LOADING,
    isLoading

})