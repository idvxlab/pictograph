const defaultSpec = {
    "encoding": {
        "x": { "field": "Origin", "type": "quantitative" },
        //取消默认encoding
        //"y": {},
       // "color":{}
         "y": { "field": "Horsepower", "type": "quantitative" },
        "color": { "field": "Cylinders", "type": "nordinal" },
        // "time": { "field": "Year", "type": "temporal" },
    },
    "style": {
        "layout": ["barchart4","barchart5","stacked","horizontalrect","singlebar","grouped"],
        "colorset": ["rgb(141,211,199)", "rgb(190,186,218)" , "rgb(219,191,140)","rgb(255,255,179)","rgb(251,128,114)" , "rgb(130,212,230)", "rgb(146,181,204)", "rgb(242,177,173)", "rgb(255,193,104)", "rgb(127,201,127)"],
        "inspire": ["percent2-1","area-1"],
        "inspireType": ["bar chart", "bar chart"],
    },
    "animation": []
}

export default defaultSpec;