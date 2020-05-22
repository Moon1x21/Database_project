var request = require('request');

var url = 'http://apis.data.go.kr/1741000/DisasterMsg2/getDisasterMsgList';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '=d%2BqlH55q8ry2VcxH5jFKLxbpftg28ieOGz5mk8DZxtiq7kclfR8GMqih5%2BzoIkBo3RVXn4tgNUJ1PzTIBgbfgw%3D%3D'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('xml'); /* */
queryParams += '&' + encodeURIComponent('flag') + '=' + encodeURIComponent('Y'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    console.log('Status', response.statusCode);
    console.log('Headers', JSON.stringify(response.headers));
    console.log('Reponse received', body);
});