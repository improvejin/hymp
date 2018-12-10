const URI = 'https://api.map.baidu.com'
const fetch = require('./fetch')
const ak = 'hHjBwKZxbdTcHE9LIpbu1Ww1zDG9B6L1'
const sak = '615vWMGUK21Aptg8Z00ZGaGF13IFPGdH'
const output = 'json'

String.prototype.format = function () {
  var values = arguments;
  return this.replace(/\{(\d+)\}/g, function (match, index) {
    if (values.length > index) {
      return values[index];
    } else {
      return "";
    }
  });
};　


function fetchApi (type, params) {
  return fetch(URI, type, params)
}

/**
 * 根据经纬度获取城市
 * @param  {Number} latitude   经度
 * @param  {Number} longitude  纬度
 * @return {Promise}       包含抓取任务的Promise
 */
function getCityName (latitude = 39.90403, longitude = 116.407526) {
  const params = { location: `${latitude},${longitude}`, output: output, ak: ak }
  return fetchApi('geocoder/v2/', params)
    .then(res => res.data.result.addressComponent.city)
}

function getRouteDistance(origin, destinations) {
  const params = {origins: origin, destinations: destinations, output: output, ak: sak}
  return fetchApi('routematrix/v2/walking/', params)
        .then(res => res.data)
}

function getBDGeo(latitude, longitude){
  const params = { coords: `${longitude},${latitude}`, from: 1, to: 5, output: output, ak: ak}
  return fetchApi('geoconv/v1/', params)
    .then(res => '{0},{1}'.format(res.data.result[0].y, res.data.result[0].x))
}

function getGeoCode2(city, address){
  const params = { city: city, address: address, output: output, ak: ak, ret_coordtype: 'gcj02ll' }
  return fetchApi('geocoder/v2/', params)
    .then(res => res.data.result)
}

function getGeoCode(city, address) {
  const params = { city: city, address: address, output: output, ak: ak, ret_coordtype:'bd09ll'}
  return fetchApi('geocoder/v2/', params)
    .then(res => res.data.result)
}

module.exports = { getCityName, getRouteDistance, getBDGeo, getGeoCode, getGeoCode2}
