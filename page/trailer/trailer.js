// page/trailer/trailer.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currUrl: '',
    trailers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, resource, title } = options;
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({ currUrl: resource })
    this.getDetails(id);
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

  /**
 * 获取影视详情
 */
  getDetails: function (id) {
    wx.showLoading({
      title: 'loading...',
    });
    let _this = this;
    app.douban.findOne(id)
      .then(res => {
        _this.setData({
          trailers: res.trailers,
          loaded: true,
        });
        wx.hideLoading()
      })
      .catch(e => {
        this.setData({ title: '获取数据异常', trailers: [] })
        console.error(e)
        wx.hideLoading()
      })

  },

  /**
 * 改变当前预告
 */
  changeTrailer(e) {
    const { trailers } = this.data;
    const { index, url } = e.currentTarget.dataset;
    this.setData({ currUrl: url })
    wx.setNavigationBarTitle({
      title: trailers[index].title,
    })
  },

  /**
   * 视频播放结束
   */
  videoEnded() {
    const { trailers, currUrl } = this.data;
    const that = this;
    for (let i = 0; i < trailers.length; i++) {
      if (currUrl == trailers[i].resource_url && i < trailers.length - 1) {
        that.setData({ currUrl: trailers[i + 1].resource_url })
      }
    }
  }
})