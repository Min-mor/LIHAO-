<script setup lang="ts">
import { computed } from "vue";
import {
  LayoutDashboard,
  Calendar,
  Store,
  Users,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  Wallet,
  ShoppingBag,
} from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarRail,
} from "@vue/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  badge?: number | string;
  active?: boolean;
}

const props = withDefaults(defineProps<{ variant?: "admin" | "merchant" }>(), {
  variant: "admin",
});

const adminNav: NavItem[] = [
  { title: "Dashboard", url: "#dashboard", icon: LayoutDashboard, active: true },
  { title: "Bookings", url: "#bookings", icon: Calendar },
  { title: "Merchants", url: "#merchants", icon: Store },
  { title: "Users", url: "#users", icon: Users },
  { title: "Messages", url: "#messages", icon: MessageSquare, badge: 2 },
  { title: "Reports", url: "#reports", icon: BarChart },
  { title: "Settings", url: "#settings", icon: Settings },
];

const merchantNav: NavItem[] = [
  { title: "Overview", url: "#overview", icon: LayoutDashboard, active: true },
  { title: "Orders", url: "#orders", icon: ShoppingBag },
  { title: "Payouts", url: "#payouts", icon: Wallet },
  { title: "Messages", url: "#messages", icon: MessageSquare, badge: 1 },
  { title: "Reports", url: "#reports", icon: BarChart },
  { title: "Settings", url: "#settings", icon: Settings },
];

const navigation = computed(() =>
  props.variant === "merchant" ? merchantNav : adminNav,
);
</script>

<template>
  <Sidebar class="app-sidebar" collapsible="icon">
    <SidebarHeader class="app-sidebar__header">
      <div class="app-sidebar__brand">
        <div class="app-sidebar__logo">TG</div>
        <div class="app-sidebar__brand-text">
          <p class="app-sidebar__brand-name">TopGun</p>
          <p class="app-sidebar__brand-role">{{ props.variant === "merchant" ? "Merchant" : "Admin" }} Panel</p>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent class="app-sidebar__content">
      <SidebarGroup>
        <SidebarGroupLabel class="app-sidebar__section-title">
          Navigation
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="app-sidebar__menu">
            <SidebarMenuItem v-for="item in navigation" :key="item.title">
              <SidebarMenuButton
                asChild
                class="app-sidebar__menu-button"
                :data-active="item.active"
                :tooltip="item.title"
              >
                <a :href="item.url">
                  <component :is="item.icon" class="app-sidebar__menu-icon" />
                  <span class="app-sidebar__menu-label">{{ item.title }}</span>
                  <span v-if="item.badge" class="app-sidebar__menu-badge">{{ item.badge }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarSeparator class="app-sidebar__separator" />

    <SidebarFooter class="app-sidebar__footer">
      <div class="app-sidebar__profile">
        <div class="app-sidebar__avatar">RB</div>
        <div class="app-sidebar__profile-data">
          <p class="app-sidebar__profile-name">Raffialdo Bayu</p>
          <p class="app-sidebar__profile-role">
            {{ props.variant === "merchant" ? "Merchant" : "Administrator" }}
          </p>
        </div>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton class="app-sidebar__logout" :tooltip="'Logout'">
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

<style scoped>
.app-sidebar {
  background: var(--color-sidebar);
  color: var(--color-sidebar-foreground);
  border-right: 1px solid var(--color-sidebar-border);
}

.app-sidebar__header {
  padding: 1.5rem 1.25rem 1rem;
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-sidebar__logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #20b970;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.app-sidebar__brand-name {
  font-size: 1rem;
  font-weight: 600;
  color: #060620;
}

.app-sidebar__brand-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.app-sidebar__content {
  padding: 0 0.75rem;
}

.app-sidebar__section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.app-sidebar__menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.app-sidebar__menu-button {
  border-radius: 0.75rem;
  font-weight: 500;
  color: #475569;
  transition: background 0.2s ease, color 0.2s ease;
}

.app-sidebar__menu-button[data-active="true"] {
  background: #e6f7ef;
  color: #0b8a50;
}

.app-sidebar__menu-button[data-active="true"] .app-sidebar__menu-icon {
  color: #0b8a50;
}

.app-sidebar__menu-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #94a3b8;
}

.app-sidebar__menu-button:hover {
  background: rgba(32, 185, 112, 0.12);
  color: #0b8a50;
}

.app-sidebar__menu-label {
  flex: 1;
}

.app-sidebar__menu-badge {
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  background: #ff7b38;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.app-sidebar__separator {
  margin: 0.5rem 1rem;
  border-color: rgba(15, 23, 42, 0.08);
}

.app-sidebar__footer {
  padding: 1rem;
  border-top: 1px solid var(--color-sidebar-border);
}

.app-sidebar__profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.app-sidebar__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #060620;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.app-sidebar__profile-name {
  font-weight: 600;
  color: #060620;
}

.app-sidebar__profile-role {
  font-size: 0.75rem;
  color: #94a3b8;
}

.app-sidebar__logout {
  border-radius: 0.75rem;
  color: #ef4444;
}

.app-sidebar__logout:hover {
  background: rgba(239, 68, 68, 0.1);
}
</style>
