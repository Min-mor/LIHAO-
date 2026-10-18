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
import type { AnnouncementRecord, AnnouncementStatus } from "@/mock/data/announcements"
import { announcementMock } from "@/mock/data/announcements"
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
  activePath: "/announcements",
})

const dataset = announcementMock.records
const announcements = ref<AnnouncementRecord[]>([...dataset])

const keyword = ref("")
const statusFilter = ref<"all" | AnnouncementStatus>("all")
const page = ref(1)
const pageSize = ref(5)

const currentOperator = "平台管理员"

const statusMeta: Record<AnnouncementStatus, { label: string; class: string }> = {
  draft: { label: "已保存", class: "status-pill status-pill--draft" },
  published: { label: "已发布", class: "status-pill status-pill--published" },
  revoked: { label: "已撤回", class: "status-pill status-pill--revoked" },
}

const statusOptions = [
  { label: "全部状态", value: "all" },
  { label: statusMeta.draft.label, value: "draft" },
  { label: statusMeta.published.label, value: "published" },
  { label: statusMeta.revoked.label, value: "revoked" },
]

const filteredAnnouncements = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return announcements.value.filter((record) => {
    const matchKeyword =
      !text ||
      record.title.toLowerCase().includes(text) ||
      record.content.toLowerCase().includes(text)
    const matchStatus = statusFilter.value === "all" || record.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const paginatedAnnouncements = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredAnnouncements.value.slice(start, start + pageSize.value)
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
})

const isEditing = computed(() => Boolean(editingId.value))

const resetEditorForm = () => {
  editorForm.title = ""
  editorForm.cover = ""
  editorForm.content = ""
  editingId.value = null
}

const openCreateEditor = () => {
  resetEditorForm()
  editorOpen.value = true
}

const openEditEditor = (record: AnnouncementRecord) => {
  editingId.value = record.id
  editorForm.title = record.title
  editorForm.cover = record.cover
  editorForm.content = record.content
  editorOpen.value = true
}

const handleEditorVisibility = (next: boolean) => {
  editorOpen.value = next
  if (!next) {
    resetEditorForm()
  }
}

const formatNow = () => new Date().toLocaleString("zh-CN", { hour12: false })

const upsertAnnouncement = (nextStatus: AnnouncementStatus) => {
  if (!editorForm.title.trim() || !editorForm.content.trim()) return
  const timestamp = formatNow()
  if (editingId.value) {
    announcements.value = announcements.value.map((record) => {
      if (record.id !== editingId.value) return record
      return {
        ...record,
        title: editorForm.title.trim(),
        cover: editorForm.cover.trim() || record.cover,
        content: editorForm.content.trim(),
        status: nextStatus,
        publishedAt: nextStatus === "published" ? timestamp : record.publishedAt,
        lastOperator: currentOperator,
        lastOperatedAt: timestamp,
      }
    })
  } else {
    const id = `notice-${Date.now()}`
    const baseRecord: AnnouncementRecord = {
      id,
      title: editorForm.title.trim(),
      cover:
        editorForm.cover.trim() ||
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=640&q=60",
      content: editorForm.content.trim(),
      status: nextStatus,
      createdAt: timestamp,
      publishedAt: nextStatus === "published" ? timestamp : undefined,
      lastOperator: currentOperator,
      lastOperatedAt: timestamp,
    }
    announcements.value = [baseRecord, ...announcements.value]
  }
  editorOpen.value = false
  resetEditorForm()
}

const handleSaveDraft = () => {
  // TODO: 接入保存草稿 API
  upsertAnnouncement("draft")
}

const handlePublish = () => {
  // TODO: 接入公告发布 API
  upsertAnnouncement("published")
}

const updateAnnouncementStatus = (id: string, status: AnnouncementStatus) => {
  const timestamp = formatNow()
  announcements.value = announcements.value.map((record) =>
    record.id === id
      ? {
          ...record,
          status,
          lastOperator: currentOperator,
          lastOperatedAt: timestamp,
        }
      : record,
  )
}

const handleRevoke = (id: string) => {
  updateAnnouncementStatus(id, "revoked")
}

const handleDelete = (id: string) => {
  announcements.value = announcements.value.filter((record) => record.id !== id)
}

const handleModify = (record: AnnouncementRecord) => {
  openEditEditor(record)
}

const statusBadgeClass = (status: AnnouncementStatus) => statusMeta[status]?.class ?? "status-pill"
const statusLabel = (status: AnnouncementStatus) => statusMeta[status]?.label ?? status
</script>

<template>
  <SidebarProvider class="announcement-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="announcement-inset">
      <div class="announcement-grid">
        <section class="announcement-main">
          <header class="surface-card announcement-header">
            <div>
              <p class="announcement-title">公告中心</p>
              <p class="announcement-subtitle">发布平台公告、同步最新运营信息。</p>
            </div>
          </header>

          <section class="surface-card announcement-toolbar">
            <div class="toolbar-search">
              <input
                v-model="keyword"
                type="search"
                placeholder="搜索公告标题或内容"
                class="toolbar-search__input"
              />
            </div>
            <div class="toolbar-actions">
              <select v-model="statusFilter" class="toolbar-select">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <button type="button" class="primary-btn" @click="openCreateEditor">新建公告</button>
            </div>
          </section>

          <section class="surface-card announcement-table">
            <header class="table-head">
              <span>公告</span>
              <span>状态</span>
              <span>发布时间</span>
              <span>最后操作人</span>
              <span class="text-right">操作</span>
            </header>
            <div v-if="paginatedAnnouncements.length" class="table-body">
              <article v-for="record in paginatedAnnouncements" :key="record.id" class="table-row">
                <div class="table-announcement">
                  <img :src="record.cover" :alt="record.title" class="table-cover" />
                  <div>
                    <p class="announcement-name">{{ record.title }}</p>
                    <p class="announcement-desc">{{ record.content }}</p>
                    <p class="announcement-meta">创建时间：{{ record.createdAt }}</p>
                  </div>
                </div>
                <span>
                  <span :class="statusBadgeClass(record.status)">{{ statusLabel(record.status) }}</span>
                </span>
                <span>{{ record.publishedAt ?? "--" }}</span>
                <span>
                  <p>{{ record.lastOperator }}</p>
                  <p class="announcement-meta">{{ record.lastOperatedAt }}</p>
                </span>
                <div class="table-actions">
                  <button type="button" class="link-button" @click="handleModify(record)">修改</button>
                  <button type="button" class="link-button" @click="handleRevoke(record.id)">撤回</button>
                  <button type="button" class="link-button text-destructive" @click="handleDelete(record.id)">删除</button>
                </div>
              </article>
            </div>
            <div v-else class="table-empty">暂无公告记录，点击右上角新建公告。</div>
            <footer class="table-footer">
              <p>共 {{ filteredAnnouncements.length }} 条公告，展示 {{ pageSize }} 条/页</p>
              <div class="table-footer__pager">
                <Pagination
                  v-model:page="page"
                  class="announcement-pagination"
                  :items-per-page="pageSize"
                  :total="filteredAnnouncements.length"
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
            <DialogTitle class="dialog-title">{{ isEditing ? "编辑公告" : "新建公告" }}</DialogTitle>
            <DialogDescription class="dialog-desc">完善公告内容，支持暂存与发布。</DialogDescription>
          </div>
          <button type="button" class="ghost-btn" @click="handleSaveDraft">暂时保存</button>
        </header>

        <form class="dialog-form" @submit.prevent>
          <label class="form-field">
            <span>公告标题</span>
            <input v-model="editorForm.title" type="text" placeholder="请输入公告标题" />
          </label>
          <label class="form-field">
            <span>封面图片 URL</span>
            <input v-model="editorForm.cover" type="url" placeholder="https://example.com/cover.jpg" />
          </label>
          <label class="form-field">
            <span>公告内容</span>
            <textarea
              v-model="editorForm.content"
              rows="6"
              placeholder="输入公告详情（可在此预留富文本编辑器位置）"
            ></textarea>
          </label>
        </form>

        <footer class="dialog-footer">
          <DialogClose class="ghost-btn">取消</DialogClose>
          <button type="button" class="primary-btn" @click="handlePublish">发布公告</button>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
@reference "../../styles/global.css";
.announcement-shell {
  @apply bg-muted/30 text-sm text-foreground;
}

.announcement-inset {
  @apply min-h-screen;
}

.announcement-grid {
  @apply flex min-h-screen justify-center px-4 py-6 lg:px-12;
}

.announcement-main {
  @apply flex w-full max-w-5xl flex-col gap-5;
}

.surface-card {
  @apply rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.announcement-header {
  @apply flex flex-col gap-4 border border-border/60 md:flex-row md:items-center md:justify-between;
}

.announcement-title {
  @apply text-2xl font-semibold;
}

.announcement-subtitle {
  @apply text-sm text-muted-foreground;
}

.announcement-toolbar {
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

.announcement-table {
  @apply flex flex-col gap-4 border border-border/60;
}

.table-head {
  @apply grid grid-cols-[2.4fr_0.8fr_1fr_1fr_0.8fr] items-center gap-3 border-b border-border/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground;
}

.table-body {
  @apply flex flex-col;
}

.table-row {
  @apply grid grid-cols-[2.4fr_0.8fr_1fr_1fr_0.8fr] items-start gap-3 border-b border-border/30 py-4 text-sm last:border-b-0;
}

.table-announcement {
  @apply flex items-start gap-4;
}

.table-cover {
  @apply size-16 rounded-2xl object-cover;
}

.announcement-name {
  @apply text-base font-semibold text-foreground;
}

.announcement-desc {
  @apply mt-1 line-clamp-2 text-sm text-muted-foreground;
}

.announcement-meta {
  @apply text-xs text-muted-foreground;
}

.table-actions {
  @apply flex flex-wrap justify-end gap-2;
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

.announcement-pagination {
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
  @apply bg-emerald-100 text-emerald-700;
}

.status-pill--revoked {
  @apply bg-amber-100 text-amber-700;
}

.dialog-overlay {
  @apply fixed inset-0 z-40 bg-black/60 backdrop-blur-sm;
}

.dialog-content {
  @apply fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-[32px] bg-white p-8 shadow-2xl;
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

.dialog-footer {
  @apply flex flex-wrap items-center justify-end gap-4;
}

.text-destructive {
  @apply text-destructive;
}
</style>
