<template>
  <div style="">

    <!--区块1-->
    <div class="section">
       <Row class="title_left">
        <Col span="3">
        <span><h3 >儿童信息</h3></span>
        </Col>
      </Row>
      <Row class="title_left">
          <Col span="2"><span > 儿童姓名: </span></Col>
          <Col span="8"><span > {{ childInfo.child_name  || '--' }} </span></Col>
          <Col span="2"><span > 儿童性别: </span></Col>
          <Col span="8"><span > {{ childInfo.sex ? "男" : "女" || '--' }} </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 儿童年龄:</span></Col>
        <Col span="8"><span> {{ childInfo.age  || '--' }} </span></Col>
        <Col span="2"><span> 儿童特点:</span></Col>
        <Col span="8"><span> {{ childInfo.specialty  || '--' }} </span></Col>
      </Row>
       <Row class="title_left">
        <Col span="2"><span> 儿童生日:</span></Col>
        <Col span="8"><span> {{ childInfo.birthday  || '--' }} </span></Col>
        <Col span="2"><span> 会员状态:</span></Col>
        <Col span="8"><span> {{ +childInfo.member_status === 0 ? '非会员' : +childInfo.member_status === 1 ? '会员' : '过期会员'}}  </span></Col>
      </Row>
    </div>

     <!--区块2-->
    <div class="section">
       <Row class="title_left">
        <Col span="3">
        <span><h3 >所属家长信息</h3></span>
        </Col>
      </Row>
      <Row class="title_left">
          <Col span="2"><span > 第一联系人 </span></Col>
          <Col offset="10"><span > 第二联系人 </span></Col>
      </Row>
       <Row class="title_left">
        <Col span="2"><span> 家长姓名:</span></Col>
        <Col span="8"><span> {{ childInfo.name  || '--' }} </span></Col>
        <Col span="2"><span> 家长姓名:</span></Col>
        <Col span="8"><span> {{ childInfo.second_name  || '--' }}  </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 家长电话:</span></Col>
        <Col span="8"><span> {{ childInfo.tel_phone  || '--' }} </span></Col>
        <Col span="2"><span> 家长电话:</span></Col>
        <Col span="8"><span> {{ childInfo.second_tel_phone  || '--' }}  </span></Col>
      </Row>
       <Row class="title_left">
        <Col span="2"><span><a @click="routeTo('memberDetail', childInfo.member_id)" style="font-size:10px">查看家长详情</a></span></Col>
      </Row>
    </div>

         <!--区块3-->
    <div class="section">
       <Row class="title_left">
        <Col span="3">
        <span><h3 >所报课程信息</h3></span>
        </Col>
      </Row>
       <Row class="title_left">
        <Col span="2"><span> 课程名称:</span></Col>
        <Col span="8"><span> {{ childInfo.name  || '--' }} </span></Col>
        <Col span="2"><span> 课程描述:</span></Col>
        <Col span="8"><span> {{ childInfo.description  || '--' }}  </span></Col>
      </Row>
      <Row class="title_left">
        <Col span="2"><span> 课程费用:</span></Col>
        <Col span="8"><span> {{ childInfo.class_fee  || '--' }} </span></Col>
        <Col span="2"><span> 成交费用:</span></Col>
        <Col span="8"><span> {{ childInfo.final_fee  || '--' }} </span></Col>
      </Row>
    </div>


    <div class="section">
      <Row class="title_left">
        <Col span="4">
        <span> <Button type="primary" @click="routeTo('child')">返回上一页</Button></span>
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
        childInfo : {},
      }
    },
    async created() {
      if(!_.isEmpty(this.$route.query)){
        let r = await this.$axios({
          method: "get",
          url: '/api/child/getChildDetail',
          params: {
              data: this.$route.query.child_id,
          }
        })
        this.childInfo = r.data.rows[0]
      }
    },
    methods: {
 
      routeTo(path, id) {
        this.$router.push({ path, query: {member_id : id} })
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
