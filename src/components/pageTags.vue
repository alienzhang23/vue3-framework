<template>
  <el-scrollbar>
    <div class="scrollbar-flex-content">
      <div class="tag-item-box" v-for="(tag, index) in tags" :key="tag.name">
        <el-dropdown trigger="contextmenu">
          <span class="el-dropdown-link">
            <el-tag
              closable
              :effect="currentPath === tag.path ? 'dark' : 'light'"
              @click="funGo(tag)"
              @close="tagClose(index, tag)"
            >
              {{ tag.name }}
            </el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="funRefresh(tag)">刷新</el-dropdown-item>
              <el-dropdown-item @click="tagClose(index, tag)">
                关闭
              </el-dropdown-item>
              <el-dropdown-item @click="closeOthers(tag)">
                关闭其他
              </el-dropdown-item>
              <el-dropdown-item @click="closeAll()">
                关闭所有
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-scrollbar>
</template>
<script>
import { reactive, onMounted, toRefs, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
export default {
  props: {
    tag: Object, //路由对象,必须包含path和name字段
    refreshKey: Boolean, //
  },

  setup(props, { emit }) {
    const router = useRouter();
    const data = reactive({
      tags: [],
      currentPath: "",
      rightMenuTag: {
        path: "",
      },
    });
    watch(
      () => props.tag,
      (newVal, oldVal) => {
      console.log(123,newVal)
        data.currentPath=newVal.path
        let tagsPath = data.tags.map((item) => item.path);
        if (!tagsPath.includes(newVal.path)) {
          data.tags.push(JSON.parse(JSON.stringify(newVal)));
        }
      },
      {immediate:true}
    );
    onMounted(() => {});
    const closeOthers = (tag) => {
      if (data.tags.length === 1) return;
      data.tags = [tag];
      data.rightMenuTag.path = tag.path;
      if (data.currentPath === data.rightMenuTag.path) {
        emit("update:refreshKey", false);
        nextTick(() => {
          emit("update:refreshKey", true);
        });
      } else {
        router.replace(data.rightMenuTag.path);
        data.currentPath = data.rightMenuTag.path;
      }
      emit("tagChange", tag);
    };
    const closeAll = () => {
      if (data.tags.length === 1) return;
      data.tags.splice(1);
      funGo(data.tags[0]);
      emit("tagChange", data.tags[0]);
    };
    const funRefresh = (tag) => {
      data.rightMenuTag.path = tag.path;
      if (data.currentPath === data.rightMenuTag.path) {
        emit("update:refreshKey", false);
        nextTick(() => {
          emit("update:refreshKey", true);
        });
      } else {
        router.replace(data.rightMenuTag.path);
        data.currentPath = data.rightMenuTag.path;
        console.log(data.currentPath);
      }
      emit("tagChange", tag);
    };
    const funGo = (tag) => {
      if (data.currentPath !== tag.path) {
        router.push(tag.path);
        emit("update:tag", tag);
      }
      emit("tagChange", tag);
    };
    const tagClose = (index, tag) => {
      if (data.tags.length === 1) return;
      if (data.currentPath === tag.path) {
        if (index === 0) {
          funGo(data.tags[index + 1]);
          emit("tagChange", data.tags[index + 1]);
        } else {
          funGo(data.tags[index - 1]);
          emit("tagChange", data.tags[index - 1]);
        }
      }
      data.tags.splice(index, 1);
      
    };

    return {
      ...toRefs(data),
      funGo,
      tagClose,
      funRefresh,
      closeAll,
      closeOthers,
    };
  },
};
</script>
<style lang="less" scoped>
.scrollbar-flex-content {
  display: flex;
  overflow-x: auto;

  padding: 5px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 12%), 0 0 3px 0 rgba(0, 0, 0, 4%);

  .tag-item-box {
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

.scrollbar-flex-content ::v-deep .el-scrollbar {
  height: 50px;
}
</style>
