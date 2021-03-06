const state = {
  add: {
    prod: '',
    proc: '',
    machine: '',
    operator: [],
    cartno: '',
    category: '',
    content: '',
    title: '',
    receiver: '',
    remark: '',
    reward: 5,
    reward_status: 0,
    reward_user: ''
  },
  commentContent: '',
  rtxlist: [], // 添加新数据库字段

  // 文章预览数据
  preview: '',
  previewMode: 0,

  activeIndex: '',
  listId: '',
  user: {
    name: '',
    id: '',
    avatar: '',
    username: '',
    unLogin: true
  },
  articleId: {}, // 记录各分类的最大id

  // 文章二级列表数据缓存
  newsList: {},
  // 主页列表缓存
  mainList: [],
  needRefreshMainList: false,

  // 附件文件列表
  fileList: [],
  // 最近上传文件
  latestFile: {},

  // 媒体库列表
  activeName: '',

  // 搜索结果
  searchResult: [],
  showPartyUrl: false
};

export default state;
