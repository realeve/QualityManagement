var options = {
    proc: [{
            value: "0",
            label: "辅料"
        },
        {
            value: "1",
            label: "油墨"
        },
        {
            value: "2",
            label: "印版"
        },
        {
            value: "3",
            label: "白纸数管"
        },
        {
            value: "4",
            label: "钞纸"
        },
        {
            value: "5",
            label: "胶印"
        },
        {
            value: "6",
            label: "凹印"
        },
        {
            value: "7",
            label: "印码"
        },
        {
            value: "8",
            label: "检封"
        }
    ],
    prod: [],
    machine: [],
    operator: [{
            label: "印钞管理部",
            options: [{
                    value: "武明凯"
                },
                {
                    value: "张楠岚"
                }, {
                    value: '赵立军',
                    id: 11202
                },
                {
                    value: "张宪"
                }
            ]
        },
        {
            label: "钞纸管理部",
            options: [{
                    value: "赵洪新"
                },
                {
                    value: "达时"
                },
                {
                    value: "吕树荣"
                }
            ]
        },
        {
            label: "印钞工艺组",
            options: [{
                    value: "徐东海"
                },
                {
                    value: "陈文革"
                },
                {
                    value: "钟鸣"
                },
                {
                    value: "袁长虹"
                },
                {
                    value: "杨晓娟"
                }, {
                    value: "舒粤"
                },
                {
                    value: "张建军"
                },
                {
                    value: "曹娅"
                },
                {
                    value: "包诚"
                },
                {
                    value: "陈姝婧"
                },
                {
                    value: "李丹"
                },
                {
                    value: "杨畅"
                },
                {
                    value: "周海兵",
                    id: 11184
                },
                {
                    value: "吕从飞"
                }
            ]
        },
        {
            label: "印刷机检组",
            options: [{
                    value: "舒粤"
                },
                {
                    value: "蒲明玥"
                },
                {
                    value: "冯诗伟"
                },
                {
                    value: "金鑫"
                },
                {
                    value: "李宾"
                },
                {
                    value: "徐闵"
                },
                {
                    value: "李超群"
                },
                {
                    value: "张立力"
                },
                {
                    value: "潘成"
                },
                {
                    value: "朱振华"
                },
                {
                    value: "马可"
                }
            ]
        },
        {
            label: "检封机检组",
            options: [{
                    value: "杨林"
                },
                {
                    value: "冯诗伟"
                },
                {
                    value: "胡新玥"
                },
                {
                    value: "蒋荣"
                },
                {
                    value: "任礼科"
                }
            ]
        },
        {
            label: "综合管理及班组长",
            options: [{
                    value: "白薇"
                },
                {
                    value: "杨洁"
                },
                {
                    value: "权净"
                },
                {
                    value: "吴运笙"
                },
                {
                    value: "蔡憬"
                },
                {
                    value: "周琳丽"
                },
                {
                    value: "吴梅"
                },
                {
                    value: "徐群英"
                },
                {
                    value: "廖迎春"
                }
            ]
        },
        {
            label: "钞纸机检组",
            options: [{
                    value: "于潇"
                },
                {
                    value: "丰锋"
                },
                {
                    value: "彭鹏"
                },
                {
                    value: "郭峰"
                },
                {
                    value: "王严"
                }
            ]
        },
        {
            label: "钞纸工艺组",
            options: [{
                    value: "王梅"
                },
                {
                    value: "陈晶"
                },
                {
                    value: "周正东"
                },
                {
                    value: "杜煜"
                },
                {
                    value: "赵锦良"
                },
                {
                    value: "李政"
                },
                {
                    value: "张宁"
                },
                {
                    value: "罗克"
                },
                {
                    value: "黄凯"
                },
                {
                    value: "林莉"
                }
            ]
        },
        {
            label: "物检中心",
            options: [{
                    value: "李奎昌"
                },
                {
                    value: "李虹斌"
                },
                {
                    value: "刘方群"
                }
            ]
        },
        {
            label: "设备管理部",
            options: [{
                    value: "王昌明"
                },
                {
                    value: "周晓平"
                },
                {
                    value: "谢其德"
                },
                {
                    value: "白平"
                },
                {
                    value: "杜宁"
                },
                {
                    value: "张亚伟"
                },
                {
                    value: "任伟"
                }
            ]
        },
        {
            label: "物资管理部",
            options: [{
                    value: "贾燕"
                },
                {
                    value: "赵军"
                },
                {
                    value: "刘洪桔"
                },
                {
                    value: "张莲娜"
                },
                {
                    value: "李平"
                },
                {
                    value: "魏屹"
                }
            ]
        },
        {
            label: "企划信息部",
            options: [{
                    value: "唐璇"
                },
                {
                    value: "倪震"
                },
                {
                    value: "郝中明"
                },
                {
                    value: "蒲云飞"
                }
            ]
        }
    ],
    category: [{
            value: "日常工作安排"
        },
        {
            value: "质量问题发布"
        },
        {
            value: "工艺质量通知"
        },
        {
            value: "重点工作"
        },
        {
            value: "例会及汇报材料"
        },
        {
            value: "机检异常品"
        },
        {
            value: "机检维护"
        },
        {
            value: "工艺质量隐患排查"
        },
        {
            value: "质量隐患整改通知"
        },
        {
            value: "综合管理"
        },
        {
            value: "专项工作跟踪"
        },
        {
            value: "设备维修"
        }
    ],
    mediaList: [{
            label: "图片",
            value: "image"
        },
        {
            label: "音频",
            value: "audio"
        },
        {
            label: "视频",
            value: "video"
        },
        {
            label: "其它",
            value: "other"
        }
    ],
    mediaLoadingNums: 25,
    menu: [{
            label: "首页",
            value: "/"
        },
        {
            label: "列表",
            value: "/list"
        },
        {
            label: "新增",
            value: "/add"
        },
        {
            label: "媒体库",
            value: "/media"
        },
        {
            label: "搜索",
            value: "/search"
        }
    ]
};

export default options;