import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/style/reset.css';
import ElementUI from 'element-ui';
import './assets/style/icon/iconfont.css';
import './assets/font/BindUserFont.css';
import 'element-ui/lib/theme-chalk/index.css';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'
import wx from 'weixin-js-sdk';
import api from './api';

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: api.graphql,
    credentials: 'include',
});
// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
// Install the vue plugin
Vue.use(VueApollo);
const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
});

Vue.use(ElementUI);
Vue.use(FormMaking);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
