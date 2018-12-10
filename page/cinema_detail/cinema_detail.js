// page/cinema_detail/cinema_detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    vertical: false,
    indicatorDots: true,
    circular: true,
    
    cinemaId: 0,
    cinemaName: '',
    cinemaAddr: '',

    movies: [],
    currentMovieIndex: 0,
    currentMovie: {},
    currentMoviePrices: [],
    tab:{
      dates:[],
      activeDateIndex: 0,
    },

    // sliderOffset: 0,
    // sliderLeft: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (req) {
    wx.setNavigationBarTitle({
      title: req.name,
    })

    const cinemaId=req.id, movieId = req.movieId
    this.setData({
      cinemaId: cinemaId,
      cinemaName: req.name,
      cinemaAddr: req.addr
    })

    wx.showLoading({ title: '拼命加载中...' })
    app.hys.getMoviesByCinema(cinemaId).then(movies => {
      var currentMovieIndex = this.getCurrentMovieIndex(movies, movieId)
      var found = true
      if(currentMovieIndex == -1) {
        found = false
        currentMovieIndex = 0
      }

      var currentMovie = movies[currentMovieIndex]
      this.setData({
        movies: movies,
        currentMovieIndex: currentMovieIndex,
        currentMovie: currentMovie
      })
      this.getCurrentMoviePrices(cinemaId, currentMovie.id).then(prices => {
        var dates = prices.map((p, index)=>{
          return {
            id: index,
            title: p.date
          }
        })

        this.setData({
          currentMoviePrices: prices,
          ['tab.dates']: dates,
          ['tab.activeDateIndex']: 0
        })
        wx.hideLoading()

        this.showHint(found)

      })

    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },


  showHint: function(found) {
    if (found == false) {
      // wx.showToast({
      //   title: '当前影院无此电影在售',
      //   icon: 'None',
      //   duration: 2000
      // })

      wx.showModal({
        title: '',
        content: '当前影院无此电影比价信息,查看当前影院其他电影信息？',
        // confirmText: '重新选择',
        // cancelText: '查看当前影院',
        confirmColor: "#d81e06",
        success: function (res) {
          if (res.cancel) {
            wx.navigateBack({
              delta: 1
            })
            console.log('重新选择影院')
          } else if (res.confirm) {
            console.log('继续查看当前影院')
          }
        }
      })
    }
  },


  getCurrentMovieIndex:function(movies, movieId) {
      if(movieId==-1) {
        return 0
      } else {
        for(var i=0; i<movies.length;++i) {
          if(movies[i].id == movieId) {
            return i;
          }
        }
        return -1
      }
  },

  // getMovies: function (cinemaId, cinemaAddr, currentMovieIndex) {
  // },


  getCurrentMoviePrices: function(cinemaId, movieId){
    return app.hys.getMoviePrices(cinemaId, movieId)     
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
    this.setData({currentMoviePrices: [] })
    wx.showLoading({ title: '拼命加载中...' })
    this.getCurrentMoviePrices(this.data.cinemaId, this.data.currentMovie.id).then(prices => {
      var dates = prices.map((p, index) => {
        return {
          id: index,
          title: p.date
        }
      })

      this.setData({
        currentMoviePrices: prices,
        ['tab.dates']: dates,
        ['tab.activeDateIndex']: 0
      })
      wx.hideLoading()
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
    wx.stopPullDownRefresh()
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

  showMap:function(){
    app.baidu.getGeoCode2(app.getCurrentCity(), this.data.cinemaAddr).then(res=>{
      const latitude = res.location.lat
      const longitude = res.location.lng
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        address: this.data.cinemaAddr,
        name: this.data.cinemaName,
        scale: 18
      })
    }).catch(err => {
      console.error(err)
    })

    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 28
    //     })
    //   }
    // })
  },

  movieChange: function(e) {
    console.log(e);
    if(e.detail.source == 'touch') {
      var currentMovieIndex = e.detail.current
      var currentMovie = this.data.movies[currentMovieIndex]
      wx.showLoading({ title: '拼命加载中...' })
      this.getCurrentMoviePrices(this.data.cinemaId, currentMovie.id).then(prices => {
        var dates = prices.map((p, index) => {
          return {
            id: index,
            title: p.date
          }
        })

        this.setData({
          currentMovieIndex: currentMovieIndex,
          currentMovie: currentMovie,
          // activeDateIndex: 0,
          // sliderOffset: 0,
          currentMoviePrices: prices,
          ['tab.dates']: dates,
          ['tab.activeDateIndex']: 0
        })
        wx.hideLoading()
      }).catch(err => {
        console.error(err)
        wx.hideLoading()
      })
    }
  },

  scheduleTabClick: function (selectedTab) {
    this.setData({
      ['tab.activeDateIndex']: selectedTab.detail
    });
  },

  scheduleToggle: function (e) {
    var id = e.currentTarget.id, prices = this.data.currentMoviePrices;
    var schedules = prices[this.data.tab.activeDateIndex].schedules
    for (var i = 0, len = schedules.length; i < len; ++i) {
      if (schedules[i].begin == id) {
        schedules[i].open = !schedules[i].open
      } else {
        schedules[i].open = false
      }
    }
    this.setData({
      currentMoviePrices: prices
    });
  }
})