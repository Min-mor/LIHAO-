<script setup lang="ts">
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "merchant",
  activePath: "/tickets",
})
</script>

<template>
  <SidebarProvider class="ticket-workspace">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="ticket-workspace__inset">
      <div class="ticket-workspace__grid">
        <section class="ticket-workspace__main">
          <slot />
        </section>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.ticket-workspace {
  @apply bg-muted/30 text-sm text-foreground;
}

.ticket-workspace__inset {
  @apply min-h-screen;
}

.ticket-workspace__grid {
  @apply flex min-h-screen justify-center px-4 py-6 lg:px-12;
}

.ticket-workspace__main {
  @apply flex w-full max-w-5xl flex-col gap-5;
}
</style>
