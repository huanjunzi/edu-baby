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
        width: 150,
        searchable: true,
      },
      {
        title: '家长称呼',
        width: 200,
        key: 'parents',
      },
      {
        title: '家长年纪',
        key: 'age',
        width: 100,
      },
      {
        title: '手机号',
        key: 'tel_phone',
        width: 150,
        searchable: true,
      },
      {
        title: '家庭地址',
        key: '',
        width: 220,
        renderText: r => r.province+r.city+r.district+r.address
      },
      {
        title: '客户类型',
        key: 'customer_type',
        width: 120,
        mappers: member_type,
        renderText: r =>  member_type[r.customer_type] || '-',
      },
      {
        title: '孩子数量',
        key: 'count_member',
        width: 100,
      },
      {
        title: '沟通次数',
        align: 'center',
        type: 'error',
        key: "",
        width: 120,
        render: (h, ctx) => 
        <div>
          <input-number value={+ctx.row.contact_count} editable={false} step={1} min={0} onOn-change={(val) => this.changeCount(ctx, val) }></input-number>
        </div>
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
          fixed: 'right',
          width: 210,
          render: (h, ctx) => 
          <div>
            {ctx.row.count_member ? <poptip trigger="hover" content="孩子数量为零后即可删除" placement="top-start"><a disabled>删除</a></poptip> : <a on-click={() => this.deleteMember(0, ctx.row)}>删除</a>}
            <a on-click={() => this.createCustorm(1, ctx.row)} style="margin-left:10px">编辑</a>
            <a on-click={() => this.routeTo('member/memberDetail',ctx.row.id)} style="margin-left:10px">查看</a>
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
    routeTo(path, id) {
      this.$router.push({ path, query: { member_id: id } })
    },
    selectChange(selection) {
      this.selectedItems = []
      _.extend(this.selectedItems, selection)
    },
    async createCustorm(type, row) {
       let title = type === 0 ? "新建家长" : "编辑家长"
       let r = await showModal(memberEdit, { data: row, type: 1 }, { title, width: 'default', styles: {top: '40px'} })
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("保存成功")
        }
    },
    formatRow(row) {
      return {...row, _disabled: !_.contains([0], row.count_member)}
    },
    async changeCount(ctx , val) {
       let r = await this.$axios({
          method: "post",
          url: '/api/member/changeContactCount',
          params: {
              id: ctx.row.id,
              count: val
          }
        }).then(res => res.data)
      
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
