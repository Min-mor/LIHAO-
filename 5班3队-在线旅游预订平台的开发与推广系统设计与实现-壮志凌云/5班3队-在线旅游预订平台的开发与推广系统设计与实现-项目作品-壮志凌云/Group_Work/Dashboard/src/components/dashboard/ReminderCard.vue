<script setup lang="ts">
import type { ReminderItem, ReminderToneMeta } from "./types"

const props = defineProps<{
  reminder: ReminderItem
  toneMeta: ReminderToneMeta
}>()
</script>

<template>
  <div class="reminder-card">
    <div class="reminder-icon" :class="[toneMeta.iconBg, toneMeta.iconText]">
      <component :is="toneMeta.icon" class="icon" />
    </div>
    <div class="reminder-content">
      <p class="reminder-title">{{ reminder.title }}</p>
      <p class="reminder-detail">{{ reminder.detail }}</p>
      <p class="reminder-time">{{ reminder.time }}</p>
    </div>
  </div>
</template>

<style scoped>
@reference "../../styles/global.css";
.reminder-card {
  @apply flex w-full items-start gap-3 rounded-3xl border border-border/70 bg-white px-4 py-3 shadow-sm;
}

.reminder-icon {
  @apply flex size-10 items-center justify-center rounded-2xl bg-primary/10;
}

.icon {
  @apply size-4;
}

.reminder-content {
  @apply flex flex-col gap-1 text-left;
}

.reminder-title {
  @apply text-sm font-semibold text-foreground;
}

.reminder-detail {
  @apply text-sm text-muted-foreground;
}

.reminder-time {
  @apply text-xs text-muted-foreground;
}
</style>
