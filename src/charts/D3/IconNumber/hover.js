import * as d3 from 'd3';
import { getStackedData,getAggregatedRows, getWidth } from './helper';
import ChartAnimationTask from '../ChartAnimationTask';
import ChartAnimationType from '../ChartAnimationType';
import _ from 'lodash';
const config = {
    "legend-text-color": "#666"
}
//const offset = 20; // To show whole chart

const inArea = (point, area) => {
    // check dragging mouse area
    if (point.x > area.x && point.x < (area.x + area.width) && point.y > area.y && point.y < (area.y + area.height)) {
        return true;
    } else {
        return false;
    }
}

const draw = (props) => {

   
}

export default draw;