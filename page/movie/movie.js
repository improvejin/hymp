
// 获取全局应用程序实例对象
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",

    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1200,

    tab: {
      list: [{
        id: 0,
        title: '正在上映'
      }, {
        id: 1,
        title: '即将上映'
      }],
      selectedId: 0
    },

    poster: [],

    boards: [
     {  
      key: 'in_theaters',
      page: 1,
      size: 8,
      hasMore: true,
      movies:[]
     },
     {
       key: 'coming_soon',
       page: 1,
       size: 8,
       hasMore: true,
       movies:[]
     }
   ],

    // type: 'in_theaters',
    // hasMore: true,
    // page: 1,
    // size: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '拼命加载中...' })

    const tasks = this.data.boards.map(board => {
      return app.douban.find(board.key, board.page++, board.size)
        .then(d => {
          board.title = d.title
          board.movies = d.subjects
          return board
        })
    })
    
    Promise.all(tasks).then(boards => {
      this.setData({ 
        posters: boards[0].movies,
        [`boards[0].movies`]: boards[0].movies,
        [`boards[1].movies`]: boards[1].movies
        })
      wx.hideLoading()
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
    this.setData({
      poster: [], 
      reachBottom: false,

      [`boards[0].page`]: 1,
      [`boards[0].hasMore`]: true,
      [`boards[0].movies`]: [],
      
      [`boards[1].page`]: 1,
      [`boards[1].hasMore`]: true,
      [`boards[1].movies`]: []
    })
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.loadMore();
  },


  loadMore: function() {
    const index = this.data.tab.selectedId
    const board = this.data.boards[index]
    if (!board.hasMore) 
      return

    wx.showLoading({ title: '拼命加载中...' })

    return app.douban.find(board.key, board.page++, board.size)
      .then(d => {
        if (d.subjects.length) {
          var movies = 'boards[' + index + '].movies'
          this.setData({ [movies]: board.movies.concat(d.subjects) })
        } else {
          var hasMore = 'boards[' + index + '].hasMore'
          this.setData({ [hasMore]: false})
        }
        wx.hideLoading()
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常' })
        console.error(e)
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
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  searchMovie: function (e) {
    console.log(e.detail.value)
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  handleTabChange: function (selectedTab){
    // console.log(selectedTab)
    this.setData({
      [`tab.selectedId`]: selectedTab.detail
    })
  },

  onPriceComparison: function({ currentTarget = {} }) {
    console.log(currentTarget)
    const { dataset = {} } = currentTarget;
    wx.navigateTo({
      url: '/page/cinema2/cinema2?movieId='+dataset.id+'&movieName='+dataset.title
    })
  }
})