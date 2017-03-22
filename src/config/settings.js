var host = 'http://10.8.2.133';
//host = 'http://localhost';
var url = host + '/datainterface/api?ID=';
var rtxJmpLink = 'http://10.8.2.133:90';
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

    // 文章列表详情332
    articleList: url + 404 + '&M=0',

    // 主页模块329
    articleHome: url + 402 + '&M=0',

    // 文章详情330
    articleDetail: url + 403 + '&M=0',

    // 文章评论331
    commentDetail: url + 405 + '&M=0',

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
  rtxInfo: {
    technology: [{
      value: '徐东海',
      id: 10866
    }, {
      value: '陈文革',
      id: 10867
    }, {
      value: '钟鸣',
      id: 10864
    }, {
      value: '曹娅',
      id: 10844
    }, {
      value: '包诚',
      id: 10877
    }, {
      value: '陈姝婧',
      id: 10906
    }, {
      value: '李丹',
      id: 10927
    }, {
      value: '杨畅',
      id: 10749
    }, {
      value: '汪雄',
      id: 10738
    }, {
      value: '吕从飞',
      id: 10754
    }, {
      name: '袁长虹',
      id: 10863
    }, {
      name: '张建军',
      id: 10875
    }, {
      name: '张楠岚',
      id: 10650
    }, {
      name: '赵洪新',
      id: 10652
    }, {
      name: '达时',
      id: 11122
    }],
    imgVs: [{
      name: '徐闵',
      id: 10884
    }, {
      name: '胡新玥',
      id: 10861
    }, {
      name: '马可',
      id: 10876
    }, {
      name: "李超群",
      id: 10883
    }, {
      name: "李宾",
      id: 10654
    }, {
      name: "舒粤",
      id: 10865
    }, {
      name: "蒲明玥",
      id: 10882
    }, {
      name: "杨林",
      id: 10862
    }, {
      name: "金鑫",
      id: 10880
    }],
    paper: [{
      value: '陈晶',
      id: 10871,
    }, {
      value: '杜煜',
      id: 10872
    }, {
      value: '赵锦良',
      id: 10858
    }],
    reward: [{
      name: '袁长虹',
      id: 10863
    }, {
      name: '张建军',
      id: 10875
    }, {
      name: '陈晶',
      id: 10871
    }, {
      name: '张楠岚',
      id: 10650
    }, {
      name: '赵洪新',
      id: 10652
    }, {
      name: '达时',
      id: 11122
    }],
    verify:[{
      name: '张楠岚',
      id: 10650
    }, {
      name: '赵洪新',
      id: 10652
    }, {
      name: '达时',
      id: 11122
    }]
  }
}
