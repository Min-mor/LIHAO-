<script setup lang="ts">
import { SidebarProvider, SidebarInset } from "@vue/ui/sidebar";
import AppSidebar from "@vue/ui/AppSidebar.vue";

withDefaults(defineProps<{ variant?: "admin" | "merchant" }>(), {
  variant: "admin",
});
</script>

<template>
  <SidebarProvider class="admin-shell">
    <AppSidebar :variant="variant" />
    <SidebarInset class="admin-shell__inset">
      <header class="admin-shell__header">
        <slot name="header">
          <div>
            <p class="admin-shell__eyebrow">欢迎回来 👋</p>
            <h1 class="admin-shell__title">控制台概览</h1>
          </div>
        </slot>
      </header>

      <div class="admin-shell__body">
        <main class="admin-shell__main">
          <slot />
        </main>
        <aside class="admin-shell__aside">
          <slot name="profile" />
        </aside>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
.admin-shell {
  background: var(--color-background);
  min-height: 100vh;
}

.admin-shell__inset {
  padding-left: clamp(1rem, 2vw, 2rem);
  padding-right: clamp(1rem, 2vw, 2rem);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  background: #f5f7fb;
}

.admin-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow: 0 10px 40px rgba(6, 6, 32, 0.04);
  margin-bottom: 1.5rem;
}

.admin-shell__eyebrow {
  font-size: 0.85rem;
  color: #20b970;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.admin-shell__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #060620;
  margin: 0;
}

.admin-shell__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.5rem;
}

.admin-shell__main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-shell__aside {
  position: sticky;
  top: 1.5rem;
  align-self: start;
}

@media (max-width: 1024px) {
  .admin-shell__body {
    grid-template-columns: 1fr;
  }

  .admin-shell__aside {
    position: static;
  }
}
</style>
