import { ref } from 'vue'

const count = ref<number>(0)

export const useCount = () => {
  const setCount = (c: number) => {
    count.value = c
  }
  return {
    count,
    setCount
  }
}
