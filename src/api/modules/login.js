import axios from '@/utils/axios'

export default {
    // 示例
    getDataDetail: (param) => {
        return axios("get", "/getDataDetail", param);
    },
  
}