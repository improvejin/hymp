
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showArea: false,
    areas: [{
      padding: 0,
      value: '0',
      name: '全部区域',
    },
    {
      padding: 0,
      value: '1',
      name: '闵行',
    },
    {
      padding: 0,
      value: '2',
      name: '浦东',
    }
    ],
    areaIndex: 0,

    inputShowed: false,
    inputVal: "",
    
    sortBy: ["距离由近及远", "价格从高到低"],
    sortByIndex: 0,

    hasMore: true,
    page: 0,
    size: 10,
    cinemas: [],
    currentMovieId:0,
    city: '上海'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.movieName
    })
    this.setData({currentMovieId: options.movieId })
    this.loadCinemas()
  },

  loadCinemas: function () {
    this.setData({ city: app.getCurrentCity() })
    wx.showLoading({ title: '拼命加载中...' })
    app.wechat.getLocation().then(res => {
      const { latitude, longitude } = res
      const district = this.data.areas[this.data.areaIndex].value
      return app.hys.getCinemas(latitude, longitude, this.data.city, district, this.data.sortByIndex,
        this.data.page++, this.data.size)
    }).then(cinemas => {
      this.setData({ cinemas: cinemas })
      wx.hideLoading()
    }
    ).catch(err => {
      console.error(err)
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
    if (this.data.city != app.getCurrentCity()) {
      this.setData({ page: 0, hasMore: true, cinemas: [] })
      this.loadCinemas()
    }
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
    this.setData({ page: 0, hasMore: true, cinemas: []})
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  loadMore: function () {
    if (!this.data.hasMore) return

    wx.showLoading({ title: '拼命加载中...' })

    app.wechat.getLocation().then(res => {
      const { latitude, longitude } = res
      const district = this.data.areas[this.data.areaIndex].value
      app.hys.getCinemas(latitude, longitude, this.data.city, district, this.data.sortByIndex,
        this.data.page++, this.data.size).then(cinemas => {
          if(cinemas.length) {
            this.setData({ cinemas: this.data.cinemas.concat(cinemas) })
          } else {
            this.setData({ hasMore: false })  
          } 
          wx.hideLoading()         
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
        })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  areaChange: function (e) {
    //get cinema list
    this.setData({
      areaIndex: e.detail.value
    })
  },
  changeSort: function (e) {
    this.setData({
      sortByIndex: e.detail.value
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  onFocus: function (e) {
    wx.navigateTo({
      url: '/page/search/search?currentMovieId='+this.data.currentMovieId,
    })
  },

  toggleAreaPopup() {
    this.setData({
      showArea: !this.data.showArea
    });
  },
  handleAreaChange({ currentTarget = {}, detail = {} }) {
    const { value = '' } = detail;
    const { dataset = {} } = currentTarget;
    this.setData({
      areaIndex: value
    });

    this.toggleAreaPopup()
  }
})