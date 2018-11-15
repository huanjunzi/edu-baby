<template>
  <div class="eduClass">
    <div>
      <Button style="position:relative;top: -10px;left: -37.2%;
" type="primary" @click="routeTo('class_create')" >新建课程
      </Button>
            <Button style="position:relative;top: -10px;left: -36.4%;
    " type="primary" @click="editClass('1')" >批量编辑价格
          </Button>
           <Button style="position:relative;top: -10px;left: -35.8%;
    " type="primary" @click="deleteClass('1')" >批量删除
          </Button>
    </div>
    <table-list ref="tableList" :height="500" :cols="historyColumns" :isCheckBox="true" :url="url" :pagingOption="pagingOption"  @on-selection-change="selectChange" :params="params" :timeShow="false" :downloadURL="downloadURL"  /></table-list>
  </div>

</template>
<script>
import _ from 'underscore'
import {showModal} from '../modals'
import classEdit from './classEdit'
import * as utils from '../utils/utils'
export default {
  data () {
    return {
      theme1: 'dark',
      selectedItems: [],
      url: '/api/education/findClasses',
      downloadURL: '/api/education/downloadExcel',
      pagingOption: { 
        showPaging: true,
      },
      params: {
        deleted: ['0']
      },
      historyColumns: [
        {
            title: '课程名称',
            key: 'class_name',
            mappers: {'亲子课': '亲子课', '早教课': '早教课', '托班':'托班'}
        },
        {
            title: '课程费用',
            key: 'class_fee',
            searchable: true,
            // mappers: {'小于': '普通', '加急': '加急'}
            // filters: [
            //   {
            //     label: '小于￥5000',
            //     value: '5000'
            //   },
            //   {
            //     label: '￥5000~￥10000',
            //     value: '￥10000'
            //   }
            // ],
            // filterRemote: (value,row) => {
            //   this.filter[0] = "ddd"
            //     this.$refs.tableList.handleListApproveHistory()
            // }
        },
        {
            title: '课程描述',
            key: 'class_description'
        },
        {
            title: '创建时间',
            key: 'create_time',
            sortable: true,
        },
        {
            title: '操作',
            align: 'center',
            type: 'error',
            width: 180,
            render: (h, ctx) => 
            <div>
              <a on-click={() => this.createClass("class_create", ctx.row)} style="margin-right:10px">编辑</a>
              <a on-click={() => this.editClass('0', ctx.row)} style="margin-right:10px">编辑价格</a>
              <a on-click={() => this.deleteClass(0, ctx.row)}>删除</a>
            </div>
        }
      ],
    }
  },
  components: {},
  created(){
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
    // 0代表单个编辑 1代表批量编辑
    async editClass(type, row) {
      let title = "单个编辑"
      if (type === '1') {
          title = "批量编辑"
          if (!this.selectedItems.length) return this.$Message.error("请先选择项目")
      }
      let data
      data = type === '0' ?  row : this.selectedItems
      let r = await showModal(classEdit, { data, type }, { title: title, width: 'default', styles: {top: '40px'} })
      if(r && r.message === "success"){
        // 清空选中框数据
        this.selectedItems = []
        this.$refs.tableList.handleListApproveHistory()
      }
    },
    createClass(path, row) {
      this.$router.push({ path, query: {id : row.id} })
    },
    async deleteClass(type, row) {
      let ids = []
      let title = "这些课程"
      if (type === '1') {
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
          url: '/api/education/deleteClass',
          params: {
              class_id: JSON.stringify(ids),
          }  
        }).then(res => res.data)
        
        if(r && r.message === "success") {
          this.$refs.tableList.handleListApproveHistory()
          this.$Message.success("删除成功")
        }
      })
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
