<script setup lang="ts">
interface ActivityItem {
  title: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

interface Props {
  name: string;
  role: string;
  statusLabel: string;
  activities: ActivityItem[];
}

const props = defineProps<Props>();

const statusDot: Record<ActivityItem['status'], string> = {
  success: 'activity__dot activity__dot--success',
  warning: 'activity__dot activity__dot--warning',
  error: 'activity__dot activity__dot--error'
};
</script>

<template>
  <div class="profile-card">
    <header class="profile-card__header">
      <div class="profile-card__avatar">RB</div>
      <div class="profile-card__meta">
        <p class="profile-card__name">{{ props.name }}</p>
        <p class="profile-card__role">{{ props.role }}</p>
      </div>
      <span class="profile-card__badge">{{ props.statusLabel }}</span>
    </header>

    <section class="profile-card__section">
      <p class="profile-card__section-title">Recent Activity</p>
      <ul class="activity-list">
        <li v-for="item in props.activities" :key="item.title" class="activity">
          <span :class="statusDot[item.status]" />
          <div class="activity__content">
            <p class="activity__title">{{ item.title }}</p>
            <p class="activity__time">{{ item.time }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.profile-card {
  border-radius: 1.5rem;
  background: #ffffff;
  padding: 1.75rem;
  border: 1px solid rgba(6, 6, 32, 0.05);
  box-shadow: 0 25px 55px rgba(6, 6, 32, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: linear-gradient(135deg, #20b970, #1a9362);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card__meta {
  flex: 1;
}

.profile-card__name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: #060620;
}

.profile-card__role {
  margin: 0.15rem 0 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.profile-card__badge {
  padding: 0.35rem 1rem;
  border-radius: 999px;
  background: rgba(32, 185, 112, 0.15);
  color: #0f9b63;
  font-weight: 600;
}

.profile-card__section-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.8rem;
}

.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.activity__content {
  display: flex;
  flex-direction: column;
}

.activity__title {
  margin: 0;
  font-weight: 600;
  color: #060620;
}

.activity__time {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.activity__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.activity__dot--success {
  background: #20b970;
}

.activity__dot--warning {
  background: #ff7b38;
}

.activity__dot--error {
  background: #ef4444;
}

@media (max-width: 1024px) {
  .profile-card {
    border-radius: 1rem;
  }
}
</style>
