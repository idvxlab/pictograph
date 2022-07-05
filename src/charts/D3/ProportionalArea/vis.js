import * as d3 from 'd3';
import { getCategories, getAggregatedRows, getWidth } from './helper';
import _ from 'lodash';
import Color from '@/constants/Color';
import pictorialtype from '../../../pictorialTypeDict';
import {drawLegend,outRepeat} from '../drawLegend'
import { rgb, text } from 'd3';

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
    console.log('pie-draw', props);
    let a = document.createElement("div");
   // d3.select(a).style("backgroundColor","white");
   // if (!props.onCanvas) {
      
        d3.select('.'+props.chartId+'>*').remove();
        a = '.'+props.chartId;
   // }

    var width = 400/4*props.size.w;
    var height =400/4*props.size.h;
    var margin = { top: width/4, right: width/4, bottom: width/4, left: width/4 };
    const encoding = props.spec.encoding;
    // Process Data
    let data = props.data;
    data = getAggregatedRows(data, encoding);

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
    
    let gradientcolor=props.cardcolor;
    let colorPair = props.colorPair;

    function toRGB(color){
        var sColor = color.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "RGB(" + sColorChange.join(",") + ")";
        }
        return sColor;
    };
    
     let darkColor;

     const colorset=props.colormap;
     let color;
     if('color' in encoding){
         let colorScale=d3.scaleOrdinal(colorset);      
             color=colorScale.domain(data.map(function(d){return d[encoding.color.field];}));
         }
         
     // console.log('gradientcolor',gradientcolor);
     let rgb1 = toRGB(gradientcolor);
     // console.log('rgb',rgb);
     rgb1 = rgb1.replace("RGB(", "");
     rgb1 = rgb1.replace(")", "");
     let arr = rgb1.split(',');
     // console.log('arr',arr);
     let luminance = (0.299*arr[0] + 0.587*arr[1] + 0.114*arr[2]);
     // console.log('luminance',luminance);
     if (luminance<150){
            let c = d3.hsl(d3.rgb(colorset[0]));
            let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
            let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
            let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
            darkColor = defaultcolor;
     }else{
         darkColor = 'rgb(238,238,238)';  
     }

    let iconcolor= (props.iconcolor == undefined ? darkColor: props.iconcolor);
    
   


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

    if (_.isEmpty(encoding) || !('size' in encoding) || _.isEmpty(encoding.size)|| !('color' in encoding) || _.isEmpty(encoding.color)) {
        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", height / 2)
            .attr("fill", "pink");
        return svg;
    }

     
 
     // let data = props.data;
     let data1= getAggregatedRows(data, encoding); 
     let categoriescolor1=outRepeat(data1.map(d=>(d[encoding.color.field]))); //categories或者series已经做了判断
     let categoriescolor=categoriescolor1;

    

    console.log('data', props.data);
    console.log('data-pie', data);

    //Get categories
    let dataCategories = getCategories(data, encoding);
    let categories= Object.keys(dataCategories);  
    //categoriesreading应与categories相同 对应相应的icon
    //let categoriesreading=["BMW","Ford","Mazda","Volkswagen","Hyundai","water-cooler","fountain","food-and-wine"];
    let categoriesreading=props.categoriesreading;
    if((Array.isArray(categoriesreading)&& categoriesreading.length<=0)||(Array.isArray(props.icontype)&& props.icontype.length<=0))  return svg;

   

    let icontype=props.icontype;
    let fieldsreading=props.fieldsreading;
    let pictogram= fieldsreading;

    
    let typepie=props.stylelayout;

    //Compute the position of each group on the pie
    let pie = d3.pie()
        .value(function (d) { return d[encoding.size.field]; });
    let pieData = pie(data);

    console.log('pie-data', pieData)

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
        return pictorialtype[d]; 
    })

    svg.append("defs")
    .append("g")
    .attr("id",function(){
        if(props.chartId.indexOf("sugess")>0)   return `suggess-${pictogram}`
        else return `canvas-${pictogram}`
    })
    .append("path")
    .attr("d",function(){
        return pictorialtype[pictogram]; 
    })
           

    //Build the pie chart
/***************************************************************************************/
    if(typepie==="area1"){   //[5]
        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let iconindex="suggess-"+'a';
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+'a';
        else iconindex="canvas-"+'a'

        svg.append("defs")
        .append("g")
        .attr("id",function(){
            if(props.chartId.indexOf("sugess")>0)  return `suggess-`+'a'+`${pictogram}`;
            else return `canvas-`+'a'+`${pictogram}`//为区分suggestion和canvas中的icon
        })
        .append("path")
        .attr("d",function(){
            // var obj = pictorialtype.find(function (obj) {
            //     return obj.name === pictogram
            // })
            // return obj.picpath;
            return pictorialtype[pictogram]
        })
    
        let typesizexx=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
        let typesizeyy=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
    
        
        //Process Data
        let data=props.data;
        data=getAggregatedRows(data,encoding);
   
       
        //Color channel     
        let x = d3.scaleBand()
        .range([0, width-50])
        .domain(categoriescolor)
        .padding(0.2);
    
        //Compute the scale
        let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));

        let area11=typesizexx*typesizeyy;
        let area12=x.bandwidth()*x.bandwidth()
        let scaleorign=Math.sqrt(area12/area11)  
       
        let picdata=[];
    
        for(let i=0;i<categoriescolor.length;i++){
            picdata[i]=parseInt(pictorialdata[i])
        }

        let scale1=[];
    
        let yScale = d3.scaleLinear() 
            .domain([0, d3.max(picdata)])
            .range([0,scaleorign]);
     
        for(let i=0;i<categoriescolor.length;i++){
            svg.append("defs")
            .append("g")
            .attr("id",function(){
                let type=iconindex+pictogram+i
                return `${type}`
            })
            .append("path")
            .attr("d",function(){
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === pictogram
                // })
                // return obj.picpath;
                return pictorialtype[pictogram]
            })
            .attr("transform", function(){
                scale1.push(yScale(picdata[i]));
                return `scale(${scale1[i]})`;
            });
            
        }
          
        svg.selectAll("use")
        .data(data)
        .enter()
        .append("use")
        .attr("xlink:href",function(d,i){
            let type=iconindex+pictogram+i
            return `#${type}`
        })
        .attr("class",function(d,i){
            return "icon-"+pictogram + ' ' + "source-" + encoding.size.field + ' ' + `icon${i}${iconindex}` ;
        }) 
        // .attr("fill",function(d,i){ 
        .style("fill",function(d,i){            
            return colorPair[categoriescolor[i]]
        })
    
        let typesizex=[];
        let typesizey=[];
        let typex=[];
        let typey=[];
    
        for(let i=0;i<categoriescolor.length;i++){
             typesizex[i]=svg.select(`.icon${i}${iconindex}`).node().getBoundingClientRect().width;
             typesizey[i]=svg.select(`.icon${i}${iconindex}`).node().getBoundingClientRect().height;
             typex[i]=svg.select(`.icon${i}${iconindex}`).node().getBBox().x;
             typey[i]=svg.select(`.icon${i}${iconindex}`).node().getBBox().y;
            }
       
         
        let afterIconIndexy=[];
        svg.selectAll("use")
           .attr("x", function(d, i) {                               
            return 30+ x.bandwidth()/2+x(categoriescolor[i])-Math.abs(typex[i]*scale1[i])-typesizex[i]/2
        })
          .attr("y", function(d, i) {                  
                let j=(d3.max(typesizey)-typesizey[i])/2 //使得所有的中心在一条线上  
                // afterIconIndexy.push(height/4*3-Math.abs(typey[i]*scale1[i])-typesizey[i]/2) 
                afterIconIndexy.push(height/2+20-Math.abs(typey[i]*scale1[i])-typesizey[i])         
                return afterIconIndexy[i];                      
        })
    
    
        let textpercent1=svg.append("g").attr("id","text1")
        let textpercent2=svg.append("g").attr("id","text2")
         textpercent1.selectAll("text")
         .data(data)
         .enter()
         .append("text")
         .text((function(d,i) {
             return categoriescolor[i];
         } ))
         .attr("fill",textcolor)
         .style("font-family",textfont)
         .attr("font-size",18*iconradiusscale)
         .attr("x", function (d,i) { 
             return x.bandwidth()/2+x(categoriescolor[i])+30; 
            })
         .attr("text-anchor","middle")   
         .attr("y", function (d,i) { 
          return d3.max(afterIconIndexy)+d3.max(typesizey);
         })
     
         textpercent2.selectAll("text")
         .data(data)
         .enter()
         .append("text")
         .text((function(d,i) {
            return pictorialdata[i].toFixed(2);
         } ))
         .attr("fill",textcolor)
         .style("font-family",textfont)
         .attr("font-size",18*iconradiusscale)
         .attr("x", function (d,i) { 
             return x.bandwidth()/2+x(categoriescolor[i])+30; })
         .attr("text-anchor","middle")   
         .attr("y", function (d,i) { 
          // return d3.max(afterIconIndexy)-30;
          return afterIconIndexy[i]-10;
         })

         if(props.chartId.indexOf("sugess")<0){
            drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor,textfont)
        }
    
    } 

    else if(typepie==="area"){   //[5]
        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let iconindex="suggess-"+'a';
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+'a';
        else iconindex="canvas-"+'a'

        svg.append("defs")
        .append("g")
        .attr("id",function(){
            if(props.chartId.indexOf("sugess")>0)  return `suggess-`+'a'+`${pictogram}`;
            else return `canvas-`+'a'+`${pictogram}`//为区分suggestion和canvas中的icon
        })
        .append("path")
        .attr("d",function(){
            // var obj = pictorialtype.find(function (obj) {
            //     return obj.name === pictogram
            // })
            // return obj.picpath;
            return pictorialtype[pictogram]
        })
    
        let typesizexx=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
        let typesizeyy=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
    
        
        //Process Data
        let data=props.data;
        data=getAggregatedRows(data,encoding);
   
       
        //Color channel     
        let x = d3.scaleBand()
        .range([0, width-50])
        .domain(categoriescolor)
        .padding(0.2);
    
        //Compute the scale
        let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));

        let area11=typesizexx*typesizeyy;
        let area12=x.bandwidth()*x.bandwidth()
        let scaleorign=Math.sqrt(area12/area11)  
       
        let picdata=[];
    
        for(let i=0;i<categoriescolor.length;i++){
            picdata[i]=parseInt(pictorialdata[i])
        }

        let scale1=[];
    
        let yScale = d3.scaleLinear() 
            .domain([0, d3.max(picdata)])
            .range([0,scaleorign]);
     
        for(let i=0;i<categoriescolor.length;i++){
            svg.append("defs")
            .append("g")
            .attr("id",function(){
                let type=iconindex+pictogram+i
                return `${type}`
            })
            .append("path")
            .attr("d",function(){
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === pictogram
                // })
                // return obj.picpath;
                return pictorialtype[pictogram]
            })
            .attr("transform", function(){
                scale1.push(yScale(picdata[i]));
                return `scale(${scale1[i]})`;
            });
            
        }
          
        svg.selectAll("use")
        .data(data)
        .enter()
        .append("use")
        .attr("xlink:href",function(d,i){
            let type=iconindex+pictogram+i
            return `#${type}`
        })
        .attr("class",function(d,i){
            return "icon-"+pictogram + ' ' + "source-" + encoding.size.field + ' ' + `icon${i}${iconindex}` ;
        }) 
        // .attr("fill",function(d,i){ 
        .style("fill",function(d,i){            
            return colorPair[categoriescolor[i]]
        })
    
        let typesizex=[];
        let typesizey=[];
        let typex=[];
        let typey=[];
    
        for(let i=0;i<categoriescolor.length;i++){
             typesizex[i]=svg.select(`.icon${i}${iconindex}`).node().getBoundingClientRect().width;
             typesizey[i]=svg.select(`.icon${i}${iconindex}`).node().getBoundingClientRect().height;
             typex[i]=svg.select(`.icon${i}${iconindex}`).node().getBBox().x;
             typey[i]=svg.select(`.icon${i}${iconindex}`).node().getBBox().y;
            }
       
         
        let afterIconIndexy=[];
        svg.selectAll("use")
           .attr("x", function(d, i) {                               
            return 30+ x.bandwidth()/2+x(categoriescolor[i])-Math.abs(typex[i]*scale1[i])-typesizex[i]/2
        })
          .attr("y", function(d, i) {                  
                let j=(d3.max(typesizey)-typesizey[i])/2 //使得所有的中心在一条线上  
                // afterIconIndexy.push(height/4*3-Math.abs(typey[i]*scale1[i])-typesizey[i]/2) 
                afterIconIndexy.push(height/2+20-Math.abs(typey[i]*scale1[i])-typesizey[i])         
                return afterIconIndexy[i];                      
        })
    
    
        let textpercent1=svg.append("g").attr("id","text1")
        let textpercent2=svg.append("g").attr("id","text2")
         textpercent1.selectAll("text")
         .data(data)
         .enter()
        //  .append("div")
        //  .style("overflow", function(d,i) {
        //      console.log("overflow")
        //      return "hidden";
        //  })
        //  .style("white-space", "nowrap")
        //  .style("text-overflow", "ellipsis")
        //  .style("width", "10px")
         .append("text")
         .text((function(d,i) {

             return categoriescolor[i];
         } ))
         .attr("fill",textcolor)
         .style("font-family", textfont)
         .style("font-size", "13px")
        //  .attr("font-size",10*iconradiusscale)
         .attr("x", function (d,i) { 
             return x.bandwidth()/2+x(categoriescolor[i])+30; 
            })
         .attr("text-anchor","middle")   
         .attr("y", function (d,i) { 
          return d3.max(afterIconIndexy)+d3.max(typesizey);
         })
     
         textpercent2.selectAll("text")
         .data(data)
         .enter()
         .append("text")
         .text((function(d,i) {
            return pictorialdata[i].toFixed(2);
         } ))
         .attr("fill",textcolor)
         .style("font-family", textfont)
         .style("font-size", "13px")
        //  .attr("font-size",18*iconradiusscale)
         .attr("x", function (d,i) { 
             return x.bandwidth()/2+x(categoriescolor[i])+30; })
         .attr("text-anchor","middle")   
         .attr("y", function (d,i) { 
          // return d3.max(afterIconIndexy)-30;
          return afterIconIndexy[i]-10;
         })

         if(props.chartId.indexOf("sugess")<0){
            drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
        }
    
    }


    let ssscale;
    if(props.chartId.indexOf("sugess")>0){
        ssscale=0.2;
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