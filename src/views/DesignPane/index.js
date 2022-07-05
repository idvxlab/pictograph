/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:54
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-02-01 21:53:07
 */
import { connect } from 'react-redux';
import DesignPane from './DesignPane';
import * as canvasActions from '@/actions/canvasAction';
import { cardColor, textColor,colormap,textfont, iconcolor, featuresList} from '../../selectors/canvas';

const mapStateToProps = state => {
    return {
        
        //style migration
        cardColor: cardColor(state),
        textColor: textColor(state),
        colormap:colormap(state),
        textfont:textfont(state),
        iconcolor:iconcolor(state),

        featuresList: featuresList(state)

        
    }
}

const mapDispatchToProps = dispatch => {  
    return {
        
        changeLoading: (isLoading) => dispatch(canvasActions.changeLoading(isLoading)),

        //style migration
        changeColorStyle:(backgroundColor, cardColor, textColor,colormap,textfont,iconcolor)=>dispatch(canvasActions.changeColorStyle(backgroundColor, cardColor, textColor,colormap,textfont,iconcolor)),

        changeFeaturesList: (featuresList) => dispatch(canvasActions.changeFeaturesList(featuresList))
       
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DesignPane)