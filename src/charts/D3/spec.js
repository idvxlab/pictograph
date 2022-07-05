import ChartType from '@/constants/ChartType';
import barchartSpec from './BarChart/spec';
import linechartSpec from './LineChart/spec';
import areachartSpec from './AreaChart/spec';
import piechartSpec from './PieChart/spec';
import treemapSpec from './TreeMap/spec';
import mapSpec from './Map/spec';
import marixSpec from './Marix/spec';
import iconnumberSpec from './IconNumber/spec';

import proportionalAreaSpec from './ProportionalArea/spec';
import fractionSpec from './Fraction/spec'

export default function d3DefaultSpec(chartType) {
    switch (chartType) {
        case ChartType.BARCHART:
            return barchartSpec;

        case ChartType.LINECHART:
            return linechartSpec;

        case ChartType.AREACHART:
            return areachartSpec;

        case ChartType.PIECHART:
            return piechartSpec;


        case ChartType.TREEMAP:
            return treemapSpec;

        case ChartType.MARIX:
            return marixSpec;
    
        case ChartType.MAP:
            return mapSpec;
        
        case ChartType.ICONNUMBER:
            return iconnumberSpec;

        case ChartType.PROPORTIONALAREA:
            return proportionalAreaSpec;
        
        case ChartType.FRACTION:
            return fractionSpec;
        
        default:
            return {}
    }
}