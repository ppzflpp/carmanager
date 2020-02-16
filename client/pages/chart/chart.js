//import * as echarts from '../../dist/ec-canvas/echarts';
//const echarts = require('../../dist/ec-canvas/echarts.min.js')

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: 'gggggg',
        textAlign: 'center',
        fill: '#000',
        width: 30,
        height: 30
      }
    },
    series: [{
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['30%', '60%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }, ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  data: {
    itemList: [],
    ec: {

    }
  },
  onLoad() {

  },
  onShow() {
    if (app.globalData.itemList) {
      var dataMap = new Map();

      var oldList = app.globalData.itemList;
      for (var i = 0; i < oldList.length; i++) {
        var year = oldList[i].date.slice(0, 4);
        var month = '_' + parseInt(oldList[i].date.slice(5, 7));
        var styleAlias = oldList[i].style_alias;
        //console.log("year = " + year + ",month = " + month + ",style = " + style);
        if (!dataMap.has(year)) {
          var monthData = {
            'year': year,
            [month]: {
              [styleAlias]: oldList[i].money,
               monthMoney: oldList[i].money,
            },
            yearMoney :oldList[i].money,
          }
          dataMap.set(year, monthData);
        } else {
          var monthData = dataMap.get(year);

          if (!monthData[month]) {
            //不存在月数据
            monthData[month] = {
              [styleAlias]: oldList[i].money,
              monthMoney: oldList[i].money,
            }
            monthData.yearMoney = parseInt(monthData.yearMoney) + parseInt(oldList[i].money),
            dataMap.set(year, monthData);
          } else {
            //存在月数据
            var tmpMonthData = monthData[month];
            if (!tmpMonthData[styleAlias]) {
              //不存在该类型数据
              tmpMonthData[styleAlias] = oldList[i].money;
              monthData.yearMoney = parseInt(monthData.yearMoney) + parseInt(oldList[i].money),
                tmpMonthData.monthMoney = parseInt(tmpMonthData.monthMoney) + parseInt(oldList[i].money);
            } else {
              tmpMonthData[styleAlias] = parseInt(tmpMonthData[styleAlias]) + parseInt(oldList[i].money);
              monthData.yearMoney = parseInt(monthData.yearMoney) + parseInt(oldList[i].money),
              tmpMonthData.monthMoney = parseInt(tmpMonthData.monthMoney) + parseInt(oldList[i].money);
            }

            dataMap.set(year, monthData);
          }

        }
      }

      var array = [];
      dataMap.forEach(function(value, key, map) {
        console.log('year=' + key + 'value = ' + JSON.stringify(value));
        array.push(value);
      });
      this.setData({
        itemList : array,
      });

    }

  },

  onReady() {},

  echartInit(e) {
    console.log("echartInit");
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  }
});