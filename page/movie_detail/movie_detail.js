// 获取全局应用程序实例对象
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFold: true,
    coming: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(req) {
    wx.setNavigationBarTitle({
      title: req.title
    })
    wx.showLoading({
      title: '拼命加载中...'
    })

    this.setData({
      coming: req.coming
    })


    app.douban.findOne(req.id).then(d => {
      this.setData({
        title: d.title,
        movie: d
      })
      wx.hideLoading()
    }).catch(e => {
      this.setData({
        title: '获取数据异常',
        movie: {}
      })
      console.error(e)
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // wx.setNavigationBarTitle({
    //   title: this.data.title})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 折叠开关
   */
  foldToggle() {
    const {isFold} = this.data;
    this.setData({
      isFold: !isFold
    })
  },

  onCastImagePre(e) {
    const {img} = e.currentTarget.dataset;
    const {movie} = this.data;
    let urls = [];
    for (let cast of movie.casts) {
      urls.push(cast.avatars.large)
    }
    wx.previewImage({
      current: img,
      urls
    })
  },

  onImagePre(e) {
    const {
      img
    } = e.currentTarget.dataset;
    const {
      movie
    } = this.data;
    let urls = [];
    for (let p of movie.photos) {
      urls.push(p.image)
    }
    wx.previewImage({
      current: img,
      urls
    })
  },

  onPriceComparison: function({
    currentTarget = {}
  }) {
    const {
      dataset = {}
    } = currentTarget;
    wx.navigateTo({
      url: '/page/cinema2/cinema2?movieId=' + dataset.id + '&movieName=' + dataset.title
    })
  }
})