# weibo-request

这个库可以解析任意合法的微博状态URL，并将它转化为标准的数据格式输出。

## 安装

```
npm install weibo-request
```

## 使用

```javascript
var weibo = require('weibo-request');

weibo('https://weibo.com/2036070420/FyGnYmrxE', function (err, data) {
    if (err) {
        return console.log(err);
    }

    console.log(data);
});
```

## 数据范例

```json
{
    "id": "4182660865349090",
    "title": "SSH 登录流程分析",
    "text": "【SSH 登录流程分析】<a data-url=\"http://t.cn/RYk411m\" target=\"_blank\" href=\"https://weibo.cn/sinaurl/blocked44182325?luicode=20000061&lfid=4182660865349090&u=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000012333003\" class=\"\"><span class=\"url-icon\"><img src=\"https://h5.sinaimg.cn/upload/2015/09/25/3/timeline_card_small_web_default.png\"></span></i><span class=\"surl-text\">网页链接</a>，作者：JayChen（<a data-url=\"http://t.cn/RYkMQ94\" target=\"_blank\" href=\"https://weibo.cn/sinaurl/blocked01941159?luicode=20000061&lfid=4182660865349090&u=https%3A%2F%2Fsegmentfault.com%2Fu%2Fchenjiayao\" class=\"\"><span class=\"url-icon\"><img src=\"https://h5.sinaimg.cn/upload/2015/09/25/3/timeline_card_small_web_default.png\"></span></i><span class=\"surl-text\">网页链接</a>）<br/><br/>写一篇短文，介绍 ssh 密钥登录远程服务器流程和注意事项。<br/>-  登录流程<br/>-  生成密钥对<br/>-  首次 ssh 登录<br/>-  中间人攻击<br/>-  known_hosts 文件<br/>-  config 配置 ​",
    "plainText": "【SSH 登录流程分析】<a href=\"http://t.cn/RYk411m\">网页链接</a>，作者：JayChen（<a href=\"http://t.cn/RYkMQ94\">网页链接</a>）<br/><br/>写一篇短文，介绍 ssh 密钥登录远程服务器流程和注意事项。<br/>-  登录流程<br/>-  生成密钥对<br/>-  首次 ssh 登录<br/>-  中间人攻击<br/>-  known_hosts 文件<br/>-  config 配置 ​",
    "date": "2017-12-08T04:32:03.000Z",
    "url": "https://weibo.com/2036070420/FyGnYmrxE",
    "thumbnail": "http://wx2.sinaimg.cn/thumbnail/795bf814gy1fm96qh5j2sj20m80duglv.jpg",
    "pics": [
        [
            "https://wx2.sinaimg.cn/orj360/795bf814gy1fm96qh5j2sj20m80duglv.jpg",
            "https://wx2.sinaimg.cn/large/795bf814gy1fm96qh5j2sj20m80duglv.jpg"
        ]
    ],
    "reposts": 6,
    "comments": 1,
    "likes": 4,
    "reads": 2040,
    "user": {
        "name": "SegmentFault",
        "url": "https://weibo.com/u/2036070420",
        "avatar": "https://ww2.sinaimg.cn/orj480/795bf814jw1e8qgp5bmzyj2050050aa8.jpg"
    }
}
```

## 使用范例

源码包下的 `cli.js` 可以用来测试数据格式

![screen](http://wx2.sinaimg.cn/large/6828cfabgy1fm99mq0mixj20r20h643c.jpg)
