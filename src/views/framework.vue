<template>
  <el-container class="framework">
    <el-aside style="background-color: rgb(238, 241, 246); width: auto">
      <el-menu
        :default-openeds="['0']"
        :default-active="router.currentRoute.value.fullPath"
        router
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="el-menu-vertical-demo"
      >
        <template v-for="(item, index) in menuList" :key="index">
          <el-sub-menu
            v-if="item.children && item.children.length"
            :index="item.path"
          >
            <template #title
              ><el-icon><component :is="item.icon"></component></el-icon
              ><span>{{ item.name }}</span>
            </template>
            <el-menu-item-group
              v-show="!val.children"
              v-for="(val, key) in item.children"
              :key="key"
            >
              <el-menu-item :index="val.path" @click="funGo(val)"
                >{{ val.name }}
              </el-menu-item>
            </el-menu-item-group>

            <el-sub-menu
              :index="val.path"
              v-show="val.children"
              v-for="(val, key) in item.children"
              :key="key"
            >
              <template #title>{{ val.name }}</template>
              <el-menu-item
                v-for="(child, num) in val.children"
                :index="child.path"
                :key="num"
                @click="funGo(child)"
                >{{ child.name }}</el-menu-item
              >
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path" @click="funGo(item)">
            <el-icon><component :is="item.icon"></component></el-icon
            ><span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div
          style="display: flex; justify-content: space-between; height: 100%"
        >
          <div style="display: flex; align-items: center; flex: 1">
            <el-icon :size="28">
              <component
                class="icon-switch"
                :is="iconSwitch"
                @click="funSwitch()"
              ></component>
            </el-icon>

            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              class="breadcrumb"
            >
              <el-breadcrumb-item
                v-for="(item, index) in breadcrumb"
                :key="index"
                class="breadcrumb-item"
                >{{ item.name }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>

          <div>
            <el-dropdown>
              <span class="user-box">
                <span style="margin-right: 10px">王小虎</span>
                <el-icon :size="20"><setting /></el-icon>
              </span>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="funLogout()">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <pageTags
        v-model:tag="tag"
        v-model:refreshKey="showRouterView"
        @tagChange="tagChange"
      ></pageTags>
      <el-main>
        <router-view v-if="showRouterView" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { reactive, onMounted, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import pageTags from "@/components/pageTags.vue";
export default {
  components: { pageTags },
  setup() {
    const router = useRouter();

    const iconSwitch = computed(() => {
      if (data.isCollapse) {
        return "expand";
      } else {
        return "fold";
      }
    });
    const data = reactive({
      showRouterView: true,
      isCollapse: false,
      menuList: [
        {
          name: "导航一",
          icon: "setting",
          path: "/menu1",
          children: [
            {
              name: "选项1",
              path: "/menu1/index",
            },
            {
              name: "选项2",
              path: "/menu1/about",
            },
            {
              name: "选项3",
              path: "/menu1-3",
              children: [
                {
                  name: "选项3-1",
                  path: "/menu1-3/page1",
                },
              ],
            },
          ],
        },
        {
          name: "导航二",
          icon: "location",
          path: "/menu2",
        },
      ],
      breadcrumb: [],
      currentPath: "",
      tag: {
        name: "选项1",
        path: "/menu1/index",
      },
      num: 0,
    });
    onMounted(() => {
      console.log(router.currentRoute.value.fullPath);
      //生成初始面包屑
      // pushNav(getCurrentRouterObj(data.menuList));
    });
    const getCurrentRouterObj=(list)=>{
      for(let index in list){
        if(router.currentRoute.value.fullPath===list[index].path){
          return list[index]
        }
        if(list[index].children){
          getCurrentRouterObj(list[index].children)
        }
      }
    }
    const funLogout = () => {
      router.replace("/login");
    };
    const funSwitch = () => {
      data.isCollapse = !data.isCollapse;
    };
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const funGo = (routerObj) => {
      if (routerObj.path && !window.location.hash.includes(routerObj.path)) {
        router.push(routerObj.path);
      }
      //添加页面标签
      data.tag = JSON.parse(JSON.stringify(routerObj));
      pushNav(routerObj);
    };
    const pushNav = (routerObj) => {
      //添加面包屑
      data.breadcrumb = [];

      creatBreadcrub(routerObj.path, data.menuList);
    };
    const creatBreadcrub = (url, list) => {
      for (let index in list) {
        if (url.includes(list[index].path)) {
          data.breadcrumb.push(list[index]);
          if (list[index].children) {
            creatBreadcrub(url, list[index].children);
          }
        }
      }
    };
    const tagChange = (val) => {
      console.log(val);
      pushNav(val);
    };
    return {
      ...toRefs(data),
      funLogout,
      funSwitch,
      handleOpen,
      handleClose,
      funGo,
      pushNav,
      tagChange,
      iconSwitch,
      router,
      creatBreadcrub,
      getCurrentRouterObj
    };
  },
};
</script>
<style lang="less" scoped>
.framework {
  height: 100vh;
  overflow: hidden;
  .user-box {
    cursor: pointer;
    padding-top: 20px;
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.breadcrumb {
  padding: 10px;
  .breadcrumb-item {
    cursor: pointer;
    ::v-deep .el-breadcrumb__inner {
      &:hover {
        color: #000;
        font-weight: bold;
      }
    }
  }
}

.icon-switch {
  cursor: pointer;
}
.scrollbar-flex-content {
  display: flex;
  overflow-x: auto;
  padding: 5px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 12%), 0 0 3px 0 rgba(0, 0, 0, 4%);

  .tag-item {
    margin-right: 10px;
    cursor: pointer;
  }
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    width: 12px;
    height: 4px;
  }
  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.1);
  }
}
::v-deep .el-main {
  padding-top: 10px;
}
::v-deep .el-scrollbar {
  height: 50px;
}
</style>
<style>
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e8e8e8;
}

.el-aside {
  color: #333;
  height: 100%;
}

.el-container {
  height: 100%;
  overflow: hidden;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu--collapse {
  height: 100% !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  height: 100% !important;
}
</style>
