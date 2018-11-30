<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">

      <FormItem label="儿童姓名" prop="child_name">
        <Input v-model="form.child_name" placeholder="请输入儿童姓名"></Input>
      </FormItem>
      <FormItem label="儿童性别" prop="sex">
        <Select v-model="form.sex">
          <Option v-for="option in sexOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
      </Select>
      </FormItem>
      <FormItem label="儿童年龄" prop="age">
        <Input v-model="form.age" placeholder="请输入儿童年龄"></Input>
      </FormItem>
      <FormItem label="儿童特点" prop="specialty">
        <Input v-model="form.specialty"  type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入儿童特点最多150个字..." :maxlength="150"></Input>
      </FormItem>
      <FormItem label="儿童生日" prop="birthday">
        <br />
        <DatePicker type="date" v-model="form.birthday" @on-change="changeTime" placeholder="请输入儿童生日" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="所属家长" prop="member_id">
        <Select v-model="form.member_id">
          <Option v-for="option in prarentsOptions" :value="option.id" :key="option.id">
            {{ option.name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="会员课程" prop="class_id">
        <Select v-model="form.class_id" :clearable="true">
          <Option v-for="option in classOptions" :value="option.id" :key="option.id">
            {{ option.class_name }}
          </Option>
        </Select>
      </FormItem>
      <div v-if="showMember&&showMessage" style="color:red;padding-top:10px;">当前是会员,切换课程会修改课程最终支付费用</div>
      <FormItem label="会员类型" prop="member_status">
        <Select v-model="form.member_status">
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
import { member_type } from '../member';
export default {
  props: ['data', 'type'],

  data() {
    let form = {
      child_name: "",
      sex: "",
      age: "",
      specialty: "",
      birthday: "",
      class_id: "",
      member_status: "",
      member_id: "",
    }
    if(this.data){
      form =  Object.assign(form, JSON.parse(JSON.stringify(this.data)))
      // 这边member_status传过来是number类型 需要转换成string
      form.member_status = form.member_status.toString()
    }
    return {
      childOptions: getMapFilters(child_type),
      sexOptions: getMapFilters(sex_type),
      prarentsOptions: [],
      classOptions: [],
      form,
      showMember: false,
      showMessage: false,
      classStatus: 0,
      ruleValidate: {
        child_name: [{ required: true, message: '儿童名字不能为空'}],
        sex: [{ required: true, message: '儿童性别不能为空'}],
        age: [{ required: true, message: '儿童年龄不能为空'}],
        member_id: [{ required: true, message: '所属家长不能为空'}],
        member_status: [{ required: true, message: '会员类型未选择'}],
      }
    }
  },
  created() {
    this.showMember =  +this.form.member_status === 1 ? true : false 
    this.classStatus = +this.form.class_id
    this.findInfo()
  },
  // 监听是否在职
  watch:{
    'form.member_status': function (newVal) {
      if(+newVal === 1) {
        this.showMember = true
      } else {
        this.showMember = false
      }
    },
     'form.class_id': function (newVal) {
      if(+this.classStatus!== 0 && +newVal !== +this.classStatus) {
        // console.log("+this.classStatus=", +this.classStatus)
        this.showMessage = true
      }
      else {
        this.showMessage = false
      }
    },
  },
  methods: {
    async findInfo() {
      let member = await this.$axios({
          method: "get",
          url: '/api/member/findMember',
          params: {
              params: {
                deleted: ['0']
              }
          }
      }).then(res => res.data)
      this.prarentsOptions = member.rows
      let classes = await this.$axios({
          method: "get",
          url: '/api/education/findClasses',
          params: {
              params: {
                deleted: ['0']
              }
          }
      }).then(res => res.data)
      this.classOptions = classes.rows
    },
    changeTime (datatime) {
        this.form.birthday = datatime
    },
    // 确定事件
    async onOk(close) {
      let valid = await this.$validForm(this.$refs.form)
      if (!valid) {
        return this.$Message.error("表单验证失败")
      }
      let r = await this.$axios({
          method: "post",
          url: '/api/child/editChild',
          params: {
              data: JSON.stringify([this.form]),
          }
      }).then(res => res.data)
      return close(r)
    },
  }
}
</script>
