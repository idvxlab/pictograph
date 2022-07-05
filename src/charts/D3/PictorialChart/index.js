import React, { Component } from 'react';
import D3Chart from '../D3Chart';
import draw from './vis';
import hover from './hover';
import select from './select';
import {animate} from './animation';

export default class PictorialChart extends Component {
    render() {
        return <D3Chart chartId={this.props.chartId} draw={draw} hover={hover} select={select} animate={animate} {...this.props}/>
    }
}