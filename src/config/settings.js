var host = 'http://10.8.2.133'
host = 'http://localhost'

var url = host + '/datainterface/api?ID='

var rtxJmpLink = 'http://10.8.2.133:90'

import rtx from './rtx'

export default {
    host,
    url,
    rtxJmpLink,
    uploadContent: host + '/upload',
    api: {
        // POST
        insert: host + '/DataInterface/insert',

        // UPDATE
        update: host + '/DataInterface/update',

        // DELETE (POST)
        delete: host + '/DataInterface/delete',

        // FILEUPLOAD (POST)
        fileUpload: host + '/upload/upload.php',

        // FILEDELETE (GET)
        fileDelete: host + '/upload/upload.php',

        // 主页模块
        articleHome: url + 402 + '&M=0',

        // 主页各模块Top5，无请求参数，一次加载完成
        articleTop5: url + 412 + '&M=0',

        myWorkList: url + 413 + '&M=0',

        myWorkListByPage: url + 414 + '&M=0',

        // 文章详情
        articleDetail: url + 403 + '&M=0',

        // 文章评论
        commentDetail: url + 404 + '&M=0',

        // 文章列表详情
        articleList: url + 405 + '&M=0',

        // 附件列表
        attachList: url + 406 + '&M=0',

        // 媒体列表
        mediaList: url + 407 + '&M=0',

        // 素材库载入更多:
        mediaLoadMore: url + 408 + '&M=0&cache=10',

        // 登录模块-用户列表
        userList: url + 409 + '&M=0',

        // md5 encrypt
        md5: host + '/datainterface/md5',

        // login
        login: url + 165 + '&M=0',

        // search
        search: url + 410 + '&M=0',

        // rtxPush
        rtxPush: host + '/datainterface/rtxpush'
    },
    rewardUsers: ['袁长虹', '张建军', '陈晶', '张楠岚', '赵洪新', '达时'],
    verifyUsers: ['张楠岚', '赵洪新', '达时'],
    rtxInfo: rtx.rtxInfo
}