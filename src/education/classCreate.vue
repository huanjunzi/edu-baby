<template>
  <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
    <div class="selection">
      <div class="text">基本信息</div>
      
      <FormItem label="课程名称" prop="class_name" style="margin-top: 50px">
        <Row>
          <Col span="8">
            <Input v-model="formData.class_name" placeholder="请输入课程名称..."></Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="课程费用" prop="class_fee">
        <Row>
          <Col span="2">
            <InputNumber :min="0.00" v-model="formData.class_fee" :step='1000' placeholder="请输入课程费用..."></InputNumber>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="课程描述">
      <Row>
        <Col span="12" style="text-align:right">{{formData.class_description.length}}/100</Col>
      </Row>
      <Row>
        <Col span="12">
            <Input v-model="formData.class_description" type="textarea" :autosize="{minRows: 3}" :maxlength="100" placeholder="请输入课程描述..."></Input>
        </Col>
      </Row>
    </FormItem>
    
      <div style="padding: 1em 0; border-bottom: 1px solid #e4e4e4;border-bottom:none;width:100%">
        <FormItem>
          <Button :loading="loadingStatus" type="primary" @click="onOk()">保存</Button>
          <Button type="ghost" @click="cancel()" style="margin-left: 8px">取消</Button>
        </FormItem>
      </div>
    </div>
  </Form>
</template>
<script>

  import * as _ from 'underscore'
  export default {
    data() {
      const reg = /^(\d+)(\.\d{1,2})?$/

      return {
        loadingStatus: false,
        formData : {
          class_name: "",
          class_fee: 0,
          class_description: ""
        },
        ruleValidate: {
          class_name: [{ required: true, message: '课程名称为必填选项' }],
          class_fee: [{ required: true, message: '课程费用只能有两位小数' , pattern: reg,}],

        },
      }
    },
    async created() {
      if(!_.isEmpty(this.$route.query)){
        let r = await this.$axios({
          method: "get",
          url: '/api/education/findOneClass',
          params: {
              data: this.$route.query.id,
          }
        }).then(res => res.data)
        if(r && r.message === "success") {
          //ES6提供了Object.assign()，用于合并/复制对象的属性。浅拷贝标准写法（推荐）应用于双向绑定的场景 例如编辑 
          this.formData = Object.assign(this.formData, r.rows[0])
          // _.extend(this.formData, r.rows[0]) 等同于 Object.assign(this.formData, r.rows[0]（不推荐双向绑定的场景使用）
          // _.extend(this.formData, r.rows[0])
        }
      }
   
      
    },
    methods: {
 
      async onOk() {
        let valid = await this.$validForm(this.$refs.formData)
        if (!valid) {
          return this.$Message.error("表单验证失败")
        }
        this.loadingStatus = true
        let r = await this.$axios({
          method: "post",
          url: '/api/education/createClass',
          params: {
              data: this.formData,
          }
        }).then(res => res.data).then(this.loadingStatus = false)

        if (r && r.message === "success") {
         this.cancel()
         return this.$Message.success("操作成功")
        }
        return this.$Message.error("操作失败")

      },
      cancel() {
        this.$router.push({ path: 'class'})
      },
 
    }
  }
</script>
<style scoped lang="less">
  .selection {
     padding: 1em 0;
     border-bottom: 1px solid #e4e4e4;
    .text {
      position: absolute;
      left: 50px;
      font-size: 14px;
      font-weight: bold;
      color: #495060;
    }
  }
</style>
