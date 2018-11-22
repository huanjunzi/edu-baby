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
        <Col span="2"><span > 第一联系人 </span></Col>
        <Col offset="10"><span >  第二联系人 </span></Col>
      </Row>
      <Row class="title_left">
          <Col span="2"><span > 客户姓名: </span></Col>
          <Col span="8"><span > {{ parentArr.name  || '--' }} </span></Col>
          <Col span="2"><span > 客户姓名: </span></Col>
          <Col span="8"><span > {{ parentArr.second_name  || '--' }} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 客户称谓:</span></Col>
        <Col span="8"><span> {{ parentArr.parents  || '--' }} </span></Col>
        <Col span="2"><span> 客户称谓:</span></Col>
        <Col span="8"><span> {{ parentArr.second_parents  || '--' }} </span></Col>
      </Row>
       <Row class="title_left">
        <Col span="2"><span> 客户年龄:</span></Col>
        <Col span="8"><span> {{ parentArr.age  || '--' }} </span></Col>
         <Col span="2"><span> 客户年龄:</span></Col>
        <Col span="8"><span> {{ parentArr.second_age  || '--' }} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 客户号码:</span></Col>
        <Col span="8"><span> {{ parentArr.tel_phone  || '--' }} </span></Col>
        <Col span="2"><span> 客户号码:</span></Col>
        <Col span="8"><span> {{ parentArr.second_tel_phone  || '--' }}  </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 客户类型:</span></Col>
        <Col span="8"><span> {{ memberType = parentArr.customer_type === '0' ? "非潜在客户" : parentArr.customer_type === "1" ? "潜在客户" : "会员"}} </span></Col>
        <Col span="2"><span> 客户意向:</span></Col>
        <Col span="8"><span> {{ parentArr.purpose  || '--' }}  </span></Col>
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
          <span style="color:green" v-if="childArr.length > 0"> {{childArr.length}} </span>
          <span style="color:red" v-else> {{childArr.length}} </span>
        </Col>
      </Row>

      <Row class="title_left" v-for="(item, index) in childArr" :key="">
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
        <Col span="3">
        <span><h3 >备注信息</h3></span>
        </Col>
      </Row>
      <Row class="title_left">
          <Col span="2"><span > 添加方式: </span></Col>
          <Col span="22"><span > {{ +parentArr.social_soft === 0 ? "微信" : +parentArr.social_soft === 1 ? "QQ" : +parentArr.social_soft === 2 ? "其它" : "--" }} </span></Col>
      </Row>
      <Row class="title_left">
          <Col span="2"><span > 客户备注: </span></Col>
          <Col span="22"><span > {{ parentArr.remark  || '--' }} </span></Col>
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
      }
    },
    methods: {
 
      routeTo() {
        this.$router.push({ path: 'child'})
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
