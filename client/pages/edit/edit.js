  // pages/edit/edit.js
const util = require('../../utils/util.js')
const Bmob = require('../../dist/Bmob-1.7.0.min.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexStyle: 0,
    styleArray: ['加油费', '洗车费', '维修费', '保养费', '保险费', '其它'],
    styleArrayAlias: ['jiayou', 'xiche', 'weixiu', 'baoyang', 'baoxian', 'other'],
    currentDate: '',
    money: 0,
    info: '',
    objectId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.objectId) {
      wx.setNavigationBarTitle({
        title: '编辑',
      }) ;
      const query = Bmob.Query('records');
      query.equalTo('objectId', "==",options.objectId)
      query.find().then(res => {
        this.setData({
          currentDate: res[0].date,
          indexStyle: res[0].index,
          money: res[0].money,
          info: res[0].info,
          objectId: options.objectId 
        })
      });
    } else {
      wx.setNavigationBarTitle({
        title: '添加',
      });
      this.setData({
        currentDate: util.formatTime(new Date()),
        indexStyle: 0,
        //objectId: options.objectId ? options.objectId : null
      })
    }
  },



  bindPickerDate: function (res) {
    //console.log('currentDate = ' + res.detail.value);
    this.setData({
      currentDate: res.detail.value
    })
  },

  bindPickerStyle: function (res) {
    //console.log('indexStyle = ' + res.detail.value );
    this.setData({
      indexStyle: res.detail.value
    })
  },

  cancelButton: function (res) {
    wx.navigateBack({});
  },

  confirmButton: function (res) {
    var style = this.data.styleArray[this.data.indexStyle];
    var styleAlias = this.data.styleArrayAlias[this.data.indexStyle];
    var index = ""+this.data.indexStyle
    var date = this.data.currentDate;
    var money = this.data.money;
    var info = this.data.info;
    console.log("sytle = " + style + ",index = " + index + ",data = " + date + ",money = " + money + ",info = " + info + ',user_id = ' + app.globalData.openId);
    //显示加载框
    wx.showLoading({
      title: '正在保存...',
    })

    const query = Bmob.Query(app.globalData.tableName);
    if(this.data.objectId){
      query.set("id", this.data.objectId);
    }
    query.set("user_id", app.globalData.openId);
    query.set('index',index);
    query.set("style", style);
    query.set("style_alias", styleAlias);
    query.set('date', date);
    query.set('money', money);
    query.set('info', info);

    query.save().then(res => {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '已保存',
      });
      app.globalData.updateData = true;
      wx.navigateBack({});
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '保存失败',
      })
    })

  },

  getMoney: function (res) {
    this.data.money = res.detail.value;
  },

  getInfo: function (res) {
    this.data.info = res.detail.value;
  }
})