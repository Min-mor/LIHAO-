<script setup lang="ts">
import { computed, ref } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { merchantManagementMock } from "@/mock/data/merchants"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "admin",
  activePath: "/merchants",
})

const dataset = merchantManagementMock

const selectedMerchantId = ref(dataset.details[0]?.id ?? "")

const selectedMerchant = computed(() =>
  dataset.details.find(detail => detail.id === selectedMerchantId.value) ?? dataset.details[0],
)

const statusBadgeClass = computed(() => {
  switch (selectedMerchant.value?.status) {
    case "active":
      return "bg-emerald-50 text-emerald-600"
    case "pending":
      return "bg-amber-50 text-amber-600"
    default:
      return "bg-muted text-muted-foreground"
  }
})

const merchantStatusClass = (status: string) => {
  if (status === "active") return "text-emerald-600"
  if (status === "pending") return "text-amber-600"
  return "text-muted-foreground"
}
</script>

<template>
  <SidebarProvider class="merchant-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="merchant-inset">
      <div class="merchant-grid">
        <div class="merchant-main">
          <section class="surface-card merchant-header">
            <div>
              <p class="merchant-title">商家管理</p>
              <p class="merchant-subtitle">审核、管理并维护平台商家账号状态。</p>
            </div>
            <div class="merchant-header__actions">
              <div class="search-input-wrapper">
                <input type="search" placeholder="搜索商家或联系人" class="search-input" />
              </div>
              <button class="ghost-btn" type="button">状态：全部</button>
              <button class="primary-btn" type="button">新增商家</button>
            </div>
          </section>

          <section class="surface-card merchant-section">
            <header class="section-header">
              <div>
                <p class="section-title">新商家申请</p>
                <p class="section-caption">最近提交的入驻申请，请尽快处理。</p>
              </div>
            </header>
            <div class="application-list">
              <article
                v-for="application in dataset.applications"
                :key="application.id"
                class="application-card"
              >
                <p class="application-name">{{ application.name }}</p>
                <p class="application-location">{{ application.location }}</p>
                <p class="application-desc">{{ application.description }}</p>
                <div class="application-actions">
                  <button class="ghost-danger" type="button">拒绝</button>
                  <button class="primary-outline" type="button">通过</button>
                </div>
              </article>
            </div>
          </section>

          <section class="surface-card merchant-section">
            <header class="section-header">
              <div>
                <p class="section-title">全部商家</p>
                <p class="section-caption">总览所有合作商家，支持快捷筛选。</p>
              </div>
              <button class="link-button" type="button">导出列表</button>
            </header>
            <div class="table-shell">
              <div class="table-head">
                <span>商家名称</span>
                <span>联系人</span>
                <span>入驻时间</span>
                <span>状态</span>
              </div>
              <button
                v-for="merchant in dataset.merchants"
                :key="merchant.id"
                class="table-row"
                :class="{ 'table-row--active': merchant.id === selectedMerchantId }"
                type="button"
                @click="selectedMerchantId = merchant.id"
              >
                <span class="table-cell">
                  <span class="merchant-name">{{ merchant.name }}</span>
                  <span class="merchant-id">{{ merchant.id }}</span>
                </span>
                <span>{{ merchant.contact }}</span>
                <span>{{ merchant.joinedAt }}</span>
                <span :class="merchantStatusClass(merchant.status)">
                  {{ merchant.status === 'active' ? '正常' : merchant.status === 'pending' ? '待审核' : '暂停' }}
                </span>
              </button>
            </div>
          </section>
        </div>

        <aside class="merchant-side" v-if="selectedMerchant">
          <div class="surface-card detail-card">
            <div class="detail-header">
              <div>
                <p class="detail-name">{{ selectedMerchant.name }}</p>
                <p class="detail-location">{{ selectedMerchant.location }}</p>
              </div>
              <span class="detail-status" :class="statusBadgeClass">{{ selectedMerchant.status }}</span>
            </div>
            <dl class="detail-grid">
              <div>
                <dt>负责人</dt>
                <dd>{{ selectedMerchant.contactPerson }}</dd>
              </div>
              <div>
                <dt>邮箱</dt>
                <dd>{{ selectedMerchant.email }}</dd>
              </div>
              <div>
                <dt>电话</dt>
                <dd>{{ selectedMerchant.phone }}</dd>
              </div>
              <div>
                <dt>业务类型</dt>
                <dd>{{ selectedMerchant.businessType }}</dd>
              </div>
              <div>
                <dt>商家编号</dt>
                <dd>{{ selectedMerchant.merchantId }}</dd>
              </div>
              <div>
                <dt>入驻日期</dt>
                <dd>{{ selectedMerchant.joinedOn }}</dd>
              </div>
            </dl>
            <div class="detail-actions">
              <button class="primary-btn" type="button">编辑资料</button>
              <button class="ghost-btn" type="button">发送提醒</button>
            </div>
          </div>
        </aside>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.merchant-shell {
  @apply bg-muted/30 text-sm text-foreground;
}

.merchant-inset {
  @apply min-h-screen;
}

.merchant-grid {
  @apply grid gap-6 px-4 py-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_360px];
}

.merchant-main {
  @apply flex flex-col gap-6;
}

.merchant-header {
  @apply flex flex-col gap-4 rounded-3xl border border-border/60 px-6 py-6 shadow-sm;
}

.merchant-title {
  @apply text-2xl font-semibold;
}

.merchant-subtitle {
  @apply text-sm text-muted-foreground;
}

.merchant-header__actions {
  @apply flex flex-wrap items-center gap-3;
}

.search-input-wrapper {
  @apply flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3;
}

.search-input {
  @apply w-full bg-transparent text-base outline-none placeholder:text-muted-foreground;
}

.ghost-btn {
  @apply rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground;
}

.primary-btn {
  @apply rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90;
}

.surface-card {
  @apply rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.merchant-section {
  @apply space-y-4;
}

.section-header {
  @apply flex flex-wrap items-center justify-between gap-2;
}

.section-title {
  @apply text-lg font-semibold;
}

.section-caption {
  @apply text-sm text-muted-foreground;
}

.application-list {
  @apply grid gap-4 md:grid-cols-2;
}

.application-card {
  @apply flex flex-col gap-2 rounded-2xl border border-border/70 px-5 py-4;
}

.application-name {
  @apply text-base font-semibold text-foreground;
}

.application-location {
  @apply text-sm text-muted-foreground;
}

.application-desc {
  @apply text-sm text-muted-foreground;
}

.application-actions {
  @apply mt-2 flex gap-2;
}

.ghost-danger {
  @apply flex-1 rounded-2xl border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive;
}

.primary-outline {
  @apply flex-1 rounded-2xl border border-primary px-4 py-2 text-sm font-semibold text-primary;
}

.table-shell {
  @apply flex flex-col divide-y divide-border/60;
}

.table-head,
.table-row {
  @apply grid grid-cols-[1.4fr_1fr_1fr_0.7fr] items-center gap-3 px-2 py-3 text-left;
}

.table-head {
  @apply text-xs font-semibold uppercase tracking-wide text-muted-foreground;
}

.table-row {
  @apply text-sm text-foreground transition hover:bg-muted/80;
}

.table-row--active {
  @apply bg-primary/5 text-primary;
}

.table-cell {
  @apply flex flex-col;
}

.merchant-name {
  @apply text-sm font-semibold;
}

.merchant-id {
  @apply text-xs text-muted-foreground;
}

.link-button {
  @apply text-sm text-primary hover:underline;
}

.merchant-side {
  @apply hidden xl:block;
}

.detail-card {
  @apply h-full rounded-[32px] border border-border/60 px-6 py-6;
}

.detail-header {
  @apply flex items-center justify-between;
}

.detail-name {
  @apply text-xl font-semibold;
}

.detail-location {
  @apply text-sm text-muted-foreground;
}

.detail-status {
  @apply rounded-full px-3 py-1 text-xs font-semibold capitalize;
}

.detail-grid {
  @apply mt-6 grid grid-cols-1 gap-4 text-sm;
}

.detail-grid dt {
  @apply text-xs uppercase text-muted-foreground;
}

.detail-grid dd {
  @apply font-semibold text-foreground;
}

.detail-actions {
  @apply mt-6 flex flex-col gap-3;
}

.detail-actions .ghost-btn {
  @apply justify-center;
}
</style>
