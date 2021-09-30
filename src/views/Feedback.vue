<template>
  <div class="feedback">
    <div class="title">添加个人信息</div>
    <section>
      <h3>姓名</h3>
      <input placeholder="请填写真实姓名" v-model="name"/>
      <span class="err" v-if="nameErr">{{ nameErr }}</span>
    </section>
    <section>
      <h3>手机号码</h3>
      <input placeholder="请填写11位手机号码" v-model="number"/>
      <span class="err" v-if="phoneErr">{{ phoneErr }}</span>
    </section>
    <section>
      <h3>身份证号</h3>
      <input placeholder="请填写18位身份证号码" v-model="idCardNum"/>
      <span class="err" v-if="idErr">{{ idErr }}</span>
    </section>
    <section @click="showPicker">
      <h3>学历</h3>
      <input placeholder="请选择学历信息" :value="grade" disabled/>
      <span class="err" v-if="gradeErr">{{ gradeErr }}</span>
    </section>
    <section>
      <h3>工作技能</h3>
      <p class="tips">请填写你会的工作技能，比如：电工、木工、会计</p>
      <div class="skill">
        <div v-for="(item,idx) in skills" :key="idx" class="ss">
          <input :placeholder="idx===0?'一项功能技能一个框，多个请点击右侧 +':'请输入工作技能'" @input="(e)=>skillChange(e,idx)" :value="item"/>
          <span @click="addSkill" v-if="idx===0"><img :src="require('@/assets/add.png')" alt="img"/></span>
          <span @click="minusSkill(idx)" v-else><img :src="require('@/assets/minus.png')" alt="img"/></span>
        </div>
        <span class="err" v-if="skillsErr">{{ skillsErr }}</span>
      </div>
    </section>
    <div class="formErr" v-if="formErr">{{ formErr }}</div>
    <div class="action">
      <span class="save" @click="save">保存,填写下一个</span>
      <span class="submit" @click="complete" v-if="firstSend">完成</span>
    </div>
    <Picker ref="pickerRef" @select="pickerSelect"/>
     <p v-if="saveSuccess" class="saveSuccess">保存成功</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import Picker from '@/components/Picker.vue'
import gql from 'graphql-tag'

export default defineComponent({
  name: 'FeedBack',
  components: {
    Picker
  },
  methods: {
    complete: function () {
      this.$router.push('/success')
    },
    save: function () {
      const insertReg = gql`mutation insertPerson($info:PersonalData!){
  insertPersonalData(info:$info){
    statusCode,msg
  }
}`
      // 验证当前表单内容的合法性
      // 同步到data
      let flag = true
      this.nameErr = ''
      this.idErr = ''
      this.formErr = ''
      this.phoneErr = ''
      this.skillsErr = ''
      this.gradeErr = ''
      if (!/^[\u4E00-\u9FA5]{2,4}$/.test(this.name)) {
        this.nameErr = '请输入正确姓名'
        flag = false
      }
      if (!/^[1]([2-9])[0-9]{9}$/.test(this.number)) {
        this.phoneErr = '请输入正确手机号'
        flag = false
      }
      if (!/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.idCardNum)) {
        this.idErr = '请输入正确身份证号'
        flag = false
      }
      if (!this.grade) {
        this.gradeErr = '请选择学历'
        flag = false
      }
      if (this.skills.filter(s => !!s).length <= 0) {
        this.skillsErr = '请至少添加一项技能'
        flag = false
      }
      if (flag) {
        // 通过验证
        this.$apollo.mutate({
          mutation: insertReg,
          fetchPolicy: 'no-cache',
          variables: {
            info: {
              name: this.name,
              idCardNum: this.idCardNum,
              number: this.number,
              education: this.education,
              skills: this.skills
            }
          }
        }).then(res => {
          this.saveSuccess = true
          setTimeout(() => {
            this.saveSuccess = false
          }, 1500)
          this.firstSend = true
          this.grade = ''
          this.education = ''
          this.name = ''
          this.idCardNum = ''
          this.number = ''
          this.skills = ['']
        }).catch(err => {
          this.formErr = '表单填写有误，请检测输入'
          console.error(err)
        })
      }
    }
  },
  setup () {
    const pickerRef = ref<any>(null)
    const saveSuccess = ref(false)
    const firstSend = ref(false)
    const errMsg = reactive({
      nameErr: '',
      phoneErr: '',
      idErr: '',
      gradeErr: '',
      skillsErr: '',
      formErr: ''
    })
    const currentData = reactive({
      name: '',
      number: '',
      idCardNum: '',
      grade: '',
      education: '',
      skills: ['']
    })
    const errors = toRefs(errMsg)
    const current = toRefs(currentData)
    const skillChange = (e: { target: HTMLInputElement }, idx: number) => {
      currentData.skills[idx] = e.target.value
    }
    const addSkill = () => {
      currentData.skills.push('')
    }

    const minusSkill = (idx: number) => {
      currentData.skills.splice(idx, 1)
    }
    const showPicker = () => {
      // eslint-disable-next-line no-unused-expressions
      pickerRef?.value?.show()
    }
    const pickerSelect = (idx: number, item: { text: string, value: string }) => {
      currentData.grade = item.text
      currentData.education = item.value
    }
    return {
      ...errors,
      ...current,
      skillChange,
      pickerRef,
      addSkill,
      saveSuccess,
      minusSkill,
      showPicker,
      firstSend,
      pickerSelect
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable.styl"
.feedback {
  .saveSuccess{
    position fixed
    width (200 / $rem)
    top (20 / $rem)
    font-size (24 / $rem)
    left 50%
    transform translateX(-50%)
    background white
    box-shadow 0 0 10px #c4c2c2
    border-radius 3px
    padding 8px
    color #57DE9E
    font-weight bold
  }
  .formErr{
    color #fc3131
    text-align left
    margin-top 12px
    text-indent 12px
    font-size: (24 / $rem);
  }
  .title {
    padding-top (22 /$rem)
    font-size: (36 / $rem);
    font-family: PingFang SC;
    font-weight: 600;
    color: #333333;
  }

  section {
    font-size 0
    border-bottom 1px solid #ECECEC;
    padding (32 /$rem) (22 / $rem)
    text-align left
    position relative
    .tips {
      font-size (22 / $rem)
      color #57DE9E
      margin-bottom (10/ $rem)
    }
    .err {
      position absolute
      display inline-block
      width 100%
      font-size: (22 / $rem)
      color #fc3131
      left (22 /$rem)
      bottom 3px
      text-align left
    }

    h3 {
      font-size: (30 / $rem);
      font-family: PingFang SC;
      font-weight: 400;
      color: #666666;
      margin-bottom (24 /$rem)
    }

    input {
      display inline-block
      border none
      outline none
      background white
      box-sizing border-box
      color #3b3a3a
      font-size (28 / $rem)
      width 100%
      height 24px

      &::-webkit-input-placeholder {
        color #ccc
      }
    }

    .skill {
      .ss {
        display flex

        span {
          width 50px
          text-align right
          cursor pointer

          img {
            width 24px
          }
        }
      }

      .ss + .ss {
        margin-top (20 / $rem)
      }

      input {
        flex: 1
      }
    }
  }

  .action {
    display flex
    font-size (26 / $rem)
    padding 0 (80 /$rem)
    color white
    margin-top (50 /$rem)

    .save {
      flex 2
      cursor pointer
      border-radius: (8 /$rem);
      line-height (80 /$rem)
      margin-right (40 / $rem)
      background: linear-gradient(90deg, #57DE9E, #81E3AE);
    }

    .submit {
      flex 1
      cursor pointer
      line-height (80 /$rem)
      border-radius: (8 /$rem);
      background: #409EFF
    }
  }
}
</style>
