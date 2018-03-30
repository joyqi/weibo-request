WeiboID = require 'weibo-ids'
Cheerio = require 'cheerio'
{VM} = require 'vm2'
Request = require 'request'
URL = require 'url'

module.exports = (url, cb = null, cookie = null) ->
    promise = null

    if not cb?
        resolve = null
        reject = null
        
        promise = new Promise (res, rej) ->
            resolve = res
            reject = rej

        cb = (err, data = null) ->
            if err?
                reject err
            else
                resolve data

            promise
            

    # 解析URL
    scheme = URL.parse url
    return cb new Error 'Url is not correct.' if not scheme

    id = null

    if scheme.host is 'weibo.com'
        # web版
        matches = scheme.pathname.match /^\/[0-9]+\/([0-9a-z]+)$/i
        return cb new Error "#{scheme.path} is not a valid path." if not matches

        id = matches[1]
    else if scheme.host is 'm.weibo.cn'
        # mobile版
        matches = scheme.pathname.match /^\/status\/([0-9a-z]+)$/i
        return cb new Error "#{scheme.path} is not a valid path." if not matches

        id = matches[1]

    return cb new Error 'Url is not correct.' if not id?

    headers = 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    headers.Cookie = cookie if cookie?

    # 请求移动版地址
    Request
        uri: 'https://m.weibo.cn/status/' + id
        timeout: 5000
        headers: headers
    , (err, response, body) ->
        return cb err if err?
        $ = Cheerio.load body

        script = ($ 'script').eq 1
            .html() + ';$render_data'

        # 执行VM
        vm = new VM
            timeout: 1000
            sandbox:
                location:
                    href: ''

        try
            data = vm.run script
            return cb new Error 'Status has no data.' if typeof data.status is 'undefined'

            status = data.status
            pics = []

            text = status.text.replace /<(\/?)([_a-z0-9-]+)(\s+[^>]+)?>/ig, (matches...) ->
                return '' if matches[2] isnt 'a'
                return matches[0] if matches[1] is '/'
                url = '#'

                if matches[3]?
                    if !!(all = matches[3].match /\s+href="([^"]+)"/i)
                        url = all[1]

                    if !!(all = matches[3].match /\s+data\-url="([^"]+)"/i)
                        url = all[1]
                    
                return "<a href=\"#{url}\">"
                    
            if status.pics?
                pics.push [pic.url, pic.large.url] for pic in status.pics

            cb null,
                id: status.id
                bid: status.bid
                title: status.status_title
                text: status.text
                plainText: text
                date: new Date status.created_at
                url: 'https://weibo.com/' + status.user.id + '/' + status.bid
                thumbnail: status.thumbnail_pic
                pics: pics
                reposts: status.reposts_count
                comments: status.comments_count
                likes: status.attitudes_count
                reads: status.reads
                user:
                    name: status.user.screen_name
                    url: 'https://weibo.com/u/' + status.user.id
                    avatar: status.user.avatar_hd
        catch e
            cb e

    promise

