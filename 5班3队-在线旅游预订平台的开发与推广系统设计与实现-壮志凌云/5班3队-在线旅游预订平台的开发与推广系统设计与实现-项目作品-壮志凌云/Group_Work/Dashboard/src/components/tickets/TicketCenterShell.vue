<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { TicketRecord, TicketStatus } from "@/mock/data/tickets"
import { ticketCenterMock } from "@/mock/data/tickets"
import TicketWorkspace from "@/components/tickets/TicketWorkspace.vue"
import { readAuthSession } from "@/lib/auth"

const DEFAULT_ROLE: UserRole = "merchant"

const props = withDefaults(
  defineProps<{
    role?: UserRole
    activePath?: string
    ticketsData?: TicketRecord[]
    pageSize?: number
    onRefresh?: () => Promise<void> | void
    onExport?: (tickets: TicketRecord[]) => void
  }>(),
  {
    activePath: "/tickets",
    pageSize: 5,
  },
)

function resolveInitialRole() {
  if (typeof window === "undefined")
    return DEFAULT_ROLE
  return readAuthSession()?.role ?? DEFAULT_ROLE
}

const sessionRole = ref<UserRole>(resolveInitialRole())

const resolvedRole = computed<UserRole>(() => props.role ?? sessionRole.value)

const dataset = computed(() => ticketCenterMock[resolvedRole.value] ?? ticketCenterMock.merchant)

const ticketsSource = computed(() => props.ticketsData ?? dataset.value.tickets)
const tickets = ref<TicketRecord[]>([...ticketsSource.value])

watch(ticketsSource, (next) => {
  tickets.value = [...next]
})

const keyword = ref("")
const statusFilter = ref<"all" | TicketStatus>("all")
const page = ref(1)
const pageSize = ref(props.pageSize)

watch(
  () => props.pageSize,
  (next) => {
    if (typeof next === "number" && next > 0) {
      pageSize.value = next
    }
  },
)

const statusMeta: Record<TicketStatus, { label: string; badge: string }> = {
  pending: { label: "待处理", badge: "status-pill status-pill--pending" },
  processing: { label: "处理中", badge: "status-pill status-pill--progress" },
  completed: { label: "已完成", badge: "status-pill status-pill--completed" },
}

const filteredTickets = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return tickets.value.filter((ticket) => {
    const matchKeyword =
      !text ||
      ticket.description.toLowerCase().includes(text) ||
      ticket.ticketNo.toLowerCase().includes(text) ||
      ticket.requester.toLowerCase().includes(text)
    const matchStatus = statusFilter.value === "all" || ticket.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const ticketStatusLabel = (status: TicketStatus) => statusMeta[status]?.label ?? status
const ticketStatusClass = (status: TicketStatus) => statusMeta[status]?.badge ?? "status-pill"

const statusOptions = computed(() => [
  { label: "全部状态", value: "all" },
  { label: statusMeta.pending.label, value: "pending" },
  { label: statusMeta.processing.label, value: "processing" },
  { label: statusMeta.completed.label, value: "completed" },
])

const handleResetFilters = () => {
  keyword.value = ""
  statusFilter.value = "all"
}

const handleRefresh = async () => {
  if (props.onRefresh) {
    await props.onRefresh()
  }
  tickets.value = [...ticketsSource.value]
}

const handleExport = () => {
  props.onExport?.(filteredTickets.value)
}

const handleLeaveMessage = (ticketId: string) => {
  const destination = resolvedRole.value === "merchant" ? `/tickets/chat/${ticketId}` : `/tickets/${ticketId}`
  window.location.href = destination
}

watch([keyword, statusFilter], () => {
  page.value = 1
})

const ticketTotalPages = computed(() => Math.max(1, Math.ceil(filteredTickets.value.length / pageSize.value)))

const paginatedTickets = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredTickets.value.slice(start, start + pageSize.value)
})

watch(
  [() => filteredTickets.value.length, pageSize],
  () => {
    if (page.value > ticketTotalPages.value) {
      page.value = ticketTotalPages.value
    }
  },
  { immediate: true },
)
</script>

<template>
  <TicketWorkspace :role="resolvedRole" :active-path="props.activePath">
    <header class="surface-card ticket-header">
      <div>
        <p class="ticket-title">工单中心</p>
        <p class="ticket-subtitle">查看、筛选工单并快速回复用户问题。</p>
      </div>
      <div class="ticket-header__actions">
        <button type="button" class="ghost-btn" @click="handleRefresh">刷新</button>
        <button type="button" class="primary-btn" @click="handleExport">导出记录</button>
      </div>
    </header>

    <section class="surface-card filter-bar">
      <div class="filter-search">
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索问题描述、工单编号或提单人"
          class="filter-search__input"
        />
      </div>
      <div class="filter-actions">
        <select v-model="statusFilter" class="filter-select">
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <button type="button" class="ghost-btn" @click="handleResetFilters">重置</button>
      </div>
    </section>

    <section class="surface-card ticket-table">
      <header class="table-head">
        <span>问题描述</span>
        <span>工单编号</span>
        <span>问题类型</span>
        <span>服务类型</span>
        <span>提单人</span>
        <span>状态</span>
        <span>创建时间</span>
        <span class="text-right">操作</span>
      </header>
      <div v-if="paginatedTickets.length" class="table-body">
        <article
          v-for="ticket in paginatedTickets"
          :key="ticket.id"
          class="table-row"
          role="button"
          tabindex="0"
          @click="handleLeaveMessage(ticket.id)"
        >
          <div class="issue-col">
            <p class="issue-desc">{{ ticket.description }}</p>
          </div>
          <span class="muted">{{ ticket.ticketNo }}</span>
          <span>{{ ticket.issueType }}</span>
          <span>{{ ticket.serviceType }}</span>
          <span>{{ ticket.requester }}</span>
          <span>
            <span :class="ticketStatusClass(ticket.status)">{{ ticketStatusLabel(ticket.status) }}</span>
          </span>
          <span>{{ ticket.createdAt }}</span>
          <span class="text-right">
            <button type="button" class="link-button" @click.stop="handleLeaveMessage(ticket.id)">查看对话</button>
          </span>
        </article>
      </div>
      <div v-else class="table-empty">
        <p>没有匹配的工单，尝试调整搜索条件。</p>
      </div>
      <footer class="table-footer">
        <p>共 {{ filteredTickets.length }} 条工单，展示 {{ pageSize }} 条/页</p>
        <Pagination
          v-model:page="page"
          class="ticket-pagination"
          :items-per-page="pageSize"
          :total="filteredTickets.length"
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
      </footer>
    </section>
  </TicketWorkspace>
</template>

<style scoped>
@reference "../../styles/global.css";
.surface-card {
  @apply rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.ticket-header {
  @apply flex flex-col gap-4 border border-border/60 lg:flex-row lg:items-center lg:justify-between;
}

.ticket-title {
  @apply text-2xl font-semibold;
}

.ticket-subtitle {
  @apply text-sm text-muted-foreground;
}

.ticket-header__actions {
  @apply flex items-center gap-3;
}

.ghost-btn {
  @apply rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60;
}

.primary-btn {
  @apply rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90;
}

.filter-bar {
  @apply flex flex-col gap-4 border border-border/60 md:flex-row md:items-center md:justify-between;
}

.filter-search {
  @apply flex flex-1 items-center rounded-2xl border border-border bg-background px-4 py-3;
}

.filter-search__input {
  @apply w-full bg-transparent text-base outline-none placeholder:text-muted-foreground;
}

.filter-actions {
  @apply flex flex-wrap items-center gap-3;
}

.filter-select {
  @apply rounded-2xl border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground;
}

.ticket-table {
  @apply flex flex-col gap-4 border border-border/60;
}

.table-head {
  @apply grid grid-cols-[2.6fr_1.2fr_1fr_1fr_1fr_0.8fr_1fr_0.8fr] items-center gap-3 border-b border-border/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground;
}

.table-body {
  @apply flex flex-col;
}

.table-row {
  @apply grid grid-cols-[2.6fr_1.2fr_1fr_1fr_1fr_0.8fr_1fr_0.8fr] items-start gap-3 border-b border-border/30 py-4 text-sm last:border-b-0;
}

.issue-col {
  @apply pr-4;
}

.issue-desc {
  @apply line-clamp-2 text-sm font-medium text-foreground;
}

.muted {
  @apply text-xs text-muted-foreground;
}

.table-empty {
  @apply py-8 text-center text-sm text-muted-foreground;
}

.table-footer {
  @apply flex flex-col gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between;
}

.ticket-pagination {
  @apply !mx-0 !w-auto items-center gap-2 md:justify-end;
}

.pagination-button {
  @apply inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-foreground disabled:opacity-40;
}

.pagination-number {
  @apply inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground;
}

.status-pill {
  @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold;
}

.status-pill--pending {
  @apply bg-amber-100 text-amber-700;
}

.status-pill--progress {
  @apply bg-sky-100 text-sky-700;
}

.status-pill--completed {
  @apply bg-emerald-100 text-emerald-700;
}
</style>
