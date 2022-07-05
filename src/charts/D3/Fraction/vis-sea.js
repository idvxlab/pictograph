import * as d3 from 'd3';
import { getCategories, getAggregatedRows, getWidth } from './helper';
import _ from 'lodash';
import Color from '@/constants/Color';
import pictorialtype from '../../../pictorialTypeDict';
import {drawLegend,outRepeat} from '../drawLegend'
import { rgb } from 'd3';



const draw = (props) => {
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
            darkColor = 'rgb(174,179,185)';
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

/*****************************************************************************************/
    if(typepie==="picstacked"){

        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let iconindex="suggess-" + 'ps';
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-" + 'ps';
        else iconindex="canvas-" + 'ps';
        svg.append("defs")
        .append("g")
        .attr("id",function(){
            if(props.chartId.indexOf("sugess")>0)  return `suggess-` + 'ps' +`${pictogram}`;
            else return `canvas-`+'ps'+`${pictogram}`
        })
        .append("path")
        .attr("d",function(){
            return pictorialtype[pictogram]
        })
        .attr("stroke","none")
        .attr("stroke-width","1px")
 
    let typesizex1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
    let typesizey1=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
    let scale1;
    svg.select(`#${iconindex}${pictogram}`)
    .attr("transform", function(){     
        let area11=typesizex1*typesizey1;
        let area12=250*250;               
        scale1=Math.sqrt(area12/area11) 
        return  `scale(${scale1/4*props.size.w})` 
        // scale1=width/2/typesizex1;
        // return  `scale(${scale1})` 
  });    


    let typesizex=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
    let typesizey=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
    let typex=svg.select(`#${iconindex}${pictogram}`).node().getBBox().x;
    let typey=svg.select(`#${iconindex}${pictogram}`).node().getBBox().y;
    //let typesizey=svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;

    //Append pictogram
    svg.append("g")
    .attr("id","pictoLayer")
    .append("use")
    .attr("xlink:href",`#${iconindex}${pictogram}`)
    .attr("class",function(d,i){
        return "icon-"+pictogram + ' ' + "source-" + encoding.size.field
            
    })
    .attr("id",pictogram)
    .attr("x",-Math.abs(typex*scale1)-50)
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
    .attr("id","iconPicStack")
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
    .style("fill",function(d){
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
        return "url(#iconPicStack)";
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
           return -25+typesizex ;

        })
        .attr("y1",function(){
             return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200;
  
        })
        .attr("x2",function(){
            return 25+typesizex ;
        })
        .attr("y2",function(){
            return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200;
       
        })
        .style("stroke","grey")
        .attr("stroke-dasharray","2 2")

        svg.append("text")
       // .attr("direction","rtl")
        .attr("x",function(){
            return  30+typesizex 
        })
        .attr("y",function(){
            return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200+4;
        })
        .attr("fill",function(){
           // return color(colortype[i]);
           return "grey"
        })
        .style("font-family", textfont)
        .attr("font-weight","bold")
        .attr("font-size",20)
        .text(`${categories[i]}`);

        svg.append("text")
        //.attr("direction","rtl")
        .attr("x",function(){
           return  35+typesizex+categoriesTextMax*2.1
        })
        .attr("y",function(){
            return height/2+typesizey/2-typesizey*sumpercent[i]/100+typesizey*datapercent[i]/200+4;
        })
        .style("font-family", textfont)
        .attr("fill",function(){
            //return color(colortype[i]);
            return "grey"
        })
        .attr("font-size",18)
        .text(`${datapercent[i].toFixed(1)}%`);


        }

        if(props.chartId.indexOf("sugess")<0){       
            drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor, textfont)
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
    let gradientM=svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id","icon1")
    .attr("x1","0")
    .attr("y1", "0")
    .attr("x2","1")
    .attr("y2", "0")
    .attr("spreadMethod","pad");

    //Define the gradient colors
    gradientM.append("svg:stop")
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
            gradientM.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[categories[i]];
            })
            .attr("stop-opacity",1);
            gradientM.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[categories[i+1]];
            })
            .attr("stop-opacity",1);

        }
        gradientM.append("svg:stop")
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

    let iconindex="suggess-"+"fm";
    if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"fm";
    else iconindex="canvas-"+"fm"

    svg.append("defs")
    .selectAll("g")
    .data(categoriesreading)
    .enter()
    .append("g")
    .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `suggess-`+"fm"+`${d}`;
        else return `canvas-`+"fm"+`${d}`
    })
    .append("path")
    .attr("d",function(d){
        return pictorialtype[d]; 
    })

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
    .style("fill",function(d,i) {
        console.log('iconcolor---', iconcolor)
        return iconcolor
    })
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
        .style("font-family",textfont)
        .attr("font-size",16*iconradiusscale)
        .attr("text-anchor","middle")   //文字居中
        .text((d,i)=>`${d.toFixed(1)}%`);

        if(props.chartId.indexOf("sugess")<0){       
            drawLegend(categoriescolor,textcolor,svg,props.colorPair,width,height,props.changeElementColor,textfont)
        }
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