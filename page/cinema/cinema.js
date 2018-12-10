
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
    city: '上海',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCinemas()
  },

  loadCinemas:function(){
    this.setData({ city: app.getCurrentCity() })
    wx.showLoading({ title: '拼命加载中...' })
    app.wechat.getLocation().then(res => {
      const { latitude, longitude } = res
      const district = this.data.areas[this.data.areaIndex].value
      return app.hys.getCinemas(latitude, longitude, this.data.city, district, this.data.sortByIndex,
        this.data.page++, this.data.size)
    }).then(cinemas => {
      if (cinemas.length == 0) {
        wx.showToast({
          title: '当前城市服务未开通，敬请期待',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({ cinemas: cinemas })
      }
      wx.hideLoading()
    }
    ).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
   
  },

  // getDistance:function() {

  // },

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
    return {
      title: '最新热映电影,优惠尽在这里',
      path: '/page/movie/movie'
    }
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

    //get cinema list


    // const that = this;
    // that.dropMenu = that.dropMenu ? that.dropMenu() : $markDropmenu.show({
    //   titleText: '',
    //   buttons: [
    //     { id: 'addTime', title: '最近添加' },
    //     { id: 'filmTime', title: '上映日期' },
    //     { id: 'rating', title: '豆瓣评分' },
    //     { id: 'filmName', title: '电影名称' },
    //   ],
    //   choosedId: that.data.sortId,
    //   onChange(index, item) {
    //     this.setData({
    //       sortId: item.id
    //     }, () => {
    //       let { wantSee } = app.globalData.setting;
    //       wantSee = { ...wantSee, sort: item.id };
    //       wx.setStorage({
    //         key: 'setting',
    //         data: { ...app.globalData.setting, wantSee },
    //       })

    //     })
    //     return true;
    //   },
    //   cancel() {
    //     that.dropMenu = null;
    //   }
    // })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  onFocus: function (e) {
    wx.navigateTo({
      url: '/page/search/search?currentMovieId=-1',
    })
  },

  toggleAreaPopup() {
    //todo
    this.setData({
      //showArea: !this.data.showArea
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