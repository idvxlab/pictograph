/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:43
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-01-06 15:12:46
 */
import * as d3 from 'd3';
import { SketchPicker } from 'react-color';
import {getWidth} from './BarChart/helper';

function titleCase(str) {
    var arr = str.toLowerCase().split(" ");
    for (var i = 0; i < arr.length; i++) {

        arr[i] = arr[i].replace(arr[i].charAt(0), arr[i].charAt(0).toUpperCase());

    }
    return arr.join(" ");
}

const drawLegend=(colorcategories,textcolor,svg,colorPair,width,height,changeElementColor, textfont)=>{

    d3.selectAll('.legend_color').remove();
    
    const legend=svg.append("g");
    var legends=legend.selectAll("legend_color")
        .data(colorcategories)
        .enter()
        .append("g")
        .attr("class","legend_color")
        .attr('transform',(d,i)=>`translate(${-35},${-height/4})`);

    legends.append("rect")
        .attr("fill",(d,i)=>colorPair[colorcategories[i]])
        .attr('x',15)
        .attr('y',-10)
        .attr("width","10px")
        .attr("height","10px")
        .attr("rx",1.5)
        .attr("ry",1.5)
        .on("click",(d,i) => {
            console.log('click-legend', colorcategories[i])
            changeElementColor(colorcategories[i])
        });

  
    
    legends.append("text")
        .attr("fill",textcolor)
        .style("font-family", textfont)
        .attr("x",35)
         .text(d=>titleCase(d));

    let legend_nodes=legends.nodes();
    let before=legend_nodes[0];
    let current;
    let offset=-35;
         
    for(let i=1;i<legend_nodes.length;i++){
        current=legend_nodes[i];
        if(d3.select(before).select("text").node().getComputedTextLength()){
            offset+=d3.select(before).select("text").node().getComputedTextLength();
        }else{
            offset+=getWidth(colorcategories[i-1])
        }
        d3.select(current)
        .attr("transform",`translate(${i*30+offset},${-height/4})`);
        before=current;
    }
    if(legend.node().getBBox().width){
        legend.attr("transform",`translate(${(width-legend.node().getBBox().width)/2+20},${height+140})`);
    
        }else{
        offset += getWidth(colorcategories[colorcategories.length-1]);
        legend.attr("transform", `translate(${(width - offset - 30 * colorcategories.length + 20)/2}, ${height + 140})`);
    }
         
         
}

//去除数组中的重复元素
const outRepeat=(a)=>{
    let hash=[],arr=[];
    for (let i = 0,elem;(elem=a[i])!=null; i++) {
        if(!hash[elem]){
          arr.push(elem);
          hash[elem]=true;
        }
      }
    return arr;
  }
export {drawLegend,outRepeat};

// if(props.chartId.indexOf("sugess")<0){
//     drawLegend(categoriescolor,textcolor,svg,color,width,height)
// }