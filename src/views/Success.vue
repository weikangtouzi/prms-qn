<template>
  <div class="success">
    <img alt="logo" :src="require('@/assets/success.png')"/>
    <p>填写成功</p>
  </div>
</template>

<style scoped lang="stylus">
@import "../common/stylus/variable.styl"
.success{
  padding (150 / $rem)
  img{
    width (180 /$rem)
  }
  p{
    font-size (36 / $rem)
  }
}
</style>
