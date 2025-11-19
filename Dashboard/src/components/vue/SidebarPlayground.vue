<script setup lang="ts">
import AppSidebar from '@/components/vue/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/vue/ui/sidebar'
</script>

<template>
  <div class="mt-6 flex gap-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60">
    <SidebarProvider>
      <AppSidebar />

      <div class="flex-1 space-y-4 p-6">
        <header class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-400">工作台内容区域</p>
            <h3 class="text-2xl font-semibold text-white">主视图</h3>
          </div>
          <SidebarTrigger class="rounded-lg border border-white/10 px-4 py-2 text-sm text-white" />
        </header>
        <p class="text-sm text-slate-400">
          在这里放置业务组件、数据面板或其他需要与 Sidebar 联动的内容。
        </p>
      </div>
    </SidebarProvider>
  </div>
</template>
