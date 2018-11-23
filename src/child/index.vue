<template>
  <div>
     <Row>
          <Col span="2">
               <Button style="margin: 0px 0px 15px -10px" type="primary" @click="createCustorm(0)">新建儿童</Button>
          </Col>
          <Col span="2">
               <Button style="margin: 0px 0px 15px 10px" type="primary" @click="deleteChild(1)">批量删除</Button>
          </Col>
      </Row>
      <table-list ref="tableList" :height="500" :cols="historyColumns" :url="url" :formatRow="formatRow" @on-selection-change="selectChange" :params="params" :downloadURL="downloadURL"></table-list>
  </div>
</template>
<script>
import _ from 'underscore'
import {showModal} from '../modals'
import childEdit from './childEdit'
import * as utils from '../utils/utils'
import {child_type,sex_type} from './index.js'
export default {
  data () {
    return {
      selectedItems: [],
      url: '/api/child/findChild',
      downloadURL: '/api/child/downloadChildExcel',
      
      pagingOption: { 
        showPaging: true,
      },
      params: {
        deleted: ['0']
      },
      isEdit: true,
      historyColumns: [
      {
        title: '儿童姓名',
        key: 'child_name',
        width: 120,
        searchable: true,
      },
      {
        title: '所属家长',
        key: 'member_name',
        width: 120,
      },
      {
        title: '家长电话',
        key: 'tel_phone',
        width: 120,
      },
      {
        title: '儿童性别',
        key: 'sex',
        width: 100,
        mappers: sex_type,
        renderText: r =>  sex_type[r.sex] || '-',
      },
      {
        title: '儿童年龄',
        key: 'age',
        width: 100,
      },
      {
        title: '儿童生日',
        key: 'birthday',
        width: 100,
      },
      {
        title: '儿童特点',
        key: 'specialty',
        width: 200,
      },
      {
        title: '所报课程',
        key: 'class_name',
        width: 120,
      },
      {
        title: '最终支付费用',
        key: '',
        width: 110,
        render: (h, ctx) => 
        <div>
          <input-number id={"fee" + ctx.row.id} value={+ctx.row.final_fee} editable={this.isEdit} min={0} step={1000} onOn-change={(val) => this.changeCount(ctx, val, "fee") }></input-number>
        </div>
      },
      {
        title: '会员状态',
        key: 'member_status',
        width: 120,
        mappers: child_type,
        renderText: r =>  child_type[r.member_status] || '-',
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
          width: 180,
          fixed: 'right',
          render: (h, ctx) => 
          <div>
            <a on-click={() => this.createCustorm(1, ctx.row)} style="margin-right:10px">编辑</a>
             {+ctx.row.member_status === 1 ? <poptip trigger="hover" content="设为非会员后即可删除" placement="top-end"><a disabled>删除</a></poptip> : <a on-click={() => this.deleteChild(0, ctx.row)}>删除</a>}
            <a on-click={() => this.routeTo('childDetail',ctx.row.id)} style="margin-left:10px">查看</a>
          </div>
      }],
    }
  },
  components: {},
  async created(){
  },
  methods: {
    deleteChild(type, row){
      let ids = []
      let title = "这些儿童"
      if (+type === 1) {
        if (!this.selectedItems.length) return this.$Message.error("请先选择项目")
        for(let element of this.selectedItems){
          ids.push({ id: element.id })
        }
      } else {
      ids = [{id : row.id}]
      title = row.child_name
      }
      utils.deletedModal(this,title, async() => {
        let r = await this.$axios({
          method: "post",
          url: '/api/child/deleteChild',
          params: {
              child_id: JSON.stringify(ids),
          }
        }).then(res => res.data)
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("删除成功")
        }
      })
    },
    routeTo(path, id) {
      this.$router.push({ path, query: { child_id: id } })
    },
    selectChange(selection) {
      this.selectedItems = []
      _.extend(this.selectedItems, selection)
    },
    async createCustorm(type, row) {
       let title = type === 0 ? "新建儿童" : "编辑儿童"
       let r = await showModal(childEdit, { data: row, type: 1 }, { title, width: 'default', styles: {top: '40px'} })
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("保存成功")
        }
    },
    formatRow(row) {
      return {...row, _disabled: _.contains([1], row.member_status)}
    },
    async changeCount(ctx , val, keyName) {
      // 获取选中的节点
      // let currentNode = document.getElementById(keyName + ctx.row.id)
      // currentNode.style="background-color:red"
      
       let r = await this.$axios({
          method: "post",
          url: '/api/child/changeClassFee',
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
