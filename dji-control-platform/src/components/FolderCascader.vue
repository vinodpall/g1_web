<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
const props = defineProps<{ tree: any[], modelValue: string[] }>()
const emit = defineEmits(['update:modelValue'])
const selectedPath = ref([...props.modelValue])
watch(() => props.modelValue, (val) => { selectedPath.value = [...val] })
const cascaderOptions = computed(() => {
  const result = []
  let current = props.tree
  for (let i = 0; i <= selectedPath.value.length; i++) {
    if (!current) break
    result.push(current)
    const next = current.find((item: any) => item.value === selectedPath.value[i])
    current = next && next.children
  }
  return result
})
function onSelect(level: number, e: Event) {
  const value = (e.target as HTMLSelectElement).value
  selectedPath.value = selectedPath.value.slice(0, level)
  selectedPath.value[level] = value
  emit('update:modelValue', [...selectedPath.value])
}
</script>
<template>
  <div class="folder-cascader">
    <template v-for="(options, level) in cascaderOptions" :key="level">
      <select v-model="selectedPath[level]" @change="onSelect(level, $event)" class="mission-select" style="margin-right:8px;">
        <option value="" disabled>请选择</option>
        <option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
    </template>
  </div>
</template>
<style scoped>
.folder-cascader {
  display: flex;
  align-items: center;
}
</style> 