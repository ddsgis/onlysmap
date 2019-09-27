<template>
  <section ref="appMain" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {}
};
</script>

<style scoped>
  .app-main {
    min-height: calc(100vh - 50px);
    padding: 10px;
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
