var host =
  process.env.NODE_ENV === 'development' ? '//localhost' : '//10.8.2.133';

var url = host + '/datainterface/api?ID=';

var rtxJmpLink = '//10.8.2.133:90';

import rtx from './rtx';

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
    articleHome: 'http://localhost:90/api/57/e25408e435', // url + 402 + '&M=0',

    // 主页各模块Top5，无请求参数，一次加载完成
    articleTop5: 'http://localhost:90/api/56/67772bd935', // url + 412 + '&M=0',

    myWorkList: 'http://localhost:90/api/55/b0fdc7440d', // url + 413 + '&M=0',

    myWorkListByPage: 'http://localhost:90/api/58/21eac5516f', // url + 414 + '&M=0',

    // 文章详情
    articleDetail: 'http://localhost:90/api/52/4ea73d46fc', // 'http://10.8.1.25:100/api/298/2011115320',

    // 文章评论
    commentDetail: 'http://localhost:90/api/53/bbf61894f5', // url + 404 + '&M=0',

    // 文章列表详情
    articleList: 'http://localhost:90/api/59/9ce72536da', // url + 405 + '&M=0',

    // 附件列表
    attachList: 'http://localhost:90/api/54/6685ffcc2f', // url + 406 + '&M=0',

    // 媒体列表
    mediaList: 'http://localhost:90/api/60/c7c49da170', // url + 407 + '&M=0',

    // 素材库载入更多:
    mediaLoadMore: 'http://localhost:90/api/61/f179198b56', // url + 408 + '&M=0&cache=10',

    // 登录模块-用户列表
    userList: 'http://localhost:90/api/62/337580349b', // url + 409 + '&M=0',

    // md5 encrypt
    md5: host + '/datainterface/md5',

    // login
    login: url + 165 + '&M=0',

    // search
    search: url + 410 + '&M=0', // 'http://localhost:90/api/63/1013f75c9c', // 不允许字符串拼接

    // rtxPush
    rtxPush: host + '/datainterface/rtxpush',

    readnum: 'http://localhost:90/api/65/c231fe5f9f', // url + 474 + '&M=3',
    commentnum: 'http://localhost:90/api/64/59eef0d55a' // url + 475 + '&M=3'
  },
  rewardUsers: ['袁长虹', '张建军', '陈晶', '张楠岚', '赵洪新', '达时'],
  verifyUsers: ['袁长虹', '张楠岚', '赵洪新', '达时'],
  rtxInfo: rtx.rtxInfo
};
