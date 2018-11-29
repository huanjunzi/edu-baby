<template>
  <div>
    <Row>
      <Col span="2">
        <Button style="margin: 0px 0px 15px -10px" type="primary" @click="createCustorm(0)">新建员工</Button>
      </Col>
      <Col span="2">
        <Button style="margin: 0px 0px 15px 10px" type="primary" @click="deleteStaff(1)">批量删除</Button>
      </Col>
    </Row>
      <table-list ref="tableList" :height="500" :cols="historyColumns" :url="url" :formatRow="formatRow" @on-selection-change="selectChange" :params="params" :timeShow="false"></table-list>
  </div>
</template>
<script>
import _ from 'underscore'
import {showModal} from '../modals'
import * as utils from '../utils/utils'
import staffEdit from './staffEdit'
import { sex_type, online, job_type } from './index.js'
export default {
  data () {
    return {
      selectedItems: [],
      url: '/api/staff/findStaff',
      pagingOption: { 
        showPaging: true,
      },
      params: {
        deleted: ['0']
      },
      historyColumns: [
      {
        title: '员工姓名',
        key: 'staff_name',
        width: 120,
        searchable: true,
      },
      {
        title: '员工年龄',
        key: 'staff_age',
        width: 100,
      },
      {
        title: '员工性别',
        key: 'staff_sex',
        width: 100,
        mappers: sex_type,
        renderText: r =>  sex_type[r.staff_sex] || '-',
      },
      {
        title: '员工电话',
        key: 'staff_tel_phone',
        width: 120,
      },
      {
        title: '员工职位',
        key: 'staff_type',
        width: 100,
        mappers: job_type,
        renderText: r =>  job_type[r.staff_type] || '-',
      },
      {
        title: '员工在职状态',
        key: 'staff_online',
        width: 130,
        mappers: online,
        renderText: r =>  online[r.staff_online] || '-',
      },
      {
        title: '员工月薪',
        key: 'staff_salary',
        width: 100,
        render: (h, ctx) =>
        <div>
          {ctx.row.staff_salary + '/月'}
        </div>
      },
      {
        title: '最近工资',
        key: 'staff_last_salary',
        width: 100,
        render: (h, ctx) =>
        <div>
          {ctx.row.staff_last_salary}
        </div>
      },
      {
        title: '入职时间',
        key: 'entry_time',
        width: 100,
      },
      {
        title: '创建时间',
        key: 'create_time',
        width: 150,
        sortable: true
      },
      {
          title: '操作',
          align: 'center',
          type: 'error',
          width: 188,
          fixed: 'right',
          render: (h, ctx) => 
          <div>
           {+ctx.row.staff_online === 0 ? <poptip trigger="hover" content="设为离职后即可删除" placement="top-start"><a disabled>删除</a></poptip> : <a on-click={() => this.deleteStaff(0, ctx.row)}>删除</a>}
            <a on-click={() => this.createCustorm(1, ctx.row)} style="margin-left:10px">编辑</a>
            <a on-click={() => this.routeTo('staffDetail',ctx.row.id)} style="margin-left:10px">查看</a>
          </div>
      }],
    }
  },
  components: {},
  async created(){
  },
  methods: {
    deleteStaff(type, row){
      let ids = []
      let title = "这些员工"
      if (+type === 1) {
        if (!this.selectedItems.length) return this.$Message.error("请先选择项目")
        for(let element of this.selectedItems){
          ids.push({ id: element.id })
        }
      } else {
      ids = [{id : row.id}]
      title = row.staff_name
      }
      utils.deletedModal(this,title, async() => {
        let r = await this.$axios({
          method: "post",
          url: '/api/staff/deleteStaff',
          params: {
              staff_id: JSON.stringify(ids),
          }
        }).then(res => res.data)
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("删除成功")
        }
      })
    },
    routeTo(path, id) {
      this.$router.push({ path, query: { staff_id: id } })
    },
    selectChange(selection) {
      this.selectedItems = []
      _.extend(this.selectedItems, selection)
    },
    async createCustorm(type, row) {
       let title = type === 0 ? "新建员工" : "编辑员工"
       let r = await showModal(staffEdit, { data: row, type: 1 }, { title, width: 'default', styles: {top: '40px'} })
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("保存成功")
        }
    },
    formatRow(row) {
      return {...row, _disabled: _.contains([1], row.member_status)}
    },
    async changeCount(ctx , val, keyName) {      
       let r = await this.$axios({
          method: "post",
          url: '/api/staff/changeClassFee',
          params: {
              id: ctx.row.id,
              count: val
          }
        }).then(res => res.data)
    },
    lockEdit(row){
       row._locked = !row._locked
    }
  }
}
</script>

<style lang="less" scoped>
.layout-logo-left {
    width: 90%;
    margin: 15px auto;
    .text{
      color: #fff;
      font-weight: 300
    }
    text-align: center;
}
.ivu-menu.ivu-menu-dark.ivu-menu-vertical {
  height:100%; 
  position:absolute;
  left:0; top:0;
}
.ivu-table td.demo-table-info-column{
      background-color: #2db7f5;
      color: red;
}

</style>
