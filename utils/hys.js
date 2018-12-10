const URI = 'https://jinjiating.xyz'
const fetch = require('./fetch')
const baidu = require('./baidu.js')

function fetchApi(type, params) {
  return fetch(URI, type, params)
}

function listCinemas(url, params, origin) {
  var cinemas = fetchApi(url, params).then(res => {
    if (res.data.length == 0) {
      return []
    }

    var cinemas_lat_lng = ''
    for (var i = 0; i < res.data.length; i++) {
      cinemas_lat_lng = cinemas_lat_lng.concat(res.data[i].lat_lng)
      cinemas_lat_lng = cinemas_lat_lng.concat('|')
    }
    cinemas_lat_lng = cinemas_lat_lng.substr(0, cinemas_lat_lng.length - 1)

    return baidu.getRouteDistance(origin, cinemas_lat_lng).then(distance_result => {
      if (distance_result['status'] !=0) {
        return res.data
      }

      var distance = distance_result['result']
      for (var i = 0; i < distance.length; i++) {
        var s = distance[i].distance.text
        res.data[i]['distance'] = s.replace('公里', 'km').replace('米', 'm')
      }
      return res.data
    })
  })

  return cinemas
}

//通过当前位置查找影院
function getCinemas(latitude, longitude, city, district, sortBy, page, size = 10) {

  return baidu.getBDGeo(latitude, longitude).then(location=>{

    const params = {
      city: city,
      location: location,
      district: district,
      sortBy: sortBy,
      page: page,
      size: size
    }

    return listCinemas('cinemas', params, params.location)
    })
}

//通过suggestion查找影院
function searchCinemas(city, latitude, longitude, page, size = 10, currentLocation) {

  return baidu.getBDGeo(currentLocation.latitude, currentLocation.longitude).then(location => {

    const params = {
      city: city,
      location: `${latitude},${longitude}`,
      page: page,
      size: size
    }

    var origin = currentLocation.latitude + ',' +currentLocation.longitude

    return listCinemas('cinemas/search/', params, origin)
  })
}

function getMoviesByCinema(cinemaId) {
  const params = {
    cinemaId: cinemaId
  }
  return fetchApi('movies', params).then(res=>res.data)
}

function getMoviePrices(cinemaId, movieId) {
  const params = {
    cinemaId: cinemaId
  }
  return fetchApi('movies/'+movieId+'/price/', params).then(res => {
    var prices = res.data
    for (var i = 0; i < prices.length; i++) {
      for(var j=0; j< prices[i].schedules.length; j++) {
        var schedule = prices[i].schedules[j]
        const num = schedule.prices.length
        schedule['num'] = num
        schedule['open'] = j==0
        for(var k=0; k<num; k++) {
          var p = schedule.prices[k]
          if(p.channel == 'mt') {
            p.channel = '猫眼'
          } else if (p.channel == 'tb'){
            p.channel = '淘票票'
          } else if (p.channel == 'lm') {
            p.channel = '糯米'
          }
        }
      }
    }
    return prices
  })
}

module.exports = { getCinemas, searchCinemas, getMoviesByCinema, getMoviePrices }