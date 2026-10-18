<script setup lang="ts">
import { computed, ref } from "vue"
import DashboardShell from "@/components/dashboard/DashboardShell.vue"
import LoginShell from "@/components/auth/LoginShell.vue"
import { clearAuthSession, readAuthSession, type AuthSession } from "@/lib/auth"

const session = ref<AuthSession | null>(null)
const isHydrated = ref(false)
const role = computed(() => session.value?.role ?? "merchant")

if (typeof window !== "undefined") {
  session.value = readAuthSession()
  isHydrated.value = true
}

function handleLoginSuccess(payload: AuthSession) {
  session.value = payload
}

function handleLogout() {
  clearAuthSession()
  session.value = null
}
</script>

<template>
  <div class="auth-gateway" v-if="isHydrated">
    <DashboardShell v-if="session" :role="role" @logout="handleLogout" />
    <div v-else class="auth-gateway__login">
      <LoginShell :redirect-on-success="false" @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<style scoped>
@reference "../../styles/global.css";
.auth-gateway {
  @apply relative min-h-screen bg-muted/20;
}

.auth-gateway__login {
  @apply min-h-screen;
}
</style>
