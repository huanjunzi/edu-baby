<template>
  <div>
    <Form ref="form" :model="form" :rules="ruleValidate">
      <FormItem prop="class_fee" style="">
          <InputNumber :min="0.00" v-model="form.class_fee" :step='1000' ></InputNumber>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import _ from 'underscore'
export default {
  props: ['data', 'type'],
  data() {
    let form = JSON.parse(JSON.stringify(this.data))
    const reg = /^(\d+)(\.\d{1,2})?$/
    return {
      form,
      imgUrl: '',
      ruleValidate: {
          class_fee: [{required: true, message: '只能填写到小数点后两位', pattern: reg, }],
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
      let dataFomart =JSON.stringify(await this.dataEdit())
      let r = await this.$axios({
          method: "post",
          url: '/api/education/editClass',
          params: {
              data: dataFomart,
              class_fee: this.form.class_fee,
          }
      })
      return close(r)
    },
    
    // 单个编辑和多个编辑的数据 统一成数组格式 到后台循环处理
    dataEdit() {
      let dataList = []
      if(this.type === '0') {
        dataList = [this.form]
      }
      if(this.type === '1') {
        for(let element of this.form){
          dataList.push({ id: element.id })
        }
      }
      return dataList
    }
  }
}
</script>
