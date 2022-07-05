import * as d3 from 'd3';
import { getCategories, getAggregatedRows, getWidth } from './helper';
import _ from 'lodash';
import { selectAll } from 'd3-selection';
import { read } from 'fs';
import { range } from 'd3/node_modules/d3-array';
import pictorialtype from '../../../pictorialTypeDict'
//import { type } from 'os';


const draw = (props) => {
    let a = document.createElement("div"); 
 
    if (!props.onCanvas) {
        d3.select('.'+props.chartId+'>*').remove();
        a = '.'+props.chartId;
    }

 //默认卡片背景
 let cardcolor;
 let textcolor=props.textcolor;
 let textfont=props.textfont;
 let iconcolor=props.iconcolor;
 let colorset = props.colormap;
 const colorPair = props.colorPair;
 let gradientcolor=props.cardcolor; 
 let styletype=props.stylelayout;
 let pictogram= props.fieldsreading;
//  console.log('props',props);
//  console.log('pictogram',pictogram);
//  let pictogram="-chair"; //field name
    // const width = props.width - margin.left - margin.right+150 ;
    // const height = props.height - margin.top - margin.bottom - 80;

    // let margin = { top: 100, right: 100, bottom:100, left:100 };
    // const width = 500/4*props.size.w;
    // const height = 500/4*props.size.h;

    var margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const width11 = props.width - margin.left - margin.right - 20;
    const height11 = props.height - margin.top - margin.bottom - 20 - 40;
    var width = width11/4*props.size.w;
    var height = height11/4*props.size.h;

    let sscale;
    let svgg;
    if(props.chartId.indexOf("sugess")>0){
        sscale=1;
        svgg="suggess"
        margin = { top: width/20, right: width/12, bottom: width/15, left: width/25};
    }else{
        sscale=1;
        svgg="canvas"
        margin = { top: 100, right: 100, bottom:100, left:100 };
    }

    let svg = d3.select(a)
                .append("center")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style('background-color',cardcolor)
                .append("g")
                .attr("class",`${svgg}`)
                .attr("transform", "translate(" +0 + "," + 0 + ")"+"scale("+sscale+")");
                // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                // .attr("viewBox", "0 0 100 100");
  
    // Encoding
    const encoding = props.spec.encoding;
    // Process Data
    // const data = props.data;
    let data=props.data;
    data=getAggregatedRows(data,encoding);
    //Get categories
    let dataCategories = getCategories(data, encoding);
    let categories = Object.keys(dataCategories);

    //Color channel
    let color;
    if('color' in encoding){
    let colorScale=d3.scaleOrdinal(colorset);
    color=colorScale.domain(data.map(function(d){return d[encoding.color.field];}));
    }

     if(_.isEmpty(encoding)||!('size' in encoding) || _.isEmpty(encoding.size) || !('color' in encoding) || _.isEmpty(encoding.color)){
        
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "pink");
        return svg;
     }

  

/***********************************************************************************/
if(styletype==="background"){
    let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
    let iconindex='i'+'2';
    if(props.chartId.indexOf("sugess")>0) iconindex='i'+'2';
    else iconindex='i'+'666'
   
    //Compute the percent

    let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));
    let colortype=data.map(d=>d[encoding.color.field]);

    let datalen=colortype.length;

    let sum=0;
    let datapercent=[];
    for(let i=0;i<datalen;i++){
    sum+=pictorialdata[i];
    }
    for(let i=0;i<datalen;i++){
    datapercent.push(Math.round(pictorialdata[i]/sum*100) );
    }

    svg.append("defs")
    .append("g")
    .attr("id",function(){   
        if(props.chartId.indexOf("sugess")>0) return `${pictogram}`+'i'+'2'
        else return `${pictogram}`+'i'+'666'
    })
    .append("path")
    .attr("d",function(){
        // var obj = pictorialtype.find(function (obj) {
        //     return obj.name === pictogram
        // })
        // return obj.picpath; 
        console.log('pictogram',pictogram)
        console.log('pictorialtype[pictogram]',pictorialtype[pictogram])
        return pictorialtype[pictogram];
    })     

    let typesizexx=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
    let typesizeyy=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;
 
    let area11=typesizexx*typesizeyy;
    let area12=20*20*iconradiusscale
    let scaleorign=Math.sqrt(area12/area11)  
    let scale1;
    svg.select(`#${pictogram}${iconindex}`)
    .attr("transform", function(){
          scale1=Math.sqrt(area12/area11) 
            return  `scale(${scale1})`
    })

    let typesizex=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
    let typesizey=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;
    let typex=svg.select(`#${pictogram}${iconindex}`).node().getBBox().x;
    let typey=svg.select(`#${pictogram}${iconindex}`).node().getBBox().y;

    //specify the number of columns and rows for pictogram layout
    let numCols = 20;
    let numRows = 10;

    //padding for the grid
    let xPadding = 10;
    let yPadding = 15;

    //horizontal and vertical spacing between the icons
    let hBuffer = typesizey+5;
    let wBuffer =typesizex+5;

    //generate a d3 range for the total number of required elements
    let myIndex = d3.range(numCols * numRows);

    svg.append("g")
    .attr("id", "pictoLayer")
    .selectAll("use")
    .data(myIndex)
    .enter()
    .append("use")
    .attr("xlink:href", `#${pictogram}${iconindex}`)
    .attr("id", function(d) {
        return "icon" + d;
    })
    .attr("x", function(d) {
        let remainder = d % numCols; //calculates the x position (column number) using modulus
        return width/4+xPadding + (remainder * wBuffer)-Math.abs(typex*scale1); //apply the buffer and return value
    })
    .attr("y", function(d) {
        let whole = Math.floor(d / numCols) //calculates the y position (row number)
        return height/4+yPadding + (whole *hBuffer)-Math.abs(typey*scale1); //apply the buffer and return the value
    })
    .style("fill",colorPair[colortype[0]])
    .attr("opacity",0.4)
    .classed("iconPlain", true)
    .attr("class",function(d,i){
        return "icon-"+ pictogram + ' ' + "source-" + encoding.size.field;
    });

    let typesizex1=svg.select("#pictoLayer").node().getBoundingClientRect().width;
    let typesizey1=svg.select("#pictoLayer").node().getBoundingClientRect().height;
    svg.append("circle")
    .attr("cx", width/4+xPadding+typesizex1/2)
    .attr("cy",height/4+yPadding+typesizey1/2)
    // .attr("cx", (width/5+xPadding + (numCols * wBuffer)-Math.abs(typex*scale1))/2)
    // .attr("cy", (height/3+yPadding + (numRows *hBuffer)-Math.abs(typey*scale1))/2)
    .attr("r",typesizey1>typesizex1?typesizex1/3:typesizey1/3)
    .attr("fill", gradientcolor)
    .attr("opacity",0.8)
    .attr("stroke","white")
    .attr("stroke-width","5px")
    
    svg.append("text")
    .attr("x", width/4+xPadding+typesizex1/2)
    .attr("y", height/4+yPadding+typesizey1/2+10)
    .attr("fill", "white")
    .text(`${datapercent[0]}%`)
    .attr('text-anchor',"middle")
    .attr('font-weight','bold')
    .attr('font-size',40*iconradiusscale)

  }
/***********************************************************************************/
if(styletype==="iconnumber3"){
    //icon+数字+进度条的
       // Process Data
  let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
  

  let iconindex='i'+ '1';
  if(props.chartId.indexOf("sugess")>0) iconindex='i'+ '1';
  else iconindex='i'+ '66'

  //Compute the percent

  let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));
  let colortype=data.map(d=>d[encoding.color.field]);


  let datalen=colortype.length;

  let darkColor = [];
  for(let i=0;i<datalen;i++){
              let c = d3.hsl(d3.rgb(colorset[i]));
              let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
              let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
              let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
              darkColor[i] = defaultcolor;
          }

  let sum=0;
  let datapercent=[];
  for(let i=0;i<datalen;i++){
  sum+=pictorialdata[i];
  }
  for(let i=0;i<datalen;i++){
  datapercent.push(Math.round(pictorialdata[i]/sum*100) );
  }

  svg.append("defs")
  .append("g")
  .attr("id",function(){   
    if(props.chartId.indexOf("sugess")>0) return `${pictogram}` + 'i' + '1'
    else return `${pictogram}` + 'i' +'66'
})
  .append("path")
  .attr("d",function(){
    //   var obj = pictorialtype.find(function (obj) {
    //       return obj.name === pictogram
    //   })
    //   return obj.picpath; 
      return pictorialtype[pictogram];
  })     

  let typesizexx=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
  let typesizeyy=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;

  let area11=typesizexx*typesizeyy;
  let area12=180*180
  let scaleorign=Math.sqrt(area12/area11)  
  let scale1;
  svg.select(`#${pictogram}${iconindex}`)
  .attr("transform", function(){
        scale1=Math.sqrt(area12/area11) *iconradiusscale
          return  `scale(${scale1})`
  })

  let typesizex=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
  let typesizey=svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;
  let typex=svg.select(`#${pictogram}${iconindex}`).node().getBBox().x;
  let typey=svg.select(`#${pictogram}${iconindex}`).node().getBBox().y;

  let pictoLayer=svg.append("g")
  .attr("id","pictoLayer")

  pictoLayer.append("use")
  .attr("xlink:href",`#${pictogram}${iconindex}`)
  .attr("id",pictogram)
  .attr("x",width/2-typesizex/2-Math.abs(typex*scale1))
  .attr("y",height/2-typesizey/2-Math.abs(typey*scale1))
  .style("fill",colorPair[colortype[0]])
  .attr("class",function(d,i){
    return "icon-"+ pictogram + ' ' + "source-" + encoding.size.field
});

   pictoLayer.append("text")
   .text(`${datapercent[0]}%`)
   .attr("x",width/2+typesizex/2+typesizex/3)
   .attr("y",height/2-10)
   .attr("fill",colorPair[colortype[0]])
   .attr("font-size",80*iconradiusscale)

  
      //Define the gradient
      let gradient=svg.append("svg:defs")
      .append("svg:linearGradient")
      .attr("id","icontype")
      .attr("x1","0")
      .attr("y1", "0")
      .attr("x2","1")
      .attr("y2", "0")
      .attr("spreadMethod","pad");

      //Define the gradient colors
      gradient.append("svg:stop")
      .attr("offset","0%")
      .attr("stop-color",function(){
          return color(colortype[0]);
      })
      .attr("stop-opacity",1);

          pictoLayer.append("rect")
          .attr("id","progressbar")
          .attr("x",width/2+typesizex/2+typesizex/3)
          .attr("y",height/2+20*iconradiusscale)
          .attr('rx',5)
          .attr('ry',5)
          .attr("width",`${150*iconradiusscale}px`)
          .attr("height",`${10*iconradiusscale}px`)

          pictoLayer.append("circle")
          .attr("cx",width/2+typesizex/2+typesizex/3+150*iconradiusscale*datapercent[0]/100)
          .attr("cy",height/2+20*iconradiusscale+5*iconradiusscale)
          .attr('r',5*iconradiusscale)
          .attr("fill", colorPair[colortype[0]])
          .attr("stroke",colorPair[colortype[0]])
          .attr("stroke-width","5px")

    pictoLayer.selectAll("#progressbar")
      .attr("fill", function(d) {

          console.log(datapercent[0])
      gradient.append("svg:stop")
          .attr("offset", `${datapercent[0]}%`)
          .attr("stop-color", color(colortype[0]))
          .attr("stop-opacity", 1);
      gradient.append("svg:stop")
          .attr("offset", `${datapercent[0]}%`)
          .attr("stop-color", `${darkColor[0]}`)
          .attr("stop-opacity", 1);
      gradient.append("svg:stop")
          .attr("offset", '100%')
          .attr("stop-color", `${darkColor[0]}`)
          .attr("stop-opacity", 1);
      return "url(#icontype)";
      }) 
}
/***********************************************************************************/
let ssscale;
if(props.chartId.indexOf("sugess")>0){
    if(styletype==="iconnumber3"){
         ssscale=0.25;
          margin = { top: 15, right: width/12, bottom: width/15, left:20};
    }
    if(styletype==="background"){
        ssscale=0.15;
        margin = { top: 20, right: width/12, bottom: width/15, left:20};
    } 
   
}else{
    ssscale=1;
    margin = { top:0, right: 0, bottom: 0, left: 0 };
}

 d3.selectAll(`.${svgg}`)
   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+ssscale+")");



return svg;

    }




export default draw;
