<template>
  <div id="app">
    <router-view v-if="isRouterAlibe"></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlibe: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlibe = false
        this.$nextTick(function() {
          this.isRouterAlibe = true
        })
      }
    }
  }
</script>
