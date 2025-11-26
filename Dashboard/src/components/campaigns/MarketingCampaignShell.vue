<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
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
import type { CampaignStatus, MarketingCampaignRecord } from "@/mock/data/campaigns"
import { campaignMock } from "@/mock/data/campaigns"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "reka-ui"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "admin",
  activePath: "/campaigns",
})

const dataset = campaignMock.records
const campaigns = ref<MarketingCampaignRecord[]>([...dataset])

const keyword = ref("")
const statusFilter = ref<"all" | CampaignStatus>("all")
const page = ref(1)
const pageSize = ref(5)

const currentOperator = "平台管理员"

const statusMeta: Record<CampaignStatus, { label: string; class: string }> = {
  draft: { label: "已保存", class: "status-pill status-pill--draft" },
  published: { label: "已发布", class: "status-pill status-pill--published" },
  ongoing: { label: "进行中", class: "status-pill status-pill--ongoing" },
  revoked: { label: "已撤回", class: "status-pill status-pill--revoked" },
  finished: { label: "已结束", class: "status-pill status-pill--finished" },
}

const statusOptions = [
  { label: "全部状态", value: "all" },
  { label: statusMeta.draft.label, value: "draft" },
  { label: statusMeta.published.label, value: "published" },
  { label: statusMeta.ongoing.label, value: "ongoing" },
  { label: statusMeta.revoked.label, value: "revoked" },
  { label: statusMeta.finished.label, value: "finished" },
]

const notifyTargetOptions = [
  { label: "商家", value: "merchants" },
  { label: "用户", value: "users" },
  { label: "渠道伙伴", value: "partners" },
  { label: "内部团队", value: "internal" },
]

const targetLabelMap = Object.fromEntries(notifyTargetOptions.map((option) => [option.value, option.label]))

const syncFinishedCampaigns = () => {
  const now = Date.now()
  campaigns.value = campaigns.value.map((record) => {
    if ((record.status === "published" || record.status === "ongoing") && record.endAt) {
      const endTs = new Date(record.endAt).getTime()
      if (!Number.isNaN(endTs) && endTs < now) {
        return { ...record, status: "finished" }
      }
    }
    if (record.status === "published" && record.startAt) {
      const startTs = new Date(record.startAt).getTime()
      if (!Number.isNaN(startTs) && startTs <= now) {
        return { ...record, status: "ongoing" }
      }
    }
    return record
  })
}

syncFinishedCampaigns()

watch(
  () => campaigns.value.length,
  () => {
    const maxPage = Math.max(1, Math.ceil(campaigns.value.length / pageSize.value))
    if (page.value > maxPage) page.value = maxPage
  },
  { immediate: true },
)

const filteredCampaigns = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return campaigns.value.filter((record) => {
    const matchKeyword =
      !text ||
      record.title.toLowerCase().includes(text) ||
      record.content.toLowerCase().includes(text)
    const actualStatus = record.status
    const matchStatus = statusFilter.value === "all" || actualStatus === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const paginatedCampaigns = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredCampaigns.value.slice(start, start + pageSize.value)
})

watch([keyword, statusFilter], () => {
  page.value = 1
})

const editorOpen = ref(false)
const editingId = ref<string | null>(null)

const editorForm = reactive({
  title: "",
  cover: "",
  content: "",
  startAt: "",
  endAt: "",
  preNotifyMinutes: 60,
  postNotifyMinutes: 60,
  notifyTargets: ["merchants", "users"] as string[],
})

const isEditing = computed(() => Boolean(editingId.value))

const resetEditorForm = () => {
  editorForm.title = ""
  editorForm.cover = ""
  editorForm.content = ""
  editorForm.startAt = ""
  editorForm.endAt = ""
  editorForm.preNotifyMinutes = 60
  editorForm.postNotifyMinutes = 60
  editorForm.notifyTargets = ["merchants", "users"]
  editingId.value = null
}

const openCreateEditor = () => {
  resetEditorForm()
  editorOpen.value = true
}

const openEditEditor = (record: MarketingCampaignRecord) => {
  editingId.value = record.id
  editorForm.title = record.title
  editorForm.cover = record.cover
  editorForm.content = record.content
  editorForm.startAt = record.startAt ?? ""
  editorForm.endAt = record.endAt ?? ""
  editorForm.preNotifyMinutes = record.preNotifyMinutes ?? 60
  editorForm.postNotifyMinutes = record.postNotifyMinutes ?? 60
  editorForm.notifyTargets = [...record.notifyTargets]
  editorOpen.value = true
}

const handleEditorVisibility = (next: boolean) => {
  editorOpen.value = next
  if (!next) resetEditorForm()
}

const formatNow = () => new Date().toLocaleString("zh-CN", { hour12: false })

const ensureValidRange = () => {
  if (!editorForm.startAt || !editorForm.endAt) return true
  return new Date(editorForm.startAt).getTime() <= new Date(editorForm.endAt).getTime()
}

const buildBaseRecord = (nextStatus: CampaignStatus): MarketingCampaignRecord => {
  const timestamp = formatNow()
  return {
    id: editingId.value ?? `campaign-${Date.now()}`,
    title: editorForm.title.trim(),
    cover:
      editorForm.cover.trim() ||
      "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=640&q=60",
    content: editorForm.content.trim(),
    status: nextStatus,
    createdAt: editingId.value ? undefined! : timestamp,
    publishedAt: nextStatus === "published" ? timestamp : undefined,
    startAt: editorForm.startAt || undefined,
    endAt: editorForm.endAt || undefined,
    preNotifyMinutes: editorForm.preNotifyMinutes,
    postNotifyMinutes: editorForm.postNotifyMinutes,
    notifyTargets: [...editorForm.notifyTargets],
    lastOperator: currentOperator,
    lastOperatedAt: timestamp,
  }
}

const upsertCampaign = (nextStatus: CampaignStatus) => {
  if (!editorForm.title.trim() || !editorForm.content.trim() || !ensureValidRange()) return
  const timestamp = formatNow()
  if (editingId.value) {
    campaigns.value = campaigns.value.map((record) => {
      if (record.id !== editingId.value) return record
      return {
        ...record,
        title: editorForm.title.trim(),
        cover: editorForm.cover.trim() || record.cover,
        content: editorForm.content.trim(),
        status: nextStatus,
        publishedAt: nextStatus === "published" ? timestamp : record.publishedAt,
        startAt: editorForm.startAt || undefined,
        endAt: editorForm.endAt || undefined,
        preNotifyMinutes: editorForm.preNotifyMinutes,
        postNotifyMinutes: editorForm.postNotifyMinutes,
        notifyTargets: [...editorForm.notifyTargets],
        lastOperator: currentOperator,
        lastOperatedAt: timestamp,
      }
    })
  } else {
    const baseRecord = buildBaseRecord(nextStatus)
    campaigns.value = [
      {
        ...baseRecord,
        createdAt: baseRecord.createdAt ?? timestamp,
      },
      ...campaigns.value,
    ]
  }
  // TODO: 调用营销活动保存/发布 API，传入编辑表单与提醒配置
  editorOpen.value = false
  resetEditorForm()
  syncFinishedCampaigns()
}

const handleSaveDraft = () => {
  upsertCampaign("draft")
}

const handlePublish = () => {
  upsertCampaign("published")
}

const handleRevoke = (id: string) => {
  const timestamp = formatNow()
  campaigns.value = campaigns.value.map((record) =>
    record.id === id
      ? { ...record, status: "revoked", lastOperator: currentOperator, lastOperatedAt: timestamp }
      : record,
  )
}

const handleMarkFinished = (id: string) => {
  const timestamp = formatNow()
  campaigns.value = campaigns.value.map((record) =>
    record.id === id
      ? { ...record, status: "finished", lastOperator: currentOperator, lastOperatedAt: timestamp }
      : record,
  )
}

const handleDelete = (id: string) => {
  campaigns.value = campaigns.value.filter((record) => record.id !== id)
}

const handleModify = (record: MarketingCampaignRecord) => {
  openEditEditor(record)
}

const statusBadgeClass = (status: CampaignStatus) => statusMeta[status]?.class ?? "status-pill"
const statusLabel = (status: CampaignStatus) => statusMeta[status]?.label ?? status

const formatDateTime = (value?: string) => {
  if (!value) return "--"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("zh-CN", { hour12: false })
}

const formatDuration = (minutes?: number) => {
  if (!minutes) return "未设置"
  if (minutes % 60 === 0) {
    return `${minutes / 60} 小时`
  }
  return `${minutes} 分钟`
}

const formatTargets = (targets: string[]) => {
  if (!targets.length) return "--"
  return targets.map((target) => targetLabelMap[target] ?? target).join("、")
}
</script>

<template>
  <SidebarProvider class="campaign-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="campaign-inset">
      <div class="campaign-grid">
        <section class="campaign-main">
          <header class="surface-card campaign-header">
            <div>
              <p class="campaign-title">营销活动</p>
              <p class="campaign-subtitle">策划营销动作，配置提醒触达商家与用户。</p>
            </div>
          </header>

          <section class="surface-card campaign-toolbar">
            <div class="toolbar-search">
              <input
                v-model="keyword"
                type="search"
                placeholder="搜索活动名称或内容"
                class="toolbar-search__input"
              />
            </div>
            <div class="toolbar-actions">
              <select v-model="statusFilter" class="toolbar-select">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <button type="button" class="primary-btn" @click="openCreateEditor">新建活动</button>
            </div>
          </section>

          <section class="surface-card campaign-table">
            <header class="table-head">
              <span>活动</span>
              <span>周期</span>
              <span>提醒策略</span>
              <span>状态</span>
              <span>操作</span>
            </header>
            <div v-if="paginatedCampaigns.length" class="table-body">
              <article v-for="record in paginatedCampaigns" :key="record.id" class="table-row">
                <div class="table-campaign">
                  <img :src="record.cover" :alt="record.title" class="table-cover" />
                  <div>
                    <p class="campaign-name">{{ record.title }}</p>
                    <p class="campaign-desc">{{ record.content }}</p>
                    <p class="campaign-meta">最后操作：{{ record.lastOperator }} · {{ record.lastOperatedAt }}</p>
                  </div>
                </div>
                <div class="table-period">
                  <p>{{ formatDateTime(record.startAt) }}</p>
                  <p>至</p>
                  <p>{{ formatDateTime(record.endAt) }}</p>
                </div>
                <div class="table-reminder">
                  <p>开始前：{{ formatDuration(record.preNotifyMinutes) }}</p>
                  <p>结束前：{{ formatDuration(record.postNotifyMinutes) }}</p>
                  <p>通知对象：{{ formatTargets(record.notifyTargets) }}</p>
                </div>
                <div>
                  <span :class="statusBadgeClass(record.status)">{{ statusLabel(record.status) }}</span>
                  <p class="campaign-meta">创建于：{{ record.createdAt }}</p>
                  <p class="campaign-meta" v-if="record.publishedAt">发布于：{{ record.publishedAt }}</p>
                </div>
                <div class="table-actions">
                  <button type="button" class="link-button" @click="handleModify(record)">修改</button>
                  <button type="button" class="link-button" @click="handleRevoke(record.id)">撤回</button>
                  <button type="button" class="link-button" @click="handleMarkFinished(record.id)">结束</button>
                  <button type="button" class="link-button text-destructive" @click="handleDelete(record.id)">删除</button>
                </div>
              </article>
            </div>
            <div v-else class="table-empty">暂无营销活动，点击右上角新建活动。</div>
            <footer class="table-footer">
              <p>共 {{ filteredCampaigns.length }} 条活动，展示 {{ pageSize }} 条/页</p>
              <div class="table-footer__pager">
                <Pagination
                  v-model:page="page"
                  class="campaign-pagination"
                  :items-per-page="pageSize"
                  :total="filteredCampaigns.length"
                  :sibling-count="1"
                >
                  <PaginationContent v-slot="{ items }">
                    <PaginationPrevious aria-label="上一页" class="pagination-button">
                      <span>上一页</span>
                    </PaginationPrevious>
                    <template v-for="(item, index) in items" :key="`${item.type}-${index}`">
                      <PaginationItem
                        v-if="item.type === 'page'"
                        :value="item.value"
                        :is-active="item.value === page"
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
          </section>
        </section>
      </div>
    </SidebarInset>
  </SidebarProvider>

  <DialogRoot :open="editorOpen" @update:open="handleEditorVisibility">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <header class="dialog-header">
          <div>
            <DialogTitle class="dialog-title">{{ isEditing ? "编辑活动" : "新建活动" }}</DialogTitle>
            <DialogDescription class="dialog-desc">配置活动内容、周期与提醒策略。</DialogDescription>
          </div>
          <button type="button" class="ghost-btn" @click="handleSaveDraft">暂时保存</button>
        </header>

        <form class="dialog-form" @submit.prevent>
          <label class="form-field">
            <span>活动标题</span>
            <input v-model="editorForm.title" type="text" placeholder="输入活动标题" />
          </label>
          <label class="form-field">
            <span>封面图片 URL</span>
            <input v-model="editorForm.cover" type="url" placeholder="https://example.com/banner.jpg" />
          </label>
          <label class="form-field">
            <span>活动内容</span>
            <textarea
              v-model="editorForm.content"
              rows="6"
              placeholder="填写活动说明，可在此接入富文本编辑器"
            ></textarea>
          </label>

          <div class="form-grid">
            <label class="form-field">
              <span>开始时间</span>
              <input v-model="editorForm.startAt" type="datetime-local" />
            </label>
            <label class="form-field">
              <span>结束时间</span>
              <input v-model="editorForm.endAt" type="datetime-local" />
            </label>
          </div>

          <div class="form-grid">
            <label class="form-field">
              <span>开始前提醒（分钟）</span>
              <input v-model.number="editorForm.preNotifyMinutes" type="number" min="0" step="15" />
            </label>
            <label class="form-field">
              <span>结束前提醒（分钟）</span>
              <input v-model.number="editorForm.postNotifyMinutes" type="number" min="0" step="15" />
            </label>
          </div>

          <fieldset class="form-field">
            <span>通知对象</span>
            <div class="target-grid">
              <label v-for="option in notifyTargetOptions" :key="option.value" class="target-option">
                <input
                  v-model="editorForm.notifyTargets"
                  type="checkbox"
                  :value="option.value"
                />
                <span>{{ option.label }}</span>
              </label>
            </div>
            <p class="field-hint">发布后将在活动开始/结束前按照设置触达所选人群。// TODO: 调用提醒配置 API</p>
          </fieldset>
        </form>

        <footer class="dialog-footer">
          <DialogClose class="ghost-btn">取消</DialogClose>
          <button type="button" class="primary-btn" @click="handlePublish">发布活动</button>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
@reference "../../styles/global.css";
.campaign-shell {
  @apply bg-muted/30 text-sm text-foreground;
}

.campaign-inset {
  @apply min-h-screen;
}

.campaign-grid {
  @apply flex min-h-screen justify-center px-4 py-6 lg:px-12;
}

.campaign-main {
  @apply flex w-full max-w-6xl flex-col gap-5;
}

.surface-card {
  @apply rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.campaign-header {
  @apply flex flex-col gap-4 border border-border/60;
}

.campaign-title {
  @apply text-2xl font-semibold;
}

.campaign-subtitle {
  @apply text-sm text-muted-foreground;
}

.campaign-toolbar {
  @apply flex flex-col gap-4 border border-border/60 md:flex-row md:items-center md:justify-between;
}

.toolbar-search {
  @apply flex flex-1 items-center rounded-2xl border border-border bg-background px-4 py-3;
}

.toolbar-search__input {
  @apply w-full bg-transparent text-base outline-none placeholder:text-muted-foreground;
}

.toolbar-actions {
  @apply flex flex-wrap items-center gap-3;
}

.toolbar-select {
  @apply rounded-2xl border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground;
}

.ghost-btn {
  @apply rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground;
}

.primary-btn {
  @apply rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90;
}

.campaign-table {
  @apply flex flex-col gap-4 border border-border/60;
}

.table-head,
.table-row {
  @apply grid grid-cols-[2.6fr_1.3fr_1.6fr_1fr_0.9fr] items-start gap-3;
}

.table-head {
  @apply border-b border-border/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground;
}

.table-row {
  @apply border-b border-border/30 py-4 text-sm last:border-b-0;
}

.table-body {
  @apply flex flex-col;
}

.table-campaign {
  @apply flex items-start gap-4;
}

.table-cover {
  @apply size-16 rounded-2xl object-cover;
}

.campaign-name {
  @apply text-base font-semibold text-foreground;
}

.campaign-desc {
  @apply mt-1 line-clamp-2 text-sm text-muted-foreground;
}

.campaign-meta {
  @apply text-xs text-muted-foreground;
}

.table-period,
.table-reminder {
  @apply flex flex-col gap-1 text-sm text-muted-foreground;
}

.table-actions {
  @apply flex flex-col gap-1 text-right;
}

.link-button {
  @apply text-sm font-semibold text-primary hover:underline;
}

.table-empty {
  @apply py-10 text-center text-sm text-muted-foreground;
}

.table-footer {
  @apply flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground;
}

.table-footer__pager {
  @apply flex flex-1 justify-end;
}

.campaign-pagination {
  @apply !mx-0 !w-auto items-center gap-2 justify-end;
}

.pagination-button {
  @apply inline-flex items-center rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground;
}

.pagination-number {
  @apply inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground;
}

.status-pill {
  @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold;
}

.status-pill--draft {
  @apply bg-slate-100 text-slate-600;
}

.status-pill--published {
  @apply bg-primary/10 text-primary;
}

.status-pill--ongoing {
  @apply bg-sky-100 text-sky-700;
}

.status-pill--revoked {
  @apply bg-amber-100 text-amber-700;
}

.status-pill--finished {
  @apply bg-emerald-100 text-emerald-700;
}

.dialog-overlay {
  @apply fixed inset-0 z-40 bg-black/60 backdrop-blur-sm;
}

.dialog-content {
  @apply fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-[32px] bg-white p-8 shadow-2xl;
}

.dialog-header {
  @apply flex flex-col gap-4 md:flex-row md:items-center md:justify-between;
}

.dialog-title {
  @apply text-2xl font-semibold;
}

.dialog-desc {
  @apply text-sm text-muted-foreground;
}

.dialog-form {
  @apply flex flex-col gap-4;
}

.form-field {
  @apply flex flex-col gap-2 text-sm font-medium text-foreground;
}

.form-field input,
.form-field textarea {
  @apply rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground;
}

.form-grid {
  @apply grid gap-4 md:grid-cols-2;
}

.target-grid {
  @apply grid gap-2 sm:grid-cols-2;
}

.target-option {
  @apply flex items-center gap-2 rounded-2xl border border-border/60 px-3 py-2 text-sm;
}

.field-hint {
  @apply text-xs text-muted-foreground;
}

.dialog-footer {
  @apply flex flex-wrap items-center justify-end gap-4;
}

.text-destructive {
  @apply text-destructive;
}
</style>
