<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">

      <FormItem label="儿童姓名" prop="child_name">
        <Input v-model="form.child_name" placeholder="请输入儿童姓名"></Input>
      </FormItem>
      <FormItem label="儿童性别" prop="sex">
        <Select v-model="form.sex" :clearable="true">
          <Option v-for="option in sexOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
      </Select>
      </FormItem>
      <FormItem label="儿童年龄" prop="age">
          <Input v-model="form.age" placeholder="请输入儿童年龄"></Input>
      </FormItem>
      <FormItem label="儿童特点" prop="specialty">
        <Input v-model="form.tel_phone" placeholder="请输入儿童特点"></Input>
      </FormItem>
      <FormItem label="儿童生日" prop="birthday">
        <br />
        <DatePicker type="date" placeholder="请输入儿童生日" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="所属家长" prop="parents">
        <Select v-model="form.parents" :clearable="true">
          <Option v-for="option in childOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="会员课程" prop="class_info">
        <Select v-model="form.class_info" :clearable="true">
          <Option v-for="option in childOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="会员类型" prop="member_status">
        <Select v-model="form.member_status" :clearable="true">
          <Option v-for="option in childOptions" :value="option.value" :key="option.value">
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
import {child_type, sex_type} from './index.js'
export default {
  props: ['data', 'type'],

  data() {
    let form = {
      child_name: "",
      sex: "",
      age: "",
      specialty: "",
      birthday: "",
      class_info: "",
      final_fee: "",
      member_status: "",
      parents: "",
    }
    if(this.data){
      form =  Object.assign(form, JSON.parse(JSON.stringify(this.data)))
    }
    return {
      childOptions: getMapFilters(child_type),
      sexOptions: getMapFilters(sex_type), 
      form,
      imgUrl: '',
      ruleValidate: {
        name: [{ required: true, message: '客户名字不能为空'}],
        parents: [{ required: true, message: '客户称谓不能为空'}],
        customer_type: [{ required: true, message: '客户类型未选择'}],
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
