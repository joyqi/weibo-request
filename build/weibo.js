// Generated by CoffeeScript 1.12.2
(function() {
  var Cheerio, Request, URL, VM, WeiboID,
    slice = [].slice;

  WeiboID = require('weibo-ids');

  Cheerio = require('cheerio');

  VM = require('vm2').VM;

  Request = require('request');

  URL = require('url');

  module.exports = function(url, cb) {
    var id, matches, promise, reject, resolve, scheme;
    if (cb == null) {
      cb = null;
    }
    promise = null;
    if (cb == null) {
      resolve = null;
      reject = null;
      promise = new Promise(function(res, rej) {
        resolve = res;
        return reject = rej;
      });
      cb = function(err, data) {
        if (data == null) {
          data = null;
        }
        if (err != null) {
          reject(err);
        } else {
          resolve(data);
        }
        return promise;
      };
    }
    scheme = URL.parse(url);
    if (!scheme) {
      return cb(new Error('Url is not correct.'));
    }
    id = null;
    if (scheme.host === 'weibo.com') {
      matches = scheme.pathname.match(/^\/[0-9]+\/([0-9a-z]+)$/i);
      if (!matches) {
        return cb(new Error(scheme.path + " is not a valid path."));
      }
      id = matches[1];
    } else if (scheme.host === 'm.weibo.cn') {
      matches = scheme.pathname.match(/^\/status\/([0-9a-z]+)$/i);
      if (!matches) {
        return cb(new Error(scheme.path + " is not a valid path."));
      }
      id = matches[1];
    }
    if (id == null) {
      return cb(new Error('Url is not correct.'));
    }
    Request({
      uri: 'https://m.weibo.cn/status/' + id,
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
      }
    }, function(err, response, body) {
      var $, data, e, i, len, pic, pics, ref, script, status, text, vm;
      if (err != null) {
        return cb(err);
      }
      $ = Cheerio.load(body);
      script = ($('script')).eq(1).html() + ';$render_data';
      vm = new VM({
        timeout: 1000,
        sandbox: {
          location: {
            href: ''
          }
        }
      });
      try {
        data = vm.run(script);
        if (typeof data.status === 'undefined') {
          return cb(new Error('Status has no data.'));
        }
        status = data.status;
        pics = [];
        text = status.text.replace(/<(\/?)([_a-z0-9-]+)(\s+[^>]+)?>/ig, function() {
          var all, matches;
          matches = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (matches[2] !== 'a') {
            return '';
          }
          if (matches[1] === '/') {
            return matches[0];
          }
          url = '#';
          if (matches[3] != null) {
            if (!!(all = matches[3].match(/\s+href="([^"]+)"/i))) {
              url = all[1];
            }
            if (!!(all = matches[3].match(/\s+data\-url="([^"]+)"/i))) {
              url = all[1];
            }
          }
          return "<a href=\"" + url + "\">";
        });
        if (status.pics != null) {
          ref = status.pics;
          for (i = 0, len = ref.length; i < len; i++) {
            pic = ref[i];
            pics.push([pic.url, pic.large.url]);
          }
        }
        return cb(null, {
          id: status.id,
          bid: status.bid,
          title: status.status_title,
          text: status.text,
          plainText: text,
          date: new Date(status.created_at),
          url: 'https://weibo.com/' + status.user.id + '/' + mid,
          thumbnail: status.thumbnail_pic,
          pics: pics,
          reposts: status.reposts_count,
          comments: status.comments_count,
          likes: status.attitudes_count,
          reads: status.reads,
          user: {
            name: status.user.screen_name,
            url: 'https://weibo.com/u/' + status.user.id,
            avatar: status.user.avatar_hd
          }
        });
      } catch (error) {
        e = error;
        return cb(e);
      }
    });
    return promise;
  };

}).call(this);
