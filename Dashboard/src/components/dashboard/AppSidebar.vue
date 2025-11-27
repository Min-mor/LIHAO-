<script setup lang="ts">
import { getCurrentInstance } from "vue"
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  BarChart3,
  MessageCircle,
  Megaphone,
  UsersRound,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-vue-next"
import type { UserRole } from "./types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { clearAuthSession } from "@/lib/auth"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "merchant",
  activePath: "/",
})

const emit = defineEmits<{ (e: "logout"): void }>()

const instance = getCurrentInstance()

function handleLogout() {
  emit("logout")
  const hasListener = Boolean(instance?.vnode.props?.onLogout)
  if (!hasListener && typeof window !== "undefined") {
    clearAuthSession()
    window.location.href = "/"
  }
}

const navMap: Record<UserRole, { label: string; icon: any; path: string; badge?: number }[]> = {
  merchant: [
    { label: "仪表盘", icon: LayoutDashboard, path: "/" },
    { label: "商品管理", icon: Store, path: "/products" },
    { label: "订单中心", icon: ShoppingCart, path: "/orders" },
    { label: "销售报表", icon: BarChart3, path: "/reports" },
    { label: "工单中心", icon: MessageCircle, path: "/tickets", badge: 2 },
    { label: "联系管理员", icon: Megaphone, path: "/support" },
    { label: "设置", icon: Settings, path: "/settings" },
  ],
  admin: [
    { label: "仪表盘", icon: LayoutDashboard, path: "/" },
    { label: "商家管理", icon: UsersRound, path: "/merchants" },
    { label: "工单中心", icon: MessageCircle, path: "/tickets", badge: 3 },
    { label: "公告中心", icon: Megaphone, path: "/announcements" },
    { label: "营销活动", icon: TrendingUp, path: "/campaigns" },
    { label: "设置", icon: Settings, path: "/settings" },
  ],
}
</script>

<template>
  <Sidebar class="app-sidebar">
    <SidebarHeader class="sidebar-header">
      <div class="sidebar-brand">
        <div class="sidebar-logo">T</div>
        <div>
          <p class="sidebar-title">Trip</p>
          <p class="sidebar-caption">在线旅游控制台</p>
        </div>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in navMap[props.role]"
              :key="item.label"
            >
              <SidebarMenuButton
                asChild
                :class="['menu-button', { 'menu-button--active': props.activePath === item.path }]"
              >
                <a :href="item.path" class="menu-link">
                  <component :is="item.icon" class="menu-icon" />
                  <span>{{ item.label }}</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuBadge v-if="item.badge" class="menu-badge">
                {{ item.badge }}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="sidebar-footer">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton class="logout-button" @click="handleLogout">
            <LogOut class="menu-icon" />
            <span>登出</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<style scoped>
@reference "../../styles/global.css";
.app-sidebar {
  @apply border-r bg-white/95;
}

.sidebar-header {
  @apply px-5 py-6;
}

.sidebar-brand {
  @apply flex items-center gap-3 rounded-2xl bg-primary/5 p-4;
}

.sidebar-logo {
  @apply flex size-12 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-white;
}

.sidebar-title {
  @apply text-lg font-semibold text-foreground;
}

.sidebar-caption {
  @apply text-xs text-muted-foreground;
}

.menu-button {
  @apply rounded-xl px-3 py-2 text-base text-foreground/80 transition hover:bg-primary/10 hover:text-primary;
}

.menu-button--active {
  @apply bg-primary font-semibold text-white shadow-sm hover:bg-primary text-white;
}

.menu-button--active:hover {
  @apply text-white;
}

.menu-link {
  @apply flex items-center gap-3;
}

.menu-icon {
  @apply size-5;
}

.menu-badge {
  @apply bg-primary/10 text-primary;
}

.sidebar-footer {
  @apply px-5 pb-6;
}

.logout-button {
  @apply rounded-xl px-3 py-2 text-base font-semibold text-destructive transition hover:bg-destructive/10;
}
</style>
