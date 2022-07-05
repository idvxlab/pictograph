import * as d3 from 'd3';
import { getStackedData, getSeries, getAggregatedRows, getWidth,getCategories } from './helper';
import _ from 'lodash';
import { type } from 'os';
import { range } from 'd3/node_modules/d3-array';
import pictorialtype from '../../../pictorialTypeDict'
// import pictorialtype from '../../../pictorialtype-brand'
import {drawLegend,outRepeat} from '../drawLegend'
// const config = {
//     "legend-text-color": "#666"
// }
//const offset = 20; // To show whole chart


const draw = (props) => {
    // console.log('bar_allData', props)
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.'+props.chartId+'>*').remove();
        a = '.'+props.chartId;
    }

     let cardcolor;
     let textcolor=props.textcolor;
     let textfont=props.textfont;
     let iconcolor=props.iconcolor;
     var bartype =props.stylelayout //"horizontalrect" //singlebar///"stacked" 
     let gradientcolor=props.cardcolor; 
    //  let FieldsData = props.FieldsData;
     let fieldsreading=props.fieldsreading;
     let icondict = props.icondict;
//fields name
    // console.log('icondict',icondict);
    // console.log('fieldsreading',fieldsreading, encoding.y.field);
    let pictogram= fieldsreading;
    // console.log('pictogram',pictogram);

    //  let pictogram= 'flag';

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
        margin = { top: width/20, right: width/12, bottom: width/15, left: width/20};
    }else{
        sscale=1;
        svgg="canvas"
        margin = { top: width/15, right: width/4, bottom: width/4, left: width/6 };
    }

    let svg = d3.select(a)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 40)
         .style('background-color',cardcolor)
        .append("g")
        .attr("class",`${svgg}`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+sscale+")");

    // svg.append("rect")
    //     .attr("height", props.width-20)
    //     .attr("width", props.height-20)
    //     .attr("x", 10)
    //     .attr("y", 10)
    //     .attr("cx", 50)
    //     .attr("cy", 50)
    //     .attr("stroke","#eee")
    //     .attr("stroke-width",5)
    //     // .style("border","2px solid #4674b2")
    //     // .style('border-radius','4px')
    //     .attr("fill","white")
    //     .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")");

    // Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y)) {
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "steelblue");
        return svg;
    }
    let hasSeries = ('color' in encoding) && ('field' in encoding.color);

    // Process Data
    let data = props.data;
    let stackedData = [];
    let dataSeries = [];
    let series = [];
    if (hasSeries) {
        dataSeries = getSeries(data, encoding);
        stackedData = getStackedData(data, encoding);
        series = Object.keys(dataSeries);
    } else {
        data = getAggregatedRows(data, encoding);
       
    }

    // console.log('stackedData', stackedData)
    // X channel
    let x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d[encoding.x.field]; }))
        .padding(0.2);


    // Y channel
    let y = d3.scaleLinear()
    if (hasSeries) {
        y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice().range([height-50, 100]);
    } else {
        y.domain([0, d3.max(data, function (d) { return d[encoding.y.field]; })]).range([height-50, 100]);
    }

    /*----------------------------------------------------------------------------- */
    // Color channel
    let colorset=[];
    let colorData;
    let color;
    let colorPair = props.colorPair;
    let colorScale;

    // console.log("COLOR",colorset);
    
    //获取类别
    let data1= getAggregatedRows(data, encoding);   
    let categoriesx1=outRepeat(data1.map(d=>d[encoding.x.field]));

    categoriesx1 = Object.keys(getCategories(data, encoding));

    // console.log('categoriesx1', categoriesx1)

    // console.log('categoriesx1', categoriesx1)
    let categoriescolor1=outRepeat(data1.map(d=>(d[encoding.x.field]))); //categories或者series已经做了判断
    let categoriescolor=categoriescolor1;

   

 

   let categoriesreading=props.categoriesreading;
   if(Array.isArray(categoriesreading)&& categoriesreading.length<=0)  return svg;
//    console.log("draw -> categoriesreading", categoriesreading)

    /*----------------------------------------------------------------------------- */
    //calculate
    let pictorialdata=data1.map(d=>parseFloat(d[encoding.y.field]));
  
    let sum=0;
    let datapercent=[];
    for(let i=0;i<pictorialdata.length;i++){
        sum+=pictorialdata[i];
    }
    for(let i=0;i<pictorialdata.length;i++){
        datapercent.push(parseFloat((pictorialdata[i]/sum*100).toFixed(1)));
    }


    //select icon
    // let categoriesreading=["plane","bus","car","batterycar","truck","rocket","bicycle","tractor"];
   // let categoriesreading=["add-list","creek--v1","fountain","jazz","one-to-one","water-cooler","torrent","food-and-wine"];
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
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === d
                // })
                // return obj.picpath;
                // console.log('d-pict', pictorialtype[d])
                return pictorialtype[d]
            })




   



        
        if(bartype==="area"){   //[5]
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
            let pictorialdata=data.map(d=>parseFloat(d[encoding.y.field]));
   
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
                return "icon-"+pictogram + ' ' + "source-" + encoding.y.field + ' ' + `icon${i}${iconindex}` ;
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
        

            let ssscale;
            if(props.chartId.indexOf("sugess")>0){
                ssscale=0.2;
                margin = { top: width/20, right: width/12, bottom: width/15, left: width/15};
            }else{
                ssscale=1;
                margin = { top: width/15, right: width/4, bottom: width/4, left: width/7 }; //width/5
            }
        
             d3.selectAll(`.${svgg}`)
               // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+ssscale+")");

  
   
    return svg;

}

export default draw;