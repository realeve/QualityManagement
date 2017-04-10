<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" class="card">
      <el-form-item label="关键字">
        <el-input v-model="form.key" style="width:218px;" placeholder="在此输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="问题分类">
        <el-select v-model="form.category" clearable placeholder="请选择问题分类">
          <el-option v-for="(item,i) in options.category" :label="item.label" :value="item.value" :key="i">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="完成状态">
        <el-radio-group v-model="form.status">
          <el-radio label="0">未完成</el-radio>
          <el-radio label="1">已完成</el-radio>
          <el-radio label="2">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker v-model="daterange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="selectDateRange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="操作人员">
        <el-radio-group v-model="form.operator">
          <el-radio label="0">由我发起</el-radio>
          <el-radio label="1">由我处理</el-radio>
          <el-radio label="2">由我关闭</el-radio>
          <el-radio label="3">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">开始搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="welcome">
      <el-row>
        <el-col :span="24" class="list">
          <my-card :news="news" @loadMore="loadMore" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import settings from '../config/settings';
  import options from '../config/options';
  import MyCard from './common/NewsCard';
  const HOST = settings.host;

  let selectDateRange = {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  };

  export default {
    name: 'search',
    components: {
      'my-card': MyCard
    },
    data() {
      return {
        options,
        form: {
          key: '',
          category: '',
          status: "2",
          tstart: '',
          tend: '',
          operator: '0'
        },
        daterange: '',
        selectDateRange,
        news: {
          title: '搜索结果',
          empty: '',
          isLoading: false,
          data: [],
          showCategory: true
        },
        loadMoreCounter: 0,
        pagePerNum: 5
      }
    },
    computed: {
      initStatus() {
        let status = false;
        if (typeof this.searchResult == 'undefined') {
          status = true;
        } else if (this.searchResult.length == 0) {
          status = true;
        }
        return status;
      },
      searchResult: {
        get() {
          return this.$store.state.searchResult;
        },
        set(val) {
          this.$store.commit('setSearchResult', val);
        }
      },
      user() {
        return this.$store.state.user;
      }
    },
    watch: {
      daterange(val) {
        this.form.tstart = JSON.stringify(val[0]).split('T')[0].replace('"', '').replace(/-/g, '');
        this.form.tend = JSON.stringify(val[1]).split('T')[0].replace('"', '').replace(/-/g, '');
      },
      searchResult(val) {
        this.init(val);
      }
    },
    created() {
      this.init(this.searchResult);
      this.news.empty = this.initStatus;
    },
    methods: {
      init(val) {
        this.news.isLoading = false;
        this.news.data = val.slice(0, this.pagePerNum);
        this.loadMoreCounter = 1;
      },
      getSearchStr() {
        // 此处需注意单引号的使用，传数据库参数中通过 ?匹配
        let str = `%${this.form.key}%`;
        if (this.form.tstart != '' && this.daterange[0] != null) {
          str += `' and convert(varchar,a.rec_time,112) between '${this.form.tstart}' and '${this.form.tend}`;
        }
        if (this.form.status != 2) {
          str += `' and a.status= '${this.form.status}`;
        }
        if (this.form.category.length) {
          str += `' and a.category ='${this.form.category}`;
        }

        switch (this.form.operator) {
          case "0":
            str += `' and a.uid= '${this.user.id}`;
            break;
          case "1":
            str += `' and a.operator like '%${this.user.username}%`;
            break;
          case "2":
            str += `' and a.status_username like '%${this.user.username}%`;
            break;
          default:
            break;
        }
        return str;
      },
      loadMore() {
        if (this.news.isLoading || this.news.empty || this.searchResult.length == 0) {
          return
        }
        this.news.isLoading = true;

        let start = this.loadMoreCounter * this.pagePerNum + 1;

        this.news.data = [...this.news.data, ...this.searchResult.slice(start, start + this.pagePerNum)];
        this.loadMoreCounter++;

        if (start >= this.searchResult.length) {
          this.news.empty = true;
        }
        this.news.isLoading = false;
      },
      onSubmit() {
        this.news.empty = false;
        if (this.form.status == 2 && this.form.operator == 3 && (this.form.tstart == '' || this.daterange[0] == null) &&
          this.form.category.length +
          this.form.key == 0) {
          this.$message({
            message: '请选择至少一项条件',
            type: 'error'
          });
          return;
        }

        this.$http.jsonp(settings.api.search, {
          params: {
            key: this.getSearchStr()
          }
        }).then(res => {
          if (res.data.rows == 0) {
            this.news.empty = true;
            this.searchResult = [];
            return;
          }
          let avatar;
          this.searchResult = res.data.data.map(item => {
            avatar = item.avatar == 1 ? window.btoa(item.avatarkey) : 'Avatar_none';
            return Object.assign(item, {
              img: HOST + '/demo/avatar/' + avatar + '.jpg',
              url: '/view/' + item.id
            });
          })
        }).catch(res => {
          console.log(res);
        })
      }
    }
  }

</script>
<style scoped>
  .card {
    background-color: #fff;
    padding: 20px;
  }

  .welcome {
    margin-top: 40px;
  }

</style>
