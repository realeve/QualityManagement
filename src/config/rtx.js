let rtxInfo = {
    technology: [{
        value: '徐东海',
        id: 10866
    }, {
        value: '陈文革',
        id: 10867
    }, {
        value: '杨晓娟',
        id: 10820
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
        value: '袁长虹',
        id: 10863
    }, {
        value: '张建军',
        id: 10875
    }],
    imgVs: [{
        value: '徐闵',
        id: 10884
    }, {
        value: '胡新玥',
        id: 10861
    }, {
        value: '马可',
        id: 10876
    }, {
        value: '李超群',
        id: 10883
    }, {
        value: '李宾',
        id: 10654
    }, {
        value: '舒粤',
        id: 10865
    }, {
        value: '蒲明玥',
        id: 10882
    }, {
        value: '杨林',
        id: 10862
    }, {
        value: '金鑫',
        id: 10880
    }],
    pprImgVs:[{
        value:'于潇',
        id:10869,
    },{
        value:'丰锋',
        id:10879,
    },{
        value:'彭鹏',
        id:10885,
    }],
    paper: [{
        value: '陈晶',
        id: 10871
    }, {
        value: '杜煜',
        id: 10872
    }, {
        value: '赵锦良',
        id: 10858
    }],
    physic: [{
        value: '李奎昌',
        id: 10873
    }, {
        value: '李虹斌',
        id: 10859
    }, {
        value: '刘方群',
        id: 10870
    }],
    monitor: [{
        value: '白薇',
        id: 10887
    }, {
        value: '杨洁',
        id: 10653
    }, {
        value: '权净',
        id: 10894
    }, {
        value: '吴运笙',
        id: 10799
    }, {
        value: '蔡憬',
        id: 10895
    }, {
        value: '周琳丽',
        id: 10896
    }, {
        value: '吴梅',
        id: 10897
    }, {
        value: '徐群英',
        id: 10898
    }, {
        value: '廖迎春',
        id: 10899
    }],
    reward: [{
        value: '袁长虹',
        id: 10863
    }, {
        value: '张建军',
        id: 10875
    }, {
        value: '陈晶',
        id: 10871
    }, {
        value: '张楠岚',
        id: 10650
    }, {
        value: '赵洪新',
        id: 10652
    }, {
        value: '达时',
        id: 11122
    }],
    verify: [{
        value: '张楠岚',
        id: 10650
    }, {
        value: '赵洪新',
        id: 10652
    }, {
        value: '达时',
        id: 11122
    }],
    techLeader: [{
        value: '赵洪新',
        id: 10652
    }, {
        value: '张楠岚',
        id: 10650
    }, {
        value: '达时',
        id: 11122
    }]
};

let desc = [{
    label: '技质领导',
    value: 'techLeader'
}, {
    label: '印钞工艺组',
    value: 'technology'
}, {
    label: '印钞机检组',
    value: 'imgVs'
}, {
    label: '钞纸机检组',
    value: 'pprImgVs'
}, {
    label: '钞纸工艺组',
    value: 'paper'
}, {
    label: '物检中心',
    value: 'physic'
}, {
    label: '综合管理及班组长',
    value: 'monitor'
}]

let operators = desc.map(item => {
    return {
        label: item.label,
        options: rtxInfo[item.value]
    };
})

export default { rtxInfo, desc, operators }