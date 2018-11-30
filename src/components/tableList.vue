<template>
    <div>
        <div v-if="timeShow" class="topButton" style=''>
            <DatePicker type="daterange" split-panels placeholder="请选择日期" style="width: 200px"  @on-change="changeTime"></DatePicker>
            <Button type="primary" :loading="execlLoading" @click="exportData" style='margin-left: 10px'><Icon type="ios-download-outline"></Icon>导出表格数据</Button>
        </div>

      <Table ref="table" :loading="loading" :columns="columns2" :data="historyData" :height='height' :width='width'></Table>
      <div class="bottomPage">
        <Button type="primary" @click="toLoading" style="margin:11px 0px 0px 483px;">刷新表格
        </Button>
        <Page v-if="pagingOption.showPaging" :total="dataCount" :page-size="pageSize" :current="pageNum" show-elevator show-sizer show-total class="paging" @on-change="changepage" @on-page-size-change="handlePageSize"></Page>
      </div>
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
import { setTimeout } from 'timers';
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
                // execl下载加载
                execlLoading: false,
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
            width: {
                type : Number,
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
            // sql排序 默认按照id的降序
            order: {
                type: String,
                default: "desc"
            },
            formatRow: {
                type: Function,
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
                    render: c.renderText && ((h, ctx) => h('span', c.renderText(ctx.row))) ||
                    c.mapper && ((h, ctx) => h('span', c.mapper[ctx.row[c.key]] || ctx.row[c.key])) || c.render,
                    filterRemote: this.filterRemote,
                    // 将filters复写为mappers 调用需要用mappers: {1:1}的形式
                    filters: c.mappers && _.pairs(c.mappers).map(e => ({value: e[0], label: e[1]})),
                    renderHeader: c.searchable ? (h, ctx) => // 支持直接搜索
                    <div style="padding: 15px">
                        <span>{c.title}</span>
                        <i-input style="width:100%;" size="small" placeholder="搜索..." value={this.search[c.key]} class="inlinetop"
                        onOn-enter={() => this.handleListApproveHistory() }
                        onInput={v => this.search[c.key] = v }
                        ></i-input>
                    </div>
                    : c.renderHeader
                }))
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
                        timeRange: JSON.stringify(this.timeRange),
                        order: " order by t1.id "+this.order
                    }
                })
                this.loading = false
                if(r.data.rows){
                    this.historyData = this.formatRow ? r.data.rows.map(this.formatRow) : r.data.rows
                } else {
                    this.historyData = []
                }

                return r.data
            },
            // 刷新整个页面
            toLoading(){
                this.reload()
            },
            async handleListApproveHistory(index) {
                let res = await this.pageSend('get',this.url, 0, 0)
                this.historyData = this.historyData ? this.historyData.slice(0, this.pageSize) : []
                this.dataCount = res.rows ? res.rows.length : 0
                this.pageNum = 1
            },
            async changepage(index){
                var _start = ( index - 1 ) * this.pageSize;
                var _end = this.pageSize;
                let res = await this.pageSend('get', this.url, _start, _end)
                this.pageNum = index
                // this.historyData = res.rows ? res.rows.slice(0, this.pageSize) : []
            },
            async handlePageSize(index){
                this.pageSize = index
                let _start = (this.pageNum  - 1) * index;
                let _end = this.pageNum  * index;
                let res = await this.pageSend('get', this.url, _start, _end)
            },
            filterRemote: function(selected, field) {
                if (!selected.length) {
                    delete this.filterMap[field]
                } else {
                    this.filterMap[field] = selected
                }
                this.handleListApproveHistory()
            },
            // 时间筛选事件
            async changeTime (datatime) {
                this.timeRange = datatime
                this.handleListApproveHistory()
            },
            exportData () {
                this.execlLoading = true
                setTimeout(() => {
                    this.execlLoading = false
                },1000)
                // 由于浏览器传参无法传对象 需要先转换成json字符串 数组则不受影响
                window.location.href = `${this.downloadURL}?limit=0&offset=0&params=${JSON.stringify(this.params)}&filter=${JSON.stringify(this.filterMap)}&search=${this.searchParams && JSON.stringify(_.object(this.searchParams))}&timeRange=${JSON.stringify(this.timeRange)}&order= order by t1.id +${this.order}`
            },
        },
 
        created(){
            // unshift()可向数组的开头添加一个或更多元素，并返回新的长度
            if (this.isCheckBox) {
                this.cols.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                })
            }
            this.handleListApproveHistory()
        }
    }
</script>
<style lang="less">
    .topButton {
        position:relative;top:-10px;left:-34.9%;margin: 10px 0px 15px;
    }
</style>
