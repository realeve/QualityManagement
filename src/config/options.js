var options = {
    proc: [{
        value: '-1',
        label: '印版/油墨'
    }, {
        value: '0',
        label: '白纸数管'
    }, {
        value: '1',
        label: '胶印'
    }, {
        value: '2',
        label: '凹印'
    }, {
        value: '3',
        label: '印码'
    }, {
        value: '4',
        label: '检封'
    }],
    prod: [],
    machine: [],
    operator: [{
        label: '工艺组',
        options: [{
            value: '徐东海'
        }, {
            value: '陈文革'
        }, {
            value: '钟鸣'
        }, {
            value: '袁长虹'
        }, {
            value: '李丹'
        }, {
            value: '杨畅'
        }, {
            value: '汪雄'
        }, {
            value: '吕从飞'
        }]
    }, {
        label: '印刷机检组',
        options: [{
            value: '舒粤'
        }, {
            value: '蒲明玥'
        }, {
            value: '冯诗伟'
        }, {
            value: '马可'
        }, {
            value: '李宾'
        }, {
            value: '徐闵'
        }, {
            value: '李超群'
        }, {
            value: '张立力'
        }, {
            value: '潘成'
        }, {
            value: '朱振华'
        }]
    }, {
        label: '检封机检组',
        options: [{
            value: '杨林'
        }, {
            value: '胡新玥'
        }, {
            value: '金鑫'
        }, {
            value: '蒋荣'
        }, {
            value: '任礼科'
        }]
    }],
    category: [{
        value: '质量问题发布'
    }, {
        value: '工艺质量月度工作计划'
    }, {
        value: '机检月度工作计划'
    }, {
        value: '周例会决议'
    }, {
        value: '司务会材料'
    }, {
        value: '年度项目计划'
    }, {
        value: '机检维护'
    }, {
        value: '工艺质量通知'
    }, {
        value: '风险隐患排查'
    }],
    mediaList: [{
        label: '图片',
        value: 'image'
    }, {
        label: '音频',
        value: 'audio'
    }, {
        label: '视频',
        value: 'video'
    }, {
        label: '其它',
        value: 'other'
    }]
}

export default options