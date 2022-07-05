import React, { Component } from 'react';
import D3Chart from '../D3Chart';
import draw from './vis';
import hover from './hover';
import select from './select';
import {animate} from './animation';

export default class PieChart extends Component {
    render() {
        console.log('this.props-pie', this.props)
        return <D3Chart chartId={this.props.chartId} draw={draw} hover={hover} select={select} animate={animate} {...this.props}/>
    }
}