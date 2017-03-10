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
          <el-form-item label="操作人员" prop="operator">
            <el-select v-model="value.operator" multiple placeholder="请选择操作人员">
              <el-option-group v-for="group in options.operator" :label="group.label" :key="group.value">
                <el-option v-for="item in group.options" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="车号/轴号" prop="cartno">
            <el-input v-model="value.cartno" :maxlength="8" :minlength="7" icon="edit" placeholder="请输入车号/轴号信息"></el-input>
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
            <el-option v-for="item in options.category" :label="item.label" :value="item.value" :key="item.value">
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
  </div>
</template>
<script>
  import options from '../config/options';
  import MyEditor from './common/Editor';
  import settings from '../config/settings';
  import util from '../config/util';
  const HOST = settings.host;
  export default {
    name: 'add',
    components: {
      'my-editor': MyEditor
    },
    data() {
      return {
        options: options,
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
          tite: [{
            required: true,
            message: '文章标题不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      procId() {
        var id = this.$store.state.add.proc;
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
        var id = parseInt(this.$store.state.add.proc);
        return this.options.proc[id + 1].label;
      }
    },
    watch: {
      procId(id) {
        this.$store.state.add.machine = '';
        if (id) {
          this.loadMachineList(id);
        }
      },
      "value.cartno": function (val) {
        this.$store.state.add.cartno = val.toUpperCase();
      }
    },
    methods: {
      loadProd() {
        var url = HOST + '/DataInterface/Api';
        this.$http.jsonp(url, {
          params: {
            ID: '35',
            cache: 14400
          }
        }).then(response => {
          var data = response.data.data;
          this.options.prod = data.map(item => {
            return {
              value: item[0],
              label: item[1]
            };
          })
        });
      },
      loadMachineList(id) {
        var url = HOST + '/DataInterface/Api';
        this.$http.jsonp(url, {
          params: {
            ID: '36',
            p: id,
            cache: 14400
          }
        }).then(response => {
          var data = response.data.data;
          this.options.machine = data.map(item => {
            return {
              value: item[1],
              label: item[0]
            };
          })
        });
      },
      querySearch(queryString, next) {
        var machine = this.options.machine;
        var results = queryString ? machine.filter(this.createFilter(queryString)) : machine;
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
        var valid=false;
        this.$refs[formName].validate(result => {
          valid = result;
        });
        return valid;
      },
      getParams() {

        if (!this.validData()) {
          return;
        }

        var params = {
          tbl: 99,
          tblname: 'tbl_article',
          utf2gbk: ['title', 'content', 'machine', 'operator', 'category', 'proc'],
          uid: this.$store.state.user.id, //此处需增加用户登录结果
          rec_time: util.getNow(1)
        };
        
        var operator = this.value.operator.toString();

        params = Object.assign(params, this.value);
        params = Object.assign(params, {
          proc: this.procName,
          operator,
          content: util.parseHtml(this.value.content)
        });
        
        this.$store.state.preview = params;
        return true;
      },
      preview() {
        if (!this.getParams()) {
          return;
        }
        this.$store.state.previewMode = true;
        this.$router.push('/view/preview');
      },
      submitForm() {
        if (!this.getParams()) {
          return;
        }
        var url = settings.api.insert;
        //post CROS 需增加 emulateJSON:true
        this.$http.post(url, this.$store.state.preview, {
            emulateJSON: true
          })
          .then(response => {
            var res = response.data;
            if (res.type == 1) {
              this.$message({
                message: '数据添加成功',
                type: 'success'
              });
              //提交后重置数据
              this.resetForm();
            } else {
              this.$message({
                message: '数据添加失败',
                type: 'error'
              });
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      resetForm(formName = 'value') {
        //this.$refs[formName].resetFields();
        this.$store.state.add = {
          prod: '',
          proc: '',
          machine: '',
          operator: [],
          cartno: '',
          category: '',
          content: '',
          title: ''
        };
      }
    },
    mounted() {
      this.loadProd();
      this.$store.state.previewMode = false;
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
    width: 460px;
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

</style>
