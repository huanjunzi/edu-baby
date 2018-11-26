<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <router-link to="/menu/index/class">
     <Button type="primary" >跳转到首页</Button>
    </router-link> -->
  </div>
</template>
<script>
export default {
  data () {
    let name = this.$route.query.name
    return {
      theme1: 'dark',
      name,
      msg: '404页面'
    }
  },
  components: {},
  created(){
    const msg = this.$Message.loading({
      content: '页面不存在！3秒后即将进入首页',
      duration: 3000
    })
    setTimeout(msg, 3000);
 
    setTimeout(() => {
      this.$router.push("/menu/index/class")
    }, 3000)
    // const msg = this.$Message.loading({
    //   content: '页面不存在！即将进入登录页',
    //   duration: 3000
    // });
    // setTimeout(msg, 3000)
  },
  methods: {
    // routeTo(path,id) {
    //         this.$router.push({ path })
    // }
  }
}
</script>

<style lang="less">
.layout-logo-left {
    width: 90%;
    margin: 15px auto;
    .text{
      color: #fff;
      font-weight: 300
    }
    text-align: center;
}
.ivu-menu.ivu-menu-dark.ivu-menu-vertical {
  height:100%; 
  position:absolute;
  left:0; top:0;
}
</style>
