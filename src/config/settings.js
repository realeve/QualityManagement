var host = 'http://localhost';
var url = host + '/datainterface/api?ID=';
export default {
    host,
    url,
    api: {
        //提交数据
        insert: host + "/DataInterface/insert",

        //文章列表详情
        articleList: url + 332 + '&M=0',

        //主页模块
        articleHome: url + 329 + '&M=0',

        //文章详情
        articleDetail: url + 330 + '&M=0',

        //文章评论
        commentDetail: url + 331 + '&M=0'
    }
};