/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:43
 * @LastEditors: Pei Liu
 * @LastEditTime: 2020-12-30 11:00:13
 */
import React, { Component } from 'react';
import D3Chart from '../D3Chart';
import draw from './vis';
import hover from './hover';
import select from './select';
import {animate} from './animation';

export default class BarChart extends Component {
    
    render() {
        console.log('BarChart-this.props',this.props)
        return <D3Chart chartId={this.props.chartId} draw={draw} hover={hover} select={select} animate={animate} {...this.props}/>
    }
}
