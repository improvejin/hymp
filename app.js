//app.js
/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat.js')

/**
 * Douban API 模块
 * @type {Object}
 */
const douban = require('./utils/douban.js')

/**
 * Baidu API 模块
 * @type {Object}
 */
const baidu = require('./utils/baidu.js')

const bmap = require('./utils/bmap-wx.min.js')

/**
 * hys API 模块
 * @type {Object}
 */
const hys = require('./utils/hys.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

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

    wechat
      .getLocation()
      .then(res => {
        const { latitude, longitude } = res
        return baidu.getCityName(latitude, longitude)
      })
      .then(name => {
        var city = name.replace('市', '')
        this.setCurrentCity(city)
        console.log(`currentCity : ${this.data.currentCity}`)
      })
      .catch(err => {
        this.setCurrentCity('上海')
        console.error(err)
      })

  },
  globalData: {
    userInfo: null,
    servicePhoneNumber: "19901713476"
  },

  setCurrentCity: function(city) {
    this.data.currentCity = city
    var cities = wx.getStorageSync('recentCities') || []
    var index = cities.indexOf(city)
    if(index>-1){
      cities.splice(index, 1)
    }
    cities.unshift(city)
    if(cities.length > 3) {
      cities.pop()
    }
    wx.setStorageSync('recentCities', cities)
  },

  getCurrentCity: function(){
    return this.data.currentCity
  },

  getRecentCities: function() {
    return wx.getStorageSync('recentCities')
  },

  data: {
    name: 'hy',
    version: '0.1.0',
    currentCity: '上海'
  },
  /**
 * WeChat API
 */
  wechat: wechat,

  /**
   * Douban API
   */
  douban: douban,

  /**
   * Baidu API
   */
  baidu: baidu,

  bmap: bmap,

  /**
   * hys API
   */
  hys: hys,

})