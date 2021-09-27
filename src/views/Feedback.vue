<template>
  <div class="feedback">
    <div class="title">添加个人信息</div>
    <section>
      <h3>姓名</h3>
      <input placeholder="请填写" v-model="name"/>
      <span class="err" v-if="nameErr">{{ nameErr }}</span>
    </section>
    <section>
      <h3>手机号码</h3>
      <input placeholder="请填写" v-model="phone"/>
      <span class="err" v-if="phoneErr">{{ phoneErr }}</span>
    </section>
    <section>
      <h3>身份证号</h3>
      <input placeholder="请填写" v-model="id"/>
      <span class="err" v-if="idErr">{{ idErr }}</span>
    </section>
    <section @click="showPicker">
      <h3>学历</h3>
      <input placeholder="请选择" :value="grade" disabled/>
      <span class="err" v-if="gradeErr">{{ gradeErr }}</span>
    </section>
    <section>
      <h3>工作技能</h3>
      <span>请填写你会的工作技能，比如：电工、木工、会计</span>
      <div class="skill">
        <div v-for="(item,idx) in skills" :key="idx" class="ss">
          <input placeholder="请填写" @input="(e)=>skillChange(e,idx)" :value="item"/>
          <span @click="addSkill" v-if="idx===0"><img :src="require('@/assets/add.png')" alt="img"/></span>
          <span @click="minusSkill(idx)" v-else><img :src="require('@/assets/minus.png')" alt="img"/></span>
        </div>
        <span class="err" v-if="skillsErr">{{ skillsErr }}</span>
      </div>
    </section>
    <div class="action">
      <span class="save" @click="save">保存,填写下一个</span>
    </div>
    <Picker ref="pickerRef"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import Picker from '@/components/Picker.vue'

export default defineComponent({
  name: 'FeedBack',
  components: {
    Picker
  },
  setup () {
    const pickerRef = ref<any>(null)
    const errMsg = reactive({
      nameErr: '',
      phoneErr: '',
      idErr: '',
      gradeErr: '',
      skillsErr: ''
    })
    const currentData = reactive({
      name: '',
      phone: '',
      id: '',
      grade: '',
      skills: ['']
    })
    const errors = toRefs(errMsg)
    const current = toRefs(currentData)
    // 保存
    const save = () => {
      // 验证当前表单内容的合法性
      // 同步到data
      let flag = true
      errors.nameErr.value = ''
      errors.idErr.value = ''
      errors.phoneErr.value = ''
      errors.skillsErr.value = ''
      errors.gradeErr.value = ''
      if (!/^[\u4E00-\u9FA5]{2,4}$/.test(current.name.value)) {
        errors.nameErr.value = '请输入正确姓名'
        flag = false
      }
      if (!/^[1]([2-9])[0-9]{9}$/.test(current.phone.value)) {
        errors.phoneErr.value = '请输入正确手机号'
        flag = false
      }
      if (!/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(current.id.value)) {
        errors.idErr.value = '请输入正确身份证号'
        flag = false
      }
      if (!current.grade.value) {
        errors.gradeErr.value = '请选择学历'
        flag = false
      }
      if (current.skills.value.filter(s => !!s).length <= 0) {
        errors.skillsErr.value = '请至少添加一项技能'
        flag = false
      }
      if (flag) {
        currentData.grade = ''
        currentData.name = ''
        currentData.id = ''
        currentData.phone = ''
        currentData.skills = ['']
      }
    }
    const skillChange = (e: { target: HTMLInputElement }, idx: number) => {
      currentData.skills[idx] = e.target.value
    }
    const addSkill = () => {
      currentData.skills.push('')
    }

    const minusSkill = (idx:number) => {
      currentData.skills.splice(idx, 1)
    }
    const showPicker = () => {
      // eslint-disable-next-line no-unused-expressions
      pickerRef?.value?.show()
    }
    return {
      ...errors,
      ...current,
      skillChange,
      save,
      pickerRef,
      addSkill,
      minusSkill,
      showPicker
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable.styl"
.feedback {
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
      box-sizing border-box
      color #3b3a3a
      font-size (30 / $rem)
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
    padding 0 (160 /$rem)
    color white
    margin-top (50 /$rem)

    .save {
      flex 1
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
