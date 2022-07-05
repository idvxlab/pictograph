import * as d3 from 'd3';
import { getCategories, getAggregatedRows, getWidth } from './helper';
import _ from 'lodash';
import Color from '@/constants/Color';
import pictorialtype from '../../../pictorialType'
import {drawLegend,outRepeat} from '../drawLegend'

// let c = d3.hsl(d3.rgb(cardcolor));
// let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.3, c.l*2);
// let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
// let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ", "+ parseInt(defaultcolor_rgb.g) + ", " + parseInt(defaultcolor_rgb.b) + ")";


// let darkColor = [];
//     for(let i=0;i<colorlen;i++){
//             let c = d3.hsl(d3.rgb(color(colortype[i])));
//             let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
//             let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
//             let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ", "+ parseInt(defaultcolor_rgb.g) + ", " + parseInt(defaultcolor_rgb.b) + ")";
//             darkColor[i] = defaultcolor;
//         }


// const config = {
//     "legend-text-color": "#666"
// }



const draw = (props) => {
    let a = document.createElement("div");
    d3.select(a).style("backgroundColor","white");
    if (!props.onCanvas) {
      
        d3.select('.'+props.chartId+'>*').remove();
        a = '.'+props.chartId;
    }

    var width = 400/4*props.size.w;
    var height =400/4*props.size.h;
    var margin = { top: width/4, right: width/4, bottom: width/4, left: width/4 };

    let svgg;
    let sscale;
    if(props.chartId.indexOf("sugess")>0){
        sscale=1;
        svgg="suggess"
        margin = { top: width/15, right: width/12, bottom: width/15, left: width/12};
    }else{
        sscale=1;
        svgg="canvas"
        margin = { top: width/8, right: width/4, bottom: width/4, left: width/4 };
    }
 
   
    let cardcolor;
    let textcolor=props.textcolor;
    let textfont=props.textfont;
    let iconcolor=props.iconcolor;
    let gradientcolor=props.cardcolor;
    let colorPair = props.colorPair;
    


    let svg = d3.select(a)
        //在svg之前添加center元素以保证svg居中显示
        .append("center")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.left + margin.right)    
        .style('background-color',cardcolor)
        .append("g")
        .attr("class",`${svgg}`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+sscale+")");
    
       
    //Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('size' in encoding) || _.isEmpty(encoding.size)|| !('color' in encoding) || _.isEmpty(encoding.color)) {
        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", height / 2)
            .attr("fill", "pink");
        return svg;
    }

    // Process Data
    let data = props.data;
    data = getAggregatedRows(data, encoding);

    //Get categories
    let dataCategories = getCategories(data, encoding);
    let categories= Object.keys(dataCategories);  
    //categoriesreading应与categories相同 对应相应的icon
    //let categoriesreading=["BMW","Ford","Mazda","Volkswagen","Hyundai","water-cooler","fountain","food-and-wine"];
    let categoriesreading=props.categoriesreading;
    if((Array.isArray(categoriesreading)&& categoriesreading.length<=0)||(Array.isArray(props.icontype)&& props.icontype.length<=0))  return svg;

    const colorset=props.colormap;
    let color;
    if('color' in encoding){
        let colorScale=d3.scaleOrdinal(colorset);      
            color=colorScale.domain(data.map(function(d){return d[encoding.color.field];}));
        }

    //let pictogram="flag";
    let icontype=props.icontype;
    let pictogram=icontype[0];
    //let typepie='mappingbarpie';//piechart,donutchart//picstacked//mappingbarpie//donuts
    let typepie=props.stylelayout;

    //Compute the position of each group on the pie
    let pie = d3.pie()
        .value(function (d) { return d[encoding.size.field]; });
    let pieData = pie(data);

    //select icon
    svg.append("defs")
    .selectAll("g")
    .data(categoriesreading)
    .enter()
    .append("g")
    .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `suggess-${d}`;
        else return `canvas-${d}`
            })
            .append("path")
            .attr("d",function(d){
                var obj = pictorialtype.find(function (obj) {
                    return obj.name === d
                })
                return obj.picpath;
            })

    svg.append("defs")
    .append("g")
    .attr("id",function(){
        if(props.chartId.indexOf("sugess")>0)   return `suggess-${pictogram}`
        else return `canvas-${pictogram}`
    })
    .append("path")
    .attr("d",function(){
        var obj = pictorialtype.find(function (obj) {
            return obj.name === pictogram
        })
        return obj.picpath;
    })
           

    //Build the pie chart
/***************************************************************************************/
    if(typepie==="piechart"){

        let angletotal=[];
        let lefticon=0;
        for(let i=0;i<pieData.length;i++){
            angletotal.push(pieData[i].endAngle-pieData[i].startAngle);
        }

        let radiusit=width>height?height/2:width/2
        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let arc = d3.arc() //弧生成器
        .innerRadius(0)
        .outerRadius(radiusit) //设置外半径
        .cornerRadius(0);

        let arcs = svg.selectAll("#pievis")
            .data(pieData)
            .enter()
            .append("g")
            .attr("id","pievis")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        arcs.append("path")
            .attr("fill", function (d, i) {
                if(angletotal[i]<=Math.PI/6) {
                    if(arc.centroid(d)[0]<0) lefticon++;
                }
                return colorPair[categories[i]]; })
            .attr("stroke", gradientcolor)
            .attr("stroke-width","3px")
            .attr("d", d=>arc(d)) ;

            let iconindex="suggess-";
            if(props.chartId.indexOf("sugess")>0) iconindex="suggess-";
            else iconindex="canvas-"

        let scale1=[];
        for(let i=0;i<categories.length;i++){

            let typesizex1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height;

            svg.select(`#${iconindex}${categoriesreading[i]}`)
            .attr("transform", function(){     
                    let area11=typesizex1*typesizey1;
                    let area12=50*50*sscale*sscale;               
                    scale1.push(Math.sqrt(area12/area11)*iconradiusscale )
                    return  `scale(${scale1[i]})`         
            });            
        }
            let typesizex=[];
            let typesizey=[];
            let typex=[];
            let typey=[];
            for(let i=0;i<categories.length;i++){
                typesizex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width);
                typesizey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height);
                typex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().x);
                typey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().y);
            }
    //append icon
    arcs.append("use")
    .attr("xlink:href",function(d,i){
        if(angletotal[i]>Math.PI/6)
        return `#${iconindex}${categoriesreading[i]}`
        else return null;
    })
    .attr("class",function(d,i){
        console.log('categoriesreading[i]', categoriesreading[i], categories[i])
        return "icon-"+categoriesreading[i] + ' ' + "source-" + categories[i]
            
    })
    .attr('transform', function (d, i) {
        if(angletotal[i]>Math.PI/6){
          let x = arc.centroid(d)[0] * 1.2-typesizex[i]/2-Math.abs(typex[i]*scale1[i]);
          let y = arc.centroid(d)[1] * 1.2-typesizey[i]/2-Math.abs(typey[i]*scale1[i]);
          return 'translate(' + x + ', ' + y + ')';
        }
    })
    .attr("fill",iconcolor)
    
    //draw text-label
    arcs.append("text")
    .attr('transform', function (d, i) {
        // var x = arc.centroid(d)[0] *3;
        // var y = arc.centroid(d)[1] *3;
        let x = arc.centroid(d)[0] * 1.2;
        let y = arc.centroid(d)[1] * 1.2+typesizey[i];
        // let x = arc.centroid(d)[0] *2.2;
        // let y = arc.centroid(d)[1] *2.2;
        return 'translate(' + x + ', ' + y + ')';
    })
    .attr('text-anchor', 'middle')
    .attr("fill",textcolor)
    .attr("font-family",textfont)
    .attr("font-size",`${20*iconradiusscale}px`)
    .text(function (d,i) {
        let percent = Number(d.value) / d3.sum(pieData, function (d) {
            return d.value;
        }) * 100;
        if(angletotal[i]>Math.PI/6)
        return percent.toFixed(1) + '%';
        else return null;
        
    });

    //draw text-line
    // arcs.append('line')
    //     .attr('stroke', '#5B5D73')
    //     .attr('stroke', textcolor)
    //     .attr('x1', function (d) { return arc.centroid(d)[0] * 1.4; })
    //     .attr('y1', function (d) { return arc.centroid(d)[1] * 1.4; })
    //     .attr('x2', function (d, i) {
    //         return arc.centroid(d)[0] * 2.4;
    //     })
    //     .attr('y2', function (d, i) {
    //         return arc.centroid(d)[1] * 2.4;
    //     })

    }
/************************************************************************/
    if(typepie==="donutchart"){
          
        let radiusit=width>height?height:width
        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let arc = d3.arc() //弧生成器
        .innerRadius(radiusit/5) //设置内半径
        .outerRadius(radiusit/3) //设置外半径
        .cornerRadius(5);

        let arcs = svg.selectAll("#pievis")
            .data(pieData)
            .enter()
            .append("g")
            .attr("id","pievis")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        arcs.append("path")
            .attr("fill", function (d, i) { return colorPair[categories[i]]; })
            .attr("stroke", null)
            .attr("d", function (d, i) {              
                d.padAngle=0.03;
                return arc(d);
            });

    //draw text-label
    arcs.append("text")
        .attr('transform', function (d, i) {
            let x = arc.centroid(d)[0] * 1.6;
            let y = arc.centroid(d)[1] * 1.6;
            return 'translate(' + x + ', ' + y + ')';
        })
        .attr('text-anchor', 'middle')
        .attr('fill', textcolor)
        .attr("font-family",textfont)
        .attr("font-size",`${20*iconradiusscale}px`)
       // .attr("opacity", "0")
        .text(function (d) {
            let percent = Number(d.value) / d3.sum(pieData, function (d) {
                return d.value;
            }) * 100;
            return percent.toFixed(1) + '%';
        });

        let iconindex="suggess-";
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-";
        else iconindex="canvas-"

        let scale1;
        let typesizex1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;

        let typesizey1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
           
        svg.select(`#${iconindex}${pictogram}`)
            .attr("transform", function(){     
                    let area11=typesizex1*typesizey1;
                    let area12=70*70            
                    scale1=Math.sqrt(area12/area11)*iconradiusscale 
                    return  `scale(${scale1})`         
            });            
        
           
            let typesizex=(svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width);
            let typesizey=(svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height);
            let typex=(svg.select(`#${iconindex}${pictogram}`).node().getBBox().x);
            let typey=(svg.select(`#${iconindex}${pictogram}`).node().getBBox().y);
        
    //append icon
    svg.append("use")
    .attr("xlink:href",`#${iconindex}${pictogram}`)
    .attr('transform', function () {
        let x =width/2-typesizex/2-Math.abs(typex*scale1);
        let y =height/2-typesizey/2-Math.abs(typey*scale1);
        return 'translate(' + x + ', ' + y + ')';
    })
    .attr("fill",iconcolor)
   // .attr("opacity","1")

        // svg.append("text")
        //  .attr('transform', function () {
        //     let x = width/2;
        //     let y = height/2+10;
        //     return 'translate(' + x + ', ' + y + ')';
        // })
        // .attr('text-anchor', 'middle')
        // .attr('fill', 'white')
        // .attr("font-size","40px")
        // .text(function () {
        //     return "Cars"; //读取上传文件名
        // });
    //draw text-line
    // arcs.append('line')
    //     .attr('stroke', '#5B5D73')
    //     .attr('stroke', textcolor)
    //     .attr('x1', function (d) { return arc.centroid(d)[0] * 1.4; })
    //     .attr('y1', function (d) { return arc.centroid(d)[1] * 1.4; })
    //     .attr('x2', function (d, i) {
    //         return arc.centroid(d)[0] * 1.7;
    //     })
    //     .attr('y2', function (d, i) {
    //         return arc.centroid(d)[1] * 1.7;
    //     })
    //     .attr("opacity", "0");       
    }

/*****************************************************************************************/
  if(typepie==="picstacked"){

    
 
    let typesizex1=svg.select(`#${pictogram}1`).node().getBoundingClientRect().width;
    let typesizey1=svg.select(`#${pictogram}1`).node().getBoundingClientRect().height;
    let scale1;
    svg.select(`#${pictogram}1`)
    .attr("transform", function(){     
        let area11=typesizex1*typesizey1;
        let area12=250*250;               
        scale1=Math.sqrt(area12/area11) 
        return  `scale(${scale1/4*props.size.w})` 
        // scale1=width/2/typesizex1;
        // return  `scale(${scale1})` 
  });    


    let typesizex=svg.select(`#${pictogram}1`).node().getBoundingClientRect().width;
    let typesizey=svg.select(`#${pictogram}1`).node().getBoundingClientRect().height;
    let typex=svg.select(`#${pictogram}1`).node().getBBox().x;
    let typey=svg.select(`#${pictogram}1`).node().getBBox().y;
    //let typesizey=svg.select(`#${pictogram}1`).node().getBoundingClientRect().height;

    //Append pictogram
    svg.append("g")
    .attr("id","pictoLayer")
    .append("use")
    .attr("xlink:href",`#${pictogram}1`)
    .attr("class",function(d,i){
        console.log('categoriesreading[i]', categoriesreading[i], categories[i])
        return "icon-"+categoriesreading[i] + ' ' + "source-" + categories[i]
            
    })
    .attr("id",pictogram)
    .attr("x",-Math.abs(typex*scale1))
    .attr("y",height/2-typesizey/2-Math.abs(typey*scale1))  

  

    let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));
    let colortype=data.map(d=>d[encoding.color.field]);
    let colorlen=colortype.length;

    let color;
    if ('color' in encoding) {
        // let colorScale = Color.CHANNEL_COLOR;
        let colorScale = d3.scaleOrdinal(colorset);
        color = colorScale.domain(data.map(function (d) { return d[encoding.color.field]; }));
    }
    //Define the gradient
    let gradient=svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id","icon1")
    .attr("x1","0")
    .attr("y1", "1")
    .attr("x2","0")
    .attr("y2", "0")
    .attr("spreadMethod","pad");

    //Define the gradient colors
    gradient.append("svg:stop")
    .attr("offset","0%")
    .attr("stop-color",function(){
        return colorPair[colortype[0]];
    })
    .attr("stop-opacity",1);
    //Compute the percent
    let sum=0;
    let datapercent=[];
    for(let i=0;i<colorlen;i++){
        sum+=pictorialdata[i];
    }
    for(let i=0;i<colorlen;i++){
        datapercent.push(parseFloat((pictorialdata[i]/sum*100).toFixed(1)));
    }
    let sumpercent=[];
    for(let i=0;i<colorlen;i++){
        let k=i;
        sumpercent[i]=0;
        while(k>=0){
            sumpercent[i]+=datapercent[k];
            k--;
        }
    }

    d3.selectAll("#"+pictogram)
    .attr("fill",function(d){
        for(let i=0;i<colorlen-1;i++){
            gradient.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[colortype[i]];
            })
            .attr("stop-opacity",1);
            gradient.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[colortype[i+1]];
            })
            .attr("stop-opacity",1);

        }
        gradient.append("svg:stop")
        .attr("offset","100%")
        .attr("stop-color",`${colorPair[colortype[colorlen-1]]}`)
        return "url(#icon1)";
    })


    //Append TEXT
    let categoriesTextLength=[];
    for(let i=0;i<colorlen;i++){
        categoriesTextLength.push(getWidth(categories[i]))
    } 
    let categoriesTextMax=d3.max(categoriesTextLength);
    for(let i=0;i<colorlen;i++){
        svg.append("line")
        .attr("x1",function(){
           return 30+typesizex ;

        })
        .attr("y1",function(){
             return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200;
  
        })
        .attr("x2",function(){
            return 70+typesizex ;
        })
        .attr("y2",function(){
            return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200;
       
        })
        .style("stroke","grey")
        .attr("stroke-dasharray","2 2")

        svg.append("text")
       // .attr("direction","rtl")
        .attr("x",function(){
            return  75+typesizex 
        })
        .attr("y",function(){
            return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200+4;
        })
        .attr("fill",function(){
           // return color(colortype[i]);
           return "grey"
        })
        .attr("font-weight","bold")
        .attr("font-size",20)
        .text(`${categories[i]}`);

        svg.append("text")
        //.attr("direction","rtl")
        .attr("x",function(){
           return  80+typesizex+categoriesTextMax*2.1
        })
        .attr("y",function(){
            return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200+4;
        })
        .attr("fill",function(){
            //return color(colortype[i]);
            return "grey"
        })
        .attr("font-size",18)
        .text(`${datapercent[i].toFixed(1)}%`);


        }

    }

/*************************************************************************************/
  if(typepie==="mappingbarpie"){
    let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
      
    svg.append("rect")
    .attr("width",width)
    .attr("height","35px")
    .attr("x",0)
    .attr("y",height/2-75)
    .attr("class","rectempty")

    let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));
    let colorlen=categories.length
  
    //Define the gradient
    let gradient=svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id","icon1")
    .attr("x1","0")
    .attr("y1", "0")
    .attr("x2","1")
    .attr("y2", "0")
    .attr("spreadMethod","pad");

    //Define the gradient colors
    gradient.append("svg:stop")
    .attr("offset","0%")
    .attr("stop-color",function(){
        return colorPair[categories[0]];
    })
    .attr("stop-opacity",1);
    //Compute the percent
    let sum=0;
    let datapercent=[];
    for(let i=0;i<categories.length;i++){
        sum+=pictorialdata[i];
    }
    for(let i=0;i<categories.length;i++){
        datapercent.push(parseFloat((pictorialdata[i]/sum*100).toFixed(1)));
    }
    let sumpercent=[];
    for(let i=0;i<categories.length;i++){
        let k=i;
        sumpercent[i]=0;
        while(k>=0){
            sumpercent[i]+=datapercent[k];
            k--;
        }
    }

    svg.select(".rectempty")
    .attr("fill",function(d){
        for(let i=0;i<colorlen-1;i++){
            gradient.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[categories[i]];
            })
            .attr("stop-opacity",1);
            gradient.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[categories[i+1]];
            })
            .attr("stop-opacity",1);

        }
        gradient.append("svg:stop")
        .attr("offset","100%")
        .attr("stop-color",`${colorPair[categories[colorlen-1]]}`)
        return "url(#icon1)";
    })

    for(let i=0;i<colorlen;i++){
        svg.append("line")
        .attr("x1",function(){
            return  width*sumpercent[i]/100-width*datapercent[i]/200;
        })
        .attr("y1",function(){
            return height/2-30
        })
        .attr("x2",function(){
            return width*sumpercent[i]/100-width*datapercent[i]/200;
        })
        .attr("y2",function(){
            return height/2-10
       
        })
        .style("stroke",colorPair[categories[i]])
        //.attr("stroke-dasharray","2 2")
    }

    let iconindex="suggess-";
    if(props.chartId.indexOf("sugess")>0) iconindex="suggess-";
    else iconindex="canvas-"

    let scale1=[];
    for(let i=0;i<categories.length;i++){

        let typesizex1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width;
        let typesizey1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height;

        svg.select(`#${iconindex}${categoriesreading[i]}`)
        .attr("transform", function(){     
                let area11=typesizex1*typesizey1;
                let area12=25*45*sscale*sscale               
                scale1.push(Math.sqrt(area12/area11)*iconradiusscale )
                return  `scale(${scale1[i]})`         
        });            
    }
        let typesizex=[];
        let typesizey=[];
        let typex=[];
        let typey=[];
        for(let i=0;i<categories.length;i++){
            typesizex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width);
            typesizey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height);
            typex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().x);
            typey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().y);
        }
    //append icon
    svg.selectAll("use")
    .data(categories)
    .enter()
    .append("use")
    .attr("xlink:href",(d,i)=>`#${iconindex}${categoriesreading[i]}`)
    .attr("class",function(d,i){
        console.log('categoriesreading[i]', categoriesreading[i], categories[i])
        return "icon-"+categoriesreading[i] + ' ' + "source-" + categories[i]
            
    })
    .attr('transform', function (d, i) {
        let x = width*sumpercent[i]/100-width*datapercent[i]/200-typesizex[i]/2-Math.abs(typex[i]*scale1[i]);
        let y = height/2+20-typesizey[i]/2-Math.abs(typey[i]*scale1[i]);
        return 'translate(' + x + ', ' + y + ')';
    })
    //.attr("fill",(d,i)=>colorset[i])
    .attr("fill",iconcolor)
//     .call(d3.drag()
//     .on("start",function(){
//         d3.select(this).raise().classed('active',true)})
    
//     .on("drag",function(d,i){
//         d3.select(this)
//         .attr("x", d.x = d3.event.x )
//         .attr("y", d.y = d3.event.y );
//     })
//     .on("end",function(){
//         d3.select(this).classed('active',false)})
// )

    //append Text
    svg.selectAll("text")
        .data(datapercent)
        .enter()
        .append("text")
        .attr("x",function(d,i){
           return  width*sumpercent[i]/100-width*datapercent[i]/200;
        })
        .attr("y",function(){
            return height/2-53;
        })
        .attr("fill",function(){
            //return color(colortype[i]);
            return textcolor
        })
        .attr("font-family",textfont)
        .attr("font-size",16*iconradiusscale)
        .attr("text-anchor","middle")   //文字居中
        .text((d,i)=>`${d.toFixed(1)}%`);
   }

/**************************************************************************/
   if(typepie==="donuts"){

    let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
      
   //多个甜甜圈 同色填充
    let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));
    let colorlen=categories.length;

     //X 
     let x = d3.scaleBand()
     .range([0, width+100])
     .domain(data.map(function (d) { return d[encoding.color.field]; }))
     .padding(0.2);

     //Compute the percent
     let sum=0;
     let datapercent=[];
     for(let i=0;i<colorlen;i++){
         sum+=pictorialdata[i];
     }
     for(let i=0;i<colorlen;i++){
         datapercent.push(parseFloat((pictorialdata[i]/sum*100).toFixed(1)));
     }
     let sumpercent=[];
     for(let i=0;i<colorlen;i++){
         let k=i;
         sumpercent[i]=0;
         while(k>=0){
             sumpercent[i]+=datapercent[k];
             k--;
         }
     }

     let darkColor = [];
      for(let i=0;i<colorlen;i++){
                let c = d3.hsl(d3.rgb(colorset[i]));
                let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
                let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
                let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                darkColor[i] = defaultcolor;
                }

    for(let a=0;a<colorlen;a++){
        let data1=[];
        data1[0]=datapercent[a];
        data1[1]=100-datapercent[a];
        // let pie = d3.pie()
        // .value(function (d) { return d[encoding.size.field]; });
        let pieData = d3.pie()(data1);
   
        let arc = d3.arc() //弧生成器
        .innerRadius(x.bandwidth()/12*5) //设置内半径
        .outerRadius(x.bandwidth()/2) //设置外半径
       // .cornerRadius(5);
   
        let arcs = svg.selectAll("#pievis"+a)
            .data(pieData)
            .enter()
            .append("g")
            .attr("id","pievis"+a)
            .attr("transform", function(){
                let xx=x(categories[a])+x.bandwidth()/2-50;
                let yy=height/3;
                return "translate(" +xx + "," + yy + ")"
            
            });
   
     

        arcs.append("path")
            .attr("fill", function (d, i) {
                if(i===0) return colorPair[categories[a]];
                else{
                    return darkColor[0]
                } 
             })
            .attr("stroke", null)
            .attr("d", function (d, i) {              
                //d.padAngle=0.03;
                return arc(d);
            });
   

    }
  
    let iconindex="suggess-";
    if(props.chartId.indexOf("sugess")>0) iconindex="suggess-";
    else iconindex="canvas-"


    let scale1=[];
    for(let i=0;i<categories.length;i++){

        let typesizex1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width;
        let typesizey1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height;

        svg.select(`#${iconindex}${categoriesreading[i]}`)
        .attr("transform", function(){     
                let area11=typesizex1*typesizey1;
                let area12=x.bandwidth()*x.bandwidth()/9          
                scale1.push(Math.sqrt(area12/area11)*iconradiusscale)
                return  `scale(${scale1[i]})`         
        });            
    }
        let typesizex=[];
        let typesizey=[];
        let typex=[];
        let typey=[];
        for(let i=0;i<categories.length;i++){
            typesizex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width);
            typesizey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height);
            typex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().x);
            typey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().y);
        }
    //append icon
    svg.selectAll("use")
    .data(categories)
    .enter()
    .append("use")
    .attr("xlink:href",(d,i)=>`#${iconindex}${categoriesreading[i]}`)
    .attr("class",function(d,i){
        console.log('categoriesreading[i]', categoriesreading[i], categories[i])
        return "icon-"+categoriesreading[i] + ' ' + "source-" + categories[i]
            
    })
    .attr('transform', function (d, i) {
        let xx = x(categories[i])+x.bandwidth()/2-50-typesizex[i]/2-Math.abs(typex[i]*scale1[i]);
        let yy = height/3-typesizey[i]/2-Math.abs(typey[i]*scale1[i]);
        return 'translate(' + xx + ', ' + yy + ')';
    })
    //.attr("fill",(d,i)=>colorset[i])
    .attr("fill",(d,i)=>colorPair[categories[i]])

  
    //append Text
    svg.selectAll("#text1")
        .data(datapercent)
        .enter()
        .append("text")
        .attr("id","text1")
        .attr("x",function(d,i){
           return x(categories[i])+x.bandwidth()/2-50;
        })
        .attr("y",function(){
            return height/3+x.bandwidth()/2+25;
        })
        .attr("fill",textcolor)
        .attr("font-family",textfont)
        .attr("font-size",18*iconradiusscale)
        .attr("text-anchor","middle")   //文字居中
        .text(function(d,i){
            let texttt=categories[i]+" "+d.toFixed(1)+"%"
            return texttt;
        });
    }

    let ssscale;
    if(props.chartId.indexOf("sugess")>0){
        ssscale=0.25;
        margin = { top: width/10, right: width/12, bottom: width/15, left: width/10};
    }else{
        ssscale=1;
        margin = { top: width/4, right: width/4, bottom: width/4, left: width/4 };
    }

     d3.selectAll(`.${svgg}`)
       // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+ssscale+")");

    return svg;
}

export default draw;