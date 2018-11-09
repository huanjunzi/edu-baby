<template>
    <div>
        <div v-if="timeShow" class="topButton" style=''>
            <DatePicker type="daterange" split-panels placeholder="请选择日期" style="width: 200px"  @on-change="changeTime"></DatePicker>
            <Button type="primary" @click="exportData" style='margin-left: 10px'><Icon type="ios-download-outline"></Icon>导出原始数据</Button>
        </div>

      <Table ref="table" :loading="loading" :columns="columns2" :data="historyData" :height='height'></Table>
      <Button type="primary" :loading="loadingButton" @click="toLoading" style="margin:11px 0px 0px 483px;">刷新表格
      </Button>
      <Page v-if="pagingOption.showPaging" :total="dataCount" :page-size="pageSize" :current="pageNum" show-elevator show-sizer show-total class="paging" @on-change="changepage" @on-page-size-change="handlePageSize"></Page>
    </div>
</template>
<style scoped>
  .paging{
      float:right;
      margin-top:10px;
  }
  .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: blue;
  }
</style>
<script>
    import _ from 'underscore'
    export default {
        inject: ['reload'],
        data () {
            return {
                // 当前页数
                pageNum: 1,
                // 每页显示多少记录
                pageSize:10,
                // 表格数据项
                historyData: [],
                // 数据总条数
                dataCount:0,
                // 表格加载
                loading: false,
                // filters
                filterMap: {},
                // 搜索
                search: {},
                searchParams: {},
                // 时间筛选
                timeRange: [],
            }
        },
        props: {
            // 表格高度
            height: {
                type : Number,
                default: 500
            },
            // 是否有复选框
            isCheckBox: {
                type: Boolean,
                default: true
            },
            cols: {},
            url: {
                type: String,
                require: true
            },
            downloadURL: {
                type: String,
                require: true
            },
            params: {
                type: Object,
            },
            filter: {
                type: Array,
            },
            // 是否显示时间筛选框
            timeShow: {
                type: Boolean,
                default: true
            },
            // 是否显示分页信息
            pagingOption: {
                type: Object,
                default: function () {
                    return {
                        showPaging: true,
                    }
                }
            },
        },
        mounted(){
            // 使父组件可以触发自定义函数
            for (let event of ['on-selection-change']) {
                 //触发当前实例上的事件...args
                this.$refs.table.$on(event, (...args) => {
                //监听event事件后运行...args
                this.$emit(event, ...args)
                })
            }  
        },
        computed: {
            columns2() {
                const cloumns = this.cols.map(c => _.extend({align: 'center'}, c, {
                    filterRemote: this.filterRemote,
                    // 将filters复写为mappers 调用需要用mappers: {1:1}的形式
                    filters: c.mappers && _.pairs(c.mappers).map(e => ({value: e[0], label: e[1]})),
                    renderHeader: c.searchable ? (h, ctx) => // 支持直接搜索
                    <div style="padding: 15px">
                        <span>{c.title}</span>
                        <i-input style="width:80%;" size="small" placeholder="搜索..." value={this.search[c.key]} class="inlinetop"
                        onOn-enter={() => this.handleListApproveHistory() }
                        onInput={v => this.search[c.key] = v }
                        ></i-input>
                    </div>
                    : c.renderHeader
                }))
                // console.log('cloumns===', cloumns)
                return cloumns
            }
        },
        methods:{
            // 获取表格数据
            async pageSend(type,url,limit,offset){
                if(this.search){
                    this.searchParams = _.pairs(this.search).filter(p => p[1])
                }
                this.loading = true
                let r = await this.$axios({
                    methods: type,
                    url: url,
                    params: {
                        limit,
                        offset,
                        params: this.params,
                        filter: this.filterMap,
                        search: this.searchParams && _.object(this.searchParams),
                        timeRange: JSON.stringify(this.timeRange)
                    }
                }).then(res => res.data).then(this.loading = false)
                return r
            },
            // 刷新整个页面
            toLoading(){
                this.reload()
            },
            async handleListApproveHistory() {
                console.log('调用', this.filterMap, this.params, this.timeRange)
                let r = await this.pageSend('get',this.url, 0, 0)
                this.dataCount = r.rows ? r.rows.length : 0
                this.historyData = r.rows ? r.rows.slice(0, this.pageSize) : []
            },

            async changepage(index){
                var _start = ( index - 1 ) * this.pageSize;
                var _end = this.pageSize;
                let r = await this.pageSend('get', this.url, _start, _end)
                this.historyData = r.rows;
                // this.dataCount = r.rows ? r.rows.length : 0
                },
            async handlePageSize(index){
                this.pageSize = index
                let _start = (this.pageNum  - 1) * index;
                let _end = this.pageNum  * index;
                let r = await this.pageSend('get', this.url, _start, _end)
                this.historyData = r.rows;
                this.dataCount = r.rows ? r.rows.length : 0
            },
            filterRemote: function(selected, field) {
                console.log('selected=', selected, 'field=', field)
                if (!selected.length) {
                    delete this.filterMap[field]
                } else {
                    this.filterMap[field] = selected
                    console.log('this.filterMap', this.filterMap, typeof this.filterMap)
                }
                this.handleListApproveHistory()
            },
            // 时间筛选事件
            async changeTime (datatime) {
                this.timeRange = datatime
                console.log('this.timeRange', this.timeRange)
                this.handleListApproveHistory()
            },
            exportData () {
                // 由于浏览器传参无法传对象 需要先转换成json字符串 数组则不受影响
                window.location.href = `${this.downloadURL}?limit=0&offset=0&params=${JSON.stringify(this.params)}&filter=${JSON.stringify(this.filterMap)}&search=${this.searchParams && JSON.stringify(_.object(this.searchParams))}&timeRange=${JSON.stringify(this.timeRange)}`
            },
        },
 
        created(){
            // unshift()可向数组的开头添加一个或更多元素，并返回新的长度
            if (this.isCheckBox) {
                this.cols.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center',
                })
            }
            this.handleListApproveHistory()
        }
    }
</script>
<style lang="less" scoped>
    .topButton{
        position:relative;top:-10px;left:-34.9%;margin: 10px 0px 15px;
    }
</style>
