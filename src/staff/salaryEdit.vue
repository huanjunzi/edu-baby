<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">
      <FormItem label="员工月薪" prop="salary">
        <InputNumber :min="0.00" v-model="form.salary" :step='1000' ></InputNumber>
      </FormItem>
      <FormItem label="薪资发放时间" prop="salary_time">
        <br />
        <DatePicker type="date" v-model="form.salary_time" @on-change="changeTime" placeholder="请输入入职时间" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="form.remark" type="textarea" :autosize="{minRows: 5}" :maxlength="150" placeholder="请输入备注最多150个字..."></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import _ from 'underscore'
export default {
  props: ['data', 'type'],
  data() {
    let form = {
      salary: 0,
      salary_time: "",
      remark: "",
    }
    if(this.data) {
      form =  Object.assign(form, JSON.parse(JSON.stringify(this.data)))
    }
    const regSalary = /^(\d+)(\.\d{1,2})?$/

    return {
      form,
      ruleValidate: {
          salary_time: [{required: true, message: '薪资发放时间未选择' }],
          salary: [{required: true, message: '只能填写到小数点后两位', pattern: regSalary, }],
      },
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
      let r = await this.$axios({
        method: "post",
        url: '/api/staff/editSalary',
        params: {
            data: JSON.stringify([this.form]),
        }
      }).then(res => res.data)
      return close(r)
    },
    changeTime (datatime) {
      this.form.salary_time = datatime
    },
  }
}
</script>
