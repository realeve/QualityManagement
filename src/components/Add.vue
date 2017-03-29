<template>
  <div>
    <el-form :model="value" :rules="rules" ref="value" label-width="100px">
      <div class="card">
        <el-row>
          <el-col :md="10" :sm="24" :xs="24">
            <div class="basic">
              <h3>基础信息</h3>
              <el-form-item label="品种" prop="prod">
                <el-select v-model="value.prod" clearable placeholder="请选择品种名称">
                  <el-option v-for="item in options.prod" :label="item.label" :value="item.label" :key="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工序" prop="proc">
                <el-select v-model="value.proc" clearable placeholder="请选择工序">
                  <el-option v-for="item in options.proc" :label="item.label" :value="item.label" :key="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机台" prop="machine">
                <el-autocomplete class="inline-input" v-model="value.machine" :fetch-suggestions="querySearch" placeholder="请输入机台"></el-autocomplete>
              </el-form-item>
              <el-form-item label="处理人员" prop="operator">
                <el-select v-model="value.operator" multiple placeholder="请选择处理人员">
                  <el-option-group v-for="group in options.operator" :label="group.label" :key="group.value">
                    <el-option v-for="item in group.options" :label="item.label" :value="item.value" :key="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="车号/轴号" prop="cartno">
                <el-input v-model="value.cartno" @input="capitalizeCartno" :maxlength="8" :minlength="7" icon="edit" placeholder="请输入车号/轴号信息"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :md="14" :sm="24" :xs="24">
            <h3>消息推送名单</h3>
            <rtx-check/>
          </el-col>
        </el-row>
      </div>
      <div class="card">
        <h3>文章内容</h3>
        <el-form-item label="标题" prop="title">
          <el-input v-model="value.title" icon="edit" placeholder="请输入标题内容"></el-input>
        </el-form-item>
        <el-form-item label="问题分类" prop="category">
          <el-select v-model="value.category" clearable placeholder="请选择问题分类">
            <el-option v-for="(item,i) in options.category" :label="item.label" :value="item.value" :key="i">
            </el-option>
          </el-select>
        </el-form-item>
        <my-editor/>
        <div class="submit">
          <el-button type="primary" @click="submitForm()">立即创建</el-button>
          <el-button @click="preview()">预览</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>
    </el-form>

    <div class="card">
      <h3>附件管理</h3>
      <attach :listType="'picture-card'" />
    </div>
  </div>
</template>
<script>
  import options from '../config/options';
  import MyEditor from './common/Editor';
  import Attach from './common/Attach';
  import RtxCheck from './common/RtxCheck'

  import settings from '../config/settings';
  import util from '../config/util';
  const HOST = settings.host;
  export default {
    name: 'add',
    components: {
      MyEditor,
      Attach,
      RtxCheck
    },
    data() {
      return {
        options,
        rules: {
          operator: [{
            required: true,
            type: 'array',
            message: '请选择操作人员',
            trigger: 'blur'
          }],
          category: [{
            required: true,
            message: '请选择文章分类',
            trigger: 'blur'
          }],
          title: [{
            required: true,
            message: '文章标题不能为空',
            trigger: 'blur'
          }],
          cartno: [{
            required: false,
            trigger: 'blur',
            validator(rule, value, callback) {
              let cart = /^[1-9]\d{3}[A-Za-z]\d{3}$|^[1-9]\d{6}[A-Ca-c]$|^[1-9]\d{6}$/;
              if (value != '' && !cart.test(value)) {
                callback(new Error('请输入正确的车号/轴号信息'));
              } else {
                callback();
              }
            }
          }]
        }
      }
    },
    computed: {
      procId() {
        let proc = this.$store.state.add.proc;
        let id;
        switch (proc) {
          case '胶印':
          case '凹印':
            id = 1;
            break;
          case '印码':
            id = 2;
            break;
          case '检封':
            id = 3;
            break;
          default:
            id = 0;
            break;
        }
        return id;
      },
      value: {
        get() {
          return this.$store.state.add;
        },
        set(val) {
          this.$store.commit('setAddInfo', val);
        }
      },
      attachList() {
        return this.$store.state.fileList.map(item => item.attach_id).join(',');
      },
      fileList: {
        get() {
          return this.$store.state.fileList;
        },
        set(val) {
          return this.$store.commit('setFileList', val);
        }
      }
    },
    watch: {
      procId(id, oldId) {
        if (oldId == id) {
          return; //胶凹共用一个id
        }
        if (id > 0) {
          this.loadMachineList(id);
        } else {
          this.options.machine = [];
        }
      }
    },
    methods: {
      pushMsgByRtx(params) {
        let url = settings.host + '/DataInterface/rtxPush'
        return this.$http.jsonp(url, {
          params
        }).then(response => this.$message.success(response.data.msg))
      },
      validFile(file) {
        //const isJPG = file.type === 'image/jpeg';
        const isLt20M = file.size / 1024 / 1024 < 100;
        if (!isLt20M) {
          this.$message.error('上传头像图片大小不能超过 20MB!');
        }
        return isLt20M;
      },
      capitalizeCartno(str) {
        let reg = new RegExp(/[a-zA-Z]|\d/);
        let result = str.split('').filter(item => item.match(reg)).join('').toUpperCase();
        this.value.cartno = result;
      },
      loadProd() {
        let url = HOST + '/DataInterface/Api';
        this.$http.jsonp(url, {
          params: {
            ID: '35',
            cache: 14400
          }
        }).then(response => {
          let data = response.data.data;
          this.options.prod = data.map(item => {
            return {
              value: item[0],
              label: item[1]
            };
          })
        });
      },
      loadMachineList(id) {
        let url = HOST + '/DataInterface/Api';
        this.$http.jsonp(url, {
          params: {
            ID: '36',
            p: id,
            cache: 14400
          }
        }).then(response => {
          let data = response.data.data;
          this.options.machine = data.map(item => {
            return {
              value: item[1],
              label: item[0]
            };
          })
        });
      },
      querySearch(queryString, next) {
        let machine = this.options.machine;
        let results = queryString ? machine.filter(this.createFilter(queryString)) : machine;
        // 调用 callback 返回建议列表的数据
        next(results);
      },
      createFilter(queryString) {
        return (result) => {
          return (result.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      validData(formName = 'value') {
        if (this.$store.state.add.content == '') {
          this.$message.error('问题描述不能为空');
          return false;
        }

        let valid = false;
        this.$refs[formName].validate(result => {
          valid = result;
        });
        return valid;
      },
      getParams() {

        if (!this.validData()) {
          return;
        }

        let params = {
          tblname: 'tbl_article',
          utf2gbk: ['title', 'content', 'machine', 'operator', 'category', 'proc'],
          uid: this.$store.state.user.id, //此处需增加用户登录结果
          rec_time: util.getNow(1),
          attach_list: this.attachList
        };

        let operator = this.value.operator.toString();

        params = Object.assign(params, this.value);
        params = Object.assign(params, {
          proc: this.value.proc,
          operator,
          content: util.parseHtml(this.value.content)
        });

        this.$store.commit('setPreviewData', params);
        return true;
      },
      preview() {
        if (!this.getParams()) {
          return;
        }
        this.$store.commit('enterPreview', true);

        this.$router.push('/view/preview');
      },
      updateAttachArticleId(article_id) {
        //更新附件中对应的文章id
        let url = settings.api.update;
        let params = {
          tblname: 'tbl_article_attach',
          article_id
        };

        this.attachList.split(',').map(id => {
          params.id = id;
          this.$http.jsonp(url, {
              params
            })
            .then(res => {
              console.info('附件信息更新成功');
            })
            .catch(e => {
              console.log(e);
            })
        });

      },
      submitForm() {
        if (!this.getParams()) {
          return;
        }
        let url = settings.api.insert;
        let receiver = this.$store.state.rtxlist.join(',');

        //post CROS 需增加 emulateJSON:true
        //需更新article表单，增加receiver字段
        this.$http.post(url, Object.assign(this.$store.state.preview, {
            receiver
          }), {
            emulateJSON: true
          })
          .then(response => {
            let res = response.data;
            if (res.type == 1) {
              this.$message({
                message: '数据添加成功',
                type: 'success'
              });
              this.updateAttachArticleId(res.id);
              //提交后重置数据
              this.resetForm();
            } else {
              this.$message({
                message: '数据添加失败',
                type: 'error'
              });
            }
            this.$store.commit('refreshMainList', true);
            window.localStorage.setItem('editor', '');

            //没有选择人员时，则不推送
            if (receiver != '') {
              let msg =
                `${this.$store.state.user.username}发表了一篇新文章,[(${this.$store.state.preview.title})|${settings.rtxJmpLink+'/view/'+res.id}]`;
              this.pushMsgByRtx({
                msg,
                receiver,
                title: '质量问题管理平台',
                delaytime: 0
              });
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      resetForm(formName = 'value') {
        //this.$store.commit('resetAddInfo');
        this.value = {
          prod: '',
          proc: '',
          machine: '',
          operator: [],
          cartno: '',
          category: '',
          content: '',
          title: '',
          receiver: ''
        }
        this.$store.commit('clearFileList');
      },
      convertFromMedia() {
        if (typeof this.fileList != 'undefined' && this.fileList.length) {
          this.fileList = this.fileList.map(item => {
            if (typeof item.id != 'undefined') {
              item.attach_id = item.id;
              delete item.id;
              item.url = settings.uploadContent + item.url;
            }
            return item;
          });
        }
      }
    },
    created() {
      this.loadProd();
      this.$store.commit('enterPreview', false);
      this.convertFromMedia();
      //this.$store.commit('clearFileList');
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  h3,
  h4 {
    font-weight: 400;
  }


  .margin-top-20 {
    margin-top: 20px;
  }

  .submit {
    .margin-top-20;
    display: flex;
    justify-content: flex-end;
  }

  .card {
    .margin-top-20;
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    .basic {
      width: 290px;
    }
  }

  .card:nth-child(1) {
    margin-top: 0;
  }

</style>
