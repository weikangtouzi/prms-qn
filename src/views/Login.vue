<template>
  <div class="login">
    <div class="logo">
      <img alt="logo" :src="require('@/assets/logo.png')"/>
    </div>
    <h5>为您提供优质的人力资源服务</h5>
    <div class="title">验证码登录</div>
    <div class="form">
      <div class="section">
         <input placeholder="请输入手机号" v-model="phone"/>
      </div>
      <div class="section">
        <input placeholder="请输入验证码" v-model="code"/>
        <span class="code" @click="sendMsg">{{ codeMsg }}</span>
        <span class="error" v-if="errorMsg">{{errorMsg}}</span>
      </div>
      <div class="action">
        <a class="btn" @click="login">登录</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import gql from 'graphql-tag'

export default defineComponent({
  name: 'Home',
  methods: {
    sendMsg: function () {
      const sms = gql`query getSms($phoneNumber:String!){
     sendSms(phoneNumber:$phoneNumber)
     }`
      this.checkCode().then((res) => {
        if (res !== 'error') {
          this.$apollo.query({
            query: sms,
            fetchPolicy: 'no-cache',
            variables: {
              phoneNumber: res
            }
          }
          ).then((res) => {
            const { data } = res
            console.log(data)
            const msg = JSON.parse(data.sendSms)
            if (msg.body.message.toUpperCase() === 'OK') {
              this.startTimeOut()
              console.log('获取验证码成功')
            } else {
              this.errorMsg = msg.body.message
            }
          })
        }
      })
    },
    login: function () {
      this.errorMsg = ''
      if (!/^[1]([2-9])[0-9]{9}$/.test(this.phone)) {
        this.errorMsg = '请输入正确手机号'
        return
      }
      if (!/^[0-9]{6}$/.test(this.code)) {
        this.errorMsg = '请输入正确验证码'
        return
      }
      console.log('通过格式认证')
      localStorage.setItem('phone', '')
      const loginReg = gql`query checkCode($phoneNumber:String!,$verifyCode:String!){
  phoneNumberCheck(phoneNumber:$phoneNumber,verifyCode:$verifyCode)
       }`
      this.$apollo.query({
        query: loginReg,
        fetchPolicy: 'no-cache',
        variables: {
          phoneNumber: this.phone,
          verifyCode: this.code
        }
      }
      ).then(() => {
        localStorage.setItem('phone', this.phone)
        this.$router.push('/feedback')
        console.log('验证码验证成功')
      }).catch(error => {
        this.errorMsg = '验证码不正确'
        console.log(error)
      })
    }
  },
  setup () {
    const phone = ref('')
    const code = ref('')
    const errorMsg = ref('')
    const codeMsg = ref('获取验证码')

    const checkCode = () => {
      if (/^[1]([2-9])[0-9]{9}$/.test(phone.value)) {
        errorMsg.value = ''
        console.log('通过')
        return Promise.resolve(phone.value)
      } else {
        errorMsg.value = '请输入正确手机号'
        return Promise.resolve('error')
      }
    }
    // 倒计时
    const startTimeOut = () => {
      let total = 59
      codeMsg.value = `${total}秒`
      const timer = setInterval(() => {
        total -= 1
        if (total > 0) {
          codeMsg.value = `${total}秒`
        } else {
          clearInterval(timer)
          codeMsg.value = '获取验证码'
        }
      }, 1000)
    }
    return {
      phone,
      errorMsg,
      codeMsg,
      startTimeOut,
      checkCode,
      code
    }
  },
  created () {
    // localStorage.setItem('phone', '')
  }
})
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable.styl"
.login{
   font-family: PingFang SC;
   padding: (42 / $rem);
   padding-top: (72 / $rem);
  .logo{
    height (87 / $rem)
    img{
      vertical-align top
      width (265 / $rem)
    }
  }
  h5{
    margin-top (18 / $rem)
    width 100%
    font-size  (20 / $rem)
    font-family: PingFang SC;
    font-weight: 600;
    color: #666666;
  }
  .title{
    margin-top (150 / $rem)
    font-size (40 / $rem)
    text-align left
    font-family: PingFang SC;
    font-weight: 600;
    color: #333333;
  }
   .form{
     box-sizing border-box
     font-size 0
     .section{
       position relative
       height (90 / $rem)
       box-sizing border-box
       border-bottom 1px solid #DDDDDD
       padding-top (30 / $rem)
       margin-top (25 /$rem)
       input{
         background none
         table-layout: fixed
         width (660 / $rem)
         height: (40 / $rem)
         display inline-block
         border none
         outline none
         box-sizing border-box
         color #3b3a3a
         font-size (30 / $rem)
         &::-webkit-input-placeholder{
              color #888888
              font-size  (30 / $rem)
         }
       }
       .code{
         position absolute
         display inline-block
         width: (160 / $rem)
         cursor pointer
         height: (40 / $rem)
         line-height: (40 / $rem)
         background: linear-gradient(90deg, #54D693, #81E3AE);
         border-radius: (8 / $rem)
         font-size: (22 / $rem)
         color white
         right 0
         top 50%
         text-align center
         transform translateY(-50%)
       }
       .error{
         position absolute
         display inline-block
         font-size: (22 / $rem)
         color #fc3131
         left 0
         top (100 / $rem)
         text-align left
       }
     }
     .btn{
       display inline-block
       font-size (30 / $rem)
       width (666 /$rem)
       height (110 /$rem)
       line-height (110 / $rem)
       border-radius  (16 / $rem)
       background #54D693
       outline none
       text-decoration none
       color white
       cursor pointer
       margin-top (210 /$rem)
     }
   }
}
</style>
