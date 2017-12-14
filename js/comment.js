var myChart4 = echarts.init(document.getElementById('comment'));

var app={};

var indices = {
    剧名: 0,
    国别: 1,
    序号: 1
};

// console.log(indices.剧名);
var schema = 
[ {name:"剧名",index:0},
{name:"国别",index:1},
{name:"评分人数（人）",index:2},
{name:"讨论条数（条）",index:3},
{name:"短评数量（条）",index:4},
{name:"长评数量（条）",index:5},
{name:"序号",index:6}];

var axisColors = {
    'xAxisLeft': '#2A8339',
    'xAxisRight': '#367DA6',
    'yAxisTop': '#A68B36',
    'yAxisBottom': '#BD5692'
};
var colorBySchema = {};

var fieldIndices = schema.reduce(function (obj, item) {
    obj[item.name] = item.index;
    return obj;
}, {});

var groupCategories = [];
var groupColors = [];
var data;

// zlevel 为 1 的层开启尾迹特效
myChart4.getZr().configLayer(1, {
    motionBlur: 0.5
});


function normalizeData(originData) {
    var groupMap = {};
    originData.forEach(function (row) {
        var groupName = row[indices.国别];
        if (!groupMap.hasOwnProperty(groupName)) {
            groupMap[groupName] = 1;
        }
    });

    originData.forEach(function (row) {
        row.forEach(function (item, index) {
            if (index !== indices.剧名
                && index !== indices.国别
                && index !== indices.序号
            ) {
                // Convert null to zero, as all of them under unit "g".
                row[index] = parseFloat(item) || 0;
            }
        });
    });

    for (var groupName in groupMap) {
        if (groupMap.hasOwnProperty(groupName)) {
            groupCategories.push(groupName);
        }
    }
    // var hStep = Math.round(300 / (groupCategories.length - 1));
    // for (var i = 0; i < groupCategories.length; i++) {
    //     groupColors.push(echarts.color.modifyHSL('#5A94DF', hStep * i));
    // } //为类添加颜色
    // var groupColors = ["#9b4454","#ff6d6e","#33b9d6","#927ce0","#ffa88a"];
    // console.log(groupColors);

    return originData;
}

function makeAxis(dimIndex, id, name, nameLocation) {
    var axisColor = axisColors[id.split('-')[dimIndex]];
    colorBySchema[name] = axisColor;
    return {
        id: id,
        name: name,
        nameLocation: nameLocation,
        nameGap: nameLocation === 'middle' ? 30 : 10,
        gridId: id,
        splitLine: {show: false},
        axisLine: {
            lineStyle: {
                color: axisColor
            }
        },
        axisLabel: {
            textStyle: {
                color: axisColor
            }
        },
        axisTick: {
            lineStyle: {
                color: axisColor
            }
        }
    };
}

function makeSeriesData(xLeftOrRight, yTopOrBottom,data) {
    return data.map(function (item, idx) {
        var schemaX = app.config[xLeftOrRight];
        var schemaY = app.config[yTopOrBottom];
        return [
            item[fieldIndices[schemaX]], // 0: xValue
            item[fieldIndices[schemaY]], // 1: yValue
            item[1],                     // 2: group
            item[0],                     // 3: name
            schemaX,                     // 4: schemaX
            schemaY,                     // 5: schemaY
            idx                          // 6
        ];
    });
}

function makeSeries(xLeftOrRight, yTopOrBottom,data) {
    var id = xLeftOrRight + '-' + yTopOrBottom;
    return {
        zlevel: 1,
        type: 'scatter',
        name: id,
        xAxisId: id,
        yAxisId: id,
        symbolSize: 8,
        itemStyle: {
            emphasis: {
                color: '#fff'
            }
        },
        animationThreshold: 3000,
        progressiveThreshold: 5000,
        data: makeSeriesData(xLeftOrRight, yTopOrBottom,data)
    };
}

function makeDataZoom(opt) {
    return echarts.util.extend({
        type: 'slider',
        fillerColor: 'rgba(255,255,255,0.1)',
        borderColor: '#777',
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '60%',
        handleStyle: {
            color: '#aaa'
        },
        textStyle: {
            color: '#aaa'
        },
        filterMode: 'empty',
        realtime: false
    }, opt);
}

function tooltipFormatter(params) {
    // Remove duplicate by data name.
    var mapByDataName = {};
    var mapOnDim = {x: {}, y: {}, xy: {}};
    echarts.util.each(params, function (item) {
        var data = item.data;
        var dataName = data[3];
        var mapItem = mapByDataName[dataName] || (mapByDataName[dataName] = {});
        mapItem[data[4]] = data[0];
        mapItem[data[5]] = data[1];
        mapOnDim[item.axisDim][dataName] = mapItem;
    });
    echarts.util.each(mapByDataName, function (mapItem, dataName) {
        if (mapOnDim.x[dataName] && mapOnDim.y[dataName]) {
            mapOnDim.xy[dataName] = mapItem;
            delete mapOnDim.x[dataName];
            delete mapOnDim.y[dataName];
        }
    });
    var resultHTML = [];
    echarts.util.each([['xy', 'CROSS'], ['x', 'V LINE'], ['y', 'H LINE']], function (dimDefine) {
        var html = [];
        echarts.util.each(mapOnDim[dimDefine[0]], function (mapItem, dataName) {
            var valuesHTML = [];
            echarts.util.each(mapItem, function (value, dataName) {
                valuesHTML.push(
                    '<span style="color:' + colorBySchema[dataName] + '">'
                        + dataName
                    + '</span>: ' + value
                );
            });
            html.push('<div style="margin: 10px 0">' + dataName + '<br/>' + valuesHTML.join('<br/>') + '</div>');
        });
        html.length && resultHTML.push(
            '<div style="margin: 10px 0">'
            + '<div style="font-size: 16px; color: #aaa">POINTS ON ' + dimDefine[1] + '</div>'
            + html.join('')
            + '</div>'
        );
    });
    return resultHTML.join('');
}

function getOption(data) {
    var gridWidth = '35%';
    var gridHeight = '35%';
    var gridLeft = 80;
    var gridRight = 50;
    var gridTop = 50;
    var gridBottom = 80;

    return {
        // backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'none',
            padding: [10, 20, 10, 20],
            backgroundColor: 'rgba(44,52,60,0.7)',
            borderColor: '#ccc',
            borderWidth: 2,
            borderRadius: 4,
            transitionDuration: 0,
            extraCssText: 'width: 300px; white-space: normal',
            textStyle: {
                fontSize: 12
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 60;
                obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 20;
                return obj;
            },
            formatter: tooltipFormatter
        },
        axisPointer: {
            show: true,
            snap: true,
            lineStyle: {
                type: 'dashed'
            },
            label: {
                show: true,
                margin: 6,
                backgroundColor: '#556',
                textStyle: {
                    color: '#fff'
                }
            },
            link: [{
                xAxisId: ['xAxisLeft-yAxisTop', 'xAxisLeft-yAxisBottom']
            }, {
                xAxisId: ['xAxisRight-yAxisTop', 'xAxisRight-yAxisBottom']
            }, {
                yAxisId: ['xAxisLeft-yAxisTop', 'xAxisRight-yAxisTop']
            }, {
                yAxisId: ['xAxisLeft-yAxisBottom', 'xAxisRight-yAxisBottom']
            }]
        },
        xAxis: [
            makeAxis(0, 'xAxisLeft-yAxisTop', '评分人数（人）', 'middle'),
            makeAxis(0, 'xAxisLeft-yAxisBottom', '评分人数（人）', 'middle'),
            makeAxis(0, 'xAxisRight-yAxisTop', '短评数量（条）', 'middle'),
            makeAxis(0, 'xAxisRight-yAxisBottom', '短评数量（条）', 'middle')
        ],
        yAxis: [
            makeAxis(1, 'xAxisLeft-yAxisTop', '讨论条数（条）', 'end'),
            makeAxis(1, 'xAxisLeft-yAxisBottom', '长评数量（条）', 'end'),
            makeAxis(1, 'xAxisRight-yAxisTop', '讨论条数（条）', 'end'),
            makeAxis(1, 'xAxisRight-yAxisBottom', '长评数量（条）', 'end')
        ],
        grid: [{
            id: 'xAxisLeft-yAxisTop',
            left: gridLeft,
            top: gridTop,
            width: gridWidth,
            height: gridHeight
        }, {
            id: 'xAxisLeft-yAxisBottom',
            left: gridLeft,
            bottom: gridBottom,
            width: gridWidth,
            height: gridHeight
        }, {
            id: 'xAxisRight-yAxisTop',
            right: gridRight,
            top: gridTop,
            width: gridWidth,
            height: gridHeight
        }, {
            id: 'xAxisRight-yAxisBottom',
            right: gridRight,
            bottom: gridBottom,
            width: gridWidth,
            height: gridHeight
        }],
        dataZoom: [
            makeDataZoom({
                width: gridWidth,
                height: 20,
                left: gridLeft,
                bottom: 10,
                xAxisIndex: [0, 1]
            }),
            makeDataZoom({
                width: gridWidth,
                height: 20,
                right: gridRight,
                bottom: 10,
                xAxisIndex: [2, 3]
            }),
            makeDataZoom({
                orient: 'vertical',
                width: 20,
                height: gridHeight,
                left: 10,
                top: gridTop,
                yAxisIndex: [0, 2]
            }),
            makeDataZoom({
                orient: 'vertical',
                width: 20,
                height: gridHeight,
                left: 10,
                bottom: gridBottom,
                yAxisIndex: [1, 3]
            })
        ],
        visualMap: [{
            show: false,
            type: 'piecewise',
            categories: groupCategories,
            dimension: 2,
            inRange: {
                color:  ["#9b4454","#ff6d6e","#33b9d6","#927ce0","#ffa88a"]//['#d94e5d','#eac736','#50a3ba']
            },
            outOfRange: {
                color: ['#ccc'] //['#d94e5d','#eac736','#50a3ba']
            },
            top: 20,
            textStyle: {
                color: '#fff'
            },
            realtime: false
        }],
        series: [
            makeSeries('xAxisLeft', 'yAxisTop',data),
            makeSeries('xAxisLeft', 'yAxisBottom',data),
            makeSeries('xAxisRight', 'yAxisTop',data),
            makeSeries('xAxisRight', 'yAxisBottom',data)
        ],
        animationEasingUpdate: 'cubicInOut',
        animationDurationUpdate: 2000
    };
}

var fieldNames = schema.map(function (item) {
    return item.name;
}).slice(2);

app.config = {
    xAxisLeft: '评分人数（人）',
    yAxisTop: '短评数量（条）',
    xAxisRight: '讨论条数（条）',
    yAxisBottom: '长评数量（条）',
    onChange: function () {
        if (data) {
            colorBySchema[app.config.xAxisLeft] = axisColors.xAxisLeft;
            colorBySchema[app.config.xAxisRight] = axisColors.xAxisRight;
            colorBySchema[app.config.yAxisTop] = axisColors.yAxisTop;
            colorBySchema[app.config.yAxisBottom] = axisColors.yAxisBottom;

            myChart4.setOption({
                xAxis: [{
                    name: app.config.xAxisLeft
                }, {
                    name: app.config.xAxisLeft
                }, {
                    name: app.config.xAxisRight
                }, {
                    name: app.config.xAxisRight
                }],
                yAxis: [{
                    name: app.config.yAxisTop
                }, {
                    name: app.config.yAxisBottom
                }, {
                    name: app.config.yAxisTop
                }, {
                    name: app.config.yAxisBottom
                }],
                series: [{
                    data: makeSeriesData('xAxisLeft', 'yAxisTop',data)
                }, {
                    data: makeSeriesData('xAxisLeft', 'yAxisBottom',data)
                }, {
                    data: makeSeriesData('xAxisRight', 'yAxisTop',data)
                }, {
                    data: makeSeriesData('xAxisRight', 'yAxisBottom',data)
                }]
            });
        }
    }
};

app.configParameters = {
    xAxisLeft: {
        options: fieldNames
    },
    xAxisRight: {
        options: fieldNames
    },
    yAxisTop: {
        options: fieldNames
    },
    yAxisBottom: {
        options: fieldNames
    }
};

 $.getJSON('json/comment.json', function (originData) {
        
        data = normalizeData(originData);
        data_country={}
        
        filter = [];
        $("#scatLegend>span").each(function(){
            if($(this).attr("status") == "true"){
                filter.push($(this).attr("group"));
            }
        });
    
        new_data = [];
        for(i=0;i<data.length;i++){
            if(filter.indexOf(data[i][1])>=0){
                new_data.push(data[i]);
            }
           
        }

        option = getOption(new_data);
        // console.log(option);
        myChart4.setOption(option);

    $("#scatLegend>span").click(function(){
        if($(this).attr("status")=="true"){
            $(this).attr("status","false");
        }else{
            $(this).attr("status","true");
        };

        filter = [];
        $("#scatLegend>span").each(function(){
            if($(this).attr("status") == "true"){
                filter.push($(this).attr("group"));
            }
        });
        new_data = [];
        for(i=0;i<data.length;i++){
            if(filter.indexOf(data[i][1])>=0){
                new_data.push(data[i]);
            }
           
        }

        option = getOption(new_data);
        console.log(option);
        myChart4.setOption(option);
    });

})


// $("#scatLegend>span").each(function(){
//     if($(this).attr("status") == "false"){
//         $(this).addClass("false");
//     }else if(($(this).attr("stasus") == "false" ) && ($(this).attr("group") == "英剧")){
//         $(this).addClass("yj");
// //     }
    
// });