//index.js
//获取应用实
var Bmob = require('../../dist/Bmob-1.7.0.min.js');
const app = getApp()

Page({
  data: {
    newsList: [],
    imageArray: ['../../images/jiayou.png', '../../images/xiche.png', '../../images/weixiu.png', '../../images/baoyang.png', '../../images/baoxian.png', '../../images/qita.png']
  },

  addInfo: function() {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },

  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    })

    if (!app.globalData.openId) {
      app.openIdReadyCallback = res => {
        console.log("openIdReadyCallback");
        //第一次初始化程序 需要加载数据
        this.loadData();
      }
    } else {
      //第一次初始化程序 需要加载数据
      this.loadData();
    }
  },
  //加载数据
  loadData: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    var myDate = new Date();
    var date = myDate.toLocaleDateString();
    const query = Bmob.Query(app.globalData.tableName);
    query.equalTo('user_id', "==", app.globalData.openId);
    console.log("index,query,openId = " + app.globalData.openId);
    query.order("-date");
    query.find().then(res => {
      console.log(res);
      if (res.length == 0) {
        this.setData({
          empty_content: '无内容，请添加'
        })
      } else {
        this.setData({
          empty_content: ''
        })
      }
      this.setData({
        newsList: res
      });
      app.globalData.itemList = res;
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    });
  },

  onItemClick: function(res) {
    var id = res.currentTarget.dataset.objectid;
    console.log('onItemClick,objectId = ' + id);
    wx.navigateTo({
      url: '../edit/edit?objectId=' + id,
    })
  },

  onShow: function() {
    if (app.globalData.updateData) {
      console.log("data dirty ,update");
      this.loadData();
      app.globalData.updateData = false;
    } else {
      console.log("data not dirty ");
    }
  },
  onPullDownRefresh: function() {
    this.loadData();
  },
  onShareAppMessage: function (res) {
    console.log("onShareAppMessage")
    return {
      title: '一个月养车尽然花这么多钱？',
      path: '/pages/index/index',
      success: function (res) {
        console.log("share success")
      },
      fail: function (res) {
        console.log("share fail")
      }
    }
  }
})