<template>
  <div>
    <!--区块1-->
    <div class="section">
       <Row class="title_left">
        <Col span="3">
        <span><h3 >员工信息</h3></span>
        </Col>
      </Row>
      <Row class="title_left">
          <Col span="3"><span > 员工姓名: </span></Col>
          <Col span="5"><span > {{ staffInfo.staff_name  || '--' }} </span></Col>
          <Col span="3"><span > 员工性别: </span></Col>
          <Col span="5"><span > {{ staffInfo.staff_age ? "男" : "女" }} </span></Col>
          <Col span="3"><span > 员工月薪: </span></Col>
          <Col span="5"><span > {{ staffInfo.staff_salary }} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="3"><span> 员工年龄:</span></Col>
        <Col span="5"><span> {{ staffInfo.staff_age  || '--' }} </span></Col>
        <Col span="3"><span> 员工电话:</span></Col>
        <Col span="5"><span> {{ staffInfo.staff_tel_phone  || '--' }} </span></Col>
        <Col span="3"><span> 员工入职时间:</span></Col>
        <Col span="5"><span> {{ staffInfo.entry_time  || '--' }} </span></Col>
      </Row>
       <Row class="title_left">
        <Col span="3"><span> 员工职位:</span></Col>
         <!-- { 0: '园长', 1: '教学主管', 2: '早教老师', 3: '保育员', 4: '销售', 5: '厨房', 6: '保洁', 7: '其它' } -->
        <Col span="5"><span> {{ +staffInfo.staff_type === 0 ? '园长' : +staffInfo.staff_type === 1 ? '教学主管' : +staffInfo.staff_type === 2 ? '早教老师' : +staffInfo.staff_type === 3 ? '保育员' : +staffInfo.staff_type === 4 ? '销售' : +staffInfo.staff_type === 5 ? '厨房' : +staffInfo.staff_type === 6 ? '保洁' : '其它'}}  </span></Col>
        <Col span="3"><span> 员工在职状态:</span></Col>
        <Col span="5"><span> {{ +staffInfo.staff_online === 0 ? '在职' : '离职'}}  </span></Col>
        <div v-if="+staffInfo.staff_online === 1">
          <Col span="3"><span> 员工离职时间:</span></Col>
          <Col span="5"><span> {{ staffInfo.dimission_time || '--' }} </span></Col>
        </div>
      </Row>
    </div>
    <div class="section">
    <Row>
      <Col span="2">
        <Button style="margin: 0px 0px 20px 0px" type="primary" @click="createCustorm(0)">新建工资条</Button>
      </Col>
    </Row>
    <Row>
      <Col span="10">
        <span style="color: red">录入顺序请按照工资发放的月份，从先到后依次录入。</span>
      </Col>
    </Row>
      <table-list ref="tableList" :height="320" :width="900" :cols="historyColumns" :url="url" :params="params" :timeShow="false" :isCheckBox="false"></table-list>
    </div>
    <div class="section">
      <Row class="title_left">
        <Col span="4">
        <span> <Button type="primary" @click="routeTo('staff')">返回上一页</Button></span>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>

  import * as _ from 'underscore'
  import salaryEdit from './salaryEdit'
  import {showModal} from '../modals'
  import * as utils from '../utils/utils'

  export default {
    data() {
      return {
        staffInfo : {},
        selectedItems: [],
        url: '/api/staff/findSalary',
        pagingOption: {
          showPaging: true,
        },
        params: {
          staff_id: [this.$route.query.staff_id],
          deleted: ['0']
        },
        historyColumns: [
        {
          title: '实发月薪',
          key: 'salary',
          width: 100,
          render: (h, ctx) =>
          <div>
            {ctx.row.salary + '/月'}
          </div>
        },
        {
          title: '薪资发放时间',
          key: 'salary_time',
          width: 180,
          sortable: true,
        },
        {
          title: '备注',
          key: 'remark',
          width: 280,
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
            render: (h, ctx) => 
            <div>
              <a on-click={() => this.deleteSalary(0, ctx.row)}>删除</a>
              <a on-click={() => this.createCustorm(1, ctx.row)} style="margin-left:10px">编辑</a>
            </div>
        }],
      }
    },
    async created() {
      if(!_.isEmpty(this.$route.query)){
        let r = await this.$axios({
          method: "get",
          url: '/api/staff/getStaffDetail',
          params: {
              data: this.$route.query.staff_id,
          }
        })
        this.staffInfo = r.data.rows[0]
      }
    },
    methods: {
 
      routeTo(path) {
        this.$router.push({ path, query: {} })
      },
      async createCustorm(type, row) {
       let title = type === 0 ? "新建工资条" : "编辑工资条"
       type === 0 ? row = {staff_id : this.$route.query.staff_id } : row
       let r = await showModal(salaryEdit, { data: row, type: 1 }, { title, width: 'default', styles: {top: '40px'} })
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("保存成功")
        }
      },
      deleteSalary(type, row){
      let ids = []
      let title = "这些工资条"
      if (+type === 1) {
        if (!this.selectedItems.length) return this.$Message.error("请先选择项目")
        for(let element of this.selectedItems){
          ids.push({ id: element.id })
        }
      } else {
      ids = [{id : row.id}]
      title = row.salary
      }
      utils.deletedModal(this,title, async() => {
        let r = await this.$axios({
          method: "post",
          url: '/api/staff/deleteSalary',
          params: {
              id: JSON.stringify(ids),
              staff_id: row.staff_id
          }
        }).then(res => res.data)
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("删除成功")
        }
      })
    },
    }
  }
</script>
<style scoped lang="less">
   h3 {
    margin-bottom: 1em;
    color: #495060;
  }
  .section {
    text-align: left;
    padding: 1em 0;
    border-bottom: 1px solid #e4e4e4;
  }

  .title_left {
    margin: 1em 1em 1em 2em;
  h3 {
    margin-bottom: 1em;margin-left: -1.0em;
  }
    .space {
      margin-left: 20px;
    }
  }


</style>
