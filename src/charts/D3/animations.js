import ChartType from '@/constants/ChartType';
import barchartAnimations from './BarChart/animations';
import linechartAnimations from './LineChart/animations';
import areachartAnimations from './AreaChart/animations';
import piechartAnimations from './PieChart/animations';
import iconnumberAnimations from './IconNumber/animations';
import treemapAnimations from './TreeMap/animations';
import marixAnimations from './Marix/animations';
import mapAnimations from './Map/animations';

export default function d3Animations(chartType) {
    switch (chartType) {
        case ChartType.BARCHART:
            return barchartAnimations;

        case ChartType.LINECHART:
            return linechartAnimations;

        case ChartType.AREACHART:
            return areachartAnimations;

        case ChartType.PIECHART:
            return piechartAnimations;

        case ChartType.MARIX:
            return marixAnimations;

        case ChartType.TREEMAP:
            return treemapAnimations;

        case ChartType.ICONNUMBER:
            return iconnumberAnimations;

        case ChartType.MAP:
            return mapAnimations;


        default:
            return []
    }
}