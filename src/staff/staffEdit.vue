<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">
      <FormItem label="员工姓名" prop="staff_name">
        <Input v-model="form.staff_name" placeholder="请输入员工姓名"></Input>
      </FormItem>
      <FormItem label="员工年龄" prop="staff_age">
        <Input v-model="form.staff_age" placeholder="请输入员工年龄"></Input>
      </FormItem>
      <FormItem label="员工性别" prop="staff_sex">
        <Select v-model="form.staff_sex">
          <Option v-for="option in sexOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="员工电话" prop="staff_tel_phone">
        <Input v-model="form.staff_tel_phone" placeholder="请输入员工电话"></Input>
      </FormItem>
      <FormItem label="员工职位" prop="staff_type">
        <Select v-model="form.staff_type">
          <Option v-for="option in jobOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select> 
      </FormItem>
      <FormItem label="员工在职状态" prop="staff_online">
       <Select v-model="form.staff_online">
          <Option v-for="option in onlineOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="员工月薪" prop="staff_salary">
        <br />
        <InputNumber :min="0.00" v-model="form.staff_salary" :step='1000' ></InputNumber>
      </FormItem>
      <FormItem label="入职时间" prop="entry_time">
        <br />
        <DatePicker type="date" v-model="form.entry_time" @on-change="(time) => this.changeTime(time, 0)" placeholder="请输入入职时间" style="width: 200px"></DatePicker>
        <DatePicker v-if="+form.staff_online === 1" type="date" v-model="form.dimission_time" @on-change="(time) => this.changeTime(time, 1)" placeholder="请输入离职时间" style="width: 200px;padding-left:20px;"></DatePicker>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import _ from 'underscore'
import {getMapFilters} from '../utils/utils'
import { sex_type, online, job_type } from './index.js'
export default {
  props: ['data', 'type'],
  data() {
    let form = {
      staff_name: "",
      staff_age: "",
      staff_sex: "",
      staff_tel_phone: "",
      staff_type: "",
      staff_online: "",
      staff_salary: 0,
      staff_last_salary: "",
      entry_time: "",
      dimission_time: "",
    }
    if(this.data){
      form =  Object.assign(form, JSON.parse(JSON.stringify(this.data)))
    }
    const regSalary = /^(\d+)(\.\d{1,2})?$/

    return {
      form,
      ruleValidate: {
          staff_name: [{required: true, message: '员工姓名不能为空' }],
          staff_sex: [{required: true, message: '员工性别未选择' }],
          staff_type: [{required: true, message: '员工职位不能为空' }],
          staff_online: [{required: true, message: '员工在职状态未选择' }],
          entry_time: [{required: true, message: '员工入职时间未选择' }],
          staff_salary: [{required: false, message: '只能填写到小数点后两位', pattern: regSalary, }],
          staff_tel_phone: [{required: true, message: '电话格式不正确', pattern: /^1\d{10}$/, }],
      },
      sexOptions: getMapFilters(sex_type),
      onlineOptions: getMapFilters(online),
      jobOptions: getMapFilters(job_type),
    }
  },
  created() {
  },
  // 监听是否在职
  watch:{
    'form.staff_online': function (newVal) {
      // 如果是在职的状态 将离职日期清空
      if(+newVal === 0) {
        this.form.dimission_time = ""
        // delete this.form.dimission_time
      }
    },
  },
  methods: {
    // 确定事件
    async onOk(close) {
      console.log("form=", this.form)
      let valid = await this.$validForm(this.$refs.form)
      if (!valid) {
        return this.$Message.error("表单验证失败")
      }
      console.log("this.form", this.form)
      let r = await this.$axios({
        method: "post",
        url: '/api/staff/editStaff',
        params: {
            data: JSON.stringify([this.form]),
        }
      }).then(res => res.data)
      return close(r)
    },
    changeTime (datatime, type) {
      if(+type === 0){
       return this.form.entry_time = datatime
      }
      this.form.dimission_time = datatime
    },
  }
}
</script>
