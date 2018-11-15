<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">

      <FormItem label="家长姓名" prop="name">
        <Input v-model="form.name" placeholder="请输入家长姓名"></Input>
      </FormItem>
      <FormItem label="家长称谓" prop="parents">
        <Input v-model="form.parents" placeholder="请输入家长称谓"></Input>
      </FormItem>
      <FormItem label="家长年龄" prop="age">
          <Input v-model="form.age" placeholder="请输入家长年龄"></Input>
      </FormItem>
      <FormItem label="家长电话" prop="tel_phone">
        <Input v-model="form.tel_phone" placeholder="请输入家长电话"></Input>
      </FormItem>
      <FormItem label="客户类型" prop="customer_type">
        <Select v-model="form.customer_type" :clearable="true">
          <Option v-for="option in memberOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import _ from 'underscore'
import {getMapFilters} from '../utils/utils'
import {member_type} from './index.js'
export default {
  props: ['data', 'type'],

  data() {
    // let form = JSON.parse(JSON.stringify(this.data))
    let form = {
      name: "",
      parents: "",
      age: "",
      tel_phone: "",
      customer_type: "",
    }
    if(this.data){
      form =  Object.assign(form, JSON.parse(JSON.stringify(this.data)))
    }
    return {
      memberOptions: getMapFilters(member_type),
      form,
      imgUrl: '',
      ruleValidate: {
        name: [{ required: true, message: '客户名字不能为空'}],
        parents: [{ required: true, message: '客户称谓不能为空'}],
        customer_type: [{ required: true, message: '客户类型未选择'}],
        tel_phone: [{required: true, message: '电话格式不正确', pattern: /^1\d{10}$/, }],
      }
    }
  },
  created() {
  },
  methods: {
    // 确定事件
    async onOk(close) {
      let valid = await this.$validForm(this.$refs.form)
      if (!valid) {
        return this.$Message.error("表单验证失败")
      }
      // 如果要传json数组 需要先将JS对象转成JSON字符串
      // let dataFomart =JSON.stringify(await this.dataEdit())
      let r = await this.$axios({
          method: "post",
          url: '/api/member/editMember',
          params: {
              data: JSON.stringify([this.form]),
          }
      }).then(res => res.data)
      console.log("r==", r)
      return close(r)
    },
    
    // 单个编辑和多个编辑的数据 统一成数组格式 到后台循环处理
    // dataEdit() {
    //   let dataList = []
    //   if(this.type === '0') {
    //     dataList = [this.form]
    //   }
    //   if(this.type === '1') {
    //     for(let element of this.form){
    //       dataList.push({ id: element.id })
    //     }
    //   }
    //   return dataList
    // }
  }
}
</script>
