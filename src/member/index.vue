<template>
  <div>
     <Row>
          <Col span="2">
               <Button style="margin: 0px 0px 15px -10px" type="primary" >新建客户</Button>
          </Col>
          <Col span="2">
               <Button style="margin: 0px 0px 15px 10px" type="primary" >批量删除</Button>
          </Col>
      </Row>
      <table-list ref="tableList" :height="500" :cols="historyColumns" :url="url"></table-list>
  </div>
</template>
<script>
import _ from 'underscore'
import {showModal} from '../modals'
import * as utils from '../utils/utils'
export default {
  data () {
    const customer = {0: '非潜在顾客', 1: '潜在客户', 2: '会员'}

    return {
      customer,
      selectedItems: [],
      url: '/api/member/findMember',
      // downloadURL: '/api/education/downloadExcel',
      
      pagingOption: { 
        showPaging: true,
      },
      params: {
        deleted: ['0']
      },
      historyColumns: [{
        title: '家长姓名',
        key: 'name',
        // mappers: {'亲子课': '亲子课', '早教课': '早教课', '托班':'托班'}
      },
      {
        title: '家长称呼',
        key: 'parents',
      },
      {
        title: '家长年纪',
        key: 'age',
      },
      {
        title: '手机号',
        key: 'tel_phone',
      },
      {
        title: '客户类型',
        key: 'customer_type',
        mappers: customer,
        renderText: r =>  customer[r.customer_type] || '-',
      },
      {
        title: '创建时间',
        key: 'create_time',
      }],
    }
  },
  components: {},
  async created(){
  },
  methods: {
    routeTo(path) {
            this.$router.push({ path })
    },
    selectChange(selection) {
      this.selectedItems = []
      _.extend(this.selectedItems, selection)
      console.log('test',this.selectedItems)
    },
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
