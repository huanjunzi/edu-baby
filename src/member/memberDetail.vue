<template>
  <div style="">

    <!--区块1-->
    <div class="section">
       <Row class="title_left">
        <Col span="3">
        <span><h3 >家长信息</h3></span>
        </Col>
      </Row>
      <Row class="title_left">
          <Col span="2"><span > 客户姓名: </span></Col>
          <Col span="8"><span > {{parentArr.name}} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 客户称谓:</span></Col>
        <Col span="8"><span> {{parentArr.parents}} </span></Col>
      </Row>
       <Row class="title_left">
        <Col span="2"><span> 客户年龄:</span></Col>
        <Col span="8"><span> {{parentArr.age}} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 客户号码:</span></Col>
        <Col span="8"><span> {{parentArr.tel_phone}} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 客户类型:</span></Col>
        <Col span="8"><span> {{ memberType = parentArr.customer_type === '0' ? "非潜在客户" : parentArr.customer_type === "1" ? "潜在客户" : "会员"}} </span></Col>
      </Row>
    </div>

    <div class="section">
       <Row class="title_left">
        <Col span="3">
        <span><h3>孩子信息</h3></span>
        </Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 孩子数量:</span></Col>
        <Col span="2">
          <span style="color:green" v-if="parentArr.childs_count > 0"> {{parentArr.childs_count}} </span>
          <span style="color:red" v-else> {{parentArr.childs_count}} </span>
        </Col>
      </Row>

      <Row class="title_left" v-for="(item, index) in childArr" :key="item,index">
        <Col span="6">
          <span> 孩子姓名:</span>
          <span class="space"> {{item.child_name}} </span>
        </Col>
        <Col span="6">
          <span> 孩子年纪:</span>
          <span class="space"> {{item.age}}岁 </span>
        </Col>
        <Col span="6">
          <span> 孩子性别:</span>
          <span class="space"> {{item.sex === "male" ? "男" : "女"}} </span>
        </Col>
      </Row>
      
    </div>

    <div class="section">
      <Row class="title_left">
        <Col span="4">
        <span> <Button type="primary" @click="routeTo">返回上一页</Button></span>
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
        loadingStatus: false,
        childArr : [
          // {name: "fdff",age: 11, sex: "男"},
          // {name: "fdff",age: 11, sex: "男"},
          // {name: "fdff",age: 11, sex: "男"}
        ],
        parentArr: {},
        memberType: "",
      }
    },
    async created() {
      if(!_.isEmpty(this.$route.query)){
        let r = await this.$axios({
          method: "get",
          url: '/api/member/getMemberDetail',
          params: {
              data: this.$route.query.member_id,
          }
        })
        this.childArr = r.data.rows[0].childs
        this.parentArr = r.data.rows[1].parent[0]
        console.log("res.data=", r.data)
        console.log("this.childArr", this.parentArr, typeof this.parentArr)
        
      }
   
      //   if(r && r.message === "success") {
      //     //ES6提供了Object.assign()，用于合并/复制对象的属性。浅拷贝标准写法（推荐）应用于双向绑定的场景 例如编辑 
      //     this.formData = Object.assign(this.formData, r.rows[0])
      //     // _.extend(this.formData, r.rows[0]) 等同于 Object.assign(this.formData, r.rows[0]（不推荐双向绑定的场景使用）
      //     // _.extend(this.formData, r.rows[0])

      
    },
    methods: {
 
      routeTo() {
        this.$router.push({ path: 'member'})
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
