// pages/discovery/discovery.js
var amapFile = require('../../dist/location/amap-wx.js');
var Bmob = require('../../dist/Bmob-1.7.0.min.js');
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    MapKey: '954a375a7dc5e5134de9b061ec241e94', //定位key
    longitude: "",
    latitude: '',
    infoList: [],
    currentPos: null,
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentLocation();
  },
  updatePosition: function () {
    //测量点
    //currentPos = new AMap.LngLat(this.data.longitude, this.data.latitude);
  },
  copyData: function (des) {
    var that = this;
    var tempList = [];
    console.log("des length = " + des.length)
    for (var i = 0; i < des.length; i++) {
      var tempDis = that.getDistance(des[i].latitude, des[i].longitude, this.data.latitude, this.data.longitude);
      console.log("distance = " + tempDis);
      var tempData = {
        title: des[i].title,
        content: des[i].content,
        picture: des[i].picture,
        beginTime: des[i].begin_time,
        endTime: des[i].end_time,
        distance: tempDis,
        longitude: des[i].longitude,
        latitude: des[i].latitude
      }
      tempList.push(tempData);
      this.setData({
        infoList: tempList
      })
    }
    console.log("src = ");
    console.log(this.data.infoList);
  },

  getList: function () {
    var that = this;
    db.collection('sale_info').get({
      success: function (res) {
        console.log(res.data)
        console.log(res)
        if (res) {
          that.copyData(res.data);
        }
      }
    })
  },

  getCurrentLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo',
          data: {
            key: that.data.MapKey,
            location: res.longitude + "," + res.latitude,
            extensions: "all",
            s: "rsx",
            sdkversion: "sdkversion",
            logversion: "logversion"
          },
          success: function (res1) {
            console.log(res1.data);
            if (that.getList) {
              that.updatePosition();
              that.getList();
            }
          },
          fail: function (res1) {
            console.log('获取地理位置失败')
          }
        })

      },
      fail: function (res) {
        console.log("getCurrentLocation fail");
        console.log(res);
        that.setData({
          isShow: true
        });
      }
    })
  },
  getDistance: function (lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    return ((r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))) / 1000).toFixed(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onGoClick(res) {
    console.log("onGoClick");
    var index = res.currentTarget.dataset.bindex;
    var latitude = parseFloat(this.data.infoList[index].latitude)
    var longitude = parseFloat(this.data.infoList[index].longitude)
    console.log("index = " + index, ", latitude = " + latitude + ",longitude = " + longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      //scale: 28, // 缩放比例
    })
  },

  authorizeButton: function (res) {
    var that = this;
    wx.openSetting({
      success: function (data) {
        if (data.authSetting["scope.userLocation"] === true) {
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1000
          })
          //授权成功之后，再调用chooseLocation选择地方
          that.setData({
            isShow:false
          })
          that.getCurrentLocation();
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  }
})