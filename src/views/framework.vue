<template>
  <el-container class="framework">
    <el-aside style="background-color: rgb(238, 241, 246);width:auto">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button v-if="isCollapse" :label="false">展开</el-radio-button>
        <el-radio-button v-if="!isCollapse" :label="true">收起</el-radio-button>
      </el-radio-group>
      <el-menu :default-openeds="['0']" :default-active="defaultActive" @open="handleOpen" @close="handleClose" :collapse="isCollapse" class="el-menu-vertical-demo">
        <el-submenu
          :index="`${index}`"
          v-for="(item, index) in menuList2"
          :key="index"
        >
          <template v-slot:title
            ><i class="el-icon-location"></i><span>{{ item.title }}</span></template
          >
          <el-menu-item-group
            v-show="!val.children"
            v-for="(val, key) in item.children"
            :key="key"
          >
            <el-menu-item
              :index="`${index}-${key}`"
              @click="funGo(val.path, `${index}-${key}`)"
              >{{ val.title }}</el-menu-item
            >
          </el-menu-item-group>

          <el-submenu
            :index="`${index}-${key}`"
            v-show="val.children"
            v-for="(val, key) in item.children"
            :key="key"
          >
            <template #title>{{ val.title }}</template>
            <el-menu-item
              :index="`${index}-${key}-${num}`"
              v-for="(child, num) in val.children"
              :key="num"
              @click="funGo(child.path, `${index}-${key}-${num}`)"
              >{{ child.title }}</el-menu-item
            >
          </el-submenu>
        </el-submenu>
        <el-menu-item-group v-for="(item, index) in menuList1" :key="index">
          <el-menu-item
            :index="`${index}`"
            @click="funGo(item.path, `${index}`)"
            > 
            <i class="el-icon-menu"></i>
            <template v-slot:title><span>{{ item.title }}</span></template>
         </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <template #dropdown>
             <el-dropdown-menu >
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumb">{{
          item
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { ref, computed, watch, getCurrentInstance } from "vue";
export default {
  data() {
    return {
      isCollapse:false,
      menuList: [
        {
          title: "导航一",
          icon: "el-icon-message",
          children: [
            {
              title: "选项1",
              path: "/index",
            },
            {
              title: "选项2",
              path: "/about",
            },
            {
              title: "选项3",
              children: [
                {
                  title: "选项3-1",
                  path: "/page1",
                },
              ],
            },
          ],
        },
        {
          title: "导航二",
          icon: "el-icon-menu",
          path: "/page2",
        },
      ],
      defaultActive: "0-0",
      breadcrumb: [],
    };
  },
  computed: {
    menuList1() {
      let list = [];
      for (let item of this.menuList) {
        if (item.path) {
          list.push(item);
        }
      }
      return list;
    },
    menuList2() {
      let list = [];
      for (let item of this.menuList) {
        if (!item.path) {
          list.push(item);
        }
      }
      return list;
    },
  },
  methods: {
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    funGo(url, navList) {
      if (url && !window.location.hash.includes(url)) {
        this.$router.push(url);
      }
      this.defaultActive = navList;
      this.pushNav(navList);
    },
    pushNav(navList) {
      this.breadcrumb = [];
      let list = navList.split("-");
      switch (list.length) {
        case 3:
          this.breadcrumb.push(
            this.menuList[list[0]].title,
            this.menuList[list[0]].children[list[1]].title,
            this.menuList[list[0]].children[list[1]].children[list[2]].title
          );
          break;
        case 2:
          this.breadcrumb.push(
            this.menuList[list[0]].title,
            this.menuList[list[0]].children[list[1]].title
          );
          break;
        case 1:
          this.breadcrumb.push(this.menuList[list[0]].title);
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.framework {
  height: 100vh;
  overflow: hidden;
}
.breadcrumb {
  padding: 10px;
}
</style>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
  height: 100%;
}
.el-container {
  height: 100%;
  overflow: hidden;
}
</style>
<style >
 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>