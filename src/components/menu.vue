
<style lang='less' scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left {
    width: 90%;
    margin: 15px auto;
    .text{
      color: #fff;
      font-weight: 300
    }
    text-align: center;
  }
    .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
</style>
<template>
    <div class="layout">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto',width: '250px', minWidth: '250px'}">
          <div class="layout-logo-left">
            <img src="https://epj-images.oss-cn-shanghai.aliyuncs.com/assets/eglass-logo.png" alt="EGlass"
            width="150" height="42"/>
            <div class="text">左侧菜单栏</div>
        </div>
          <!-- active-name 指的是根据MenuItem name激活的菜单项。 open-names 指的是根据Submenu name展开的菜单项-->
            <Menu :active-name="pathDir" theme="dark" width="auto" :open-names="pathDirArray" :width="'250'" mode="vertical" @on-select="onSelect" ref="child">
                <Submenu name="menu">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        课程管理
                    </template>
                    <MenuItem name="menu/index/class">课程项目</MenuItem>
                </Submenu>
                <Submenu name="member">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        会员管理
                    </template>
                    <MenuItem name="menu/index/member">家长管理</MenuItem>
                    <MenuItem name="menu/index/child">儿童管理</MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        Item 3
                    </template>
                    <MenuItem name="3-1">Option 1</MenuItem>
                    <MenuItem name="3-2">Option 2</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '250px'}">
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"><span>欢迎你{{name}}</span><a style="margin-left:15px" @click="logout()">退出登录</a></Header>
            <Content :style="{padding: '0 16px 16px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <!-- <BreadcrumbItem href="">{{title}}</BreadcrumbItem> -->
                    <BreadcrumbItem :href="`${item.path}`" v-for="(item,index) in brumblist" :key="index">{{item.meta.title}}</BreadcrumbItem>
                </Breadcrumb>
                <Card>
                    <div class="layout-content">
                      <div class="layout-content-main">
                        <router-view />
                      </div>
                    </div>
                </Card>
            </Content>
        </Layout>
    </div>
</template>
<script>
import _ from 'underscore'
export default {
  data() {
     let name = sessionStorage.getItem("username")
    return {
        title: '',  // 页面标题
        brumblist: '', // 路由集合
        name,
        currentPath: window.location.pathname,
    }
  },
  computed: {
    pathDir() {
      const path = this.$route.path.slice(1).split('/')
      return this.$route.path.slice(1)
      // return path.length > 2 ? _.without(path, _.last(path)).join('/') : this.$route.path.slice(1)
    },
    pathDirArray() {
      let ps = this.currentPath.slice(1).split('/')
      return [ps[0]]
    },
  },
    watch: {
        $route () {
            console.log("watch==")
            this.getBreadcrumb()
        },
    },
    created() {
        this.getBreadcrumb()
    },
  methods: {
    onSelect(path) {
      console.log("selected", path, this.$route.path)
      this.$router.push('/' + path)
      // this.currentPath = '/' + path
    },
    logout() {
        this.$Message.info("注销成功")
        // 清除所有session
        sessionStorage.clear()
        this.$router.push("/login")

    },
    getBreadcrumb () {
        this.brumblist = this.$route.matched
        this.$route.matched.forEach((item, index) => {
          // 判断父级路由是否为空字符串或者meta是否为首页,直接复写路径到根目录
          // 后面的就是判断路由和当前遍历的项目是否一致,是的话把标题的值给上
          item.meta.title === '首页' ? item.path = '/menu/index/class' : this.$route.path === item.path ? this.title = item.meta.title : '';
        })
    }
  }
}
</script>