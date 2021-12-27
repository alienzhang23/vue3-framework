import Vue from 'vue'
Vue.directive('permission', {
    inserted: function(el, binding) {
        const action = binding.value.action
        const permissions = JSON.parse(localStorage.getItem('permissions')) || []
        if (!permissions.includes(action)) {
            el.parentNode.removeChild(el)
        }
    }
})