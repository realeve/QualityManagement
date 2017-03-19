var host = 'http://localhost'
var url = host + '/datainterface/api?ID='
export default {
    host,
    url,
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

        //FILEDELETE (GET)
        fileDelete: host + '/upload/upload.php',

        // 文章列表详情
        articleList: url + 332 + '&M=0',

        // 主页模块
        articleHome: url + 329 + '&M=0',

        // 文章详情
        articleDetail: url + 330 + '&M=0',

        // 文章评论
        commentDetail: url + 331 + '&M=0',

        //附件列表
        attachList: url + 333 + '&M=0',

        //媒体列表
        mediaList: url + 334 + '&M=0',

        //素材库载入更多:
        mediaLoadMore: url + 335 + '&M=0&cache=10'
    }
}