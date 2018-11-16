<template>
  <div>
     <Row>
          <Col span="2">
               <Button style="margin: 0px 0px 15px -10px" type="primary" @click="createCustorm(0)">新建客户</Button>
          </Col>
          <Col span="2">
               <Button style="margin: 0px 0px 15px 10px" type="primary" @click="deleteMember(1)">批量删除</Button>
          </Col>
      </Row>
      <table-list ref="tableList" :height="500" :cols="historyColumns" :url="url" :formatRow="formatRow" @on-selection-change="selectChange" :params="params" :downloadURL="downloadURL"></table-list>
  </div>
</template>
<script>
import _ from 'underscore'
import {showModal} from '../modals'
import * as utils from '../utils/utils'
import memberEdit from './memberEdit'
import {member_type} from './index.js'
export default {
  data () {
    return {
      selectedItems: [],
      url: '/api/member/findMember',
      downloadURL: '/api/member/downloadMemberExcel',
      
      pagingOption: { 
        showPaging: true,
      },
      params: {
        deleted: ['0']
      },
      historyColumns: [{
        title: '家长姓名',
        key: 'name',
        searchable: true,
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
        searchable: true,
      },
      {
        title: '客户类型',
        key: 'customer_type',
        mappers: member_type,
        renderText: r =>  member_type[r.customer_type] || '-',
      },
      {
        title: '孩子数量',
        key: 'childs_count'
      },
      {
        title: '创建时间',
        key: 'create_time',
      },
      {
          title: '操作',
          align: 'center',
          type: 'error',
          width: 180,
          render: (h, ctx) => 
          <div>
            <a on-click={() => this.createCustorm(1, ctx.row)} style="margin-right:10px">编辑</a>
             {ctx.row.childs_count ? <poptip trigger="hover" content="孩子数量为零后即可删除" placement="top-end"><a disabled>删除</a></poptip> : <a on-click={() => this.deleteMember(0, ctx.row)}>删除</a>}
          </div>
      }],
    }
  },
  components: {},
  async created(){
  },
  methods: {
    deleteMember(type, row){
      let ids = []
      let title = "这些客户"
      if (+type === 1) {
        if (!this.selectedItems.length) return this.$Message.error("请先选择项目")
        for(let element of this.selectedItems){
          ids.push({ id: element.id })
        }
      } else {
      ids = [{id : row.id}]
      title = row.class_name
      }
      utils.deletedModal(this,title, async() => {
        let r = await this.$axios({
          method: "post",
          url: '/api/member/deleteMember',
          params: {
              member_id: JSON.stringify(ids),
          }
        }).then(res => res.data)
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("删除成功")
        }
      })
    },
    routeTo(path) {
            this.$router.push({ path })
    },
    selectChange(selection) {
      this.selectedItems = []
      _.extend(this.selectedItems, selection)
      console.log('test',this.selectedItems)
    },
    async createCustorm(type, row) {
       let title = type === 0 ? "新建客户" : "编辑客户"
       let r = await showModal(memberEdit, { data: row, type: 1 }, { title, width: 'default', styles: {top: '40px'} })
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("保存成功")
        }
    },
    formatRow(row) {
      // console.log("_checked=",_checked: _.contains([0], row.childs_count))
      return {...row, _disabled: !_.contains([0], row.childs_count)}
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
