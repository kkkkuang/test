var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
http.get('http://www.haha.mx/topic/1/new/', function(res) {
	var data = '';
	res.on('data', function(chunk) {
		data += chunk;
	})
	res.on('end', function() {
		//console.log(data);
		var $ = cheerio.load(data);
		var imgArr = [];
		var html = $(".joke-list-item .joke-main-content a img");
		html.each(function(i, e) {
			/*connection.query("INSERT INTO `images`(`url`) VALUES ('" + $(e).attr('src') + "')", function(err, data) {
				if(err) throw err
				console.log("保存进度:" + (i + 1) + "/25" + $(e).attr('src'));
			})*/
			imgArr.push($(e).attr('src'));
		});
		//console.log(imgArr);
		download(imgArr);
	})
})

var i = 0;

function download(resource) {
	var length = resource.length;
	var writerStream = fs.createWriteStream('image/' + i + '.jpg');
	http.get(resource[i], function(res) {
		res.pipe(writerStream);
		if(i < length) {
			i++;
			download(resource);
		} else {
			return;
		}
	})
	writerStream.on('finish', function() {
		console.log("第" + i + '/' + length + "张下载成功")
	})
}