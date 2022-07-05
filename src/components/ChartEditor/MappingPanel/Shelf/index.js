/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:45
 * @LastEditors: Pei Liu
 * @LastEditTime: 2020-12-30 17:24:34
 */
import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { DropTarget } from 'react-dnd';
import DNDType from '@/constants/DNDType';
import './shelf.css';
import _ from 'lodash';

const boxTarget = {
	drop: (props) => ({ 
        name: props.channel.name,
        isEncoding: props.channel.isEncoding,
    })
}

class Shelf extends Component {

    constructor(props) {
        super(props);
        this.removeEncoding = this.removeEncoding.bind(this);
    }

    removeEncoding() {
        //这里用深拷贝，避免立马更新
        const newSpec = this.props.chartMode? _.cloneDeep(this.props.generateSpec): _.cloneDeep(this.props.editSpec);

        
        delete newSpec["encoding"][this.props.channel.name].field;
        delete newSpec["encoding"][this.props.channel.name].type;



        const newChannels = this.props.chartMode? _.cloneDeep(this.props.generateChannels):_.cloneDeep(this.props.editChannels);
        newChannels[this.props.channel.name]['isEncoding'] = false;

        if(this.props.chartMode){
            this.props.changeGenerateSpec(newSpec);
            this.props.changeGenerateChannels(newChannels)
        }else{
            this.props.changeEditSpec(newSpec);
            this.props.changeEditChannels(newChannels)
        }
        this.props.removeEncoding(this.props.channel.name, this.props.channel.field)
    }

    render() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;
        const isAvailable = this.props.dropAvailable;
        let backgroundColor = this.props.channel.isEncoding ? "#D5C0B7": '#fff';
        if (!isAvailable) {
            backgroundColor = 'darkgrey';
        }
		else if (isActive) {
            //backgroundColor = Color.LIGHT_BLUE;
            backgroundColor="#D5C0B7";
		} 
		else if (canDrop) {
            //backgroundColor = Color.BLUE;
            backgroundColor='rgb(150, 129, 118)';
        }
        
        const encoding = this.props.chartMode? this.props.generateSpec['encoding']: this.props.editSpec['encoding'];

        
        return connectDropTarget(
            <div>
                <Row className="shelf">
                    <Col span={4} className="channelName">{this.props.channel.namecss}</Col>
                    <Col span={ this.props.channel.isEncoding ? 14 : 18} className="channelSlot" 
                    style={{ backgroundColor: backgroundColor, color: this.props.channel.isEncoding ? "#ffffff" : "#37415C",borderRadius:this.props.channel.isEncoding ?'0px 0px 0px 0px':'0px 5px 5px 0px'}}>
                        {this.props.channel.isEncoding && encoding[this.props.channel.name].field!== undefined? encoding[this.props.channel.name].field : 'drop field here'}</Col>
                    <Col span={ this.props.channel.isEncoding ? 4 : 0} className="channelSlot" style={{ backgroundColor,borderRadius:'0px 5px 5px 0px' }}>
                        <Button shape="circle" type="link" ghost size="small" icon="close" style={{marginLeft: "0px"}} onClick={this.removeEncoding}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DropTarget(
	DNDType.DND_MAPPING,
	boxTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	})
)(Shelf);