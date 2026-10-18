<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { readAuthSession } from "@/lib/auth"
import {
  settingsMock,
  type AuditLogEntry,
  type ChannelStatus,
  type IntegrationCard,
  type RolePolicy,
  type SettingsDataset,
  type ToggleSetting,
} from "@/mock/data/settings"

const DEFAULT_ROLE: UserRole = "admin"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  activePath: "/settings",
})

const sessionRole = ref<UserRole>(DEFAULT_ROLE)

onMounted(() => {
  const session = readAuthSession()
  if (session?.role) {
    sessionRole.value = session.role
  }
})

const resolvedRole = computed<UserRole>(() => props.role ?? sessionRole.value)

const dataset = computed<SettingsDataset>(() => settingsMock[resolvedRole.value])
const activeTab = ref(dataset.value.tabs[0]?.value ?? "platform")

watch(resolvedRole, (role) => {
  activeTab.value = settingsMock[role].tabs[0]?.value ?? "platform"
})

function riskBadgeVariant(entry: AuditLogEntry) {
  const map: Record<AuditLogEntry["risk"], { label: string; class: string }> = {
    low: { label: "低", class: "bg-emerald-50 text-emerald-600" },
    medium: { label: "中", class: "bg-amber-50 text-amber-600" },
    high: { label: "高", class: "bg-rose-50 text-rose-600" },
  }
  return map[entry.risk]
}

function channelBadgeClass(channel: ChannelStatus) {
  return channel.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"
}

function integrationStatusBadge(card: IntegrationCard) {
  return card.status === "connected" ? { text: "已连接", class: "text-emerald-600" } : { text: "待配置", class: "text-amber-500" }
}

function switchDisabledCopy(item: ToggleSetting) {
  return item.badge ? `${item.badge}，建议保持启用` : undefined
}

function roleBadge(role: RolePolicy) {
  return role.critical ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
}
</script>

<template>
  <SidebarProvider class="settings-shell">
    <AppSidebar :role="resolvedRole" :active-path="props.activePath" />
    <SidebarInset class="settings-inset">
      <div class="settings-grid">
        <section class="surface-card hero-card">
          <div>
            <p class="hero-title">设置中心</p>
            <p class="hero-desc">统一管理平台策略、商家协作与安全策略，确保管理员与商家体验一致。</p>
          </div>
          <div class="hero-meta">
            <p class="hero-meta__label">最后同步时间</p>
            <p class="hero-meta__value">今天 · 18:42</p>
          </div>
        </section>

        <section class="surface-card tabs-panel">
          <Tabs v-model="activeTab" class="settings-tabs">
            <TabsList class="settings-tab-list">
              <TabsTrigger
                v-for="tab in dataset.tabs"
                :key="tab.value"
                :value="tab.value"
                class="settings-tab-trigger"
              >
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="platform" class="tabs-content">
              <div class="panel-grid">
                <article class="panel-card col-span-2">
                  <header class="panel-header">
                    <div>
                      <p class="panel-title">角色与权限</p>
                      <p class="panel-caption">为不同团队成员定义可访问的模块。</p>
                    </div>
                    <Button size="sm" class="rounded-2xl">新增角色</Button>
                  </header>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>角色</TableHead>
                        <TableHead>成员</TableHead>
                        <TableHead>权限范围</TableHead>
                        <TableHead class="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="role in dataset.platform.roles" :key="role.id">
                        <TableCell>
                          <div class="role-cell">
                            <Badge class="role-badge" :class="roleBadge(role)">{{ role.name }}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{{ role.users }}</TableCell>
                        <TableCell>
                          <p class="text-sm text-muted-foreground">{{ role.permissions.join(" · ") }}</p>
                        </TableCell>
                        <TableCell class="text-right">
                          <Button variant="ghost" size="sm">编辑</Button>
                          <Button variant="ghost" size="sm" class="text-destructive">删除</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </article>

                <article class="panel-card">
                  <header class="panel-header">
                    <p class="panel-title">审批与自动化</p>
                    <p class="panel-caption">关键节点需二次确认，防止误操作。</p>
                  </header>
                  <ul class="toggle-list">
                    <li v-for="item in dataset.platform.approvals" :key="item.id" class="toggle-item">
                      <div>
                        <p class="toggle-label">{{ item.label }}</p>
                        <p class="toggle-desc">{{ item.description }}</p>
                      </div>
                      <div class="toggle-action">
                        <Switch :checked="item.enabled" disabled class="switch-sm" />
                        <span v-if="switchDisabledCopy(item)" class="toggle-hint">{{ switchDisabledCopy(item) }}</span>
                      </div>
                    </li>
                  </ul>
                </article>

                <article class="panel-card col-span-2">
                  <header class="panel-header">
                    <p class="panel-title">系统集成</p>
                    <p class="panel-caption">对接支付、分析、CRM 等外部系统。</p>
                  </header>
                  <div class="integration-grid">
                    <div
                      v-for="card in dataset.platform.integrations"
                      :key="card.id"
                      class="integration-card"
                    >
                      <div class="integration-icon" :class="card.accent">
                        <component :is="card.icon" class="size-5" />
                      </div>
                      <div>
                        <p class="integration-title">{{ card.name }}</p>
                        <p class="integration-desc">{{ card.description }}</p>
                      </div>
                      <div class="integration-footer">
                        <span :class="['status-pill', integrationStatusBadge(card).class]">
                          {{ integrationStatusBadge(card).text }}
                        </span>
                        <Button variant="ghost" size="sm">{{ card.status === "connected" ? "查看" : "配置" }}</Button>
                      </div>
                      <p v-if="card.hint" class="integration-hint">{{ card.hint }}</p>
                    </div>
                  </div>
                </article>
              </div>
            </TabsContent>

            <TabsContent value="shop" class="tabs-content">
              <div class="panel-grid">
                <article class="panel-card">
                  <header class="panel-header">
                    <p class="panel-title">门户资料</p>
                    <p class="panel-caption">对外展示的品牌与联系方式。</p>
                  </header>
                  <dl class="profile-list">
                    <div v-for="field in dataset.shop.profile" :key="field.id" class="profile-row">
                      <dt>{{ field.label }}</dt>
                      <dd>{{ field.value }}</dd>
                    </div>
                  </dl>
                  <Button variant="outline" size="sm" class="w-full rounded-2xl">编辑资料</Button>
                </article>

                <article class="panel-card">
                  <header class="panel-header">
                    <p class="panel-title">通知策略</p>
                    <p class="panel-caption">管理财务、公告与风险提醒。</p>
                  </header>
                  <ul class="toggle-list">
                    <li v-for="item in dataset.shop.notifications" :key="item.id" class="toggle-item">
                      <div>
                        <p class="toggle-label">{{ item.label }}</p>
                        <p class="toggle-desc">{{ item.description }}</p>
                      </div>
                      <Switch :checked="item.enabled" disabled class="switch-sm" />
                    </li>
                  </ul>
                </article>

                <article class="panel-card col-span-2">
                  <header class="panel-header">
                    <p class="panel-title">消息渠道</p>
                    <p class="panel-caption">掌握服务号、短信、邮件的连通状态。</p>
                  </header>
                  <div class="channel-grid">
                    <div v-for="channel in dataset.shop.channels" :key="channel.id" class="channel-card">
                      <div>
                        <p class="channel-title">{{ channel.name }}</p>
                        <p class="channel-desc">{{ channel.description }}</p>
                      </div>
                      <span class="status-pill" :class="channelBadgeClass(channel)">
                        {{ channel.status === "connected" ? "已接入" : "待授权" }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </TabsContent>

            <TabsContent value="security" class="tabs-content">
              <div class="panel-grid">
                <article class="panel-card">
                  <header class="panel-header">
                    <p class="panel-title">安全策略</p>
                    <p class="panel-caption">双因子、IP 白名单等基础防护。</p>
                  </header>
                  <ul class="toggle-list">
                    <li v-for="policy in dataset.security.policies" :key="policy.id" class="toggle-item">
                      <div>
                        <p class="toggle-label">{{ policy.label }}</p>
                        <p class="toggle-desc">{{ policy.description }}</p>
                      </div>
                      <Switch :checked="policy.enabled" disabled class="switch-sm" />
                    </li>
                  </ul>
                </article>

                <article class="panel-card">
                  <header class="panel-header">
                    <p class="panel-title">合规状态</p>
                    <p class="panel-caption">追踪证照与行业认证。</p>
                  </header>
                  <ul class="compliance-list">
                    <li v-for="badge in dataset.security.compliance" :key="badge.id" class="compliance-item">
                      <div>
                        <p class="compliance-title">{{ badge.label }}</p>
                        <p class="compliance-desc">{{ badge.detail }}</p>
                      </div>
                      <Badge :variant="badge.status === 'pass' ? 'outline' : 'destructive'">
                        {{ badge.status === "pass" ? "通过" : "关注" }}
                      </Badge>
                    </li>
                  </ul>
                </article>

                <article class="panel-card col-span-2">
                  <header class="panel-header">
                    <p class="panel-title">审计日志</p>
                    <p class="panel-caption">记录敏感操作，便于追溯。</p>
                  </header>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>操作</TableHead>
                        <TableHead>执行人</TableHead>
                        <TableHead>渠道</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead class="text-right">风险</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="entry in dataset.security.auditLogs" :key="entry.id">
                        <TableCell>{{ entry.action }}</TableCell>
                        <TableCell>{{ entry.actor }}</TableCell>
                        <TableCell>{{ entry.channel }}</TableCell>
                        <TableCell>{{ entry.time }}</TableCell>
                        <TableCell class="text-right">
                          <span class="status-pill" :class="riskBadgeVariant(entry).class">
                            {{ riskBadgeVariant(entry).label }}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </article>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.settings-shell {
  @apply bg-muted/20 text-sm text-foreground;
}

.settings-inset {
  @apply min-h-screen;
}

.settings-grid {
  @apply flex flex-col gap-6 px-4 py-6 lg:px-10;
}

.surface-card {
  @apply rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-black/5;
}

.hero-card {
  @apply flex flex-wrap items-center justify-between gap-4;
}

.hero-title {
  @apply text-2xl font-semibold;
}

.hero-desc {
  @apply text-sm text-muted-foreground;
}

.hero-meta {
  @apply text-right;
}

.hero-meta__label {
  @apply text-xs text-muted-foreground;
}

.hero-meta__value {
  @apply text-lg font-semibold;
}

.tabs-panel {
  @apply p-0;
}

.settings-tabs {
  @apply flex flex-col gap-4;
}

.settings-tab-list {
  @apply flex flex-wrap gap-2 overflow-x-auto rounded-3xl bg-muted/50 p-2;
}

.settings-tab-trigger {
  @apply rounded-2xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-foreground;
}

.tabs-content {
  @apply px-6 pb-6;
}

.panel-grid {
  @apply grid gap-5 lg:grid-cols-2;
}

.panel-card {
  @apply rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-black/5;
}

.panel-header {
  @apply mb-4 flex flex-wrap items-center justify-between gap-3;
}

.panel-title {
  @apply text-lg font-semibold;
}

.panel-caption {
  @apply text-sm text-muted-foreground;
}

.role-cell {
  @apply flex items-center gap-2;
}

.role-badge {
  @apply rounded-full px-3 py-1 text-xs font-semibold;
}

.toggle-list {
  @apply space-y-4;
}

.toggle-item {
  @apply flex items-start justify-between gap-4 rounded-2xl border border-border/60 px-4 py-3;
}

.toggle-label {
  @apply text-sm font-semibold;
}

.toggle-desc {
  @apply text-xs text-muted-foreground;
}

.toggle-action {
  @apply flex flex-col items-end gap-1 text-xs text-muted-foreground;
}

.integration-grid {
  @apply grid gap-4 md:grid-cols-2;
}

.integration-card {
  @apply rounded-2xl border border-border/60 p-4;
}

.integration-icon {
  @apply mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-primary/5;
}

.integration-title {
  @apply text-base font-semibold;
}

.integration-desc {
  @apply text-sm text-muted-foreground;
}

.integration-footer {
  @apply mt-3 flex items-center justify-between;
}

.integration-hint {
  @apply mt-2 text-xs text-muted-foreground;
}

.status-pill {
  @apply inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold;
}

.profile-list {
  @apply space-y-4;
}

.profile-row {
  @apply flex items-center justify-between text-sm;
}

.profile-row dt {
  @apply text-muted-foreground;
}

.channel-grid {
  @apply grid gap-4 md:grid-cols-2;
}

.channel-card {
  @apply flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3;
}

.channel-title {
  @apply text-base font-semibold;
}

.channel-desc {
  @apply text-sm text-muted-foreground;
}

.compliance-list {
  @apply space-y-3;
}

.compliance-item {
  @apply flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3;
}

.compliance-title {
  @apply text-base font-semibold;
}

.compliance-desc {
  @apply text-sm text-muted-foreground;
}

.switch-sm {
  @apply h-4 w-7;
}
</style>
