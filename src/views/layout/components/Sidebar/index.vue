<template>
  <!-- <el-scrollbar wrapClass="scrollbar-wrapper" class="scrollbar-wrapper"> -->
  <div class="container">
    <div class="logo">
      <img src="@/assets/logo/logo1.png" alt="">
      <img src="@/assets/logo/logo2.png" alt="">
    </div>
    <el-menu
      mode="horizontal"
      :show-timeout="200"
      :default-active="$route.path"
      background-color="rgb(41, 59, 90)"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
    <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
    <div class="personalCenter">
      <div class="personal">
        <img src="@/assets/navicon/nav_icon_account.png" @mouseenter="showPersonalMsg" @mouseout="hidPersonalMsg" title="个人中心">
        <div class="userinfo" v-show="showInfo">
          <el-row>
            <el-col :span="10">用户名：</el-col>
            <el-col :span="14">{{userinfo.username}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">所属企业：</el-col>
            <el-col :span="14">{{userinfo.deptName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">所属角色：</el-col>
            <el-col :span="14">{{userinfo.realname}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">账户启用时间：</el-col>
            <el-col :span="14">{{userinfo.enableTime}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">账户停用时间：</el-col>
            <el-col :span="14">{{userinfo.disableTime}}</el-col>
          </el-row>
        </div>
      </div>
      <!-- <div style="float: left; padding: 0 10px;" class="msg">
        <img src="@/assets/navicon/nav_icon_message.png" alt="" title="消息" class="msg">
        <span class="msgIcon">1</span>
      </div> -->
      <img src="@/assets/navicon/nav_icon_logout.png" style="cursor:pointer" title="退出登录" class="logout" @click="logout">
    </div>
  </div>
  <!-- </el-scrollbar> -->
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      showInfo: false,
      userinfo: {}
    }
  },
  methods: {
    showPersonalMsg() {
      this.showInfo = true
    },
    hidPersonalMsg() {
      this.showInfo = false
    },
    logout() {
      this.$store.dispatch('FedLogOut')
      this.$store.dispatch('LogOut')
    }
  },
  mounted() {
    this.$store.dispatch('GetUserInfo').then(res => {
      this.userinfo = res.data.user
    })
  }
}
</script>
<style lang="scss">
.el-menu{
  max-height: 500px;
  overflow: auto;
}
.el-menu::-webkit-scrollbar {/*滚动条整体样式*/
    width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.el-menu::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(255, 251, 251, 0.5);
    background: rgba(255, 255, 255, 0.2);
}
.el-menu::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(61, 60, 60, 0.2);
    border-radius: 0;
    background: rgba(3, 3, 3, 0.1);
}
#app {
  .container {
    // min-width: 1290px;
    height: 60px;
    // overflow: hidden;
    display: flex;
    .logo {
      width: 440px;
      overflow: hidden;
      background-color: rgb(41, 59, 90);
      img {
        width: 220px;
        height: 60px;
        float: left;
      }
    }
    .el-menu--horizontal {
      flex: 1;
      height: 61px;
      display: flex;
      .slideBarItem {
        flex: 1;
        max-width: 115px;
        float: left;
        text-align: center;
        height: 60px !important;
        .el-submenu {
          .el-submenu__title {
            box-sizing: border-box;
            height: 60px !important;
          }
          &.is-active {
            background-color: rgb(33, 50, 79) !important;
            color: rgb(46, 179, 250) !important;
          }
          &:hover {
            .el-submenu__title {
              background-color: rgb(33, 50, 79) !important;
            }
          }
          &.is-active {
            .el-submenu__title {
              background-color: rgb(33, 50, 79) !important;
              color: rgb(46, 179, 250) !important;
              i {
                color: rgb(41, 59, 90);
              }
            }
          }
          i {
            display: none;
          }
        }
        .el-menu-item.submenu-title-noDropdown {
          height: 60px;
          &:hover {
            background-color: rgb(33, 50, 79) !important;
          }
          &.is-active {
            background-color: rgb(33, 50, 79) !important;
            color: rgb(46, 179, 250) !important;
          }
        }
      }
    }
    >.personalCenter {
    width: 150px;
    height: 61px;
    float: right;
    background:rgb(41, 59, 90);
    padding: 15px 20px 0px 20px;
    border-bottom: solid 1px #e6e6e6;
    >img {
      vertical-align: middle;
      &:last-of-type {
        padding: 0 10px;
      }
    }
    .msg {
      position: relative;
      .msgIcon {
        position: absolute;
        width: 15px;
        height: 15px;
        font-size: 12px;
        background-color: red;
        border-radius: 50%;
        line-height: 15px;
        text-align: center;
        color: #fff;
        top: 0;
        right: 5px;
      }
    }
    >.personal {
      float: left;
      position: relative;
      padding: 0 10px;
      >img {
          width: 30px;
          height: 30px;
        }
        >.userinfo {
          width: 350px;
          position: absolute;
          background-color: rgb(41, 59, 90);
          z-index: 9;
          bottom: -220px;
          left: -260px;
          padding: 20px;
          border-radius: 10px;
          color: #fff;
          .el-col {
            line-height: 2;
          }
        }
      }
    }
  }

}

</style>
