import ActionType from '../actions/types';
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';
import { axisBottom } from 'd3-axis';
import _ from "lodash";

const initialState = {
    isElementSelected: false,
    isCleanInterationLayer: false,
    elementIndex: -1,
    elementName: '',
    actionHistory: [],
    dragPos:'', // for tool display
    transformInfo:'', // for tool display
    widgets: [],//for layout-grid
    selectChartIndex: 0,
    layout:'',
    backgroundColor: '#fff',
    cardColor: '#fff',
    textColor: '#fff',
    iconcolor:'#a1a1a1',
    colormap: ["rgb(141,211,199)", "rgb(255,255,179)", "rgb(190,186,218)", "rgb(251,128,114)", "rgb(219,191,140)", "rgb(130,212,230)", "rgb(146,181,204)", "rgb(242,177,173)", "rgb(255,193,104)", "rgb(127,201,127)"],
    textfont:'robot',
    styleLayout:'',
    icontype:'',
    fieldsreading:'',
    categoriesreading:[],
    seriesreading:[],
    FieldsData: '',
    categoriesData: [],
    seriesData: [],
    AllData: [],
    icondict: {},
    highlightindex:0,
    colorPair: [],
    iconPair: [],

    //下面的结构其实与colorPair比较相似
    // colormap: [
    //     {name:'', color:'rgb(141,211,199)'},
    //     {name:'', color:'rgb(255,255,179)'},
    //     {name:'', color:'rgb(190,186,218)'},
    //     {name:'', color:'rgb(251,128,114)'},
    //     {name:'', color:'rgb(219,191,140)'},
    //     {name:'', color:'rgb(130,212,230)'},
    //     {name:'', color:'rgb(146,181,204)'},
    //     {name:'', color:'rgb(255,193,104)'},
    //     {name:'', color:'rgb(127,201,127)'}
    // ]

    chartMode: 'bar chart',
    generateChannels: d3Channels('bar chart'),
    generateSpec: d3DefaultSpec('bar chart'),

    editMode: false,
    editChannels: '',
    editSpec: '',  

    isLoading: false,

    inspireMode: false,
    similarMode: true,
    beautyMode: false,

    layoutMode: 'sugess',

    featuresList: []
}

export default (state = initialState, action) => {
    console.log('new-state-data222', {...state})
    // const newState = Object.assign({},state);
    const newState = {...state};
    newState.actionHistory = state.actionHistory.slice();
    newState.actionHistory.push(action);
    switch (action.type) {
        case ActionType.INIT_STATE:
            // newState = initialState;
            return initialState;
        //layout-grid action
        case ActionType.ADD_CHART:
            newState.widgets = action.widgets;
            return newState;
        case ActionType.REMOVE_CHART:
            newState.widgets = action.widgets;
            return newState;
        case ActionType.SELECT_CHART:
            newState.selectChartIndex = action.index; 
            return newState;
        case ActionType.CHANGE_LAYOUT:
            newState.layout = action.layout; 
            return newState;
        
        case ActionType.CHANGE_MAPPING:
            newState.widgets = action.widgets;
            return newState;

        case ActionType.CHANGE_TEXTFONT:
            newState.textfont = action.textfont;
            return newState;

        case ActionType.CHANGE_COLORSTYLE:
            console.log('CHANGE_COLORSTYLE',)
            newState.backgroundColor = action.backgroundColor;
            newState.cardColor = action.cardColor;
            newState.textColor = action.textColor;
            newState.colormap=action.colormap;
            newState.textfont=action.textfont;
            newState.iconcolor=action.iconcolor;
            console.log('card-Color', action.cardColor);
            console.log('text-font', action.textfont);
            
            return newState;

        case ActionType.CHANGE_COLORPAIR:
            newState.colorPair = action.colorPair;
            return newState;

        case ActionType.CHANGE_ICONPAIR:
            newState.iconPair = action.iconPair;
            console.log('iconPair',action.iconPair);
            return newState;
    
        case ActionType.CHANGE_STYLELAYOUT:
            newState.styleLayout=action.styleLayout;
            return newState;
        
         case ActionType.CHANGE_ICONTYPE:
            newState.icontype = action.icontype;
            return newState;

        case ActionType.CHANGE_CATEGORIESREADING:
            newState.categoriesreading = _.cloneDeep(action.categoriesreading);
            console.log("REDUCER_CATO",action.categoriesreading);
             return newState;
        
        case ActionType.CHANGE_SERIESREADING:
            newState.seriesreading = _.cloneDeep(action.seriesreading);
           console.log("REDUCER_SERI",action.seriesreading);
             return newState;  

        case ActionType.CHANGE_FIELDSREADING:
                newState.fieldsreading= action.fieldsreading;
                // console.log("REDUCER_SERI",action.seriesreading);
            return newState;  
            
        case ActionType.CHANGE_FIELDSDATA:
            newState.FieldsData = action.FieldsData;
            return newState;

        case ActionType.CHANGE_ALLDATA:
            newState.AllData = action.AllData;
            return newState;
        
        case ActionType.CHANGE_ICONDICT:
            newState.icondict = action.icondict;
            
            newState.FieldsData = action.FieldsData;
            newState.categoriesData = _.cloneDeep(action.categoriesData);
            newState.seriesData = _.cloneDeep(action.seriesData);

            newState.fieldsreading = action.icondict[action.FieldsData][0];

            console.log('newState.fieldsreading',newState.fieldsreading)


            var tempCategoriesreading = [];
            for(var i=0;i<action.categoriesData.length;i++){
                tempCategoriesreading .push(action.icondict[action.categoriesData[i]][0]);
            }
            newState.categoriesreading = tempCategoriesreading ;

            var tempSeriesreading = [];
            for(var i=0;i<action.seriesData.length;i++){
                tempSeriesreading.push(action.icondict[action.seriesData[i]][0]);
            }
            newState.seriesreading = tempSeriesreading;

            console.log('new-state-data', newState)
            
            return newState;   

        case ActionType.CHANGE_RANKMODE:
            newState.inspireMode = action.inspireMode;
            newState.similarMode = action.similarMode;
            newState.beautyMode = action.beautyMode;

            return newState; 
            
        case ActionType.CHANGE_LAYOUTMODE:
            console.log('layoutMode-state', action.layoutMode)
            newState.layoutMode = action.layoutMode;
            return newState;  

        case ActionType.CHANGE_SERIESDATA:
            newState.seriesData = action.seriesData;

            return newState;

        case ActionType.CHANGE_HIGHLIGHTINDEX:
           newState.highlightindex=action.highlightindex;
           return newState;

        //design-panel
        case ActionType.CHANGE_FEATURESLIST:
            newState.featuresList = action.featuresList;
            console.log('change-featuresList',action.featuresList)
            return newState;


        //data panel
        case ActionType.CHANGE_CHARTMODE:
            newState.chartMode = action.chartMode;
            // console.log('change-chartmode',action.chartMode)
            return newState;
        case ActionType.CHANGE_GENERATECHANNELS:
            newState.generateChannels = action.generateChannels;
            return newState;

        case ActionType.CHANGE_GENERATESPEC:
            newState.generateSpec = action.generateSpec;
            return newState;

        case ActionType.CHANGE_EDITMODE:
            newState.editMode = action.editMode;
            return newState;
        case ActionType.CHANGE_EDITCHANNELS:
            newState.editChannels = action.editChannels;
            return newState;

        case ActionType.CHANGE_EDITSPEC:
            newState.editSpec = action.editSpec;
            return newState;

        case ActionType.SELECT_ELEMENT:
            newState.isElementSelected = true;
            newState.elementIndex = action.elementIndex;
            newState.elementName = action.elementName;
            return newState;
        case ActionType.DRAG_ELEMENT:
            newState.dragPos = action.dragPos;
            return newState;
        case ActionType.TRANSFORM_ELEMENT:
            newState.transformInfo = action.transformInfo;
            return newState;
        case ActionType.UNSELECT_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState;
        case ActionType.CLEAN_INTERACTION_LAYER: 
            newState.isCleanInterationLayer = action.isCleanInterationLayer;
            return newState;
        case ActionType.ADD_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState;
        case ActionType.REMOVE_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState
        case ActionType.UPDATE_ELEMENT:
            //TODO: add action detail
            newState.isElementSelected = true;
            newState.elementIndex = action.elementIndex;
            newState.elementName = action.elementName;
            return newState
        case ActionType.REORDER_ELEMENT:
            newState.isElementSelected = true;
            newState.elementIndex = action.destinationIndex;
            return newState
        case ActionType.UNDO_CANVAS:
            //TODO: undo
            return state
        case ActionType.REDO_CANVAS:
            //TODO: redo
            return state

        case ActionType.CHANGE_LOADING:
            newState.isLoading = action.isLoading;
            return newState;
        default:
            return state
    }
}