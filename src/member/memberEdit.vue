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
      <a @click="showMore">更多联系人 <Icon v-if="!showContact" type="chevron-up"></Icon><Icon v-if="showContact" type="chevron-down"></Icon> </a> 
      <div v-if="showContact">
        <FormItem label="家长姓名" prop="second_name">
          <Input v-model="form.second_name" placeholder="请输入家长姓名"></Input>
        </FormItem>
        <FormItem label="家长称谓" prop="second_parents">
          <Input v-model="form.second_parents" placeholder="请输入家长称谓"></Input>
        </FormItem>
        <FormItem label="家长年龄" prop="second_age">
          <Input v-model="form.second_age" placeholder="请输入家长年龄"></Input>
        </FormItem>
        <FormItem label="家长电话" prop="second_tel_phone">
          <Input v-model="form.second_tel_phone" placeholder="请输入家长电话"></Input>
        </FormItem>
      </div>
      <FormItem label="所在地区：" prop="province">
        <Cascader :data="storeLocation" v-model="area" @on-change="changeArea" />
      </FormItem>
      <FormItem label="详细地址" prop="address">
        <Input v-model="form.address" placeholder="请输入详细地址"></Input>
      </FormItem>
      <FormItem label="客户类型" prop="customer_type">
        <Select v-model="form.customer_type">
          <Option v-for="option in memberOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="意向" prop="purpose">
        <Input v-model="form.purpose" placeholder="请输入家长意向"></Input>
      </FormItem>
      <FormItem label="添加方式" prop="purpose">
        <Select v-model="form.social_soft" :clearable="true">
          <Option v-for="option in socialOptions" :value="option.value" :key="option.value">
            {{ option.text }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="form.remark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" :maxlength="150" placeholder="请输入备注最多150个字..." style=""></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import _ from 'underscore'
import {getMapFilters} from '../utils/utils'
import {member_type, social} from './index.js'
import storeLocation from '../utils/StoreLocation'
export default {
  props: ['data', 'type'],

  data() {
    let form = {
      name: "",
      parents: "",
      age: "",
      tel_phone: "",
      customer_type: "",
      second_name: "",
      second_parents: "",
      second_tel_phone: "",
      second_age: "",
      purpose: "",
      social_soft: "",
      remark: "",
      area: [],
    }
    if(this.data){
      form =  Object.assign(form, JSON.parse(JSON.stringify(this.data)))
    }
    return {
      storeLocation,
      memberOptions: getMapFilters(member_type),
      socialOptions: getMapFilters(social),
      form,
      showContact: false,
      ruleValidate: {
        name: [{ required: true, message: '客户名字不能为空'}],
        parents: [{ required: true, message: '客户称谓不能为空'}],
        province: [{required: true, message: '所在地区不能为空' }],
        customer_type: [{ required: true, message: '客户类型未选择'}],
        tel_phone: [{required: true, message: '电话格式不正确', pattern: /^1\d{10}$/, }],
        second_tel_phone: [{required: false, message: '电话格式不正确', pattern: /^1\d{10}$/, }],
      }
    }
  },
  created() {
    this.area = [this.form.province, this.form.city, this.form.district]
  },
  methods: {
    // 选择所在区域
    changeArea(val) {
      this.form.province = val[0]
      this.form.city = val[1]
      if (val[2]) this.form.district = val[2]
    },
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
      return close(r)
    },
    showMore(){
      this.showContact = !this.showContact
    }
  }
}
</script>
