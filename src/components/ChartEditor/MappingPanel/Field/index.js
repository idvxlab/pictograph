/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:45
 * @LastEditors: Pei Liu
 * @LastEditTime: 2020-12-30 16:19:35
 */
import React, { Component } from 'react';
import './field.css';
import { DragSource } from 'react-dnd';
import DNDType from '@/constants/DNDType';

const boxSource = {

	beginDrag(props) {	
		return {
			field: props.field,
			// specstyle: props.currentVis.spec.style
		}
	},
	endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();

		//这里用浅拷贝就能更新，后面的props更新方法无效
		const newSpec = props.chartMode? {...props.generateSpec}:{...props.editSpec};
		const newChannels = props.chartMode? {...props.generateChannels} :{...props.editChannels};
		
				
		if (dropResult) {
			newSpec["encoding"][dropResult.name]["field"] = item.field.name;
			newSpec["encoding"][dropResult.name]["type"] = item.field.type;

			console.log('props.chartMode', props.chartMode)

			if(dropResult.name === 'size') {
				newSpec["encoding"][dropResult.name]["aggregation"] = "average";
			}
			if(props.chartMode === 'line chart' && dropResult.name === 'y') {
				newSpec["encoding"][dropResult.name]["aggregation"] = "average";
			}

			newChannels[dropResult.name]['isEncoding'] = true;


			console.log('props.chartMode', newSpec)
	
			if(props.chartMode){
				//运行这里页面没刷新
				props.changeGenerateSpec(newSpec);
				props.changeGenerateChannels(newChannels);

			}else{
				props.changeEditSpec(newSpec);
	
				props.changeEditChannels(newChannels);
				
			}
			//运行这里，页面刷新了
			props.encoding(dropResult.name, item.field, dropResult.isEncoded);

			
		}
		return props;
	},
}

class Field extends Component {
    render() {
		const { connectDragSource } = this.props;
        return connectDragSource(
            <div className="field">
				<div style={{display: "inline-block"}}>{this.props.field.name}</div>
            </div>
        )
    }
}

export default DragSource(
    DNDType.DND_MAPPING,
    boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}),
)(Field)
