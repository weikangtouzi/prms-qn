<template>
  <router-view/>
</template>

<script>
export default {
  mounted () {
    if (document.body.offsetWidth > 415) {
      document.documentElement.style.fontSize = '60px'
    }
  }
}
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  max-width 415px
  margin 0 auto
</style>
