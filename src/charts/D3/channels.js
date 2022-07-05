import ChartType from '@/constants/ChartType';
import barchartChannels from './BarChart/channels';
import linechartChannels from './LineChart/channels';
import areachartChannels from './AreaChart/channels';
import piechartChannels from './PieChart/channels';

import treemapChannels from './TreeMap/channels';
import marixChannels from './Marix/channels';
import mapChannels from './Map/channels';
import iconnumberChannels from './IconNumber/channels';

import proportionalAreaChannels from './ProportionalArea/channels';
import fractionChannels from './Fraction/channels';


export default function d3Channels(chartType) {

    switch (chartType) {
        case ChartType.BARCHART:
            return barchartChannels;

        case ChartType.LINECHART:
            return linechartChannels;

        case ChartType.AREACHART:
            return areachartChannels;

        case ChartType.PIECHART:
            return piechartChannels;


        case ChartType.TREEMAP:
            return treemapChannels;

        case ChartType.MARIX:
            return marixChannels;
        
        case ChartType.MAP:
            return mapChannels;
        
        case ChartType.ICONNUMBER:
            return iconnumberChannels;
        
        case ChartType.PROPORTIONALAREA:
            return proportionalAreaChannels;
        
        case ChartType.FRACTION:
            return fractionChannels;
    
        default:
            return {}
    }
}