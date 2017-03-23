<template>
  <div>
    <el-form :model="value" :rules="rules" ref="value" label-width="100px">
      <div class="card">
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
              <el-option v-for="item in options.proc" :label="item.label" :value="item.value" :key="item.value">
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
  import settings from '../config/settings';
  import util from '../config/util';
  const HOST = settings.host;
  export default {
    name: 'add',
    components: {
      MyEditor,
      Attach
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
        let id = this.$store.state.add.proc;
        if (id < 1) {
          this.options.machine = [];
          id = -1;
        } else if (id > 1) {
          id--;
        }
        return id;
      },
      value() {
        return this.$store.state.add;
      },
      procName() {
        let id = parseInt(this.$store.state.add.proc);
        if (isNaN(id)) {
          return '';
        }
        return this.options.proc[id + 1].label;
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
      procId(id) {
        this.$store.commit('clearMacineInfo');
        if (id) {
          this.loadMachineList(id);
        }
      }
    },
    methods: {
      pushMsgByRtx(params) {
        let url = settings.host + '/DataInterface/rtxPush'
        return this.$http.jsonp(url, {params}).then(response => this.$message.success(response.data.msg))
      },
      receiver(needPushPaperList = false){
        let tech=settings.rtxInfo.technology.map(item=>item.id);
        let imgVs = settings.rtxInfo.imgVs.map(item=>item.id);
        let paper = settings.rtxInfo.paper.map(item=>item.id);
        let users = [...tech,...imgVs];
        if(needPushPaperList){
          users = [...users,...paper];
        }
        return users.join(',');
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
        this.$store.commit('convertCartno', result);
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
          proc: this.procName,
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
        //post CROS 需增加 emulateJSON:true
        this.$http.post(url, this.$store.state.preview, {
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
          
            let msg =
              `${this.$store.state.user.username}发表了一篇新文章,[(${this.$store.state.preview.title})|${settings.rtxJmpLink+'/view/'+res.id}]`;
            
            //如果标题中含有“纸”字样，推送给纸张工艺组
            
            this.pushMsgByRtx({
              msg,
              title:'质量信息平台',
              delaytime:0,
              receiver:this.receiver(this.$store.state.preview.title.includes('纸'))
            });

          })
          .catch(e => {
            console.log(e);
          })
      },
      resetForm(formName = 'value') {
        this.$store.commit('resetAddInfo');
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

  .basic {
    width: 280px;
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
  }

  .card:nth-child(1) {
    margin-top: 0;
  }

</style>
