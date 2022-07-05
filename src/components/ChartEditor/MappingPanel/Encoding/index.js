/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:45
 * @LastEditors: Pei Liu
 * @LastEditTime: 2020-12-30 16:43:18
 */
import React, { Component } from 'react';
import Shelf from '../Shelf';

export default class Encoding extends Component {

    render() {
        const shelves = [];
        const channels = this.props.chartMode? this.props.generateChannels:this.props.editChannels;
        for (const channel in channels) {
            shelves.push(<Shelf key={channel} channel={channels[channel]} dropAvailable={true} {...this.props}/>);
        }
       
        return (
            <div style={{height: '165px', overflow: 'auto'}}>
                <div style={{marginTop: '-7px'}}>
                    {shelves}
                </div>
            </div>
        )
    }
}
