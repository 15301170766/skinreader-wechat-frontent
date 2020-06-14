<template>
  <div class="wrapper">
      <router-view></router-view>
  </div>
</template>

<script>
import Header from '../components/Header';
export default {
    name: '',
    components: {
        Header,
    },
};
</script>

<style scoped>
   .wrapper{
       height: 100%;
   }
</style>

