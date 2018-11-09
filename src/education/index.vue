<template>
  <div class="eduClass">
   
    <table-list ref="tableList" :height="500" :cols="historyColumns" :isCheckBox="true" :url="url" :pagingOption="pagingOption"  @on-selection-change="selectChange" :params="params" :timeShow="true" :downloadURL="downloadURL"/></table-list>
  </div>
</template>
<script>
import _ from 'underscore'

export default {

  data () {
    let name = this.$route.query.name
    return {
      theme1: 'dark',
      name,
      selectedItems: [],
      url: '/api/education/findClasses',
      downloadURL: '/api/education/downloadExcel',
      pagingOption: { 
        showPaging: true,
      },
      params: {
        'class_type': [0,1,2]
      },
      historyColumns: [
        {
            title: '课程名称',
            key: 'class_name',
            mappers: {'亲子课': '亲子课', '早教课': '早教课', '托班':'托班'}
            // render: (h, ctx) => {
            // },
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
        }
      ],
    }
  },
  components: {},
  created(){
  },
  methods: {
    // routeTo(path,id) {
    //         this.$router.push({ path, query: { id } })
    // }
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
