//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  aboutMe: function () {
    wx.showModal({
      title: '关于我',
      content: '话说优秀的程序员至少会给自己写点代码，我只想验证下自己是否有一点优秀',
      confirmColor: "#d81e06",
      showCancel: false
    })
  },
  contactService: function() {
    wx.showActionSheet({
      itemList: [app.globalData.servicePhoneNumber],
      success: function(res) {
        console.log(res.tapIndex)
        wx.makePhoneCall({
          phoneNumber: app.globalData.servicePhoneNumber
        })
      }
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: '最新热映电影,优惠尽在这里',
      path: '/page/movie/movie'
    }
  },
})
