var http = require('http');
var fs = require('fs');
var url = 'http://sam.dev/PUBG/stats.php?u=samjuk';

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var stats = JSON.parse(body).Stats[0].Stats;
        var string = "";
        var i = 0;
        stats.forEach(function(stat) {
            string += (`${i}: ${stat.label}\r\n`);
            i++;
        }, this);
        fs.writeFile('statsIndexDump.txt', string, () => {
            console.log('Stats wrote to statsIndexDump.txt');
        });
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});