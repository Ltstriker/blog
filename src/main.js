// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Modal from 'vuejs-modal'

//模板：
import confirm from './components/confirm.vue'
import detail from './components/detail'
import login from './components/login'
import register from './components/register'

import { EventBus } from './assets/js/event-bus.js';

Vue.use(Modal, {
     modals: {
         confirm, //消息提示
         login,
         register,
         detail
     }  //你的modals，它是个对象
})

Vue.use(VueResource)

Vue.config.productionTip = false

Vue.prototype.setCookie = (c_name, value, expiredays) => {
  EventBus.$emit('set', value);
  var exdate = new Date();　　　　
  exdate.setDate(exdate.getDate() + expiredays);　　　　
  document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
Vue.prototype.getCookie = getCookie;

Vue.prototype.delCookie =(name) => {
    EventBus.$emit('reset');
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
