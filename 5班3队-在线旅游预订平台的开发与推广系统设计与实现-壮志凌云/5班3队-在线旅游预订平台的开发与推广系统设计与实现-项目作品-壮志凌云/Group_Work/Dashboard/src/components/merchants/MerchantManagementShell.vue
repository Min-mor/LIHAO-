<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { MerchantDetail } from "@/mock/data/merchants"
import { merchantManagementMock } from "@/mock/data/merchants"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "admin",
  activePath: "/merchants",
})

const dataset = merchantManagementMock
const defaultLogo = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=60"

type MerchantStatus = MerchantDetail["status"]

const merchants = ref<MerchantDetail[]>([...dataset.details])
const merchantApplications = computed(() => merchants.value.filter((merchant: MerchantDetail) => merchant.status === "pending"))

const merchantPage = ref(1)
const merchantPageSize = ref(6)

const selectedMerchantId = ref<string>(merchants.value[0]?.id ?? "")

const selectedMerchant = computed(() => merchants.value.find((detail: MerchantDetail) => detail.id === selectedMerchantId.value))

const selectedMerchantLogo = computed(() => selectedMerchant.value?.logo || defaultLogo)

const statusBadgeClass = computed(() => {
  switch (selectedMerchant.value?.status) {
    case "active":
      return "bg-emerald-50 text-emerald-600"
    case "pending":
      return "bg-amber-50 text-amber-600"
    case "suspended":
    case "inactive":
      return "bg-slate-200 text-slate-600"
    default:
      return "bg-muted text-muted-foreground"
  }
})

const merchantStatusClass = (status: string) => {
  if (status === "active") return "text-emerald-600"
  if (status === "pending") return "text-amber-600"
  if (status === "suspended" || status === "inactive") return "text-rose-500"
  return "text-muted-foreground"
}

const statusAvatarClass = computed(() => {
  switch (selectedMerchant.value?.status) {
    case "active":
      return {
        ring: "avatar-ring--success",
        dot: "avatar-dot--success",
      }
    case "pending":
      return {
        ring: "avatar-ring--warning",
        dot: "avatar-dot--warning",
      }
    default:
      return {
        ring: "avatar-ring--muted",
        dot: "avatar-dot--muted",
      }
  }
})

const merchantStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "正常"
    case "pending":
      return "待审核"
    case "suspended":
    case "inactive":
      return "暂停"
    default:
      return status
  }
}

type MerchantActionType = "approve" | "reject" | "suspend" | "activate" | "delete"

interface MerchantAction {
  label: string
  action: MerchantActionType
  variant?: "primary" | "danger" | "ghost"
}

const merchantActionMap: Record<MerchantStatus, MerchantAction[]> = {
  active: [{ label: "封锁", action: "suspend", variant: "danger" }],
  pending: [
    { label: "拒绝", action: "reject", variant: "ghost" },
    { label: "通过", action: "approve", variant: "primary" },
  ],
  suspended: [
    { label: "启用", action: "activate", variant: "primary" },
    { label: "删除", action: "delete", variant: "danger" },
  ],
  inactive: [
    { label: "启用", action: "activate", variant: "primary" },
    { label: "删除", action: "delete", variant: "danger" },
  ],
}

const availableActions = computed(() => {
  const status = selectedMerchant.value?.status ?? "active"
  return merchantActionMap[status] || []
})

const updateMerchantStatus = (merchantId: string, nextStatus: MerchantStatus) => {
  merchants.value = merchants.value.map((merchant: MerchantDetail) =>
    merchant.id === merchantId ? { ...merchant, status: nextStatus } : merchant,
  )
}

const deleteMerchant = (merchantId: string) => {
  merchants.value = merchants.value.filter((merchant: MerchantDetail) => merchant.id !== merchantId)
  if (selectedMerchantId.value === merchantId) {
    selectedMerchantId.value = merchants.value[0]?.id ?? ""
  }
}

watch(
  () => merchants.value.length,
  () => {
    const maxPage = Math.max(1, Math.ceil(merchants.value.length / merchantPageSize.value))
    if (merchantPage.value > maxPage) merchantPage.value = maxPage
  },
  { immediate: true },
)

const paginatedMerchants = computed(() => {
  const start = (merchantPage.value - 1) * merchantPageSize.value
  return merchants.value.slice(start, start + merchantPageSize.value)
})

const triggerMerchantAction = (merchantId: string, action: MerchantActionType) => {
  switch (action) {
    case "approve":
      updateMerchantStatus(merchantId, "active")
      break
    case "reject":
      updateMerchantStatus(merchantId, "suspended")
      break
    case "suspend":
      updateMerchantStatus(merchantId, "suspended")
      break
    case "activate":
      updateMerchantStatus(merchantId, "active")
      break
    case "delete":
      deleteMerchant(merchantId)
      break
    default:
      break
  }
}

const handleMerchantAction = (action: MerchantActionType) => {
  if (!selectedMerchant.value) return
  triggerMerchantAction(selectedMerchant.value.id, action)
}

const handleApplicationAction = (merchantId: string, action: MerchantActionType) => {
  triggerMerchantAction(merchantId, action)
  selectedMerchantId.value = merchantId
}

const handleSelectMerchant = (merchantId: string) => {
  selectedMerchantId.value = merchantId
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
            <div class="application-list" v-if="merchantApplications.length">
              <article
                v-for="application in merchantApplications"
                :key="application.id"
                class="application-card"
              >
                <div class="application-card__header">
                  <div class="application-logo">
                    <img :src="application.logo || defaultLogo" :alt="`${application.name} logo`" />
                  </div>
                  <div>
                    <p class="application-name">{{ application.name }}</p>
                    <p class="application-location">{{ application.location }}</p>
                  </div>
                </div>
                <p class="application-desc">{{ application.pitch }}</p>
                <div class="application-actions">
                  <button class="ghost-danger" type="button" @click="handleApplicationAction(application.id, 'reject')">
                    拒绝
                  </button>
                  <button class="primary-outline" type="button" @click="handleApplicationAction(application.id, 'approve')">
                    通过
                  </button>
                </div>
              </article>
            </div>
            <div v-else class="application-empty">
              <p>暂无待审核商家，保持关注～</p>
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
              <template v-if="paginatedMerchants.length">
                <button
                  v-for="merchant in paginatedMerchants"
                  :key="merchant.id"
                  class="table-row"
                  :class="{ 'table-row--active': merchant.id === selectedMerchantId }"
                  type="button"
                  @click="handleSelectMerchant(merchant.id)"
                >
                  <span class="table-cell">
                    <span class="merchant-name">{{ merchant.name }}</span>
                    <span class="merchant-id">{{ merchant.id }}</span>
                  </span>
                  <span>{{ merchant.contactPerson }}</span>
                  <span>{{ merchant.joinedAt }}</span>
                  <span :class="merchantStatusClass(merchant.status)">
                    {{ merchantStatusLabel(merchant.status) }}
                  </span>
                </button>
              </template>
              <div v-else class="table-empty">暂无商家记录</div>
              <footer class="table-footer">
                <p>共 {{ merchants.length }} 名商家，展示 {{ merchantPageSize }} 条/页</p>
                <div class="table-footer__pager">
                  <Pagination
                    v-model:page="merchantPage"
                    class="merchant-pagination"
                    :items-per-page="merchantPageSize"
                    :total="merchants.length"
                    :sibling-count="1"
                  >
                    <PaginationContent v-slot="{ items }">
                      <PaginationPrevious aria-label="上一页" class="pagination-button">
                        <span>上一页</span>
                      </PaginationPrevious>
                      <template v-for="(item, index) in items" :key="`${item.type}-${item.type === 'page' ? item.value : index}`">
                        <PaginationItem
                          v-if="item.type === 'page'"
                          :value="item.value"
                          :is-active="item.value === merchantPage"
                          class="pagination-number"
                        >
                          {{ item.value }}
                        </PaginationItem>
                        <PaginationEllipsis v-else-if="item.type === 'ellipsis'" :index="index" />
                      </template>
                      <PaginationNext aria-label="下一页" class="pagination-button">
                        <span>下一页</span>
                      </PaginationNext>
                    </PaginationContent>
                  </Pagination>
                </div>
              </footer>
            </div>
          </section>
        </div>

        <aside class="merchant-side" v-if="selectedMerchant">
          <div class="surface-card detail-card">
            <div class="detail-hero">
              <div class="detail-avatar" :class="statusAvatarClass.ring">
                <span class="detail-avatar__dot" :class="statusAvatarClass.dot"></span>
                <img :src="selectedMerchantLogo" :alt="selectedMerchant.name" />
              </div>
              <div class="detail-header">
                <p class="detail-name">{{ selectedMerchant.name }}</p>
                <p class="detail-pitch" v-if="selectedMerchant.pitch">{{ selectedMerchant.pitch }}</p>
              </div>
              <span class="detail-status" :class="statusBadgeClass">{{ merchantStatusLabel(selectedMerchant.status) }}</span>
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
                <dd>{{ selectedMerchant.joinedAt }}</dd>
              </div>
            </dl>
            <div class="detail-actions">
              <div class="detail-actions__cta">
                <button class="primary-btn" type="button">编辑资料</button>
                <button class="ghost-btn" type="button">发送提醒</button>
              </div>
              <div class="detail-actions__ops">
                <div class="action-buttons" v-if="availableActions.length">
                  <button
                    v-for="action in availableActions"
                    :key="action.label"
                    type="button"
                    :class="['action-btn',
                             action.variant === 'primary' && 'action-btn--primary',
                             action.variant === 'danger' && 'action-btn--danger']"
                    @click="handleMerchantAction(action.action)"
                  >
                    {{ action.label }}
                  </button>
                </div>
                <p v-else class="action-empty">当前状态暂无可执行操作。</p>
              </div>
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
  @apply grid gap-6 px-4 py-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_400px];
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
  @apply flex flex-col gap-3 rounded-2xl border border-border/70 px-5 py-4;
}

.application-card__header {
  @apply flex items-center gap-3;
}

.application-logo {
  @apply flex size-14 items-center justify-center rounded-2xl bg-muted/70;
}

.application-logo img {
  @apply size-12 rounded-xl object-cover;
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

.application-empty {
  @apply rounded-2xl border border-dashed border-border px-5 py-6 text-center text-sm text-muted-foreground;
}

.table-shell {
  @apply flex flex-col divide-y divide-border/60;
}

.table-footer {
  @apply flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground;
}

.table-footer__pager {
  @apply flex flex-1 justify-end;
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

.merchant-pagination {
  @apply !mx-0 !w-auto items-center gap-2 justify-end;
}

.pagination-button {
  @apply inline-flex items-center rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground;
}

.pagination-number {
  @apply inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground;
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
  @apply hidden xl:flex xl:flex-col;
}

.detail-card {
  @apply flex h-full flex-col gap-6 rounded-[36px] border border-border/60 px-8 py-8;
}

.detail-hero {
  @apply flex flex-col items-center gap-4 text-center;
}

.detail-avatar {
  @apply relative flex size-32 items-center justify-center rounded-full p-1 transition;
}

.detail-avatar img {
  @apply size-full rounded-full object-cover;
}

.detail-avatar__dot {
  @apply absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white;
}

.detail-header {
  @apply flex flex-col items-center gap-1;
}

.detail-name {
  @apply text-2xl font-semibold;
}

.detail-location {
  @apply text-sm text-muted-foreground;
}

.detail-role {
  @apply text-sm font-medium text-primary;
}

.detail-pitch {
  @apply mt-2 text-sm text-muted-foreground;
}

.detail-status {
  @apply rounded-full px-3 py-1 text-xs font-semibold capitalize;
}

.detail-grid {
  @apply grid grid-cols-1 gap-4 text-sm;
}

.detail-grid dt {
  @apply text-xs uppercase text-muted-foreground;
}

.detail-grid dd {
  @apply font-semibold text-foreground;
}

.action-card {
  @apply mt-4 rounded-[32px] border border-border/60 px-6 py-6;
}

.action-header {
  @apply mb-4;
}

.action-title {
  @apply text-lg font-semibold;
}

.action-caption {
  @apply text-sm text-muted-foreground;
}

.detail-actions {
  @apply mt-auto flex flex-col gap-4;
}

.detail-actions__cta {
  @apply flex flex-wrap items-center justify-center gap-4;
}

.detail-actions__cta button {
  @apply min-w-[140px];
}

.detail-actions__ops {
  @apply flex flex-col items-center gap-3 text-center;
}

.action-buttons {
  @apply flex w-full flex-col gap-3;
}

.action-btn {
  @apply rounded-2xl border border-border px-4 py-2 text-center text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary;
}

.action-btn--primary {
  @apply border-primary bg-primary text-white hover:bg-primary/90;
}

.action-btn--danger {
  @apply border-destructive/50 text-destructive hover:border-destructive hover:text-destructive;
}

.action-empty {
  @apply text-sm text-muted-foreground;
}

.avatar-ring--success {
  box-shadow: 0 0 0 8px rgb(34 197 94 / 0.16);
}

.avatar-ring--warning {
  box-shadow: 0 0 0 8px rgb(251 191 36 / 0.22);
}

.avatar-ring--muted {
  box-shadow: 0 0 0 8px rgb(148 163 184 / 0.18);
}

.avatar-dot--success {
  @apply bg-emerald-500;
}

.avatar-dot--warning {
  @apply bg-amber-500;
}

.avatar-dot--muted {
  @apply bg-slate-400;
}
</style>
