import * as d3 from 'd3';
import {
    getCategories,
    getAggregatedRows,
    getWidth
} from './helper';
import _ from 'lodash';
import {
    selectAll
} from 'd3-selection';
import {
    read
} from 'fs';
import {
    range
} from 'd3/node_modules/d3-array';
import pictorialtype from '../../../pictorialTypeDict';
import {
    drawLegend,
    outRepeat
} from '../drawLegend'



const draw = (props) => {
    let a = document.createElement("div");

    if (!props.onCanvas) {
        d3.select('.' + props.chartId + '>*').remove();
        a = '.' + props.chartId;
    }

    //默认卡片背景
    let cardcolor;
    let textcolor = props.textcolor;
    let textfont = props.textfont;
    // let iconcolor = props.iconcolor;
    let iconcolor = '#fff';
    let colorset = props.colormap;
    const colorPair = props.colorPair;
    let gradientcolor = props.cardcolor;
    let fieldsreading = props.fieldsreading;

    let pictogram = fieldsreading; //field name
    console.log('pictogram', pictogram);
    let styletype = props.stylelayout;
    console.log('styletype',styletype);

    

    // const width = props.width - margin.left - margin.right+150 ;
    // const height = props.height - margin.top - margin.bottom - 80;

    // let margin = { top: 10, right: 10, bottom:10, left:10 };
    // const width = 500/4*props.size.w;
    // const height = 500/4*props.size.h;
    var margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    const width11 = props.width - margin.left - margin.right - 20;
    const height11 = props.height - margin.top - margin.bottom - 20 - 40;
    var width = width11 / 4 * props.size.w;
    var height = height11 / 4 * props.size.h;

    let sscale;
    let svgg;
    if (props.chartId.indexOf("sugess") > 0) {
        sscale = 1;
        svgg = "suggess";
        margin = {
            top: width / 20,
            right: width / 12,
            bottom: width / 15,
            left: width / 25
        };
    } else {
        sscale = 1;
        svgg = "canvas";
        margin = {
            top: width / 15,
            right: width / 4,
            bottom: width / 4,
            left: width / 6
        };
        // margin = { top: 10, right: 10, bottom:10, left:10 };
    }

    let svg = d3.select(a)
        .append("center")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 40)
        .style('background-color', cardcolor)
        .append("g")
        .attr("class", `${svgg}`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" + "scale(" + sscale + ")");
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // .attr("viewBox", "0 0 100 100");

    //Define the gradient
    let gradientMM=svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id","icon")
    .attr("x1","0")
    .attr("y1", "0")
    .attr("x2","1")
    .attr("y2", "0")
    .attr("spreadMethod","pad");


    // Encoding
    const encoding = props.spec.encoding;

    if (_.isEmpty(encoding) || !('size' in encoding) || _.isEmpty(encoding.size) || !('color' in encoding) || _.isEmpty(encoding.color)) {

        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "pink");
        return svg;
    }

    function titleCase(str) {
        var arr = str.toLowerCase().split(" ");
        for (var i = 0; i < arr.length; i++) {

            arr[i] = arr[i].replace(arr[i].charAt(0), arr[i].charAt(0).toUpperCase());

        }
        return arr.join(" ");
    }

    /***********************************************************************************/
    if (styletype === "unit") {
        let iconradiusscale = props.size.w > props.size.h ? props.size.h / 4 : props.size.w / 4
        let iconindex = 'm' + '2';
        if (props.chartId.indexOf("sugess") > 0) iconindex = 'm' + '2';
        else iconindex = 'm' + '666'

        svg.append("defs")
            .append("g")
            .attr("id", function () {
                if (props.chartId.indexOf("sugess") > 0) {
                    console.log('id---', `${pictogram}2`)
                    return `${pictogram}` + 'm' + '2'
                } else return `${pictogram}` + 'm' + '666'
            })
            .append("path")
            .attr("d", function () {
                return pictorialtype[pictogram];
            })
        console.log('select---', `#${pictogram}${iconindex}`)
        let typesizexx = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
        let typesizeyy = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;

        let area11 = typesizexx * typesizeyy;
        let area12 = 20 * 20 * sscale * sscale
        let scaleorign = Math.sqrt(area12 / area11)
        let scale1;
        svg.select(`#${pictogram}${iconindex}`)
            .attr("transform", function () {
                scale1 = Math.sqrt(area12 / area11) * iconradiusscale
                return `scale(${scale1})`
            })

        let typesizex = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
        let typesizey = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;
        let typex = svg.select(`#${pictogram}${iconindex}`).node().getBBox().x;
        let typey = svg.select(`#${pictogram}${iconindex}`).node().getBBox().y;

        //specify the number of columns and rows for pictogram layout
        let numCols = 10;
        let numRows = 10;

        //padding for the grid
        let xPadding = 10;
        let yPadding = 15;

        //horizontal and vertical spacing between the icons
        let hBuffer = 30 * iconradiusscale //30;
        let wBuffer = 45 * iconradiusscale //45;

        //generate a d3 range for the total number of required elements
        let myIndex = d3.range(numCols * numRows);

        svg.append("g")
            .attr("id", "pictoLayer")
            .selectAll("use")
            .data(myIndex)
            .enter()
            .append("use")
            .attr("xlink:href", `#${pictogram}${iconindex}`)
            .attr("id", function (d) {
                return "icon" + d;
            })
            .attr("x", function (d) {
                let remainder = d % numCols; //calculates the x position (column number) using modulus
                return width / 12 + xPadding + (remainder * wBuffer) - Math.abs(typex * scale1); //apply the buffer and return value
            })
            .attr("y", function (d) {
                let whole = Math.floor(d / numCols) //calculates the y position (row number)
                return height / 8 + yPadding + (whole * (typesizey + 10)) - Math.abs(typey * scale1); //apply the buffer and return the value
            })
            // .classed("iconPlain", true)
            .attr("class", function (d, i) {
                return "iconPlain";
                // return "icon-"+ pictogram + ' ' + "source-" + encoding.size.field + ' ' + 'iconPlain';
            });



        // Process Data
        // const data = props.data;
        let data = props.data;
        data = getAggregatedRows(data, encoding);
        //Get categories
        let dataCategories = getCategories(data, encoding);
        let categories = Object.keys(dataCategories);

        //Color channel
        let color;
        if ('color' in encoding) {
            // let colorScale=d3.scaleOrdinal(d3.schemeCategory10);
            let colorScale = d3.scaleOrdinal(colorset);
            color = colorScale.domain(data.map(function (d) {
                return d[encoding.color.field];
            }));
        }


        //Compute the percent

        let pictorialdata = data.map(d => parseFloat(d[encoding.size.field]));
        let colortype = data.map(d => d[encoding.color.field]);
        // console.log(colortype);


        let datalen = colortype.length;

        let sum = 0;
        let datapercent = [];
        for (let i = 0; i < datalen; i++) {
            sum += pictorialdata[i];
        }
        for (let i = 0; i < datalen; i++) {
            datapercent.push(Math.ceil(pictorialdata[i] / sum * 100));
        }

        d3.selectAll(".iconPlain")
            .style("fill", function (d) {
                let nowsum = 0;
                for (let i = 0; i < datalen; i++) {
                    if (d >= nowsum && d < datapercent[i] + nowsum) {
                        console.log('colorPair[colortype[i]]', colorPair[colortype[i]]);
                        return colorPair[colortype[i]];
                    } else {
                        nowsum += datapercent[i];
                        continue;
                    }

                }
            })
            .attr("class", function (d) {
                let nowsum = 0;
                for (let i = 0; i < datalen; i++) {
                    if (d >= nowsum && d < datapercent[i] + nowsum) {
                        return "icon-" + pictogram + ' ' + "source-" + encoding.size.field + ' ' + "icon" + i;
                        // return "icon"+i;
                    } else {
                        nowsum += datapercent[i];
                        continue;
                    }

                }

            });
        //legend
        const legend = svg.append("g");
        var legends = legend.selectAll("legend_color")
            .data(categories)
            .enter()
            .append("g")
            .attr("class", function () {
                return "icon-" + pictogram + ' ' + "source-" + encoding.size.field + ' ' + "legend_color";
            })
            .attr('transform', (d, i) => `translate(${-15},${-height/3})`);

        // legends.append("rect")
        // .attr("fill",d=>color(d))
        // .attr('x',15)
        // .attr('y',-10)
        // .attr("width","10px")
        // .attr("height","10px")
        // .attr("rx",1.5)
        // .attr("ry",1.5);

        legends.append("use")
            .attr("xlink:href", `#${pictogram}${iconindex}`)
            .style("fill", d => colorPair[d])
            .attr("x", function (d) {
                return 15 - Math.abs(typex * scale1);
            })
            .attr("y", function (d) {
                return -15 - Math.abs(typey * scale1);
            })


        legends.append("text")
            .attr("fill", textcolor)
            .style("font-family", textfont)
            .style("font-size", "14px")
            .attr("x", 40)
            .text(d => d);

        let legend_nodes = legends.nodes();
        let before = legend_nodes[0];
        let current;
        let offset = -15;

        for (let i = 1; i < legend_nodes.length; i++) {
            current = legend_nodes[i];
            if (d3.select(before).select("text").node().getComputedTextLength()) {
                offset += d3.select(before).select("text").node().getComputedTextLength();
            } else {
                offset += getWidth(categories[i - 1])
            }
            d3.select(current)
                .attr("transform", `translate(${i*30+offset},${-height/3})`);
            before = current;
        }
        if (legend.node().getBBox().width) {
            legend.attr("transform", `translate(${(width-legend.node().getBBox().width)/2+20},${height+140})`);

        } else {
            offset += getWidth(categories[categories.length - 1]);
            legend.attr("transform", `translate(${(width - offset - 30 * categories.length + 20)/2}, ${height + 140})`);
        }

        //legend
        let categoriescolor = outRepeat(data.map(d => (d[encoding.color.field]))); //categories或者series已经做了判断
        if (props.chartId.indexOf("sugess") < 0) {
            drawLegend(categoriescolor, textcolor, svg, props.colorPair, width, height, props.changeElementColor, textfont)
        }



    }

    /*******************************************************************************/
    else if (styletype === "unit2") {
        let iconradiusscale = props.size.w > props.size.h ? props.size.h / 4 : props.size.w / 4
        let numerator; //分子
        let denominator; //分母
        function decimalsToFractional(decimals) {
            const formatDecimals = decimals.toFixed(1)
            denominator = 10 //初始化分母
            numerator = formatDecimals * 10 //初始化分子
            let bigger = 0

            function recursion() {
                bigger = denominator > numerator ? denominator : numerator
                for (let i = bigger; i > 1; i--) {
                    if (
                        Number.isInteger(numerator / i) &&
                        Number.isInteger(denominator / i)) {
                        numerator = numerator / i
                        denominator = denominator / i
                        recursion()
                    }
                }
            }
            recursion()
            return `${numerator}/${denominator}`
        }

        //Process Data
        let data = props.data;
        data = getAggregatedRows(data, encoding);

        //Get categories
        let dataCategories = getCategories(data, encoding);
        let categories = Object.keys(dataCategories);


        //Color channel
        let color;
        if ('color' in encoding) {
            let colorScale = d3.scaleOrdinal(colorset);
            color = colorScale.domain(data.map(function (d) {
                return d[encoding.color.field];
            }));
        }

        //Compute the percent
        let pictorialdata = data.map(d => parseFloat(d[encoding.size.field]));
        let colortype = data.map(d => d[encoding.color.field]);

        let colorlen = colortype.length;

        let pictorialpercent;

        pictorialpercent = pictorialdata[0] / d3.sum(pictorialdata);
        decimalsToFractional(pictorialpercent)

        function toRGB(color) {
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


        let darkColor = [];
        console.log('gradientcolor', gradientcolor);
        let rgb = toRGB(gradientcolor);
        console.log('rgb', rgb);
        rgb = rgb.replace("RGB(", "");
        rgb = rgb.replace(")", "");
        let arr = rgb.split(',');
        console.log('arr', arr);
        let luminance = (0.299 * arr[0] + 0.587 * arr[1] + 0.114 * arr[2]);
        console.log('luminance', luminance);
        if (luminance < 150) {
            for (let i = 0; i < colorlen; i++) {
                let c = d3.hsl(d3.rgb(colorset[i]));
                let defaultcolor_hsl = d3.hsl(c.h, c.s * 0.1, c.l * 0.5);
                let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
                let defaultcolor = "rgb(" + parseInt(defaultcolor_rgb.r) + "," + parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                darkColor[i] = defaultcolor;
                // let r = parseInt((32+parseInt(arr[0]))/2);
                // let g = parseInt((32+parseInt(arr[1]))/2);
                // let b = parseInt((32+parseInt(arr[2]))/2);
                // console.log('rgb',r,g,b)
                // darkColor[i] = 'rgb(' + r + ',' + g + ',' + b + ')';
            }
        } else {
            for (let i = 0; i < colorlen; i++) {
                //             let c = d3.hsl(d3.rgb(colorset[i]));
                //             let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
                //             let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
                //             let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                darkColor[i] = 'rgb(238,238,238)';
            }
        }


        //   let darkColor = [];
        //   darkColor.push('rgb(238,238,238)');
        //   for(let i=0;i<colorlen;i++){
        //               let c = d3.hsl(d3.rgb(colorset[i]));
        //               let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
        //               let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
        //               let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
        //               darkColor[i] = defaultcolor;
        //           }

        let iconindex = 'm' + '1';
        if (props.chartId.indexOf("sugess") > 0) iconindex = 'm' + '1';
        else iconindex = 'm' + '66'

        svg.append("defs")
            .append("g")
            .attr("id", function () {
                if (props.chartId.indexOf("sugess") > 0) return `${pictogram}` + 'm' + '1'
                else return `${pictogram}` + 'm' + '66'
            })
            .append("path")
            .attr("d", function () {
                // console.log('pictorialtype[pictogram]',pictorialtype[pictogram]);
                return pictorialtype[pictogram];
            })

        let typesizex1 = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
        let typesizey1 = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;
        let scale1;
        svg.select(`#${pictogram}${iconindex}`)
            .attr("transform", function () {
                let area11 = typesizex1 * typesizey1
                let area12 = 770 * 3 / 2.5
                scale1 = Math.sqrt(area12 / area11) * iconradiusscale
                // scale1.push(x.bandwidth()/typesizey1)
                return `scale(${scale1})`


            });

        let typesizex = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().width;
        let typesizey = svg.select(`#${pictogram}${iconindex}`).node().getBoundingClientRect().height;
        let typex = svg.select(`#${pictogram}${iconindex}`).node().getBBox().x;
        let typey = svg.select(`#${pictogram}${iconindex}`).node().getBBox().y;

        //specify the number of columns and rows for pictogram layout
        let numCols = denominator;
        let numRows = 1;

        //padding for the grid
        let xPadding = 10;
        //let yPadding = 15;

        //horizontal and vertical spacing between the icons
        //let hBuffer = 30;
        let wBuffer = typesizex + 10;
        let myIndex = d3.range(numCols * numRows);

        svg.append("g")
            .attr("id", function () {
                return "icon" + colortype[0];
            })
            .selectAll("use")
            .data(myIndex)
            .enter()
            .append("use")
            .attr("xlink:href", `#${pictogram}${iconindex}`)
            .attr("id", function (d) {
                return "icon" + d;
            })
            .attr("x", function (d) {
                let remainder = d % numCols; //calculates the x position (column number) using modulus
                return width / denominator + 20 + xPadding + (remainder * wBuffer) - Math.abs(typex * scale1); //apply the buffer and return value
            })
            .attr("y", function (d) {
                return height / 2 - 30; //apply the buffer and return the value
            })
            // .classed("iconPlain", true);
            //   .attr("class",function(){
            //       return `icontype${iconindex}`;
            //   })
            .attr("class", function (d, i) {
                return "icon-" + pictogram + ' ' + "source-" + encoding.size.field + ' ' + `icontype${iconindex}`;
            });

        svg.append("text")
            .attr("x", width / denominator + 20 + xPadding + numCols / 2 * wBuffer)
            .attr("y", height / 2 - 53)
            .attr("fill", colorPair[colortype[0]])
            .attr("font-size", 40 * iconradiusscale)
            .attr('text-anchor', "middle")
            .attr('font-weight', 'bold')
            .style("font-family", textfont)
            .style("font-size", "14px")
            .text(`${numerator} in ${denominator}`);




        //Fill the color

        d3.selectAll(`.icontype${iconindex}`)
            .style("fill", function (d) {

                if (d <= numerator - 1) {

                    return colorPair[colortype[0]];

                } else {
                    return darkColor[0];
                    //return "#9e9e9e";
                }
            });

        //legend
        if (props.chartId.indexOf("sugess") < 0) {
            drawLegend([colortype[0]], textcolor, svg, props.colorPair, width, height, props.changeElementColor, textfont)
        }
    }

    /*******************************************************************************/
    else if (styletype === "percent2") {
        console.log('percent222')
        let iconradiusscale = props.size.w > props.size.h ? props.size.h / 4 : props.size.w / 4
        let iconindex = "suggess-" + "p" + "2";
        if (props.chartId.indexOf("sugess") > 0) iconindex = "suggess-" + "p" + "2";
        else iconindex = "canvas-" + "p" + "2";

        svg.append("defs")
            .append("g")
            .attr("id", function () {
                if (props.chartId.indexOf("sugess") > 0) return `suggess-` + "p" + "2" + `${pictogram}`
                else return `canvas-` + "p" + "2" + `${pictogram}`
            })
            .append("path")
            .attr("d", function () {
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === pictogram
                // })
                // return obj.picpath; 
                return pictorialtype[pictogram]
            })

        let typesizex1 = svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
        let typesizey1 = svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;

        let scale1;
        svg.select(`#${iconindex}${pictogram}`)
            .attr("transform", function () {
                let area11 = typesizex1 * typesizey1
                let area12 = 770
                scale1 = Math.sqrt(area12 / area11) * iconradiusscale
                // scale1.push(x.bandwidth()/typesizey1)
                return `scale(${scale1})`
            });
        //specify the number of columns and rows for pictogram layout
        let numCols = 10;
        let numRows = 1;

        //padding for the grid
        let xPadding = 10;
        //let yPadding = 15;

        //horizontal and vertical spacing between the icons
        //let hBuffer = 30;
        let wBuffer = (typesizex1 * 4 / 3) * scale1;

        //generate a d3 range for the total number of required elements
        let myIndex = d3.range(numCols * numRows);

        //Process Data
        let data = props.data;
        data = getAggregatedRows(data, encoding);


        //Compute the percent
        let pictorialdata = data.map(d => parseFloat(d[encoding.size.field]));
        let categoriescolor = data.map(d => d[encoding.color.field]);

        let colorlen = categoriescolor.length;
        if (colorlen > 6) {
            colorlen = 6;
            categoriescolor = categoriescolor.slice(0, 6)
        }
        let scaley1 = d3.scaleBand()
            .range([30, height - 50])
            .domain(d3.range(colorlen))

        // Define the gradient
        let gradient2 = [];
        for (let i = 0; i < colorlen; i++) {
            gradient2[i] = svg.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", function () {
                    return "icontype1" + i;
                })
                .attr("spreadMethod", "pad");

            // Define the gradient colors
            gradient2[i].append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", function () {
                    return colorPair[categoriescolor[i]];
                })
                .attr("stop-opacity", 1);
        }

        let total = numCols * numRows;
        let valuePict = [];
        let valueDecimal = [];
        let pictorialdatamax=d3.max(pictorialdata);
        // let pictorialdatamax = 1;
        for (let i = 0; i < colorlen; i++) {
            // valuePict[i]=total*(datapercent[i]/100);
            valuePict[i] = (pictorialdata[i] * total / pictorialdatamax).toFixed(1);

            valueDecimal[i] = (valuePict[i] % 1);

        }

        for (let i = 0; i < colorlen; i++) {
            //let typeindex=i*60;
            svg.append("g")
                .attr("id", function () {
                    return "icon" + categoriescolor[i];
                })
                .selectAll("use")
                .data(myIndex)
                .enter()
                .append("use")
                .attr("xlink:href", `#${iconindex}${pictogram}`)
                .attr("id", function (d) {
                    return "icon" + d;
                })
                .attr("x", function (d) {
                    let remainder = d % numCols; //calculates the x position (column number) using modulus
                    return width / 15 + 30 + xPadding + (remainder * wBuffer); //apply the buffer and return value
                    // return width/15+20+xPadding + (remainder * wBuffer); //apply the buffer and return value
                })
                .attr("y", function (d) {
                    return scaley1(i); //apply the buffer and return the value
                })
                .attr("class", function () {
                    return "icon-" + pictogram + ' ' + "source-" + encoding.size.field + ' ' + "icontypeP2" + i;
                });


            svg.append("text")
                .attr("x", 40)
                .attr("y", 23 + scaley1(i))
                .style("font-family", textfont)
                .attr("fill", colorPair[categoriescolor[i]])
                .style("font-size", "14px")
                // .attr("font-size",20*iconradiusscale)
                .attr('text-anchor', "end")
                .text(titleCase(categoriescolor[i]));

            svg.append("text")
                .attr("x", width + 20)
                .attr("y", 23 + scaley1(i))
                .style("font-family", textfont)
                .style("font-size", "14px")
                .attr("fill", colorPair[categoriescolor[i]])
                // .attr("font-size",20*iconradiusscale)
                .attr('text-anchor', "middle")
                .text("| " + pictorialdata[i].toFixed(1));
        }


        //Fill the color
        function toRGB(color) {
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


        let darkColor = [];
        let rgb = toRGB(gradientcolor);
        rgb = rgb.replace("RGB(", "");
        rgb = rgb.replace(")", "");
        let arr = rgb.split(',');
        let luminance = (0.299 * arr[0] + 0.587 * arr[1] + 0.114 * arr[2]);
        if (luminance < 150) {
            for (let i = 0; i < colorlen; i++) {
                let c = d3.hsl(d3.rgb(colorset[0]));
                let defaultcolor_hsl = d3.hsl(c.h, c.s * 0.1, c.l * 0.5);
                let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
                let defaultcolor = "rgb(" + parseInt(defaultcolor_rgb.r) + "," + parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                darkColor[i] = defaultcolor;

                // let r = parseInt((32+parseInt(arr[0]))/2);
                // let g = parseInt((32+parseInt(arr[1]))/2);
                // let b = parseInt((32+parseInt(arr[2]))/2);
                // console.log('rgb',r,g,b)
                // darkColor[i] = 'rgb(' + r + ',' + g + ',' + b + ')';
            }
        } else {
            for (let i = 0; i < colorlen; i++) {
                //             let c = d3.hsl(d3.rgb(colorset[i]));
                //             let defaultcolor_hsl = d3.hsl(c.h ,c.s*0.1, c.l*0.5);
                //             let defaultcolor_rgb = d3.rgb(defaultcolor_hsl);
                //             let defaultcolor = "rgb("+ parseInt(defaultcolor_rgb.r) + ","+ parseInt(defaultcolor_rgb.g) + "," + parseInt(defaultcolor_rgb.b) + ")";
                // darkColor[i] = 'rgb(238,238,238)';
                let temp = colorPair[categoriescolor[i]].replace("rgb", "rgba");
                darkColor[i] = temp.split(")")[0] + ",0.3)";
            }
        }


        for (let i = 0; i < colorlen; i++) {
            d3.selectAll(".icontypeP2" + i)
                // .attr("fill", function(d) {
                .style("fill", function (d) {

                    if (d <= valuePict[i] - 1) {

                        return colorPair[categoriescolor[i]];

                    } else if (d > (valuePict[i] - 1) && d < (valuePict[i])) {
                        gradient2[i].append("svg:stop")
                            .attr("offset", (valueDecimal[i] * 100) + '%')
                            .attr("stop-color", colorPair[categoriescolor[i]])
                            .attr("stop-opacity", 1);
                        gradient2[i].append("svg:stop")
                            .attr("offset", (valueDecimal[i] * 100) + '%')
                            //.attr("stop-color", "#9e9e9e")
                            .attr("stop-color", darkColor[i])
                            .attr("stop-opacity", 1);
                        gradient2[i].append("svg:stop")
                            .attr("offset", '100%')
                            .attr("stop-color", darkColor[i])
                            .attr("stop-opacity", 1);
                        return "url(#icontype1" + i + ")";
                    } else {
                        //return cardcolor;
                        return darkColor[i];
                    }
                });
        }
        if (props.chartId.indexOf("sugess") < 0) {
            drawLegend(categoriescolor, textcolor, svg, props.colorPair, width, height, props.changeElementColor, textfont)
        }
    }

    /*******************************************************************************/
    else if (styletype === "percent1") { //[6]
        let iconradiusscale = props.size.w > props.size.h ? props.size.h / 4 : props.size.w / 4
        let iconindex = "suggess-" + "p" + "1";
        if (props.chartId.indexOf("sugess") > 0) iconindex = "suggess-" + "p" + "1";
        else iconindex = "canvas-" + "p" + "1"

        svg.append("defs")
            .append("g")
            .attr("id", function () {
                if (props.chartId.indexOf("sugess") > 0) return `suggess-` + "p" + "1" + `${pictogram}`
                else return `canvas-` + "p" + "1" + `${pictogram}`
            })
            .append("path")
            .attr("d", function () {
                // var obj = pictorialtype.find(function (obj) {
                //     return obj.name === pictogram
                // })
                // return obj.picpath; 
                return pictorialtype[pictogram]
            })

        let typesizex1 = svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().width;
        let typesizey1 = svg.select(`#${iconindex}${pictogram}`).node().getBoundingClientRect().height;
        let scale1;
        svg.select(`#${iconindex}${pictogram}`)
            .attr("transform", function () {
                let area11 = typesizex1 * typesizey1
                let area12 = 770
                scale1 = Math.sqrt(area12 / area11) * iconradiusscale
                // scale1.push(x.bandwidth()/typesizey1)
                return `scale(${scale1})`


            });
        //specify the number of columns and rows for pictogram layout
        let numCols = 10;
        let numRows = 1;

        //padding for the grid
        let xPadding = 10;
        //let yPadding = 15;

        //horizontal and vertical spacing between the icons
        //let hBuffer = 30;
        let wBuffer = (typesizex1 * 4 / 3) * scale1;

        //Process Data
        let data = props.data;
        data = getAggregatedRows(data, encoding);


        //Compute the percent
        // let pictorialdata=data.map(d=>parseFloat(d[encoding.color.field]));

        let pictorialdata = data.map(d => parseFloat(d[encoding.size.field]));
        let categoriescolor = data.map(d => d[encoding.color.field]);

        let colorlen = categoriescolor.length;

        /******!!!!!!!!!!!!!!!最多只取前六条数据 */
        // let colorlen=categoriescolor.length;
        if (colorlen > 6) {
            colorlen = 6;
            categoriescolor = categoriescolor.slice(0, 6)
        }
        let scaley1 = d3.scaleBand()
            .range([30, height - 50])
            .domain(d3.range(colorlen))
        // Define the gradient
        let gradient = [];
        for (let i = 0; i < colorlen; i++) {
            gradient[i] = svg.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", function () {
                    return "icontype" + i;
                })
                .attr("spreadMethod", "pad");

            // Define the gradient colors
            gradient[i].append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", function () {
                    return colorPair[categoriescolor[i]];
                })
                .attr("stop-opacity", 1);
        }

        let total = numCols * numRows;
        let valuePict = [];
        let valueDecimal = [];
        let pictorialdatamax=d3.max(pictorialdata);
        // let pictorialdatamax = 1;
        let zhengshuvalue = [];
        let myIndex = [];
        for (let i = 0; i < colorlen; i++) {
            // valuePict[i]=total*(datapercent[i]/100);
            valuePict[i] = (pictorialdata[i] * total / pictorialdatamax).toFixed(1);

            valueDecimal[i] = (valuePict[i] % 1);
            zhengshuvalue[i] = Math.ceil(valuePict[i]);
            myIndex[i] = d3.range(zhengshuvalue[i] * numRows)
        }



        for (let i = 0; i < colorlen; i++) {
            // let typeindex=i*60;
            svg.append("g")
                .attr("id", function () {
                    return "icon" + categoriescolor[i];
                })
                .selectAll("use")
                .data(myIndex[i])
                .enter()
                .append("use")
                .attr("xlink:href", `#${iconindex}${pictogram}`)
                .attr("id", function (d) {
                    return "icon" + d;
                })
                .attr("x", function (d) {
                    let remainder = d % numCols; //calculates the x position (column number) using modulus
                    return width / 15 + 30 + xPadding + (remainder * wBuffer); //apply the buffer and return value
                })
                .attr("y", function (d) {
                    return scaley1(i); //apply the buffer and return the value
                })
                .attr("class", function () {
                    return "icon-" + pictogram + ' ' + "source-" + encoding.size.field + ' ' + "icontypeP1" + i;
                });

            



            svg.append("text")
                .attr("x", 40)
                .attr("y", 23 + scaley1(i))
                .attr("fill", colorPair[categoriescolor[i]])
                .style("font-family", textfont)
                .style("font-size", "14px")
                // .attr("font-size",20*iconradiusscale)
                .attr('text-anchor', "end")
                .text(titleCase(categoriescolor[i]));

            svg.append("text")
                .attr("x", width + 20)
                .attr("y", 23 + scaley1(i))
                .attr("fill", colorPair[categoriescolor[i]])
                .style("font-family", textfont)
                .style("font-size", "14px")
                // .attr("font-size",20*iconradiusscale)
                .attr('text-anchor', "middle")
                .text("| " + pictorialdata[i].toFixed(1));
        }


        //Fill the color
        for (let i = 0; i < colorlen; i++) {
            d3.selectAll(".icontypeP1" + i)
                // .attr("fill", function(d) {
                .style("fill", function (d) {

                    if (d <= valuePict[i] - 1) {

                        return colorPair[categoriescolor[i]];

                    } else if (d > (valuePict[i] - 1) && d < (valuePict[i])) {
                        gradient[i].append("svg:stop")
                            .attr("offset", (valueDecimal[i] * 100) + '%')
                            .attr("stop-color", colorPair[categoriescolor[i]])
                            .attr("stop-opacity", 1);
                        gradient[i].append("svg:stop")
                            .attr("offset", (valueDecimal[i] * 100) + '%')
                            .attr("stop-color", gradientcolor)
                            .attr("stop-opacity", 1);
                        gradient[i].append("svg:stop")
                            .attr("offset", '100%')
                            .attr("stop-color", gradientcolor)
                            .attr("stop-opacity", 1);
                        return "url(#icontype" + i + ")";
                    } else {
                        return gradientcolor;
                        //return "#9e9e9e";
                    }
                });
        }
        if (props.chartId.indexOf("sugess") < 0) {
            drawLegend(categoriescolor, textcolor, svg, props.colorPair, width, height, props.changeElementColor, textfont)
        }
    }

    /*****************************************************************************************/
    else if(styletype==="picstacked"){

        let data = props.data;
        data = getAggregatedRows(data, encoding);
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


        let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
        let iconindex="suggess-" + 'ps1';
        if(props.chartId.indexOf("sugess")>0) iconindex="suggess-" + 'ps1';
        else iconindex="canvas-" + 'ps1';
        svg.append("defs")
        .append("g")
        .attr("id",function(){
            if(props.chartId.indexOf("sugess")>0)  return `suggess-` + 'ps1' +`${pictogram}`;
            else return `canvas-`+'ps1'+`${pictogram}`
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
    else if(styletype==="mappingbarpie"){

        let data = props.data;
        let data1= getAggregatedRows(data, encoding); 
        let categoriescolor1=outRepeat(data1.map(d=>(d[encoding.color.field]))); //categories或者series已经做了判断
        let categoriescolor=categoriescolor1;

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


    let iconradiusscale=props.size.w>props.size.h?props.size.h/4:props.size.w/4
      
    svg.append("rect")
    .attr("width",width)
    .attr("height","35px")
    .attr("x",0)
    .attr("y",height/2-75)
    .attr("class","rectempty2")

    let pictorialdata=data.map(d=>parseFloat(d[encoding.size.field]));
    let colorlen=categories.length
  
    

    //Define the gradient colors
    gradientMM.append("svg:stop")
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

    svg.select(".rectempty2")
    .attr("fill",function(d){
        for(let i=0;i<colorlen-1;i++){
            gradientMM.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[categories[i]];
            })
            .attr("stop-opacity",1);
            gradientMM.append("svg:stop")
            .attr("offset",function(){
                return sumpercent[i]+"%";
            })
            .attr("stop-color",function(){
                return colorPair[categories[i+1]];
            })
            .attr("stop-opacity",1);

        }
        gradientMM.append("svg:stop")
        .attr("offset","100%")
        .attr("stop-color",`${colorPair[categories[colorlen-1]]}`)
        return "url(#icon)";
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

    let iconindex="suggess-"+"fm1";
    if(props.chartId.indexOf("sugess")>0) iconindex="suggess-"+"fm1";
    else iconindex="canvas-"+"fm1"

    svg.append("defs")
    .selectAll("g")
    .data(categoriesreading)
    .enter()
    .append("g")
    .attr("id",function(d){
        if(props.chartId.indexOf("sugess")>0) return `suggess-`+"fm1"+`${d}`;
        else return `canvas-`+"fm1"+`${d}`
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
    .style("fill",iconcolor)
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

    /*******************************************************************************/
    let ssscale;
    // if(props.chartId.indexOf("sugess")>0){
    //     ssscale=0.25;
    //     margin = { top: 0, right: width/12, bottom: width/15, left:20};
    // }else{
    //     ssscale=1;
    //     margin = { top:0, right: 0, bottom: 0, left: 0 };
    // }
    if (props.chartId.indexOf("sugess") > 0) {
        ssscale = 0.2;
        margin = {
            top: width / 20,
            right: width / 12,
            bottom: width / 15,
            left: width / 15
        };
    } else {
        ssscale = 0.9;
        margin = {
            top: width / 15,
            right: width / 4,
            bottom: width / 4,
            left: 90
        };
    }

    d3.selectAll(`.${svgg}`)
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" + "scale(" + ssscale + ")");



    return svg;
}



export default draw;