<template>
  <div style="">

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
         <!-- { 0: '园长', 1: '教学主管', 2: '幼师', 3: '保育员', 4: '销售', 5: '厨房', 6: '保洁', 7: '其它' } -->
        <Col span="5"><span> {{ +staffInfo.staff_type === 0 ? '园长' : +staffInfo.staff_type === 1 ? '教学主管' : +staffInfo.staff_type === 2 ? '幼师' : +staffInfo.staff_type === 3 ? '保育员' : +staffInfo.staff_type === 4 ? '销售' : +staffInfo.staff_type === 5 ? '厨房' : +staffInfo.staff_type === 6 ? '保洁' : '其它'}}  </span></Col>
        <Col span="3"><span> 员工在职状态:</span></Col>
        <Col span="5"><span> {{ +staffInfo.staff_online === 0 ? '在职' : '离职'}}  </span></Col>
        <div v-if="+staffInfo.staff_online === 1">
          <Col span="3"><span> 员工离职时间:</span></Col>
          <Col span="5"><span> {{ staffInfo.dimission_time || '--' }} </span></Col>
        </div>
      </Row>
    </div>
    <div calss="section">

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
  import {sex_type} from './index.js'
  import {getMapFilters} from '../utils/utils'
  export default {
    data() {
      const reg = /^(\d+)(\.\d{1,2})?$/

      return {
        staffInfo : {},
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

  .title_left{
    margin: 1em 1em 1em 2em;
  h3 {
    margin-bottom: 1em;margin-left: -1.0em;
  }
    .space {
      margin-left: 20px;
    }
  }


</style>
