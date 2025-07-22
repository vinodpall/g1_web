<template>
  <div class="dock-info-row">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="dock-info-item"
    >
      <div class="dock-info-value">
        <template v-if="item.icon">
          <img :src="item.icon" class="dock-info-icon" />
        </template>
        {{ item.value }}
      </div>
      <div class="dock-info-label">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: any[] }>()
</script>

<style scoped>
.dock-info-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  align-items: stretch;
}
.dock-info-value {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  justify-content: center;
  text-align: center;
}
.dock-info-label {
  color: #67D5FD !important;
  font-size: 14px !important;
  font-weight: 400;
  margin-top: 0;
  text-align: center;
  letter-spacing: 0.5px;
}
</style> 