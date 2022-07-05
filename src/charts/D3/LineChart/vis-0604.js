import * as d3 from 'd3';
import {getSeries, getCategories, parseTime, formatTick, getAggregatedRows, formatTicksCount, sortByDateAscending, getWidth} from './helper';
import _ ,{ mean }from 'lodash';
import pictorialtype from '../../../pictorialType'
import {drawLegend,outRepeat} from '../drawLegend'

const draw = (props) => {
    //hex -> rgb
  

    let a = document.createElement("div");
    if (!props.onCanvas) {
        // d3.select('.vis-linechart > *').remove();
        // a = '.vis-linechart';
        d3.select('.'+props.chartId+'>*').remove();
        a = '.'+props.chartId;
    }
    

    //默认卡片背景
    let cardcolor;
    let textcolor=props.textcolor;
    let textfont=props.textfont;
    let linetype=props.stylelayout;
    const colorset =props.colormap;
    const colorPair = props.colorPair;
  

    let margin = { top: 10, right: 80, bottom:10, left: 80 };
    const width = 500/4*props.size.w;
    const height = 500/4*props.size.h;
    let chartWidth = width,
          chartHeight = height;

          let svgg;
          let sscale;
          if(props.chartId.indexOf("sugess")>0){
              sscale=1;
              svgg="suggess";
              margin = { top: width/20, right: width/12, bottom: width/15, left: width/25};
          }else{
              sscale=1;
              svgg="canvas"
              margin = { top: 0, right: 80, bottom:80, left: width/10 };
          }
      
    let svg = d3.select(a)
                .append("svg")
                .attr("id","mysvg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style('background-color',cardcolor)
                .append("g")
                .append("g")
                .attr("class",`${svgg}`)
               // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+sscale+")");
       
    // Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y.field) ) {
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "steelblue"); 
        return svg;
    }
    

    let hasSeries = ('color' in encoding) && ('field' in encoding.color);
    
    // Process Data
    let data = props.data;
    data.forEach((d)=>{
        d[encoding.y.field] = +d[encoding.y.field];
        return d;
    })
    // // Get categories
    let dataCategories = getCategories(data, encoding);
    let categories = Object.keys(dataCategories);
    // console.log('categories', categories)
    
    // Get series and stacked data
    let dataSeries = {};
    let dataSeriesCategories = {};
    let series = [];
    let colorScale = d3.scaleOrdinal();
 

    let color;
    let xScale, yScale;

     //select icon
     let categoriesreading = props.categoriesreading;
     let seriesreading = props.seriesreading;
     let fieldreading=[props.fieldsreading];
     let AllData = props.AllData;

     console.log('props-line', props)

     if(Array.isArray(categoriesreading)&& categoriesreading.length<=0)  return svg;
     //if(Array.isArray(seriesreading)&& seriesreading.length<=0)  return svg;


    

    // let fieldreading="BMW";

     svg.append("defs")
     .selectAll("g")
     .data(categoriesreading)
     .enter()
     .append("g")
     .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `${d}1`;
        else return `${d}66`
             })
        .append("path")
        .attr("d",function(d){
            var obj = pictorialtype.find(function (obj) {
                return obj.name === d
            })
            return obj.picpath;
        })
        .attr('fill', (d, i) => colorPair[d])

        svg.append("defs")
     .selectAll("g")
     .data(seriesreading)
     .enter()
     .append("g")
     .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `${d}1`;
        else return `${d}66`
             })
        .append("path")
        .attr("d",function(d){
            var obj = pictorialtype.find(function (obj) {
                return obj.name === d
            })
            return obj.picpath;
        })
        .attr('fill', (d, i) => colorPair[d])

        svg.append("defs")
     .selectAll("g")
     .data(fieldreading)
     .enter()
     .append("g")
     .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `${d}1`;
        else return `${d}66`
             })
        .append("path")
        .attr("d",function(d){
            console.log('d-line', d)
            var obj = pictorialtype.find(function (obj) {
                return obj.name === d
            })
            return obj.picpath;
        })
        .attr('fill', (d, i) => colorPair[d])



//lineChart
    if (hasSeries) {
        // Series data
        dataSeries = getSeries(data, encoding);
        series = Object.keys(dataSeries);
        for (const s in dataSeries) {
            dataSeriesCategories[s] = {};
            // dataSeries[s] = getMaxRows(dataSeries[s], encoding);
            dataSeries[s] = getAggregatedRows(dataSeries[s], encoding)
            for (let index = 0; index < dataSeries[s].length; index++) {
                const rowData = dataSeries[s][index];
                // console.log(rowData);
                dataSeriesCategories[s][rowData[encoding.x.field]] = rowData[encoding.y.field]
            }
        }
        // color scale
        var colorMaxNumberarr = new Array(100);
        for(var i=0;i<colorMaxNumberarr.length;i++){
            colorMaxNumberarr[i] = i;
        }
        color = colorScale
            .domain(data.map(function(d) { return d[encoding.x.field];}))
            .range(colorMaxNumberarr);
        // console.log("linechartcolor", d3.scaleOrdinal().domain(data.map(function(d) { return d[encoding.color.field];})))

        //let style = props.spec.style;
       // linetype ="MultiSeriesLine"  
        if(linetype === "MultiSeriesLine"){
            let iconindex=1;
            if(props.chartId.indexOf("sugess")>0) iconindex=1;
            else iconindex=66

            let scale1=[];
            let paddingwidth=30;
            let paddingwidth1=paddingwidth*(series.length-1);
            let margin = width/series.length;
            let width11= (width-margin-paddingwidth1)/(series.length+1);

            for(let i=0;i<seriesreading.length;i++){
                let typesizex1=svg.select(`#${seriesreading[i]}${iconindex}`).node().getBoundingClientRect().width;
                let typesizey1=svg.select(`#${seriesreading[i]}${iconindex}`).node().getBoundingClientRect().height;

                svg.select(`#${seriesreading[i]}${iconindex}`)
                    .attr("transform", function(){
                    let area11=typesizex1*typesizey1;
                    let area12=width11*width11;
                    scale1.push(Math.sqrt(area12/area11) )
                    return  `scale(${scale1[i]})`                
                });
            }

            let typesizex=[];
            let typesizey=[];
            let typex=[];
            let typey=[];
            for(let i=0;i<seriesreading.length;i++){
                typesizex.push(svg.select(`#${seriesreading[i]}${iconindex}`).node().getBoundingClientRect().width);
                typesizey.push(svg.select(`#${seriesreading[i]}${iconindex}`).node().getBoundingClientRect().height);
                typex.push(svg.select(`#${seriesreading[i]}${iconindex}`).node().getBBox().x);
                typey.push(svg.select(`#${seriesreading[i]}${iconindex}`).node().getBBox().y);
            }

            chartHeight = height - d3.max(typesizey)*1.5;

            let chart = svg.append("g"),
            axis = chart.append("g")
                .attr("class", "axis"),
            content = chart.append("g")
                .attr("class", "content")
                .attr("chartWidth", chartWidth)
                .attr("chartHeight", chartHeight)
                .attr("clip-path", "url(#clip-rect)")

            // X channel
            xScale = d3.scaleTime()
            .domain(d3.extent(data, function(d) { console.log("draw -> parseTime(d[encoding.x.field]", parseTime(d[encoding.x.field]))
                 return parseTime(d[encoding.x.field]);}))
            
            .range([0, chartWidth]);

            // Y channel
            yScale = d3.scaleLinear()
                .domain([0, d3.max(series, function(c) {
                    return d3.max(dataSeries[c], function(d) {
                        return d[encoding.y.field]
                    })
                })])
                .range([chartHeight, 0])
                .nice();

            let tick_format = formatTick(data[0][encoding.x.field])
            let format_TicksCount = formatTicksCount(data[0][encoding.x.field])
            var axisX = d3.axisBottom(xScale)
                    .ticks(format_TicksCount)
                    .tickFormat(tick_format);
            if(format_TicksCount === d3.timeYear) {
            axisX.ticks(format_TicksCount)
            }

            let axisY = d3.axisLeft(yScale);

            let axis_x = axis.append("g")
            .attr("class", "axis_x")
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(axisX)
            //.style('display', 'none')
            .attr('xScale', xScale.domain())
            .style('color',textcolor);

            axis_x.selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-family",textfont)
            .style('color',textcolor);;

            let axis_y = axis.append("g")
            .attr("class", "axis_y")
            .call(axisY)
            // .style('display', 'none')
            .attr('yScale', yScale.domain())
            .style("font-family",textfont)
            .style('color',textcolor);

            svg.selectAll(".domain")
            .attr("stroke",textcolor);
            svg.selectAll("text")
            .style("font-family",textfont)
            .attr("stroke",textcolor);
            svg.selectAll("line")
            .attr("stroke",textcolor);

            // line Function
            var lineGen = d3.line()
            .x(function(d) {
                // return xScale(d.x);
                return xScale(parseTime(d.x));
            })
            .y(function(d) {
                return yScale(d.y);
            })
            .curve(d3.curveBasis);;

            //绘制折线

            let preparedData = {}
        series.forEach((s) => {
            let sData = [];
            categories.forEach(c => { // each x value 
                sData.push({
                    x: c,
                    y: dataSeriesCategories[s][c]?dataSeriesCategories[s][c]:0,
                    y0: 0,
                    color: s
                })
            });
            sData = sData.sort(sortByDateAscending);
            preparedData[s] = sData;
        })
        var allGroup = content.append('g')
                        .attr('id', 'allLine')
        for (let index = 0; index < series.length; index++) {
            var group = allGroup.append('g')
                .attr('id', 'series_' + series[index])
                .attr('clip-path', 'url(#clip_'+series[index]+')');
            group.append('path')
                .data([preparedData[series[index]]])
                .attr('d', lineGen(preparedData[series[index]]))
                .attr('stroke', function(d, i){
                    // console.log('line-path', d)
                    // console.log(series[index])
                    // return colorset[color(series[index])];
                    return colorPair[d[index].color];
                })
                // .attr('stroke', '#ffffff')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('class', 'data-item series_' +series[index]);
            // group.selectAll('.dot')
            //     .data(preparedData[series[index]])
            //     .enter()
            //     .append('circle')
            //     .attr("cx", function(d) { return xScale(parseTime(d.x)) }) // parseTime
            //     .attr("cy", function(d) { return yScale(d.y) })
            //     .attr("r", 4)
            //     .style("stroke", colorset[color(series[index])])    // set the line colour
            //     .style('stroke-width', 2)
            //     .style("fill", cardcolor)
            //     .attr('class', 'data-item series_' + series[index]);
                
            }

            // origin icon
               let iconindex1=[0];
        //     // Define the gradient
        // let gradient=svg.append("svg:defs")
        // .append("svg:linearGradient")
        // .attr("id","icontype")
        // .attr("x1","0")
        // .attr("y1", "0")
        // .attr("x2","1")
        // .attr("y2", "0")
        // .attr("spreadMethod","pad");

        // //Define the gradient colors
        // gradient.append("svg:stop")
        // .attr("offset","0%")
        // .attr("stop-color",function(){
        //     return color(0);
        // })
        // .attr("stop-opacity",1);


        //     let categoriesreading1=["plane","bus","car"];
        //     svg.selectAll("#path1")
        //     .data(categoriesreading1)
        //     .enter()
        //     .append("g")
        //     .attr("id",function(d){
        //         console.log("path--------:",d)
        //                 return "path1";
        //             })
        //        .append("path")   
        //        .attr("d",function(d){
        //            var obj = pictorialtype.find(function (obj) {
        //                return obj.name === d
        //            })
        //            return obj.picpath;
        //        })
        //        .attr("transform", function(d,i){

        //         let aa=i;
        //         if(i>=categoriesreading.length) aa=categoriesreading.length-1;

        //         iconindex.push(typesizex[aa]+iconindex[aa]+paddingwidth)
        //        let indexx= margin/2-Math.abs(typex[aa]*scale1[aa])+iconindex[aa];
        //        let indexy=height-Math.abs(typey[aa]*scale1[aa])-typesizey[aa]+d3.max(typesizey)*0.15;

        //         return  `translate(${indexx},${indexy})scale(${scale1[i]})`                
        //     })
        //     // .attr("x",function(d,i){
        //     //     let aa=i;
        //     //     if(i>=categoriesreading.length) aa=categoriesreading.length-1;

        //     //     iconindex.push(typesizex[aa]+iconindex[aa]+paddingwidth)
        //     //     return margin/2-Math.abs(typex[aa]*scale1[aa])+iconindex[aa];
        //     // })
        //     // .attr("y",function(d,i){
        //     // let aa=i;                  
        //     // if(i>=categoriesreading.length) aa=categoriesreading.length-1;
        //     //     //return height-Math.abs(typex[aa]*scale1[aa])-typesizey[aa];
        //     //     return height-Math.abs(typey[aa]*scale1[aa])-typesizey[aa]+d3.max(typesizey)*0.15;
        //     // })
        //     .style('fill', (d, i) => colorset[i])
           
           
            svg.append("g")
         //   .attr("id","pictoLayer")
            .selectAll("use")
            .data(series)
            .enter()
            .append("use")
          
            .attr("xlink:href",function(d,i){
                if(i>=seriesreading.length)
                return `#${seriesreading[seriesreading.length-1]}${iconindex}`
                else
                return `#${seriesreading[i]}${iconindex}`
            })
            .attr("id",function(d,i){
                if(i>=seriesreading.length)
                return "icon"+seriesreading[seriesreading.length-1]
                else
                return "icon"+seriesreading[i]
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
                return height-Math.abs(typey[aa]*scale1[aa])-typesizey[aa]+d3.max(typesizey)*0.15;
            })
            .style('fill', (d, i) => colorPair[d])
            .attr("class", (d, i) => {
                // console.log('icon-class', "icon-" + fieldreading[0] + " source-" + encoding.y.field)
                return "icon-" + seriesreading[i] + ' ' +"source-" + d;
            })

        } 

        //legend
        let categoriescolor=outRepeat(data.map(d=>(d[encoding.color.field]))); //categories或者series已经做了判断
        // let categoriescolor=categoriescolor1;
        if(props.chartId.indexOf("sugess")<0){       
            drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor)
        }

    } 

        if(linetype === "SingleLine"){
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            let iconindex=1;
            if(props.chartId.indexOf("sugess")>0) iconindex=1;
            else iconindex=66

            let scale1=[];
            let width11= 40;

            let typesizex1=svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().height;

            svg.select(`#${fieldreading}${iconindex}`)
                .attr("transform", function(){
                let area11=typesizex1*typesizey1;
                let area12=width11*width11;
                scale1.push(Math.sqrt(area12/area11)*iconradiusscale )
                return  `scale(${scale1[0]})`                
            });

           

            let typesizex=[];
            let typesizey=[];
            let typex=[];
            let typey=[];
            typesizex.push(svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().width);
            typesizey.push(svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().height);
            typex.push(svg.select(`#${fieldreading}${iconindex}`).node().getBBox().x);
            typey.push(svg.select(`#${fieldreading}${iconindex}`).node().getBBox().y);


            chartHeight = height-100;
            chartWidth = width - 50;


            let chart = svg.append("g"),
            axis = chart.append("g")
                .attr("class", "axis"),
            content = chart.append("g")
                .attr("class", "content")
                .attr("chartWidth", chartWidth)
                .attr("chartHeight", chartHeight)
                .attr("clip-path", "url(#clip-rect)")

            // X channel
            xScale = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return parseTime(d[encoding.x.field]);}))
                .range([0, chartWidth]);
            // Y channel
            yScale = d3.scaleLinear()
                .domain([0, d3.max(data.map(d=>d[encoding.y.field]))])
                .range([chartHeight, 0])
                .nice();

            let tick_format = formatTick(data[0][encoding.x.field])
            let format_TicksCount = formatTicksCount(data[0][encoding.x.field])
            var axisX = d3.axisBottom(xScale)
                    .ticks(format_TicksCount)
                    .tickFormat(tick_format);
            if(format_TicksCount === d3.timeYear) {
            axisX.ticks(format_TicksCount)
            }

            let axisY = d3.axisLeft(yScale);

            let axis_x = axis.append("g")
            .attr("class", "axis_x")
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(axisX)
            //.style('display', 'none')
            .attr('xScale', xScale.domain())
            .style('color',textcolor);

            axis_x.selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('color',textcolor);;

            let axis_y = axis.append("g")
            .attr("class", "axis_y")
            .call(axisY)
            // .style('display', 'none')
            .attr('yScale', yScale.domain())
            .style('color',textcolor);

            // line Function
            var lineGen = d3.line()
            .x(function(d) {
                // return xScale(d.x);
                return xScale(parseTime(d.x));
            })
            .y(function(d) {
                return yScale(d.y);
            })
            .curve(d3.curveBasis);;

            //绘制折线
            let sData = {};
            categories.forEach(c => {
                data.forEach(d => {
                    if (d[encoding.x.field] === c) {
                        sData[c] = d[encoding.y.field];
                    }
                })
            });
            var averageData = [];
            Object.keys(sData).forEach(s => {
                averageData.push({
                    x: s,
                    y: sData[s],
                    y0: 0,
                    color: 'overall'
                })
            })
            averageData = averageData.sort(sortByDateAscending)
            console.log("draw -> averageData", averageData)
            
            let group = content.append('g')
                    .attr('id', 'series_overall')
                    .attr('clip-path', 'url(#clip_overall)');

           // console.log('colorPair[fieldreading[0]]', fieldreading[0])
            group.append('path')
                .attr('d', lineGen(averageData))
                .data([averageData])
                .attr('stroke', colorPair[encoding.y.field])
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('class', 'data-item series_overall');
            // group.selectAll('.dot')
            //     .data(averageData)
            //     .enter()
            //     .append('circle')
            //     .attr("cx", function(d) { return xScale(parseTime(d.x)) }) // parseTime
            //     .attr("cy", function(d) { return yScale(d.y) })
            //     .attr("r", 4)
            //     .style("stroke", colorset[1])    // set the line colour
            //     .style('stroke-width', 2)
            //     .style("fill", cardcolor)
            //     .attr('class', 'data-item series_overall');

            // origin icon
            svg.append("g")
                .attr("id","pictoLayer")
                .selectAll("use")
                .data(fieldreading)
                .enter()
                .append("use")
                .attr("xlink:href", `#${fieldreading}${iconindex}`)
                .attr("id", function(d) {
                    return "icon" + d;
                })
                .attr("class", (d) => {
                    console.log('icon-class', "icon-" + fieldreading[0] + " source-" + encoding.y.field)
                    return "icon-" + fieldreading[0] + " source-" + encoding.y.field;
                })
                .attr("x", xScale(parseTime(averageData[averageData.length-1].x)))
                .attr("y",yScale(averageData[averageData.length-1].y) - typesizey[0]*0.75)
                .style('fill', colorPair[encoding.y.field])

                //draw legend
                if(props.chartId.indexOf("sugess")<0){       
                    drawLegend([encoding.y.field],textcolor,svg,props.colorPair,width,height,props.changeElementColor)
                }

        
        } else if(linetype === "BarLine"){
            let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
            let iconindex=1;
            if(props.chartId.indexOf("sugess")>0) iconindex=1;
            else iconindex=66

            let scale1=[];
            let width11= 25;

            let typesizex1=svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().width;
            let typesizey1=svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().height;

            svg.select(`#${fieldreading}${iconindex}`)
                .attr("transform", function(){
                let area11=typesizex1*typesizey1;
                let area12=width11*width11;
                scale1.push(Math.sqrt(area12/area11)*iconradiusscale )
                return  `scale(${scale1[0]})`                
            });          

            let typesizex=[];
            let typesizey=[];
            let typex=[];
            let typey=[];
            typesizex.push(svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().width);
            typesizey.push(svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().height);
            typex.push(svg.select(`#${fieldreading}${iconindex}`).node().getBBox().x);
            typey.push(svg.select(`#${fieldreading}${iconindex}`).node().getBBox().y);


            chartHeight = height - 100;
            chartWidth = width ;
            let transHeight = height - chartHeight*10/9;
            let transWidth = (width - chartWidth)/2;

            let chart = svg.append("g"),
            axis = chart.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0,"+ transHeight +")")
                .attr("transform", "translate(" + transWidth +","+ transHeight +")"),
            content = chart.append("g")
                .attr("class", "content")
                .attr("chartWidth", chartWidth)
                .attr("chartHeight", chartHeight)
                .attr("clip-path", "url(#clip-rect)")
                .attr("transform", "translate(" + transWidth +","+ transHeight +")")

            // X channel
            xScale = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return parseTime(d[encoding.x.field]);}))
                .range([0, chartWidth]);
            // Y channel
            yScale = d3.scaleLinear()
                .domain([0, d3.max(data.map(d=>d[encoding.y.field]))])
                .range([chartHeight, 0])
                .nice();

            let tick_format = formatTick(data[0][encoding.x.field])
            let format_TicksCount = formatTicksCount(data[0][encoding.x.field])
            var axisX = d3.axisBottom(xScale)
                    .ticks(format_TicksCount)
                    .tickFormat(tick_format);
            if(format_TicksCount === d3.timeYear) {
                axisX.ticks(format_TicksCount)
            }

            let axisY = d3.axisLeft(yScale);

            let axis_x = axis.append("g")
            .attr("class", "axis_x")
            // .attr('transform', `translate(0, ${chartHeight})`)
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(axisX)
            //.style('display', 'none')
            .attr('xScale', xScale.domain())
            .style('color',textcolor);

            axis_x.selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('color',textcolor);;

            let axis_y = axis.append("g")
            .attr("class", "axis_y")
            .call(axisY)
            // .style('display', 'none')
            .attr('yScale', yScale.domain())
            .style('color',textcolor);

            // line Function
            var lineGen = d3.line()
            .x(function(d) {
                // return xScale(d.x);
                return xScale(parseTime(d.x));
            })
            .y(function(d) {
                return yScale(d.y);
            });
            // .curve(d3.curveBasis);

            //绘制折线
            let sData = {};
            categories.forEach(c => {
                data.forEach(d => {
                    if (d[encoding.x.field] === c) {
                        sData[c] = d[encoding.y.field];
                    }
                })
            });
            var averageData = [];
            Object.keys(sData).forEach(s => {
                averageData.push({
                    x: s,
                    y: sData[s],
                    y0: 0,
                    color: 'overall'
                })
            })
            averageData = averageData.sort(sortByDateAscending)
            let group = content.append('g')
                    .attr('id', 'series_overall')
                    .attr('clip-path', 'url(#clip_overall)');
            group.append('path')
                .attr('d', lineGen(averageData))
                .data([averageData])
                .attr('stroke', colorPair[encoding.y.field])
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('class', 'data-item series_overall');
            group.selectAll('.dot')
                .data(averageData)
                .enter()
                .append('circle')
                .attr("cx", function(d) { return xScale(parseTime(d.x)) }) // parseTime
                .attr("cy", function(d) { return yScale(d.y) })
                .attr("r", 4)
                .style("stroke", colorPair[encoding.y.field])    // set the line colour
                .style('stroke-width', 2)
               .style("fill", colorPair[encoding.y.field])
                .attr('class', 'data-item series_overall');

            
            let X_Index = d3.range(0, averageData.length)
            let offset = 100;
            // origin icon
            svg.append("g")
                .attr("id","pictoLayer")
                .selectAll("use")
                .data(X_Index)
                .enter()
                .append("use")
                .attr("xlink:href", `#${fieldreading}${iconindex}`)
                .attr("id", function(d) {
                    return "icon" + d;
                })
                .attr("class", (d) => {
                    console.log('icon-class', "icon-" + fieldreading[0] + " source-" + encoding.y.field)
                    return "icon-" + fieldreading[0] + " source-" + encoding.y.field;
                })
                .attr("x", function(d,i) {
                    return xScale(parseTime(averageData[i].x)) - typesizex[0]*0.5;
                })
                .attr("y", function(d,i) {
                    return yScale(averageData[i].y) - offset;
                })
                .attr("transform", "translate(" + transWidth +","+ transHeight +")")
                .style('fill', colorPair[encoding.y.field])

            svg.append("g")
                .attr("id","lineGroup")
                .selectAll("line")
                .data(X_Index)
                .enter()
                .append("line")//making a line for legend 
                .attr("id",function(d){ 
                    return "line"+d; 
                })
                .attr("x1", function(d,i) {
                    return xScale(parseTime(averageData[i].x)); //- typesizex[0]*0.5;
                })
                .attr("x2", function(d,i) {
                    return xScale(parseTime(averageData[i].x)); //- typesizex[0]*0.5;
                }) 
                .attr("y1", function(d,i) {
                    return yScale(averageData[i].y) - offset + typesizey[0]*0.5;;
                }) 
                .attr("y2", function(d,i) {
                    return yScale(averageData[i].y);
                }) 
                .attr("transform", "translate(" + transWidth +","+ transHeight +")")
                .style("stroke-dasharray","5,5")//dashed array for line
                .style("stroke", colorPair[encoding.y.field])
                .style('stroke-width', 1.5); 

                //draw legend
                if(props.chartId.indexOf("sugess")<0){       
                    drawLegend([encoding.y.field],textcolor,svg,props.colorPair,width,height,props.changeElementColor)
                }
                
        } else if(linetype === "AreaLine"){

            let iconindex=1;
            if(props.chartId.indexOf("sugess")>0) iconindex=1;
            else iconindex=66
        let scale1=[];
        let width11= 25;

        let typesizexx=svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().width;
        let typesizeyy=svg.select(`#${fieldreading}${iconindex}`).node().getBoundingClientRect().height;

        svg.select(`#${fieldreading}${iconindex}`)
            .attr("transform", function(){
            let area11=typesizexx*typesizeyy;
            let area12=width11*width11;
            scale1.push(Math.sqrt(area12/area11) )
            return  `scale(${scale1[0]})`                
        });   

        chartHeight = height;
        chartWidth = width; 

        // //Process Data
        // let data=props.data;
        // data=getAggregatedRows(data,encoding);
      
        // //Color channel
        // let color;
        // if('color' in encoding){
        //     let colorScale=d3.scaleOrdinal(d3.schemeCategory10);
        //     color=colorScale.domain(data.map(function(d){
        //         return d[encoding.color.field];
        //     }));
        // }


        //Compute the scale
        let pictorialdata=data.map(d=>parseFloat(d[encoding.y.field]));
        let colortype=data.map(d=>d[encoding.x.field]);
        let colorlen=colortype.length;

        let widsizex;
        if(typesizexx<=50) widsizex=width/colorlen/2;
        if(typesizexx>50) widsizex=width/colorlen;
        let maxxsize=widsizex/typesizexx;

        let sum=0;
        let datapercent=[];
        for(let i=0;i<colorlen;i++){
            sum+=pictorialdata[i];
        }
        for(let i=0;i<colorlen;i++){
            datapercent.push(parseFloat((pictorialdata[i]/sum*100).toFixed(1)));
        }
       
        let picdata=[];

        for(let i=0;i<colorlen;i++){
            picdata[i]=parseInt(pictorialdata[i])
        }

       
        let yScale = d3.scaleLinear() 
            .domain([0, d3.max(picdata)])
            .range([0,maxxsize]);
     
        for(let i=0;i<colorlen;i++){
            svg.append("defs")
            .append("g")
            .attr("id",function(){
                let type=iconindex+fieldreading +i
                return `${type}`
            })
            .append("path")
            .attr("d",function(){
                var obj = pictorialtype.find(function (obj) {
                    return obj.name === fieldreading
                })
                return obj.picpath;
            })
            .attr("transform", `scale(${yScale(picdata[i])})`);
            
        }
        
          
        svg.selectAll("use")
        .data(picdata)
        .enter()
        .append("use")
        .attr("xlink:href",function(d,i){
            let type=iconindex+fieldreading + i
            return `#${type}`
        })
        // .attr("class",function(d,i){
        //     return `icon${i}`;
        // }) 
        .attr("class", (d) => {

         //  console.log('icon-class111', d)
            return "icon-" + d + " source-" + d;
        })
        .style("fill",function(d,i){     
            console.log('d-fill', d)       
            return colorPair[d]
        })

        let typesizex=[];
        let typesizey=[];

        for(let i=0;i<colorlen;i++){
             typesizex[i]=svg.select(`.icon${i}`).node().getBoundingClientRect().width;
             typesizey[i]=svg.select(`.icon${i}`).node().getBoundingClientRect().height;
            }
       
        svg.selectAll("use")
           .attr("x", function(d, i) {
              
           let xsum=0;
            let empty=0
            if(typesizexx<50) empty=80;
            else empty=30;
            while(i>0){

                       xsum+=typesizex[--i]+empty;
                   }                     
                return xsum+50;   
        })
          .attr("y", function(d, i) {
              
               return chartHeight - typesizey[i] - (chartHeight-d3.max(typesizey))/2;
                // let j=(d3.max(typesizey)-typesizey[i])/2 //使得所有的中心在一条线上
                // let empty=0;
                // if(typesizeyy<80 && colorlen<5) empty=-50;
              
                // let moveit=1;
                // if(colorlen<=10) moveit=height/(11-colorlen); 
             
                // return j+height/11*4+empty+moveit;
       
       
        })
        svg.selectAll("text")
        .data(pictorialdata)
        .enter()
        .append("text")
        .attr("fill",function(d,i){
            //return color(colortype[i]);
            return textcolor;
        })
        .attr("x",function(d, i) {
              
            let xsum=0;
            let empty=0
            let textx=0;
            if(typesizexx<50) empty=80;
            else empty=30;
            let record=typesizex[i]/3;
            while(i>0){
                xsum+=typesizex[--i]+empty;
            }   
         
            if(typesizexx>70) textx=60;
            if(typesizexx<30) textx=100;
            if(typesizexx>30&&typesizexx<40) textx=80;
            if(typesizexx>40&&typesizexx<70) textx=70;
              return xsum+record+textx;
     })

        .attr("y", function(d, i) {
        let empty=0;
        let empty1=0;
        if(typesizexx<50) empty=-20;
        if(typesizeyy<80 && colorlen<5) empty1=-50;
        let moveit=1;
        if(colorlen<=10) moveit=height/(11-colorlen); 
        return height/12*5+d3.max(typesizey)+50+empty+empty1+moveit;

    })
        .text(function(d){
            return d.toFixed(1);
        })

        
        }

    
    // console.log('dataSeriesCategories', dataSeriesCategories);
    // console.log('dataSeries', dataSeries);
    // console.log('series', series); // color 

    // let chart = svg.append("g"),
    //     axis = chart.append("g")
    //         .attr("class", "axis"),
    //     content = chart.append("g")
    //         .attr("class", "content")
    //         .attr("chartWidth", chartWidth)
    //         .attr("chartHeight", chartHeight)
    //         .attr("clip-path", "url(#clip-rect)"),
    //     legend = svg.append("g")
    //         .attr("transform", `translate(0, ${chartHeight + 60})`);

    // let tick_format = formatTick(data[0][encoding.x.field])
    // let format_TicksCount = formatTicksCount(data[0][encoding.x.field])
    // var axisX = d3.axisBottom(xScale)
    //             .ticks(format_TicksCount)
    //             .tickFormat(tick_format);
    // if(format_TicksCount === d3.timeYear) {
    //     axisX.ticks(format_TicksCount)
    // }

    // let axisY = d3.axisLeft(yScale);

    // let axis_x = axis.append("g")
    //     .attr("class", "axis_x")
    //     .attr('transform', `translate(0, ${chartHeight})`)
    //     .call(axisX)
    //     //.style('display', 'none')
    //     .attr('xScale', xScale.domain())
    
    // axis_x.selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");
        
    // let axis_y = axis.append("g")
    //     .attr("class", "axis_y")
    //     .call(axisY)
    //    // .style('display', 'none')
    //     .attr('yScale', yScale.domain());

    // // line Function
    // var lineGen = d3.line()
    //     .x(function(d) {
    //         // return xScale(d.x);
    //         return xScale(parseTime(d.x));
    //     })
    //     .y(function(d) {
    //         return yScale(d.y);
    //     });

    // Origin is set
    if (series.length > 0) {
        // let preparedData = {}
        // series.forEach((s) => {
        //     let sData = [];
        //     categories.forEach(c => { // each x value 
        //         sData.push({
        //             x: c,
        //             y: dataSeriesCategories[s][c]?dataSeriesCategories[s][c]:0,
        //             y0: 0,
        //             color: s
        //         })
        //     });
        //     sData = sData.sort(sortByDateAscending);
        //     preparedData[s] = sData;
        // })
        // var allGroup = content.append('g')
        //                 .attr('id', 'allLine')
        // for (let index = 0; index < series.length; index++) {
        //     console.log('line',series[index])
        //     var group = allGroup.append('g')
        //         .attr('id', 'series_' + series[index])
        //         .attr('clip-path', 'url(#clip_'+series[index]+')');
        //     group.append('path')
        //         .data([preparedData[series[index]]])
        //         .attr('d', lineGen(preparedData[series[index]]))
        //         .attr('stroke', colorset[color(series[index])])
        //         .attr('stroke-width', 2)
        //         .attr('fill', 'none')
        //         .attr('class', 'data-item series_' +series[index]);
        //     group.selectAll('.dot')
        //         .data(preparedData[series[index]])
        //         .enter()
        //         .append('circle')
        //         .attr("cx", function(d) { return xScale(parseTime(d.x)) }) // parseTime
        //         .attr("cy", function(d) { return yScale(d.y) })
        //         .attr("r", 4)
        //         .style("stroke", colorset[color(series[index])])    // set the line colour
        //         .style('stroke-width', 2)
        //         .style("fill", cardcolor)
        //         .attr('class', 'data-item series_' + series[index]);
                
        // }
        // // display legend
        // var legends = legend.selectAll("legend_color")
        //         .data(series)
        //         .enter()
        //         .append("g")
        //         .attr("class", "legend_color")
        //         .attr('transform', (d, i) =>`translate(${10}, 0)`);//`translate(${i*(80 + 10) + (chartWidth - (series.length * 80 + (series.length - 1) * 10)) / 2}, 0)`);
        // legends.append("circle")
        //         .attr("fill", 'none')
        //         .attr('stroke-width', 2)
        //         .attr('stroke', (d, i) => colorset[i])
        //         .attr("r", 4)
        //         .attr("cy", -5);
        //         // .attr('y', -7)
        //         // .attr("width", '30px')
        //         // .attr('height', '3px')
        //         // .attr("rx", 1.5)
        //         // .attr("ry", 1.5)
        //         // .attr("cy", -5);
        // legends.append("text")
        //         .attr("fill", textcolor)
        //         .attr("x", 10) //35
        //         .text(d => d)
        //         .style('font-family', 'Arial');
        // let legend_nodes=legends.nodes();
        // let before = legend_nodes[0];
        // let current;
        // let offset = 10;

        // for(let i = 1; i< legend_nodes.length; i++){
        //     current = legend_nodes[i];
        //     if(d3.select(before).select("text").node().getComputedTextLength()){
        //         offset += d3.select(before).select("text").node().getComputedTextLength();
        //     }else{
        //         offset += getWidth(series[i-1])
        //     } 
        //     d3.select(current)
        //         .attr('transform', `translate(${i*30 + offset}, 0)`);
        //     before = current;
        // }
        // if(legend.node().getBBox().width){
        //     legend.attr("transform", `translate(${(chartWidth - legend.node().getBBox().width)/2}, ${chartHeight + 60})`);
        // }else{
        //     offset += getWidth(series[series.length-1]);
        //     legend.attr("transform", `translate(${(chartWidth - offset - 30 * series.length + 20)/2}, ${chartHeight + 60})`);
        // }
    } else {
        // 单条line
    //     let sData = {};
    //     categories.forEach(c => {
    //         data.forEach(d => {
    //             if (d[encoding.x.field] === c) {
    //                 sData[c] = d[encoding.y.field];
    //             }
    //         })
    //     });
    //     var averageData = [];
    //     Object.keys(sData).forEach(s => {
    //         averageData.push({
    //             x: s,
    //             y: sData[s],
    //             y0: 0,
    //             color: 'overall'
    //         })
    //     })
    //     averageData = averageData.sort(sortByDateAscending)
    //     let group = content.append('g')
    //             .attr('id', 'series_overall')
    //             .attr('clip-path', 'url(#clip_overall)');
    //     group.append('path')
    //         .attr('d', lineGen(averageData))
    //         .data([averageData])
    //         .attr('stroke', colorset[1])
    //         .attr('stroke-width', 2)
    //         .attr('fill', 'none')
    //         .attr('class', 'data-item series_overall');
    //     group.selectAll('.dot')
    //         .data(averageData)
    //         .enter()
    //         .append('circle')
    //         .attr("cx", function(d) { return xScale(parseTime(d.x)) }) // parseTime
    //         .attr("cy", function(d) { return yScale(d.y) })
    //         .attr("r", 4)
    //         .style("stroke", colorset[1])    // set the line colour
    //         .style('stroke-width', 2)
    //         .style("fill", cardcolor)
    //         .attr('class', 'data-item series_overall');
    // }

    // // Style
    // // const style = props.spec.style;
    // if (!_.isEmpty(style)) {
    //     if (style.showAxisX) {
    //         axis_x.style('display', 'inline')
    //     //     svg.append("g")
    //     //         .attr("transform", "translate(0," + height + ")")
    //     //         .call(d3.axisBottom(x))
    //     //         .selectAll("text")
    //     //         .attr("transform", "translate(-10,0)rotate(-45)")
    //     //         .style("text-anchor", "end");
    //     }
    //     if (style.showAxisY) {
    //         axis_y.style('display', 'inline')
    //     //     svg.append("g").call(d3.axisLeft(y));

    //     }
    //   //  if (style.showGrid) {
    //         axis_x.selectAll('line')
    //             .attr("opacity", 0.4)
    //             .attr("y2", -chartHeight)
    //             .attr("stroke-dasharray","5,0");
    //         axis_y.select('path')
    //             .attr("opacity", 0.4)
    //             .attr("stroke-dasharray","5,0");
    //         axis_y.selectAll('line')
    //             .attr("opacity", 0.4)
    //             .attr("x2", chartWidth)
    //             .attr("stroke-dasharray","5,0");
    //   //  }

    //     svg.selectAll(".domain")
    //     .attr("stroke",textcolor);
    //     svg.selectAll("text")
    //     .attr("stroke",textcolor);
    //     svg.selectAll("line")
    //     .attr("stroke",textcolor);
        
    }

    let ssscale;
    if(props.chartId.indexOf("sugess")>0){
        ssscale=0.25;
        margin = { top: width/20, right: width/12, bottom: width/15, left: width/25};
    }else{
        ssscale=1;
        margin = { top: width/15, right: width/4, bottom: width/4, left: width/6 };
    }

     d3.selectAll(`.${svgg}`)
       // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"scale("+ssscale+")");

    return svg;

}

export default draw;