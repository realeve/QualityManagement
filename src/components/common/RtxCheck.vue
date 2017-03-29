<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
      <el-checkbox v-for="item in list" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>

    <el-select class="push-list" v-model="pushList" size="large" multiple placeholder="请选择消息推送人员">
      <el-option-group v-for="group in operators" :label="group.label" :key="group.label">
        <el-option v-for="item in group.options" :label="item.value" :value="item.id" :key="item.id">
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>
<script>
  import rtx from '../../config/rtx.js'

  let isIndeterminateByList = {};
  let allUser = rtx.desc.map(item => {
    isIndeterminateByList[item.value] = false;
    return item.value;
  });

  export default {
    name: 'rtx-check',
    data() {
      return {
        checkAll: true,
        checkedList: ['techLeader', 'technology'],
        list: rtx.desc,
        isIndeterminate: true,
        operators: rtx.operators
      };
    },
    computed: {
      pushList: {
        get() {
          return this.$store.state.rtxlist;
        },
        set(val) {
          this.$store.commit('setRtxList', val);
        }
      }
    },
    watch: {
      checkedList(val) {
        this.setPushList(val);
      }
    },
    created() {
      this.setPushList(this.checkedList);
    },
    methods: {
      handleCheckAllChange(event) {
        this.checkedList = event.target.checked ? allUser : [];
        this.isIndeterminate = false;
      },
      handleCheckedListChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.list.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
      },
      setPushList(data) {
        let arr = [];
        data.forEach(item => {
          rtx.rtxInfo[item].forEach(user => {
            arr.push(user.id);
          })
        });
        this.pushList = arr;
      }
    }
  };

</script>
<style scoped>
  .push-list {
    margin-top: 20px;
    width: 80%;
  }

</style>
