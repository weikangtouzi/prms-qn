<template>
  <div class="login">
    <div class="logo">
      劳动力信息普查表
    </div>
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
    <p class="markTip">
      注:此次普查对象为16-60岁的劳动力人员信息，但不包括公务员、事业编制人员、国企等固定编制人员。
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useCount } from '@/common/js/hook'
import gql from 'graphql-tag'

export default defineComponent({
  name: 'Home',
  methods: {
    sendMsg: function () {
      const sms = gql`query getSms($phoneNumber:String!){
     StaticSendSms(phoneNumber:$phoneNumber)
     }`
      this.checkCode().then((res) => {
        if (res !== 'error') {
          if (this.total >= 1) {
            return
          }
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
            const msg = JSON.parse(data.StaticSendSms)
            const { Code, Message } = msg.SendStatusSet[0]
            if (Code.toUpperCase() === 'OK') {
              this.startTimeOut()
              console.log('获取验证码成功')
            } else {
              this.errorMsg = Message
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
  QNPhoneNumberCheck(phoneNumber:$phoneNumber,verifyCode:$verifyCode)
       }`
      this.$apollo.query({
        query: loginReg,
        fetchPolicy: 'no-cache',
        variables: {
          phoneNumber: this.phone,
          verifyCode: this.code
        }
      }
      ).then((res) => {
        this.setCount(res.data.QNPhoneNumberCheck)
        localStorage.setItem('phone', this.phone)
        localStorage.setItem('count', res.data.QNPhoneNumberCheck)
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
    const total = ref(0)
    const errorMsg = ref('')
    const codeMsg = ref('获取验证码')
    const { count, setCount } = useCount()
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
      total.value = 59
      codeMsg.value = `${total.value}秒`
      const timer = setInterval(() => {
        total.value -= 1
        if (total.value > 0) {
          codeMsg.value = `${total.value}秒`
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
      total,
      code,
      count,
      setCount
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
    font-size (62 / $rem)
    color #54D693
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
         height: (60 / $rem)
         line-height: (60 / $rem)
         background: linear-gradient(90deg, #54D693, #81E3AE);
         border-radius: (8 / $rem)
         font-size: (26 / $rem)
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
  .markTip{
    font-size 15px
    text-align left
    color #999999
    margin-top 8px
  }
}
</style>
