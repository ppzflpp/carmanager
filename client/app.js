//app.js
var Bmob = require('./dist/Bmob-1.7.0.min.js');

App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    Bmob.initialize("c2a2830a959fe3adf2d223f3fa89d630", "e64d193a585a1c08f5d781a8cd48f448");
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (this.globalData.DEBUG) {
      this.globalData.tableName = "records_test"
    } else {
      this.globalData.tableName = "records"
    }
    console.log('tableName = ' + this.globalData.tableName);

    var that = this;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("login success")
        if (res.code) {
          var params = {
            funcName: 'getOpenId',
            data: {
              name: res.code
            }
          }

          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid: ', res.result.openid)
              that.globalData.openId = res.result.openid
              if (that.openIdReadyCallback) {
                that.openIdReadyCallback()
              }
            },
            fail: err => {
              console.log('[云函数] [login] get user openid error')
            }
          });
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("获取用户信息成功");
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    updateData: false,
    openId: '',
    itemList: null,
    tableName: "",
    DEBUG: true
  }
})