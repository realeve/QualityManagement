import util from './util';

let rtxInfo = {
  techLeader: [
    {
      value: '徐东海',
      id: 10866
    },
    {
      value: '李力',
      id: 10741 // 钞处，杨智勇
    },
    {
      value: '胡新玥',
      id: 10861
    },
    {
      value: '覃一洪',
      id: 10800
    },
    {
      value: '权净',
      id: 10894
    },
    {
      value: '李健',
      id: 11039 // 成品库党小组:尹涛
    },
    {
      value: '曾勇琼',
      id: 11040 // 废品库党小组 :徐琳,俞安明
    }
  ],
  technology: [
    {
      value: '张楠岚',
      id: 10650
    },
    {
      value: '武明凯',
      id: 10647
    },
    {
      value: '赵立军',
      id: 11202
    },
    {
      value: '张宪',
      id: 10648
    },
    {
      value: '白薇',
      id: 10887
    },
    {
      value: '张建军',
      id: 10875
    },
    {
      value: '钟鸣',
      id: 10864
    },
    {
      value: '杨晓娟',
      id: 10820
    },
    {
      value: '陈文革',
      id: 10867
    },
    {
      value: '徐东海',
      id: 10866
    },
    {
      value: '刘建佳',
      id: 10838
    },
    {
      value: '姚俊',
      id: 11034
    },
    {
      value: '鲁可',
      id: 11035
    },
    {
      value: '詹祎炜',
      id: 11038
    },
    {
      value: '荆坚',
      id: 11031
    },
    {
      value: '李展',
      id: 10649
    },
    {
      value: '李习军',
      id: 10937
    },
    {
      value: '舒粤',
      id: 10865
    }
  ],
  printmonitor: [
    {
      value: '胡新玥',
      id: 10861
    },
    {
      value: '杨林',
      id: 10862
    },
    {
      value: '马可',
      id: 10876
    },
    {
      value: '徐闵',
      id: 10884
    },
    {
      value: '张立力',
      id: 11161
    },
    {
      value: '朱振华',
      id: 11168
    },
    {
      value: '任礼科',
      id: 11166
    },
    {
      value: '李宾',
      id: 10654
    }
  ]
};

let desc = [
  {
    label: '党小组长',
    value: 'techLeader'
  },
  {
    label: '管理党小组',
    value: 'technology'
  },
  {
    label: '机检党小组',
    value: 'printmonitor'
  },
  {
    label: '印钞分析特抽党小组',
    value: 'check'
  },
  {
    label: '印钞过程分析党小组',
    value: 'process'
  },
  {
    label: '成品库党小组',
    value: 'complete'
  },
  {
    label: '废品库党小组',
    value: 'fake'
  },
  {
    label: '钞处党小组',
    value: 'storage'
  }
];

let users = [];
Object.values(rtxInfo).forEach((item) => {
  users = [...users, ...item];
});

let operators = [];
desc.forEach((item) => {
  if (rtxInfo[item.value]) {
    operators.push({
      label: item.label,
      options: rtxInfo[item.value]
    });
  }
});

export default {
  rtxInfo,
  desc,
  operators,
  users: util.unionArr(users)
};
