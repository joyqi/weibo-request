weibo = require('./build/weibo');
args = process.argv.slice(2);

if (args.length == 0) {
    console.log('Please provide a valid Weibo URL.');
} else {
    weibo(args[0], function (err, data) {
        if (err) {
            return console.log(err);
        }

        console.log(JSON.stringify(data, null, 4));
    });
}
