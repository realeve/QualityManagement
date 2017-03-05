<template>
  <div>
    <el-form :model="value" :rules="rules" ref="value" label-width="100px">
      <div class="card">
        <div class="basic">
          <h3>1.基础信息</h3>
          <el-form-item label="品种" prop="prod">
            <el-select v-model="value.prod" clearable placeholder="请选择品种名称">
              <el-option v-for="item in options.prod" :label="item.label" :value="item.value" :key="item.value">
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
          <el-form-item label="问题分类" prop="category">
            <el-select v-model="value.category" clearable placeholder="请选择工序">
              <el-option v-for="item in options.category" :label="item.label" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="card">
        <h3>2.问题描述</h3>
        <my-editor/>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitForm('value')">立即创建</el-button>
          <el-button @click="resetForm('value')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import options from '../config/options';
import MyEditor from './Editor';

var HOST = 'http://localhost';

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
        }]
      }
    }
  },
  computed: {
    procId() {
      var id = this.$store.state.addValue.proc;
      if (id == 0) {
        this.options.machine = [];
        return;
      } else if (id > 1) {
        id--;
      }
      return id;
    },
    value() {
      return this.$store.state.addValue;
    }
  },
  watch: {
    procId(id) {
      this.$store.state.addValue.machine = '';
      if (id) {
        this.loadMachineList(id);
      }
    },
    "value.cartno": function(val) {
      this.$store.state.addValue.cartno = val.toUpperCase();
    }
  },
  methods: {
    loadProd() {
      var url = HOST + '/DataInterface/Api';
      this.$http.jsonp(url, {
        params: {
          ID: '35',
          M: '3',
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
          M: '3',
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
    submitForm(formName) {
      if (this.$store.state.addValue.content == '') {
        this.$message.error('问题描述不能为空');
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('此处添加数据提交逻辑');
        } else {
          this.$message.error('数据校验失败');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$store.state.addValue.content = '';
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.loadProd();
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
  float: right;
  .margin-top-20;
}

.card {
  .margin-top-20;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style>
