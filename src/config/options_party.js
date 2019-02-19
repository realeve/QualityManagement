import optionDefault from './options_default';
let _ = require('lodash');
let menu = [
  {
    label: '首页',
    value: '/'
  },
  {
    label: '列表',
    value: '/list'
  },
  {
    label: '新增',
    value: '/add'
  }
];

let getUserList = (str) => str.split('、').map((value) => ({ value }));
let team_leader = getUserList(
  '徐东海、李力、胡新玥、覃一洪、权净、李健、曾勇琼'
);

const operator = [
  {
    label: '党小组长',
    options: team_leader
  },
  {
    label: '管理党小组',
    options: getUserList(
      '谭伟、张楠岚、武明凯、赵立军、张宪、白薇、张建军、钟鸣、杨晓娟、陈文革、徐东海、刘建佳、姚俊、鲁可、詹祎炜、荆坚、李展、李习军'
    )
  },
  {
    label: '机检党小组',
    options: getUserList(
      '舒粤、胡新玥、杨林、马可、徐闵、张立力、朱振华、任礼科、李宾'
    )
  },
  {
    label: '印钞分析特抽党小组',
    options: getUserList('吴运笙、覃一洪、周莹、赖春兰、程萍、蔡憬、谢蓉')
  },
  {
    label: '印钞过程分析党小组',
    options: getUserList('周白华、金梅、林娅、柏宇立、权净')
  },
  {
    label: '成品库党小组',
    options: getUserList(
      '张继品、金福达、尹涛、冯定刚、李健、刘怀志、奉玉梅、陈春霞、肖丹、张江'
    )
  },
  {
    label: '废品库党小组',
    options: getUserList(
      '俞安明、罗莉、罗平、徐琳、王智庆、刘晓南、曾勇琼、杨晓红'
    )
  },
  {
    label: '钞处党小组',
    options: getUserList('杨智勇、漆明鸿、谭慧、何艳秋、周玎、李力、郑雅文')
  }
];

let options = Object.assign(_.clone(optionDefault), { menu, operator });

export default options;
