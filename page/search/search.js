// page/search/search.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '上海',
    inputVal: '',
    inputShowed: true,
    suguestions: [],
    page: 0,
    size: 10,
    hasMore: true,
    location: {},
    cinemas: [],
    currentMovieId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentMovieId: options.currentMovieId
    })
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
    this.setData({ city: app.getCurrentCity() })
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

  // inputTyping: function (e) {

  // },


  inputTyping: function (e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value,
      inputShowed: true
    });

    if (e.detail.value === '') {
      that.setData({
        suguestions: []
      });
      return;
    }
    var BMap = new app.bmap.BMapWX({
      ak: 'hHjBwKZxbdTcHE9LIpbu1Ww1zDG9B6L1'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      // var sugData = [];
      // for (var i = 0; i < data.result.length; i++) {
      //   sugData.push(data.result[i].name)
      // }
      that.setData({
        suguestions: data.result
      });
    }
    BMap.suggestion({
      query: e.detail.value,
      region: app.getCurrentCity(),
      city_limit: true,
      fail: fail,
      success: success
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: true,
      suguestions:[]
    });
  },

  onFocus: function(){
    this.setData({
      inputShowed: true
    });
  },

  searchCinemas: function(){
    console.log(this.data.inputVal)
    this.setData({
      suguestions:[],
      page: 0,
      cinemas: [],
      hasMore: false
    })

    app.baidu.getGeoCode(this.data.city, this.data.inputVal).then(res=>{
      // if (res.precise == 0) {
      //   wx.showToast({
      //     title: '输入的地址无法解析',
      //     icon: 'none',
      //     duration: 2000
      //   })
      // } else {
        
      // }

      this.setData({
        hasMore: true,
        location: res.location
      })
      this.loadMore()

    }).catch(err => {
      console.error(err)
    })
  },


  suguestionSelected: function ({ currentTarget = {} }){
    const { dataset = {} } = currentTarget;
    console.log(dataset)
    this.setData({
      inputVal: dataset.name,
      inputShowed: true,
      location: dataset.loc,
      hasMore: true,
      page: 0,
      suguestions: [],
      cinemas:[]
    })

    this.loadMore()
  },

  onReachBottom: function () {
    this.loadMore();
  },

  loadMore: function () {
    if (!this.data.hasMore) return

    wx.showLoading({ title: '拼命搜索中...' })


    app.wechat.getLocation().then(curLocation => {
      return app.hys.searchCinemas(this.data.city, this.data.location.lat, this.data.location.lng,this.data.page++, this.data.size, curLocation)
    }).then(cinemas => {
      if (cinemas.length) {
        this.setData({ cinemas: this.data.cinemas.concat(cinemas) })
      } else {
        this.setData({ hasMore: false })
      }
      wx.hideLoading()
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },


})