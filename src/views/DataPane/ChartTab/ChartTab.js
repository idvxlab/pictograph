import React, { Component } from 'react';
import { Collapse, List } from 'antd';
import ChartCard from '@/components/ChartCard';
import ChartCategory from '@/constants/ChartCategory';
import './charttab.css';
import {d3Charts} from './chartList';


export default class ChartTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: ChartCategory.VEGALITE
        }
    }

    render() {
        return (
                        <List
                            style={{ backgroundColor:'#fff',border: '0px solid #d9d9d9'}} 
                            grid={{ gutter: 16, column: 8}}
                            dataSource={d3Charts}
                            renderItem={item => (
                            <List.Item style={{padding: '1px'}}>
                                {/* <LazyLoad> */}
                                <ChartCard 
                                        chartcategory={ChartCategory.D3}
                                        // chartsrc={item.src} 
                                        charttype={item.chart} 
                                        chartname={item.name}
                                        // handlechart = {this.handlechart}
                                        {...this.props}
                                    />
                                {/* </LazyLoad> */}
                            </List.Item>
                            )}
                        />    
        )
    }
}
