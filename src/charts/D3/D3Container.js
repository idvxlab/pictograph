/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:43
 * @LastEditors: Pei Liu
 * @LastEditTime: 2020-12-30 11:02:04
 */
import React, { Component } from 'react';
import ChartType from '@/constants/ChartType';
import BarChart from './BarChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';
import PieChart from './PieChart';
import TreeMap from './TreeMap';
import Marix from './Marix';
import Map from './Map';
import IconNumber from './IconNumber';
import ProportionalArea from './ProportionalArea';
import Fraction from './Fraction';

export default class D3Container extends Component {
    chooseChart() {
        console.log('D3Container-this.props',this.props)
        switch (this.props.type) {
            case ChartType.BARCHART:
                return  <BarChart {...this.props}/>

            case ChartType.LINECHART:
                return  <LineChart {...this.props}/>

            case ChartType.AREACHART:
                return  <AreaChart {...this.props}/>

            case ChartType.PIECHART:
                return  <PieChart {...this.props}/>

            case ChartType.TREEMAP:
                return  <TreeMap {...this.props}/>

            case ChartType.MARIX:
                return  <Marix {...this.props}/>
            case ChartType.MAP:
                return  <Map {...this.props}/> 
            case ChartType.ICONNUMBER:
                return  <IconNumber {...this.props}/>
            case ChartType.PROPORTIONALAREA:
                return  <ProportionalArea {...this.props}/>  
            case ChartType.FRACTION:
                return  <Fraction {...this.props}/>  
            
            
         
            default:
                return  null
        }
    }

    render() {
        return this.chooseChart()
    }
}
