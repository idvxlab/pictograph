import * as d3 from 'd3';
import { getStackedData, getSeries, getAggregatedRows, getWidth,getCategories } from './helper';
import _ from 'lodash';
import { type } from 'os';
import { range } from 'd3/node_modules/d3-array';
import pictorialtype from '../../../pictorialTypeDict'
// import pictorialtype from '../../../pictorialtype-brand'
import {drawLegend,outRepeat} from '../drawLegend'
import { func } from 'prop-types';
// const config = {
//     "legend-text-color": "#666"
// }
//const offset = 20; // To show whole chart


const draw = (props) => {
    console.log('bar_allData', props)
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
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || !('color' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y)|| _.isEmpty(encoding.color)) {
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "steelblue");
        return svg;
    }
    let hasSeries = ('color' in encoding) && ('field' in encoding.color);
    // console.log('hasSeries2222', hasSeries)

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

    console.log('stackedData---', stackedData)
    console.log('stackedData----', data)
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
    let categoriescolor1=outRepeat(data1.map(d=>(d[encoding.color.field]))); //categories或者series已经做了判断
    let categoriescolor=categoriescolor1;

   
    if('color' in encoding){
        
        if(bartype==="stacked"||bartype==="grouped") {
            categoriescolor1.forEach((d,i)=>{
                console.log('d-colorData',d)
                // console.log(colorset)
                console.log('colorPair', colorPair)
                colorset.push(colorPair[d])
            })
            colorScale=d3.scaleOrdinal(colorset);
            color=colorScale.domain(data.map(function(d){return d[encoding.color.field];}));
            categoriescolor=series;
        }
        else{
            if(categoriesx1.length>categoriescolor1.length)
            {
                categoriesx1.forEach((d,i)=>{
                    // console.log('d-colorData',d)
                    // console.log(colorset)
                //     console.log('d-colorData',d)
                // // console.log(colorset)
                // console.log('colorPair', colorPair)
                // console.log('colorPair', colorPair[d])

                    colorset.push(colorPair[d])
                })
                colorScale=d3.scaleOrdinal(colorset);
                color=colorScale.domain(data.map(function(d){return d[encoding.x.field];}));
                categoriescolor=categoriesx1
            }
            else{
                categoriescolor1.forEach((d,i)=>{
                    // console.log('d-colorData',d)
                    // console.log(colorset)
                    colorset.push(colorPair[d])
                })
                colorScale=d3.scaleOrdinal(colorset);
                color=colorScale.domain(data.map(function(d){return d[encoding.color.field];}));
            }
            
        }
    }
    
    //获取icon
    // let categoriesreading = props.categoriesreading;
    // console.log("改icon",categoriesreading)
    //categoriesreading 应与 categoriescolor 相同
   // let categoriesreading=["BMW","Ford","Mazda","Volkswagen","Hyundai","water-cooler","fountain","food-and-wine"];
    //console.log("draw -> categoriesreading", props.categoriesreading)
 

   let categoriesreading=props.categoriesreading;
   if(Array.isArray(categoriesreading)&& categoriesreading.length<=0)  return svg;
//    console.log("draw -> categoriesreading", categoriesreading)

   let seriesreading=props.seriesreading;
   if(Array.isArray(seriesreading)&& seriesreading.length<=0)  return svg;
//    console.log("draw -> seriesreading", seriesreading)
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

    console.log('defs-categoriesreading', categoriesreading)


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
                console.log('defs1--d', d);
                console.log('defs1--pictorialtype', pictorialtype[d]);
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === d
                // })
                // return obj.picpath;
                // console.log('d-pict', pictorialtype[d])
                return pictorialtype[d]
            })


    svg.append("defs")
    .selectAll("g")
    .data(seriesreading)
    .enter()
    .append("g")
    .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `suggess-${d}`;
        else return `canvas-${d}`
            })
            .append("path")
            .attr("d",function(d){
                console.log('defs2--d', d);
                console.log('defs2--pictorialtype', pictorialtype[d]);
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === d
                // })
                // return obj.picpath;
                return pictorialtype[d]
            })
       
// Bars
    if (hasSeries) {
        console.log('hasSeries-----2')
        let n = series.length;
        // console.log("series:",series)  // ["USA", "Europe", "Japan"]
     //  console.log("stackedData:",stackedData)
        let layer = svg.selectAll('layer')
            .data(stackedData)
          
            .enter()
            .append('g')
            .attr('class', function(d,i){
                return 'layer' + ' ' + d.key;
            })
            .style('fill', function(d, i) {
                //return colorset[i];
                //return color(categoriescolor[i])
                return colorPair[d.key]
            } )

        let rect = layer.selectAll('rect')
            .data(d => {
                return d.map(x => {
                    x.series = d.key.toString();
                    return x;
                });
            })
            .enter()
            .append('rect');

        //let style = props.spec.style;
        //如果没有指定style, 置为默认(报错在重新mapping时)
        // if(bartype == 'undefined'){
    
        // }
        //console.log('barstyle',style)


    if(bartype==="horizontalrect"){     //[2]
        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let iconindex="suggess-" +"hor";
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"hor";
        else iconindex="canvas-"+"hor";

        svg.append("defs")
        .selectAll("g")
        .data(categoriesreading)
        .enter()
        .append("g")
        .attr("id",function(d){
            if(props.chartId.indexOf("sugess")>0) return `suggess-`+"hor"+`${d}`;
            else return `canvas-`+"hor"+`${d}`
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


        

        let scale1=[];
        for(let i=0;i<categoriesreading.length;i++){

            let typesizex1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height;

            svg.select(`#${iconindex}${categoriesreading[i]}`)
            .attr("transform", function(){
                
                  let area11=typesizex1*typesizey1
                  let area12=x.bandwidth()*x.bandwidth()*sscale*sscale
                //   console.log("a平方："+area12)
                  scale1.push(Math.sqrt(area12/area11)*0.9 ) 
                    return  `scale(${scale1[i]})`
         
            });
        
        }

    
            let typesizex=[];
            let typesizey=[];
            let typex=[];
            let typey=[];
            for(let i=0;i<categoriesreading.length;i++){
                typesizex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width);
                typesizey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height);
                typex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().x);
                typey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().y);
            }

       let scaley = d3.scaleBand()
       .range([0, height-50])
       .domain(d3.range(pictorialdata.length))
      // .domain(data.map(function (d) { return d[encoding.x.field]; }))
       .padding(0.2);

      let scalex=d3.scaleLinear()
      scalex.domain([0, d3.max(pictorialdata)]).nice().range([0,width/3*2]);
    //    if (hasSeries) {
    //     scalex.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice().range([0,width-150]);
    // } else {
    //     scalex.domain([0, d3.max(data, function (d) { return d[encoding.y.field]; })]).range([0,width-150]);
    // }
      
    // scalex.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice();
    svg.selectAll("#myrect")
    .data(pictorialdata)
    .enter()
    .append("rect")
    .attr("id","myrect")
    .style('stroke-width', '0')
    .attr('x',"40")
    .attr('width', function(d,i){
    return  scalex(d)
    })
    .attr('y', (d,i) => scaley(i))
    .attr('height',scaley.bandwidth())
    .attr("fill",(d,i)=>color(categoriescolor[i]))

    // rect.style('stroke-width', '0')
    // .attr('x',"0")
    // .attr('width', function(d,i){
    //    return  scalex(d[1])
    // })
    // .attr('y', d => scaley(d.data.x))
    // .attr('height',scaley.bandwidth())
    //.attr("fill",(d,i)=>colorset[i]);
     
    var arrows=svg.append("g");

    arrows.selectAll('polygon')
    // .data(d => {
    //     return d.map(x => {
    //         x.series = d.key.toString();
    //         return x;
    //     });
    // })
    .data(pictorialdata)
    .enter()
    .append('polygon')
    .attr("points" ,function(d,i){
       // return `${scaley.bandwidth()/2+scaley(data1[encoding.x.field])},${scalex(data1[encoding.y.field])+30} ${scaley(data1[encoding.x.field])},${scalex(data1[encoding.y.field])-1} ${scaley(data1[encoding.x.field])+scaley.bandwidth()},${scalex(data1[encoding.y.field])-1}`
            return `${scalex(d)+30},${scaley.bandwidth()/2+scaley(i)} ${scalex(d)-1},${scaley(i)-1} ${scalex(d)-1},${scaley(i)+scaley.bandwidth()+1}`
        })
        .attr("fill",(d, i) => color(categoriescolor[i]))

    svg.append("g")
    .attr("id","pictoLayer")
    .selectAll("use")
    .data(pictorialdata)
    .enter()
    .append("use")
    .attr("xlink:href",function(d,i){
        if(i>=categoriesreading.length)
        return `#${iconindex}${categoriesreading[categoriesreading.length-1]}`
        else
        return `#${iconindex}${categoriesreading[i]}`
    })
    //to do
    .attr("class",function(d,i){
                            
        // if(i>=catogoriesreading.length)
        //     return "icon-"+seriesreading[seriesreading.length-1] + ' ' + "source-"+stackedData[stackedData.length - 1].key 
        // else{
            // console.log('categoriesreading[i]', categoriesreading[i], categoriesx1[i])
            return "icon-"+categoriesreading[i] + ' ' + "source-" + categoriesx1[i]
        // }
            
    })
    .attr("x", function (d,i) {
        let aa=i; 
        if(i>=categoriesreading.length) aa=categoriesreading.length-1;
        return scalex(d)+90-Math.abs(typex[aa]*scale1[aa])})
    .attr("y", function (d,i) { 
        let aa=i;
        if(i>=categoriesreading.length) aa=categoriesreading.length-1;
        return scaley.bandwidth()/2+scaley(i)-typesizey[aa]/2-Math.abs(typey[aa]*scale1[aa]) ; })
    //.style('fill', (d, i) => colorset[i])
    .style('fill',function(d,i){
        if(iconcolor == undefined || iconcolor == null){
            return color(categoriescolor[i]);
        }
        else{
            return iconcolor;
        }
    })

const textpercent=svg.append("g")
    .attr("id","text")



var texts=textpercent.selectAll("text")
    .data(data1)
    .enter()
    .append("text")
    .text(((d,i) => '-'+stackedData[0][i][1]))
    .attr("fill",textcolor)
    .attr("font-family",textfont)
    .attr("x", function (d,i) { 
        return 60 })
    .attr("y", function (d,i) { return scaley.bandwidth()/2+scaley(i)+7; })
    .attr("font-size",function(){
        let textsize1=42-datapercent.length*2;
        if (textsize1>0)
        return  textsize1*iconradiusscale;
        else return 5*iconradiusscale;
    });

    if(props.chartId.indexOf("sugess")<0){       
        drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
    }

                 
    }else if(bartype==="singlebar"){   //[3]
        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let iconindex="suggess-"+"sing";
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"sing";
        else iconindex="canvas-"+"sing";

        svg.append("defs")
        .selectAll("g")
        .data(categoriesreading)
        .enter()
        .append("g")
        .attr("id",function(d){
            if(props.chartId.indexOf("sugess")>0) return `suggess-`+"sing"+`${d}`;
            else return `canvas-`+"sing"+`${d}`
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

        let scale1=[];
        for(let i=0;i<categoriesreading.length;i++){

        let typesizex1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width;
        let typesizey1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height;

        svg.select(`#${iconindex}${categoriesreading[i]}`)
        .attr("transform", function(){
            if(typesizex1>typesizey1){
               scale1.push(x.bandwidth()/typesizex1);
                return  `scale(${scale1[i]})`
            }
            else{
                scale1.push(x.bandwidth()/typesizey1)
                return  `scale(${scale1[i]})`
            }            
        });
    }
            let typesizex=[];
            let typesizey=[];
            let typex=[];
            let typey=[];
            for(let i=0;i<categoriesreading.length;i++){
                typesizex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width);
                typesizey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height);
                typex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().x);
                typey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().y);
            }

        let scalex=d3.scaleBand()
        .range([0,width])
        .domain(d3.range(pictorialdata.length))
        .padding(0.2);

        let scaley= d3.scaleLinear()
            .domain([0, d3.max(pictorialdata)])
            .nice()
            .range([height-50, height/5]);
      
            console.log('pictorialdata', pictorialdata)
        // y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice();
        // rect.style('stroke-width', '0')
        //     .attr('x', d => x(d.data.x))
        //     .attr('width', x.bandwidth() - 1)
        //     .attr('y', d => y(d[1]))
        //     .attr('height', d => y(d[0]) - y(d[1]));
        svg.selectAll("#myrect1")
            .data(pictorialdata)
            .enter()
            .append("rect")
            .attr("id","myrect1")
            .style('stroke-width', '0')
            .attr('x',(d,i)=>scalex(i))
            .attr('width', x.bandwidth())
            .attr('y', d=>scaley(d))
            .attr('height',d=>height-50-scaley(d))
            .attr("fill",(d,i)=>color(categoriescolor[i]))

        svg.append("g")
            .attr("id","pictoLayer")
            .selectAll("use")
            .data(pictorialdata)
            .enter()
            .append("use")
            .attr("xlink:href",function(d,i){
                if(i>=categoriesreading.length)
                return `#${iconindex}${categoriesreading[categoriesreading.length-1]}`
                else
                return `#${iconindex}${categoriesreading[i]}`
            })
            .attr("class",function(d,i){
                            
                // if(i>=catogoriesreading.length)
                //     return "icon-"+seriesreading[seriesreading.length-1] + ' ' + "source-"+stackedData[stackedData.length - 1].key 
                // else{
                    console.log('categoriesreading[i]', categoriesreading[i], categoriesx1[i])
                    return "icon-"+categoriesreading[i] + ' ' + "source-" + categoriesx1[i]
                // }
                    
            })
            .attr("x", function (d,i) { 
                let aa=i;
                if(i>=categoriesreading.length) aa=categoriesreading.length-1;
                return x.bandwidth()/2-typesizex[aa]/2+scalex(i)-Math.abs(typex[aa]*scale1[aa]); })
            .attr("y", function (d,i) { 
                let aa=i;
                if(i>=categoriesreading.length) aa=categoriesreading.length-1;
                return scaley(d)-typesizey[aa]-Math.abs(typey[aa]*scale1[aa]); })
           // .style('fill', (d, i) => colorset[i])
        //    .style("fill",iconcolor)
            .style('fill',function(d,i){
                if(iconcolor == undefined || iconcolor == null){
                    return color(categoriescolor[i]);
                }
                else{
                    return iconcolor;
                }
            })

        const textpercent=svg.append("g")
            .attr("id","text")

        console.log('stackedData----2', stackedData)

        var texts=textpercent.selectAll("text")
            .data(data1)
            .enter()
            .append("text")
            .text(((d,i) => '-'+stackedData[0][i][1]))
            .attr("fill",textcolor)
            .attr("font-family",textfont)
            .style("font-size", "13px")
            .attr("x", function (d,i) { 
                return x.bandwidth()/2+scalex(i);
                //return x.bandwidth()/10+scalex(i);
             })
            .attr("y", function (d,i) { return height-80; })
            .attr("text-anchor","middle")   //文字居中
            // .attr("font-size",function(){
            //     let textsize1=38-datapercent.length*3;
            //     if (textsize1>0)
            //     return  textsize1*iconradiusscale;
            //     else return 5*iconradiusscale;
            // });

            if(props.chartId.indexOf("sugess")<0){      
                drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
            }

    }

        else if (bartype === "stacked") {   //[1]
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice();
            let rectarr=new Array(stackedData[0].length);
            let mappingx=[];
            for(var i = 0;i < rectarr.length; i++){
                rectarr[i] = new Array();  //二维数组
               }
            rect.style('stroke-width', '0')
                .attr('x', function(d){
                   mappingx.push(d.data.x)
                   return x(d.data.x)
                } )
                .attr('width', x.bandwidth() - 1)
                .attr('y', d => y(d[1]))
                .attr('height', function(d,i) {
                    rectarr[i].push(d[1]-d[0]);
                   console.log("rect-stroke"+i+":"+d[0]+"---"+d[1]+"----"+(d[0]-d[1]))
                    return y(d[0]) - y(d[1])
                }
                )


                let rectmax=[];//每个x类中的最大值
                let rectmaxindex=[]; //每个x类中的最大值index //rectarr 记录每个rect的高度
                let rectsum=[];//每个x类rect高度总和
                let rectmaxpercent=[];//每个x类rect最大值所占百分比
                //去除数组中的重复值
                let resultxmapping = [], hash = {};
                for (let i = 0, elem; (elem = mappingx[i]) != null; i++) {
                    if (!hash[elem]) {
                        resultxmapping.push(elem);
                    hash[elem] = true;
                    }
                }
               //计算最大值
                for(let i=0;i<rectarr.length;i++){
                    rectmax.push(d3.max(rectarr[i]))
                    rectmaxindex.push(rectarr[i].indexOf(d3.max(rectarr[i])))
                    rectsum.push(d3.sum(rectarr[i]));
                    rectmaxpercent.push(parseFloat(rectmax[i]/rectsum[i]*100).toFixed(1))
                }

                // let iconindex="suggess-";
                // if(props.chartId.indexOf("sugess")>0) iconindex="suggess-";
                // else iconindex="canvas-";

                let iconindex="suggess-"+"sta";
                if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"sta";
                else iconindex="canvas-"+"sta";
                


                svg.append("defs")
                .selectAll("g")
                .data(categoriesreading)
                .enter()
                .append("g")
                .attr("id",function(d){
                    if(props.chartId.indexOf("sugess")>0) return `suggess-`+"sta"+`${d}`;
                    else return `canvas-`+"sta"+`${d}`
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

                svg.append("defs")
                .selectAll("g")
                .data(seriesreading)
                .enter()
                .append("g")
                .attr("id",function(d){
                    if(props.chartId.indexOf("sugess")>0) return `suggess-`+"sta"+`${d}`;
                    else return `canvas-`+"sta"+`${d}`
                        })
                        .append("path")
                        .attr("d",function(d){
                            // var obj = pictorialtype.find(function (obj) {
                            //     return obj.name === d
                            // })
                            // return obj.picpath;
                            return pictorialtype[d]
                        })

                //picto添加categories
                let scale1=[];
                for(let i=0;i<categoriesreading.length;i++){
            
                    let typesizex1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width;
                    let typesizey1=svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height;
                   
                   
                    let area11=typesizex1*typesizey1;
                    let area12=x.bandwidth()*x.bandwidth()/2
                    let scaleorign=Math.sqrt(area12/area11)  

                    svg.select(`#${iconindex}${categoriesreading[i]}`)
                    .attr("transform", function(){    
                           scale1.push(scaleorign);
                            return  `scale(${scale1[i]})`
                        
                    });
            
                }

                let typesizex=[];
                        let typesizey=[];
                        let typex=[];
                        let typey=[];
                        for(let i=0;i<categoriesreading.length;i++){
                            typesizex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().width);
                            typesizey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBoundingClientRect().height);
                            typex.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().x);
                            typey.push(svg.select(`#${iconindex}${categoriesreading[i]}`).node().getBBox().y);
                        }

                //picto添加series
                let scale2=[];

                for(let i=0;i<seriesreading.length;i++){
            
                    let typesizex2=svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().width;
                    let typesizey2=svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().height;
                   
                   
                    let area21=typesizex2*typesizey2;
                    let area22=x.bandwidth()*x.bandwidth()/2
                    let scaleorign=Math.sqrt(area22/area21)  

                    svg.select(`#${iconindex}${seriesreading[i]}`)
                    .attr("transform", function(){    
                           scale2.push(scaleorign);
                            return  `scale(${scale2[i]})`
                        
                    });
            
                }

                let typesizex2=[];
                let typesizey2=[];
                let typex2=[];
                let typey2=[];
                for(let i=0;i<seriesreading.length;i++){
                    typesizex2.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().width);
                    typesizey2.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().height);
                    typex2.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBBox().x);
                    typey2.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBBox().y);
                }

                console.log('rectarr---2', rectarr)


                        


                    svg.append("g")
                        .attr("id","pictoLayer")
                        .selectAll("use")
                        .data(rectarr)
                        .enter()
                        .append("use")
                        .attr("xlink:href",function(d,i){
                          
                            // if(i>=catogoriesreading.length){
                            //     console.log("href",`#${iconindex}${seriesreading[seriesreading.length-1]}`)
                            //     return `#${iconindex}${seriesreading[seriesreading.length-1]}`
                            // }
                            // else{
                              //  console.log("else-href",`#${iconindex}${seriesreading[rectmaxindex[i]]}`,rectmaxindex[i])
                                return `#${iconindex}${seriesreading[rectmaxindex[i]]}`
                            // }
                            
                        })
                        .attr("class",function(d,i){
                            
                            // if(i>=catogoriesreading.length)
                            //     return "icon-"+seriesreading[seriesreading.length-1] + ' ' + "source-"+stackedData[stackedData.length - 1].key 
                            // else{
                                console.log('stackedData[rectmaxindex[i]].key', stackedData[rectmaxindex[i]].key)
                                return "icon-"+seriesreading[rectmaxindex[i]] + ' ' + "source-" + stackedData[rectmaxindex[i]].key
                            // }
                                
                        })

                        .attr("x", function (d,i) { 
                            //let aa=i;
                            let aa=rectmaxindex[i];
                            if(i>=seriesreading.length) aa=seriesreading.length-1;
                            return x.bandwidth()/2-typesizex2[aa]/2+x(resultxmapping[i])-Math.abs(typex2[aa]*scale2[aa]); })
                        .attr("y", function (d,i) { 
                          //  let aa=i;
                            let aa=rectmaxindex[i];
                            if(i>=seriesreading.length) aa=seriesreading.length-1;
                             return y(rectsum[i])-typesizey2[aa]-Math.abs(typey2[aa]*scale2[aa]); })
                           // return y(0)+80-typesizey[aa]-Math.abs(typey[aa]*scale1[aa]); })
                        // .style('fill', (d, i) => colorset[i])
                        .style("fill",function(d,i){
                            console.log('colorPair', colorPair)
                            return colorPair[stackedData[rectmaxindex[i]].key]  //colorset[rectmaxindex[i]]
                        })

                // const textpercent=svg.append("g")
                //     .attr("id","text")
                // var texts=textpercent.selectAll("text")
                //     .data(rectmaxpercent)
                //     .enter()
                //     .append("text")
                //     .text((function(d,i) {
                //         if((rectmaxpercent[i]-100)===0) return ;
                //         else return  rectmaxpercent[i]+"%";
                //     } ))
                //     .attr("fill",textcolor)
                //     .attr("font-family",textfont)
                //     .attr("x", function (d,i) { 
                //         return x.bandwidth()/2+x(resultxmapping[i]); })
                //     .attr("text-anchor","middle")   
                //     .attr("y", function (d,i) { 
                //        // let rectheight;
                //         let sum=0;
                //         for(let a=0;a<rectmaxindex[i]+1;a++){
                //             sum=sum+rectarr[i][a];
                         
                //         }
                //         //console.log("....:" ,sum)
                //         return y(sum-rectarr[i][rectmaxindex[i]]/2-2); 
                //     })
                //     .attr("font-size",function(){
                //         let textsize1=38-rectmaxpercent.length*3;
                //         if (textsize1>0)
                //         return  textsize1*iconradiusscale;
                //         else return 5*iconradiusscale;
                //     });
            if(props.chartId.indexOf("sugess")<0){
                drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)            
            }
            //     svg.append("g")
            //     .attr("id","pictoLayer")
            //     .selectAll("use")
            //     .data(data1)
            //     .enter()
            //     .append("use")
            //     .attr("xlink:href",function(d,i){
            //         if(i>=categoriesreading.length)
            //         return `#${categoriesreading[categoriesreading.length-1]}`
            //         else
            //         return `#${categoriesreading[i]}`
            //     })
            //     .attr("id",function(d,i){
            //         if(i>=categoriesreading.length)
            //         return "icon"+categoriesreading[categoriesreading.length-1]
            //         else
            //         return "icon"+categoriesreading[i]
            //         })
              
            //     .attr("x", function (d,i) { 
            //         let aa=i;
            //         if(i>=categoriesreading.length) aa=categoriesreading.length-1;
            //         return x.bandwidth()/2-typesizex[aa]/2+x(d[encoding.x.field])-Math.abs(typex[aa]*scale1[aa]); })
            //     .attr("y", function (d,i) { 
            //         let aa=i;
            //         if(i>=categoriesreading.length) aa=categoriesreading.length-1;
            //         return y(d[encoding.y.field])-typesizey[aa]-Math.abs(typey[aa]*scale1[aa]); })
            //    // .style('fill', (d, i) => colorset[i])
            //    .style("fill","grey")

            // const textpercent=svg.append("g")
            //     .attr("id","text")

            // var texts=textpercent.selectAll("text")
            //     .data(data1)
            //     .enter()
            //     .append("text")
            //     .text(((d,i) => datapercent[i]+"%"))
            //     .attr("fill","white")
            //     .attr("x", function (d,i) { 
            //         return x.bandwidth()/10+x(d[encoding.x.field]); })
            //     .attr("y", function (d,i) { return height-30; })
            //     .attr("font-size",function(){
            //         let textsize1=38-datapercent.length*2;
            //         if (textsize1>0)
            //         return  textsize1;
            //         else return 5;
            //     });

            // var arrows=svg.append("g");
            
            // arrows.selectAll("polygon")
            // .data(data1)
            // .enter()
            // .append('polygon')
            // .attr("points" ,function(d){
            //     return `${x.bandwidth()/2+x(d[encoding.x.field])},${y(d[encoding.y.field])-30} ${x(d[encoding.x.field])},${y(d[encoding.y.field])+1} ${x(d[encoding.x.field])+x.bandwidth()},${y(d[encoding.y.field])+1}`
            // })
            // .attr("fill",(d, i) => colorset[i])




        } 
        // else if (bartype === "percent") {
        //     let totalDict = {};
        //     stackedData[stackedData.length - 1].forEach(d => {
        //         totalDict[d.data.x] = d[1];
        //     });
        //     y.domain([0, 1]);
        //     rect.style('stroke-width', '0')
        //         .attr('x', d => x(d.data.x))
        //         .attr('width', x.bandwidth() - 1)
        //         .attr('y', d => {
        //             let total = totalDict[d.data.x];
        //             return y(d[1] / total);
        //         })
        //         .attr('height', d => {
        //             let total = totalDict[d.data.x];
        //             return y(d[0] / total) - y(d[1] / total);
        //         });
        // }
        
        else if(bartype==="grouped"){    //[4]
            // grouped
            let iconindex="suggess-"+"gro";
            if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"gro";
            else iconindex="canvas-"+"gro";

            svg.append("defs")
            .selectAll("g")
            .data(seriesreading)
            .enter()
            .append("g")
            .attr("id",function(d){
                if(props.chartId.indexOf("sugess")>0) return `suggess-`+"gro"+`${d}`;
                else return `canvas-`+"gro"+`${d}`
                    })
                    .append("path")
                    .attr("d",function(d){
                        // var obj = pictorialtype.find(function (obj) {
                        //     return obj.name === d
                        // })
                        // return obj.picpath;
                        return pictorialtype[d]
                    })

            let scale1=[];
            let paddingwidth=30;
            let paddingwidth1=paddingwidth*(series.length-1);
            let margin = width/series.length;
            let width11= (width-margin-paddingwidth1)/(series.length+1);
           

            for(let i=0;i<seriesreading.length;i++){
    
                let typesizex1=svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().width;
                let typesizey1=svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().height;
    
                svg.select(`#${iconindex}${seriesreading[i]}`)
                .attr("transform", function(){  

                      let area11=typesizex1*typesizey1
                      let area12= width11*width11;           
                      scale1.push(Math.sqrt(area12/area11) )                   
                        return  `scale(${scale1[i]})`
    
                });
            }

                let typesizex=[];
                let typesizey=[];
                let typex=[];
                let typey=[];
                for(let i=0;i<seriesreading.length;i++){
                    typesizex.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().width);
                    typesizey.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBoundingClientRect().height);
                    typex.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBBox().x);
                    typey.push(svg.select(`#${iconindex}${seriesreading[i]}`).node().getBBox().y);
                }
    
            let max = 0;
            stackedData.forEach(ds => {
                ds.forEach(d => {
                    if ((d[1] - d[0]) > max) {
                        max = d[1] - d[0];
                    }
                });
            });
            y.domain([0, max]).nice();
            rect.style('stroke-width', '0')
                .attr('rx',5)
                .attr('ry',5)
                .attr('x', d => {

                   // console.log("d.data.x----",d.data.x)
                    return x(d.data.x) + (x.bandwidth() - 1) / n * series.indexOf(d.series);
                })
                .attr('width', (x.bandwidth() - 1) / n)
                .attr('y', d => {
                    return y(0) - (y(d[0]) - y(d[1])+100)
                })
                .attr('height', d => y(d[0]) - y(d[1]))

                let iconindex1=[0];

                svg.append("g")
                .attr("id","pictoLayer")
                .selectAll("use")
                .data(series)
                .enter()
                .append("use")
                .attr("xlink:href",function(d,i){
                    if(i>=seriesreading.length)
                    return `#${iconindex}${seriesreading[seriesreading.length-1]}`
                    else
                    return `#${iconindex}${seriesreading[i]}`
                })
                .attr("class",function(d,i){
                            
                    // if(i>=catogoriesreading.length)
                    //     return "icon-"+seriesreading[seriesreading.length-1] + ' ' + "source-"+stackedData[stackedData.length - 1].key 
                    // else{
                        console.log('seriesreading[i]', seriesreading[i], stackedData[i].key)
                        return "icon-"+seriesreading[i] + ' ' + "source-" + stackedData[i].key
                    // }
                })
                .attr("x",function(d,i){
                    let aa=i;
                    if(i>=seriesreading.length) aa=seriesreading.length-1;

                    iconindex1.push(typesizex[aa]+iconindex1[aa]+paddingwidth)
                    return margin/2-Math.abs(typex[aa]*scale1[aa])+iconindex1[aa];
                })
                .attr("y",function(d,i){
                    let aa=i;                  
                    if(i>=seriesreading.length) aa=seriesreading.length-1;
                        //return height-Math.abs(typex[aa]*scale1[aa])-typesizey[aa];

                        return height-50-Math.abs(typey[aa]*scale1[aa])-typesizey[aa]+d3.max(typesizey)*0.15;
                    })
                

                // .attr("x", function (d,i) { 
                //     let aa=i;
                //     if(i>=categoriesreading.length) aa=categoriesreading.length-1;
                //     //iconindex.push(typesizex[aa]+iconindex[aa]+20)
                //     return 10-typesizex[aa]/2-Math.abs(typex[aa]*scale1[aa]);
                //     //return 20-Math.abs(typex[aa]*scale1[aa])+iconindex[aa];
                // })
                //     //return x.bandwidth()/2-typesizex[aa]/2+scalex(i)-Math.abs(typex[aa]*scale1[aa]); })
                // .attr("y", function (d,i) { 
                //     let aa=i;
                   
                //     if(i>=categoriesreading.length) aa=categoriesreading.length-1;
                //     iconindex.push(typesizey[aa]+iconindex[aa]+20)
                //     return height-50-Math.abs(typex[aa]*scale1[aa])-iconindex[aa];})
                //     //return 50-typesizey[aa]/2-Math.abs(typey[aa]*scale1[aa]); })
               .style('fill', (d, i) => colorPair[stackedData[i].key])
              
               let heightaxisx= height-150;
            svg.append("g")
                .attr("transform", "translate(0," + heightaxisx + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(10,0)")
                .style("font-family",textfont)
                .style("font-size", "13px")
              //  .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            svg.selectAll(".domain")
            .attr("stroke",textcolor);
            svg.selectAll("line")
            .attr("stroke",textcolor)
            svg.selectAll("text")
            .attr("stroke",textcolor)

            if(props.chartId.indexOf("sugess")<0){       
                drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
            }
        }
        else if(bartype==="percent2-1"){    //[7]
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            let iconindex="suggess-"+"p"+"2";
            if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"p"+"2";
            else iconindex="canvas-"+"p"+"2";

            svg.append("defs")
            .append("g")
            .attr("id",function(){
                if(props.chartId.indexOf("sugess")>0) return `suggess-`+"p"+"2"+`${pictogram}`
                else return `canvas-`+"p"+"2"+`${pictogram}`
            })
            .append("path")
            .attr("d",function(){
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === pictogram
                // })
                // return obj.picpath; 
                return pictorialtype[pictogram]
            })
        
            let typesizex1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
           
            let scale1;
            svg.select(`#${iconindex}${pictogram}`)
            .attr("transform", function(){
                  let area11=typesizex1*typesizey1
                  let area12=770
                  scale1 = Math.sqrt(area12/area11)*iconradiusscale
                   // scale1.push(x.bandwidth()/typesizey1)
                    return  `scale(${scale1})`  
            });
            //specify the number of columns and rows for pictogram layout
            let numCols = 10;
            let numRows = 1;
        
            //padding for the grid
            let xPadding =10;
            //let yPadding = 15;
        
            //horizontal and vertical spacing between the icons
            //let hBuffer = 30;
            let wBuffer = (typesizex1*4/3)*scale1;
        
            //generate a d3 range for the total number of required elements
            let myIndex = d3.range(numCols * numRows);
        
            //Process Data
            let data=props.data;
            data=getAggregatedRows(data,encoding);       
         
            //Compute the percent
            let pictorialdata=data.map(d=>parseFloat(d[encoding.y.field]));
        
            let colorlen=categoriescolor.length;
            if(colorlen>6) {colorlen=6;categoriescolor=categoriescolor.slice(0,6)}
            let scaley1 = d3.scaleBand()
            .range([30, height-50])
            .domain(d3.range(colorlen))
        
              // Define the gradient
              let gradient=[];
              for(let i=0;i<colorlen;i++){
                gradient[i] = svg.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", function(){
                    return "icontype1"+i;
                })
                .attr("spreadMethod", "pad");
        
               // Define the gradient colors
               gradient[i].append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", function(){
                    return color(categoriescolor[i]);
                })
                .attr("stop-opacity", 1);
              }
             
              let total = numCols * numRows;
              let valuePict =[];
              let valueDecimal = [];
              let pictorialdatamax=d3.max(pictorialdata);
              for(let i=0;i<colorlen;i++){   
                 // valuePict[i]=total*(datapercent[i]/100);
                 valuePict[i]=(pictorialdata[i]*total/pictorialdatamax).toFixed(1);
                 
                  valueDecimal[i]=(valuePict[i]%1);
              
              }
        
            for(let i=0;i<colorlen;i++){
                //let typeindex=i*60;
                svg.append("g")
                .attr("id", function(){
                    return "icon"+categoriescolor[i];
                })
                .selectAll("use")
                .data(myIndex)
                .enter()
                .append("use")
                .attr("xlink:href", `#${iconindex}${pictogram}`)
                .attr("id", function(d) {
                    return "icon" + d;
                })
                .attr("x", function(d) {
                    let remainder = d % numCols; //calculates the x position (column number) using modulus
                    return width/15+30+xPadding + (remainder * wBuffer); //apply the buffer and return value
                })
                .attr("y", function(d) {
                    return scaley1(i); //apply the buffer and return the value
                })
                .attr("class",function(){
                    return "icon-"+pictogram + ' ' + "source-" + encoding.y.field + ' ' + "icontypeP2"+i;
                });

        
                svg.append("text")
                .attr("x",40)
                .attr("y",23+scaley1(i))
                .attr("fill",color(categoriescolor[i]))
                .style("font-size", "13px")
                // .attr("font-size",20*iconradiusscale)
                .style("font-family", textfont)
                .attr('text-anchor',"end")
                .text(categoriescolor[i]);
        
                svg.append("text")
                .attr("x",width)
                .attr("y",23+scaley1(i))
                .attr("fill",color(categoriescolor[i]))
                // .attr("font-size",20*iconradiusscale)
                .style("font-size", "13px")
                .style("font-family", textfont)
                .attr('text-anchor',"middle")
                .text("| "+pictorialdata[i].toFixed(1));
            }
        
        
            //Fill the color
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


            let darkColor = [];
            // console.log('gradientcolor',gradientcolor);
            let rgb = toRGB(gradientcolor);
            // console.log('rgb',rgb);
            rgb = rgb.replace("RGB(", "");
            rgb = rgb.replace(")", "");
            let arr = rgb.split(',');
            // console.log('arr',arr);
            let luminance = (0.299*arr[0] + 0.587*arr[1] + 0.114*arr[2]);
            // console.log('luminance',luminance);
            if (luminance<150){
                for(let i=0;i<colorlen;i++){
                    let c = d3.hsl(d3.rgb(colorset[0]));
                    let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
                    let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
                    let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                    darkColor[i] = defaultcolor;
                    // let r = parseInt((32+parseInt(arr[0]))/2);
                    // let g = parseInt((32+parseInt(arr[1]))/2);
                    // let b = parseInt((32+parseInt(arr[2]))/2);
                    // console.log('rgb',r,g,b)
                    // darkColor[i] = 'rgb(' + r + ',' + g + ',' + b + ')';
                }
            }else{
                for(let i=0;i<colorlen;i++){
        //             let c = d3.hsl(d3.rgb(colorset[i]));
        //             let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
        //             let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
        //             let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                    darkColor[i] = 'rgb(238,238,238)';  
                }
            }
            
         
            for(let i=0;i<colorlen;i++){
                d3.selectAll(".icontypeP2"+i)
                // .attr("fill", function(d) {
                .style("fill", function(d) {
                   
                if (d <= valuePict[i] - 1) {
        
                    return color(categoriescolor[i]);
        
                } else if (d > (valuePict[i] - 1) && d < (valuePict[i])) {
                    gradient[i].append("svg:stop")
                        .attr("offset", (valueDecimal[i] * 100) + '%')
                        .attr("stop-color", color(categoriescolor[i]))
                        .attr("stop-opacity", 1);
                    gradient[i].append("svg:stop")
                        .attr("offset", (valueDecimal[i] * 100) + '%')
                        //.attr("stop-color", "#9e9e9e")
                        .attr("stop-color", darkColor[i])
                        .attr("stop-opacity", 1);
                    gradient[i].append("svg:stop")
                        .attr("offset", '100%')
                        .attr("stop-color", darkColor[1])
                        .attr("stop-opacity", 1);
                    return "url(#icontype1"+i+")";
                } else {
                    //return cardcolor;
                    return darkColor[i];
                }
            });
            }
            if(props.chartId.indexOf("sugess")<0){
                drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
            }
         }
        
         else if(bartype==="percent1-1"){    //[6]
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            let iconindex="suggess-"+"p"+"1";
            if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"p"+"1";
            else iconindex="canvas-"+"p"+"1"

            svg.append("defs")
            .append("g")
            .attr("id",function(){
                if(props.chartId.indexOf("sugess")>0) return `suggess-`+"p"+"1"+`${pictogram}`
                else return `canvas-`+"p"+"1"+`${pictogram}`
            })
            .append("path")
            .attr("d",function(){
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === pictogram
                // })
                // return obj.picpath; 
                return pictorialtype[pictogram]
            })
        
            let typesizex1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
            let scale1;
            svg.select(`#${iconindex}${pictogram}`)
            .attr("transform", function(){
                  let area11=typesizex1*typesizey1
                  let area12=770
                  scale1=Math.sqrt(area12/area11)*iconradiusscale
                   // scale1.push(x.bandwidth()/typesizey1)
                    return  `scale(${scale1})`
        
                
            });
            //specify the number of columns and rows for pictogram layout
            let numCols = 10;
            let numRows = 1;
        
            //padding for the grid
            let xPadding =10;
            //let yPadding = 15;
        
            //horizontal and vertical spacing between the icons
            //let hBuffer = 30;
            let wBuffer = (typesizex1*4/3)*scale1;
         
            //Process Data
            let data=props.data;
            data=getAggregatedRows(data,encoding);
        
               
            //Compute the percent
            let pictorialdata=data.map(d=>parseFloat(d[encoding.y.field]));
        
            /******!!!!!!!!!!!!!!!最多只取前六条数据 */
            let colorlen=categoriescolor.length;
            if(colorlen>6) {colorlen=6;categoriescolor=categoriescolor.slice(0,6)}
            let scaley1 = d3.scaleBand()
                .range([30, height-50])
                .domain(d3.range(colorlen))
              // Define the gradient
              let gradient=[];
              for(let i=0;i<colorlen;i++){
                gradient[i] = svg.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", function(){
                    return "icontype"+i;
                })
                .attr("spreadMethod", "pad");
        
               // Define the gradient colors
               gradient[i].append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", function(){
                    return color(categoriescolor[i]);
                })
                .attr("stop-opacity", 1);
              }
             
              let total = numCols * numRows;
              let valuePict =[];
              let valueDecimal = [];
              let pictorialdatamax=d3.max(pictorialdata);
              let zhengshuvalue=[];
              let myIndex=[];
              for(let i=0;i<colorlen;i++){   
                 // valuePict[i]=total*(datapercent[i]/100);
                valuePict[i]=(pictorialdata[i]*total/pictorialdatamax).toFixed(1);
                 
                valueDecimal[i]=(valuePict[i]%1);
                zhengshuvalue[i]=Math.ceil(valuePict[i]);
                myIndex[i]=d3.range(zhengshuvalue[i] * numRows)
              }
        
              
        
            for(let i=0;i<colorlen;i++){
               // let typeindex=i*60;
                svg.append("g")
                .attr("id", function(){
                    return "icon"+categoriescolor[i];
                })
                .selectAll("use")
                .data(myIndex[i])
                .enter()
                .append("use")
                .attr("xlink:href", `#${iconindex}${pictogram}`)
                .attr("id", function(d) {
                    return "icon" + d;
                })
                .attr("x", function(d) {
                    let remainder = d % numCols; //calculates the x position (column number) using modulus
                    return width/15+30+xPadding + (remainder * wBuffer); //apply the buffer and return value
                })
                .attr("y", function(d) {
                    return scaley1(i); //apply the buffer and return the value
                })
                .attr("class",function(){
                    return "icon-"+pictogram + ' ' + "source-" + encoding.y.field + ' ' + "icontypeP1"+i;
                });
                
        
                svg.append("text")
                .attr("x",40)
                .attr("y",23+scaley1(i))
                .attr("fill",color(categoriescolor[i]))
                .style("font-family", textfont)
                .style("font-size", "13px")
                // .attr("font-size",20*iconradiusscale)
                .attr('text-anchor',"end")
                .text(categoriescolor[i]);
        
                svg.append("text")
                .attr("x",width)
                .attr("y",23+scaley1(i))
                .attr("fill",color(categoriescolor[i]))
                .style("font-family", textfont)
                .style("font-size", "13px")
                // .attr("font-size",20*iconradiusscale)
                .attr('text-anchor',"middle")
                .text("| "+pictorialdata[i].toFixed(1));
            }
        
        
            //Fill the color
            for(let i=0;i<colorlen;i++){
                d3.selectAll(".icontypeP1"+i)
                // .attr("fill", function(d) {
                .style("fill", function(d) {
                   
                if (d <= valuePict[i] - 1) {
        
                    return color(categoriescolor[i]);
        
                } else if (d > (valuePict[i] - 1) && d < (valuePict[i])) {
                    gradient[i].append("svg:stop")
                        .attr("offset", (valueDecimal[i] * 100) + '%')
                        .attr("stop-color", color(categoriescolor[i]))
                        .attr("stop-opacity", 1);
                    gradient[i].append("svg:stop")
                        .attr("offset", (valueDecimal[i] * 100) + '%')
                        .attr("stop-color", gradientcolor)
                        .attr("stop-opacity", 1);
                    gradient[i].append("svg:stop")
                        .attr("offset", '100%')
                        .attr("stop-color",gradientcolor)
                        .attr("stop-opacity", 1);
                    return "url(#icontype"+i+")";
                } else {
                    return gradientcolor;
                    //return "#9e9e9e";
                }
            });
            }
            if(props.chartId.indexOf("sugess")<0){
                drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
            }
         }
        else if(bartype==="area-1"){   //[5]
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
                return color(categoriescolor[i])
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
        else if(bartype==="barchart5"){  //[9]
            // else  if(bartype==="flex") {
                let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
                let iconindex="suggess-" + 'b'+'5';
                if(props.chartId.indexOf("sugess")>0) iconindex="suggess-" + 'b'+'5';
                else iconindex="canvas-" + 'b'+'5'
                //Stroke边框 无series 例子：奥斯卡
                svg.append("defs")
                .append("g")
                .attr("id",function(){
                    if(props.chartId.indexOf("sugess")>0)  return `suggess-`+'b'+'5'+`${pictogram}`;
                    else return `canvas-`+'b'+'5'+`${pictogram}`
                })
                    .append("path")
                    .attr("d",function(){
                        // var obj = pictorialtype.find(function (obj) {
                        //     return obj.name === pictogram
                        // })
                        // return obj.picpath; 
                        return pictorialtype[pictogram]
                    })
                    .attr("stroke",function(){
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
            
        
                        // console.log('gradientcolor',gradientcolor);
                        let rgb = toRGB(gradientcolor);
                        console.log('rgb',rgb);
                        rgb = rgb.replace("RGB(", "");
                        rgb = rgb.replace(")", "");
                        let arr = rgb.split(',');
                        console.log('arr',arr);
                        let luminance = (0.299*arr[0] + 0.587*arr[1] + 0.114*arr[2]);
                        console.log('luminance',luminance);
                        if (luminance<150){
                            return "white";
                        }else{
                            return "black";
                        }
                    })
                    .attr("stroke-width","1px")
    
                let typesizex1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
               // let typesizey1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
    
                let data=props.data;
                data=getAggregatedRows(data,encoding);
    
                let pictorialdata=data.map(d=>parseFloat(d[encoding.y.field]));
    
                let colorlen=categoriescolor.length;
                let scale1;
                //X 
                let x = d3.scaleBand()
                    .range([0, width])
                    .domain(categoriescolor)
                    .padding(0.2);
                
                svg.select(`#${iconindex}${pictogram}`)
                    .attr("transform", function(){                
                        // scale1.push(x.bandwidth()/typesizey1)
                        scale1=x.bandwidth()/typesizex1;
                        return  `scale(${scale1})`                       
                    });
        
                let typesizex=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
                let typesizey=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
                let typex= svg.select(`#${iconindex}${pictogram}`).node().getBBox().x;
                let typey=svg.select(`#${iconindex}${pictogram}`).node().getBBox().y;
                
    
        
                    // Define the gradient
                    let gradient=[];
                    for(let i=0;i<colorlen;i++){
                        gradient[i] = svg.append("svg:defs")
                        .append("svg:linearGradient")
                        .attr("id", function(){
                            return `icontype${i}`;
                        })
                        .attr("x1","0")
                        .attr("y1", "1")
                        .attr("x2","0")
                        .attr("y2", "0")
                        .attr("spreadMethod", "pad");
            
                    // Define the gradient colors
                    gradient[i].append("svg:stop")
                        .attr("offset", "0%")
                        .attr("stop-color", function(){
                            return color(categoriescolor[i]);
                        })
                        .attr("stop-opacity", 1);
                    }
            
                    //Compute the percent
                    let valuePict =[];
                    let pictorialdatamax=d3.max(pictorialdata);
            
                    for(let i=0;i<colorlen;i++){   
                    // valuePict[i]=total*(datapercent[i]/100);
                        valuePict[i]=parseFloat(pictorialdata[i]/pictorialdatamax*100).toFixed(1);       
                    }
            
            svg.append("g")
                 .attr("id","pictoLayer")
                 .selectAll("use")
                 .data(categoriescolor)
                 .enter()
                 .append("use")
                 .attr("xlink:href",`#${iconindex}${pictogram}`)
                 .attr("id",function(d,i){return "icontype"+i})
                 .attr("class",function(d,i){
                    return "icon-"+pictogram + ' ' + "source-" + encoding.y.field;
                }) 
                 .attr("x", function (d,i) { 
                    return x.bandwidth()/2-Math.abs(typex*scale1)-typesizex/2+x(d); })
                 .attr("y", function (d) { return height/2-30-Math.abs(typey*scale1)-typesizey/2; })
              
               
            
                //Fill the color
                for(let i=0;i<colorlen;i++){
                d3.selectAll("#icontype"+i)
                // .attr("fill", function(d) {
                .style("fill", function(d) {
                    gradient[i].append("svg:stop")
                        .attr("offset", valuePict[i] + '%')
                        .attr("stop-color", color(categoriescolor[i]))
                        .attr("stop-opacity", 1);
                    gradient[i].append("svg:stop")
                        .attr("offset", valuePict[i] + '%')
                        .attr("stop-color", gradientcolor)
                        .attr("stop-opacity", 1);
                    gradient[i].append("svg:stop")
                        .attr("offset", '100%')
                        .attr("stop-color", gradientcolor)
                        .attr("stop-opacity", 1);
                    return `url(#icontype${i})`;
                }) 
            
            }
            
            let textpercent1=svg.append("g").attr("id","text1")
            let textpercent2=svg.append("g").attr("id","text2")
            textpercent1.selectAll("text")
            .data(categoriescolor)
            .enter()
            .append("text")
            .text((function(d) {
                return d;
            } ))
            .attr("fill",textcolor)
            .style("font-family", textfont)
            .style("font-size","13px")
            .attr("x", function (d,i) { 
                return x.bandwidth()/2+x(d); })
            .attr("text-anchor","middle")   
            .attr("y", function (d,i) { 
              return  height/2-30+typesizey/2+30;
            })
            
            textpercent2.selectAll("text")
            .data(categoriescolor)
            .enter()
            .append("text")
            .text((function(d,i) {
                return '-'+parseInt(pictorialdata[i].toFixed(2));
            } ))
            .attr("fill",textcolor)
            .style("font-family", textfont)
            .style("font-size","13px")
            // .attr("font-size",18*iconradiusscale)
            .attr("x", function (d,i) { 
                return x.bandwidth()/2+x(d); })
            .attr("text-anchor","middle")   
            .attr("y", function (d,i) { 
              return  height/2-30-Math.abs(typey*scale1)-typesizey/2;
            })
    
            if(props.chartId.indexOf("sugess")<0){
                    drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
                }
            
            }
        else  if(bartype==="flex") {
        // else if(bartype === "barchart5"){

            //电池纵向拉伸
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            let iconindex="suggess-" + 'f';
            if(props.chartId.indexOf("sugess")>0) iconindex="suggess-" + 'f';
            else iconindex="canvas-" + 'f';

            svg.append("defs")
            .append("g")
            // .attr("id",feildreading)
            .attr("id",function(){
                if(props.chartId.indexOf("sugess")>0)  return `suggess-`+'f'+`${pictogram}`;
                else return `canvas-`+'f'+`${pictogram}`
            })
            .append("path")
            .attr("d",function(){
                return pictorialtype[pictogram]
            })


            let scale1;
            let paddingwidth=(width/pictorialdata.length)*0.25;
            let paddingwidth1=paddingwidth*(pictorialdata.length-1);
            let margin = 2*paddingwidth;
            let width11= (width-margin-paddingwidth1)/(pictorialdata.length);


            let typesizex1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;

                svg.select(`#${iconindex}${pictogram}`)
                    .attr("transform", function(){
                    // let area11=typesizex1*typesizey1;
                    // let area12=width11*width11;
                    scale1 = width11/(typesizex1 * 4);
                    return  `scale(${scale1})`                
                });


            let typesizex=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
            let typesizey=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
            let typex=svg.select(`#${iconindex}${pictogram}`).node().getBBox().x;
            let typey=svg.select(`#${iconindex}${pictogram}`).node().getBBox().y;

            let scaley= d3.scaleLinear()
                .domain([0, d3.max(pictorialdata)])
                .nice()
                // .range([0, height-typesizey]);
                .range([0, height-300]);

            

                // svg.append("g")
                // .attr("id","pictoLayer")
                // .selectAll("use")
                // .data("battery_1")
                // .enter()
                // .append("use")
                // .attr("xlink:href", "#"+feildreading)
                // .attr("id", feildreading)
                // // .attr("x", xScale(parseTime(averageData[averageData.length-1].x)))
                // // .attr("y",yScale(averageData[averageData.length-1].y) - typesizey[0]*0.75)
                // // .attr("x", 0)
                // // .attr("y", 100)
                // .attr("x", 100)
                // .attr("y", 100)
                // .style('fill', colorset[1])

            var obj = pictorialtype[pictogram];

            // pictogram = 'barberry'
            // var obj = "M 88.19 0.00 L 112.00 0.00 C 112.33 0.61 112.68 1.20 113.06 1.78 L 113.10 0.01 C 117.00 0.52 121.41 1.93 123.24 5.76 C 126.14 11.76 124.60 18.65 124.98 25.07 C 132.67 24.94 140.37 25.01 148.06 25.01 C 152.31 25.00 157.08 25.90 159.90 29.37 C 162.03 32.42 162.46 36.30 162.51 39.93 C 162.52 88.31 162.51 136.70 162.52 185.08 C 162.48 188.74 162.11 192.65 159.85 195.67 C 157.35 198.60 153.48 199.75 149.76 200.00 L 50.25 200.00 C 46.49 199.76 42.61 198.58 40.09 195.63 C 37.85 192.60 37.53 188.67 37.48 185.02 C 37.48 136.67 37.48 88.32 37.48 39.97 C 37.51 36.34 37.96 32.48 40.04 29.40 C 42.65 26.21 46.98 25.09 50.94 25.04 C 58.97 24.93 67.00 25.06 75.02 24.97 C 75.40 18.60 73.86 11.75 76.75 5.79 C 78.81 1.52 83.83 0.19 88.19 0.00 Z";

            var new_path_temp = []
            var anchor_x = []
            var anchor_y = []
            var anchor_index_x = []
            var anchor_index_y = []
            var path = obj.split(' ');
            // console.log('pictogram',pictogram,obj)
            var num = 0;
            // console.log('path',path)
            for(let i=0;i<path.length;i++){
                if(path[i] === "" || path[i] === 'M' || path[i] === 'L' || path[i] === 'H'|| path[i] === 'V'|| path[i] === 'C' || path[i] === 'S' || path[i] === 'Q' || path[i] === 'T' || path[i] === 'A' || path[i] === 'Z'){
                    new_path_temp[i] = path[i];
                }
                else{
                    new_path_temp[i] = path[i];
                    if(num%2 === 0){
                        anchor_x[parseInt(num/2)] = parseFloat(path[i]);
                        anchor_index_x[parseInt(num/2)] = i;
                        // console.log('anchor',parseInt(num/2),anchor_x[parseInt(num/2)])
                    } else {
                        anchor_y[parseInt(num/2)] = parseFloat(path[i]);
                        anchor_index_y[parseInt(num/2)] = i;
                        // console.log('anchor',parseInt(num/2),anchor_y[parseInt(num/2)])
                    }
                    num++;
                }
            }


            var anchor_y_max = -1000;
            var anchor_y_max_num = -1000;
            for(let i=0;i<anchor_y.length;i++) {
                if(anchor_y[i] > anchor_y_max){
                    anchor_y_max = anchor_y[i];
                    anchor_y_max_num = i;
                }
            }
            var min_num = anchor_y_max_num;
            var max_num = anchor_y_max_num;

            let i = anchor_y_max_num;
            while( Math.abs(anchor_x[i]-anchor_x[i-1]) >= 0.015 ){
                i--;
                min_num = i;
            }
            i = anchor_y_max_num;
            while( Math.abs(anchor_x[i]-anchor_x[i+1]) >= 0.015 ){
                i++;
                max_num = i;
            }
            // console.log('maxxxxx',anchor_y_max,min_num,max_num)

            // var flex_scale = 100;

            //Data processing
            
            var flex_scale =[]

            for(let i =0;i<pictorialdata.length;i++){
                console.log(pictorialdata[i],scaley(pictorialdata[i]),typesizey);
                flex_scale.push((scaley(pictorialdata[i]) - typesizey)) 

            }
            // console.log("flex_scale",flex_scale);

            //generate flex
            for(let j =0;j<pictorialdata.length;j++){
                var new_path = _.cloneDeep(new_path_temp);
                for(let i = min_num ; i<max_num+1 ; i++ ){
                    var index = anchor_index_y[i];
                    var new_location = parseFloat(new_path[index]) + parseFloat(flex_scale[j]);
                    new_path[index] = new_location.toString();;
                }
                
                var GeneratePicpath = '';
                for(let i=0;i<new_path.length;i++){
                    GeneratePicpath = GeneratePicpath + new_path[i] +' ';
                }
                // console.log('GeneratePicpath',GeneratePicpath);
                // console.log('obj',obj);
    
    
                svg.append("defs")
                .append("g")
                .attr("id", 'Generate'+j)
                .append("path")
                .attr("d",function(){
                    // console.log(GeneratePicpath)
                    return GeneratePicpath;
                })
                .attr("transform", `scale(${scale1})`)
    
                svg.append("g")
                    .attr("id","Generate_plot")
                    .append("use")
                    .attr("xlink:href","#"+"Generate"+j)
                    .attr("x", function(){
                        let iconWidth = svg.select(`#${'Generate'+j}`).node().getBoundingClientRect().width;
                        let icontypex=svg.select(`#${'Generate'+j}`).node().getBBox().x;
                        return width11*j + paddingwidth*j + margin/2- iconWidth/2 - icontypex +40;
                    })
                    .attr("y", function(){
                        // console.log("height",height);
                        // console.log("flex_scale",flex_scale[j]);
                        // console.log("scale1",scale1);
                        let iconHeight = svg.select(`#${'Generate'+j}`).node().getBoundingClientRect().height;
                        let icontypey=svg.select(`#${'Generate'+j}`).node().getBBox().y;
                        return height  - iconHeight - icontypey -200;
                        // return height/2+20-Math.abs(icontypey[i])-iconHeight[i]
                        // return height-flex_scale[j]*scale1-typesizey*scale1;
                    })
                    .attr("class",function(){
                        return "icon-"+pictogram + ' ' + "source-" + encoding.y.field ;
                    }) 
                    .style("fill",function(){            
                        return color(categoriescolor[j])
                    });
                    // .style('fill', colorset[j]);
                    // .attr("transform", `translate(0, ${-flex_scale})`)

                
                    
            }

            const textFlex=svg.append("g")
            .attr("id","text")

            var texts=textFlex.selectAll("text")
            .data(data1)
            .enter()
            .append("text")
            .text(((d,i) => d[encoding.x.field]))
            .attr("fill",textcolor)
            .style("font-family", textfont)
            .style("font-size", "13px")
            // .attr("font-size",18*iconradiusscale)
            .attr("x", function (d,i) { 
                // return x.bandwidth()/2+scalex(i);
                //return x.bandwidth()/10+scalex(i);
                let iconWidth = svg.select(`#${'Generate'+i}`).node().getBoundingClientRect().width;
                let icontypex=svg.select(`#${'Generate'+i}`).node().getBBox().x;
                return width11*i + paddingwidth*i + margin/2 + iconWidth/4 - icontypex+40;
                })
            .attr("y", function (d,i) { 
                // return height-30; 
                let iconHeight = svg.select(`#${'Generate'+i}`).node().getBoundingClientRect().height;
                let icontypey=svg.select(`#${'Generate'+i}`).node().getBBox().y;
                return height  - icontypey -200 + 20;
            })
            .attr("text-anchor","middle")   //文字居中
            // .attr("font-size",function(){
            //     let textsize1=30-pictorialdata.length*3;
            //     if (textsize1>0)
            //     return  textsize1;
            //     else return 5;
            // });

            const textValue=svg.append("g")
            .attr("id","value")

            var texts2=textValue.selectAll("text")
            .data(data1)
            .enter()
            .append("text")
            .text(((d,i) => d[encoding.y.field]))
            .attr("fill",textcolor)
            .attr("x", function (d,i) { 
                // return x.bandwidth()/2+scalex(i);
                //return x.bandwidth()/10+scalex(i);
                let iconWidth = svg.select(`#${'Generate'+i}`).node().getBoundingClientRect().width;
                let icontypex=svg.select(`#${'Generate'+i}`).node().getBBox().x;
                return width11*i + paddingwidth*i + margin/2 + iconWidth/4 - icontypex+40;
                })
            .attr("y", function (d,i) { 
                // return height-30; 
                let iconHeight = svg.select(`#${'Generate'+i}`).node().getBoundingClientRect().height;
                let icontypey=svg.select(`#${'Generate'+i}`).node().getBBox().y;
                return height  - iconHeight - icontypey -200 -10;
                // return height  - iconHeight -10;
            })
            .style("font-family", textfont)
            .attr("text-anchor","middle")   //文字居中
            .style("font-size", "13px")
            // .attr("font-size",function(){
            //     let textsize1=30-pictorialdata.length*3;
            //     if (textsize1>0)
            //     return  textsize1;
            //     else return 5;
            // });
            
            if(props.chartId.indexOf("sugess")<0){
                drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
            }
                
            


        } 
        else  if(bartype==="barchart4") {

            //水滴类型
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            let iconindex="suggess-" + 'b'+'4';
            if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+'b'+'4';
            else iconindex="canvas-"+'b'+'4'

            svg.append("defs")
            .append("g")
            .attr("id",function(){
                if(props.chartId.indexOf("sugess")>0)  return `suggess-`+'b'+'4'+`${pictogram}`;
                else return `canvas-`+'b'+'4'+`${pictogram}`
            })
               .append("path")
               .attr("d",function(){
                return pictorialtype[pictogram]
               })

               console.log('selectBarchart---',`#${iconindex}${pictogram}`)
           
               let typesizexx=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
               let typesizeyy=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
           
           
               //Process Data
               let data=props.data;
               data=getAggregatedRows(data,encoding);
            
           
               //Compute the scale
               let pictorialdata=data.map(d=>parseFloat(d[encoding.y.field]));

               let colorlen=categoriescolor.length;
               if(colorlen>5) {colorlen=5;categoriescolor=categoriescolor.slice(0,5)}
  
           
               let x = d3.scaleBand()
               .range([0, width])
               .domain(d3.range(colorlen))
               .padding(0.2);
                      
               let area11=typesizexx*typesizeyy;
               let area12=20*20*iconradiusscale
               let scaleorign=Math.sqrt(area12/area11)  
               let scale1;
               svg.select(`#${iconindex}${pictogram}`)
               .attr("transform", function(){
                     scale1=Math.sqrt(area12/area11) 
                       return  `scale(${scale1})`
               })
           
               let typesizex=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
               let typesizey=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
               let typex=svg.select(`#${iconindex}${pictogram}`).node().getBBox().x;
               let typey=svg.select(`#${iconindex}${pictogram}`).node().getBBox().y;
           
               //Padding
               let xpadding=2;
               let ypadding=2;
           
               //Compute the number
               let total =40;
               let valuePict =[];
               let valueDecimal = [];
               let pictorialdatamax=d3.max(pictorialdata);
               let zhengshuvalue=[];
               let myIndex=[];
               for(let i=0;i<colorlen;i++){   
                  // valuePict[i]=total*(datapercent[i]/100);
                 valuePict[i]=(pictorialdata[i]*total/pictorialdatamax).toFixed(1);
                  
                 valueDecimal[i]=(valuePict[i]%1);
                 zhengshuvalue[i]=Math.ceil(valuePict[i]);
                 myIndex[i]=d3.range(zhengshuvalue[i] )
               }
               let rowa=[];
               for(let a=0;a<colorlen;a++){
                   rowa.push(Math.ceil(zhengshuvalue[a]/4)-1);
                   svg.append("g")
                      .attr("id","pictoLayer")
                      .selectAll("use")
                      .data(myIndex[a])
                      .enter()
                      .append("use")
                      .attr("xlink:href",`#${iconindex}${pictogram}`)
                      .attr("id",(d,i)=>(a+"icon"+i))
                      .attr("x",function(d,i){ 
                          
                        return d%4*(typesizex+xpadding)-Math.abs(typex*scale1)+x(a)
                         //if(d%4<2) return d%4*(typesizex+xpadding)-Math.abs(typex*scale1)-typesizex/2-xpadding+x(a)
                         //else return d%4*(typesizex+xpadding)-Math.abs(typex*scale1)+typesizex/2+xpadding+x(a)                                                                     
                      })
                      .attr("y",function(d,i){
                           return height-height/3-Math.floor(i/4)*(typesizey+ypadding)-Math.abs(typey*scale1)-typesizey/2
                      })
                      .style("fill",function(d,i) {
                          return color(categoriescolor[a])
                      })
                      .attr("class",function(d,i){
                        return "icon-"+pictogram + ' ' + "source-" + encoding.y.field;
                    }) 
               }
           
               let textpercent1=svg.append("g").attr("id","text1")
               let textpercent2=svg.append("g").attr("id","text2")
                textpercent1.selectAll("text")
                .data(categoriescolor)
                .enter()
                .append("text")
                .text((function(d,i) {
                    return d;
                } ))
                .attr("fill",textcolor)
                .style("font-family", textfont)
                .attr("x", function (d,i) { 
                    return x(i)+typesizex*2; })
                .attr("text-anchor","middle")   
                .style("font-size", "13px")
                // .attr("font-size",18*iconradiusscale)
                .attr("y", function (d,i) { 
                  return  height-height/3+40;
                })
            
                textpercent2.selectAll("text")
                .data(categoriescolor)
                .enter()
                .append("text")
                .style("font-family", textfont)
                .text((function(d,i) {
                    return '-'+parseInt(pictorialdata[i].toFixed(2));
                } ))
                .attr("fill",textcolor)
                .style("font-size", "13px")
                // .attr("font-size",18*iconradiusscale)
                .attr("x", function (d,i) { 
                    return x(i)+typesizex*2; })
                .attr("text-anchor","middle")   
                .attr("y", function (d,i) { 
                  return  height-height/3-30-rowa[i]*(typesizey+2);
                })

                if(props.chartId.indexOf("sugess")<0){
                    drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
                    }
            }
        
        
            else {
                svg.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .style('stroke-width', '0')
                    .attr('rx',5)
                    .attr('ry',5)
                    .attr("x", function (d) { return x(d[encoding.x.field]); })
                    .attr("width", x.bandwidth())
                    .attr("height", function (d) { return height - y(d[encoding.y.field]); })
                    .attr("y", function (d) { return y(d[encoding.y.field]); })
                    .style('fill', colorset[0]);
        
        
            }

            let ssscale;
            if(props.chartId.indexOf("sugess")>0){
                ssscale=0.2;
                margin = { top: width/20, right: width/12, bottom: width/15, left: width/15};
            }else{
                ssscale=1;
                margin = { top: width/15, right: width/4, bottom: width/4, left: 65 };
            }
        
             d3.selectAll(`.${svgg}`)
               // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+ssscale+")");

           
    } 
  
    // Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");
    // svg.append("g").call(d3.axisLeft(y));

    // // legend
    // // let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // // legend
    // const legend = svg.append("g")
    // //.attr("transform", `translate(0, ${height + 60})`);

    // //console.log("series",series)
    // var legends = legend.selectAll("legend_color")
    //     .data(series)
    //     .enter()
    //     .append("g")
    //     .attr("class", "legend_color")
    //     .attr('transform', (d, i) => `translate(${-15}, 0)`);//i * (80 + 10) + (width - (categories.length * 80 + (categories.length - 1) * 10)) / 2

    // legends.append("rect")
    //     .attr("fill", (d, i) => colorset[i])
    //     .attr('x', 15)
    //     .attr('y', -10)
    //     .attr("width", '10px')
    //     .attr('height', '10px')
    //     .attr("rx", 1.5)
    //     .attr("ry", 1.5)
    // // .attr("cy", -5);
    // legends.append("text")
    //     .attr("fill", textcolor)
    //     .attr("x", 35)
    //     .text(d => d);

    // let legend_nodes = legends.nodes();
    // let before = legend_nodes[0];
    // let current;
    // let offset = -15;

    // for (let i = 1; i < legend_nodes.length; i++) {
    //     current = legend_nodes[i];
    //     if (d3.select(before).select("text").node().getComputedTextLength()) {
    //         offset += d3.select(before).select("text").node().getComputedTextLength();
    //     } else {
    //         offset += getWidth(series[i - 1])
    //     }
    //     //console.log("offset1", offset)
    //     d3.select(current)
    //         .attr('transform', `translate(${i * 30 + offset}, 0)`);
    //     before = current;
    // }
    // if (legend.node().getBBox().width) {
    //     legend.attr("transform", `translate(${(width - legend.node().getBBox().width) / 2}, ${height + 60})`);
    // } else {
    //     offset += getWidth(series[series.length - 1]);
    //    // console.log("offset2", offset)
    //     legend.attr("transform", `translate(${(width - offset - 30 * series.length + 20) / 2}, ${height + 60})`);
    // }

    // svg.selectAll(".domain")
    // .attr("stroke",textcolor);
    // svg.selectAll("line")
    // .attr("stroke",textcolor)
    // svg.selectAll("text")
    // .attr("stroke",textcolor)
    return svg;

}

export default draw;