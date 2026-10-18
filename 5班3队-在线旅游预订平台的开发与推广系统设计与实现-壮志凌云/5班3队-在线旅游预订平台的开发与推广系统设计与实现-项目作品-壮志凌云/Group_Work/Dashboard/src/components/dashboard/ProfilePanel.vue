<script setup lang="ts">
import { computed } from "vue"
import type { ProfileInfo, ReminderItem, ReminderToneMeta } from "./types"
import ReminderCard from "./ReminderCard.vue"

const props = defineProps<{
  profile: ProfileInfo
  reminders: ReminderItem[]
  reminderToneMap: Record<ReminderItem["tone"], ReminderToneMeta>
}>()

const profileInitial = computed(() => props.profile.username.charAt(0) ?? "T")
</script>

<template>
  <div class="profile-card">
    <header class="profile-card__header">
      <p class="profile-card__title">我的信息</p>
    </header>

    <div class="profile-card__body">
      <div class="profile-avatar-ring">
        <div v-if="profile.avatar" class="profile-avatar">
          <img :src="profile.avatar" :alt="profile.username" />
        </div>
        <div v-else class="profile-avatar profile-avatar--fallback">
          {{ profileInitial }}
        </div>
        <span class="profile-online-dot"></span>
      </div>
      <p class="profile-name">{{ profile.username }}</p>
      <p class="profile-role">{{ profile.role }}</p>
    </div>

    <section class="profile-reminders">
      <div class="profile-reminders__header">
        <p class="panel-title">提醒列表</p>
      </div>
      <div class="profile-reminders__list">
        <ReminderCard
          v-for="reminder in reminders"
          :key="reminder.id"
          :reminder="reminder"
          :tone-meta="reminderToneMap[reminder.tone]"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "../../styles/global.css";
.profile-card {
  @apply flex h-full w-full flex-col rounded-[36px] bg-white px-6 pb-6 pt-5 shadow-sm ring-1 ring-black/5;
}

.profile-card__header {
  @apply mb-4 border-b border-border/60 pb-2 pt-1 min-h-[78px] flex items-end;
}

.profile-card__title {
  @apply text-lg font-semibold text-foreground;
}

.profile-card__body {
  @apply flex flex-col items-center gap-3 text-center;
}

.panel-title {
  @apply text-base font-semibold text-foreground;
}

.profile-avatar-ring {
  @apply relative inline-flex items-center justify-center rounded-full border-4 border-emerald-400 p-1;
}

.profile-avatar {
  @apply flex size-20 items-center justify-center rounded-full bg-primary/10;
}

.profile-avatar img {
  @apply h-full w-full rounded-full object-cover;
}

.profile-avatar--fallback {
  @apply text-2xl font-semibold text-primary;
}

.profile-online-dot {
  @apply absolute -bottom-1 -right-1 inline-flex size-3 rounded-full border-2 border-white bg-emerald-400;
}

.profile-name {
  @apply text-xl font-semibold text-foreground;
}

.profile-role {
  @apply text-sm font-medium text-emerald-600;
}

.profile-reminders {
  @apply mt-6 flex flex-1 flex-col;
}

.profile-reminders__header {
  @apply mb-3;
}

.profile-reminders__list {
  @apply flex flex-1 flex-col items-center gap-3 overflow-y-auto px-1;
}
</style>
