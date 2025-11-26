<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Filter, Download, Search, MoreVertical, ChevronDown } from "lucide-vue-next"
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ordersMock, type OrderRecord, type OrderStatus } from "@/mock/data/orders"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "merchant",
  activePath: "/orders",
})

const ORDERS_PER_PAGE = 4
const searchTerm = ref("")
const statusFilter = ref<"all" | OrderStatus>("all")
const currentPage = ref(1)
const orders = ref<OrderRecord[]>([...ordersMock])

const statusMeta: Record<OrderStatus, { label: string; badgeClass: string }> = {
  completed: { label: "已完成", badgeClass: "status-badge status-badge--success" },
  processing: { label: "处理中", badgeClass: "status-badge status-badge--info" },
  pending: { label: "待确认", badgeClass: "status-badge status-badge--warning" },
  cancelled: { label: "已取消", badgeClass: "status-badge status-badge--danger" },
}

const statusOptions = computed(() => [{ label: "全部状态", value: "all" }, ...Object.entries(statusMeta).map(([value, meta]) => ({
  label: meta.label,
  value,
}))])

watch([searchTerm, statusFilter], () => {
  currentPage.value = 1
})

const filteredOrders = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()
  return orders.value.filter((order) => {
    const matchSearch =
      !search ||
      order.orderNo.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.productName.toLowerCase().includes(search)
    const matchStatus = statusFilter.value === "all" || order.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ORDERS_PER_PAGE
  return filteredOrders.value.slice(start, start + ORDERS_PER_PAGE)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / ORDERS_PER_PAGE)))

watch(
  [() => filteredOrders.value.length],
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
  { immediate: true },
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const showingText = computed(() => {
  const start = filteredOrders.value.length === 0 ? 0 : (currentPage.value - 1) * ORDERS_PER_PAGE + 1
  const end = Math.min(filteredOrders.value.length, currentPage.value * ORDERS_PER_PAGE)
  return `显示 ${start}-${end} / ${filteredOrders.value.length} 条订单`
})

function setStatusFilter(value: "all" | OrderStatus) {
  statusFilter.value = value
}

function statusBadgeClass(status: OrderStatus) {
  return statusMeta[status]?.badgeClass ?? "status-badge"
}
</script>

<template>
  <SidebarProvider class="orders-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="orders-inset">
      <div class="orders-grid">
        <section class="orders-main">
          <header class="surface-card orders-hero">
            <div>
              <p class="hero-title">客户订单</p>
              <p class="hero-desc">实时查看、筛选并跟踪平台的所有订单。</p>
            </div>
            <div class="hero-meta">
              <span class="hero-user">Raffialdo Bayu</span>
              <span class="hero-role">平台管理员</span>
            </div>
          </header>

          <section class="surface-card orders-panel">
            <div class="panel-filters">
              <div class="search-field">
                <Search class="icon-sm" />
                <Input
                  v-model="searchTerm"
                  placeholder="搜索订单号、客户或产品"
                  class="search-input"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" class="status-button">
                    <span>状态：{{ statusFilter === 'all' ? '全部' : statusMeta[statusFilter].label }}</span>
                    <ChevronDown class="icon-sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-44 status-dropdown">
                  <DropdownMenuLabel>筛选状态</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    v-for="option in statusOptions"
                    :key="option.value"
                    class="cursor-pointer"
                    @click="setStatusFilter(option.value as 'all' | OrderStatus)"
                  >
                    {{ option.label }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" class="ghost-btn">
                <Filter class="icon-sm" />
                筛选
              </Button>
              <Button class="primary-btn">
                <Download class="icon-sm" />
                导出报表
              </Button>
            </div>

            <div class="orders-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单编号</TableHead>
                    <TableHead>客户</TableHead>
                    <TableHead>产品</TableHead>
                    <TableHead>出行日期</TableHead>
                    <TableHead class="text-right">金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead class="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="order in paginatedOrders" :key="order.id">
                    <TableCell>
                      <p class="order-no">{{ order.orderNo }}</p>
                    </TableCell>
                    <TableCell>
                      <div class="customer-cell">
                        <Avatar class="customer-avatar">
                          <AvatarImage :src="order.customerAvatar" :alt="order.customerName" />
                          <AvatarFallback>
                            {{ order.customerName.slice(0, 1) }}
                          </AvatarFallback>
                        </Avatar>
                        <span>{{ order.customerName }}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>{{ order.productName }}</p>
                    </TableCell>
                    <TableCell>
                      <p>{{ formatDate(order.departDate) }}</p>
                    </TableCell>
                    <TableCell class="text-right">
                      <p class="order-amount">￥{{ order.total.toLocaleString() }}</p>
                    </TableCell>
                    <TableCell>
                      <Badge :class="statusBadgeClass(order.status)">
                        {{ statusMeta[order.status].label }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="action-btn">
                            <MoreVertical class="icon-sm" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="orders-dropdown">
                          <DropdownMenuItem class="cursor-pointer">查看详情</DropdownMenuItem>
                          <DropdownMenuItem class="cursor-pointer">同步订单</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem class="text-destructive cursor-pointer">标记异常</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="paginatedOrders.length === 0">
                    <TableCell colspan="7" class="text-center text-sm text-muted-foreground">
                      暂无符合条件的订单
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <footer class="panel-footer">
              <p class="muted">{{ showingText }}</p>
              <Pagination
                v-model:page="currentPage"
                class="orders-pagination"
                :items-per-page="ORDERS_PER_PAGE"
                :total="filteredOrders.length"
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
                      :is-active="item.value === currentPage"
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
        </section>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.orders-shell {
  @apply bg-muted/20 text-sm text-foreground;
}

.orders-inset {
  @apply min-h-screen;
}

.orders-grid {
  @apply px-4 py-6 lg:px-10;
}

.orders-main {
  @apply flex flex-col gap-6;
}

.surface-card {
  @apply rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.orders-hero {
  @apply flex flex-col items-start justify-between gap-4 border border-border/60 lg:flex-row lg:items-center;
}

.hero-title {
  @apply text-3xl font-semibold;
}

.hero-desc {
  @apply text-sm text-muted-foreground;
}

.hero-meta {
  @apply text-right;
}

.hero-user {
  @apply block text-base font-semibold;
}

.hero-role {
  @apply text-sm text-muted-foreground;
}

.orders-panel {
  @apply flex flex-col gap-5 border border-border/50;
}

.panel-filters {
  @apply flex flex-wrap items-center gap-3;
}

.search-field {
  @apply flex flex-1 items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 min-w-[220px];
}

.search-input {
  @apply border-none bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0;
}

.status-button {
  @apply inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition;
  @apply hover:text-foreground data-[state=open]:border-primary data-[state=open]:bg-primary/5;
}

.ghost-btn {
  @apply inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground;
}

.primary-btn {
  @apply inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90;
}

.icon-sm {
  @apply size-4;
}

.orders-table {
  @apply overflow-hidden rounded-[28px] border border-border/40;
}

.order-no {
  @apply font-semibold text-foreground;
}

.customer-cell {
  @apply flex items-center gap-3;
}

.customer-avatar {
  @apply size-8;
}

.order-amount {
  @apply font-semibold text-foreground;
}

.status-badge {
  @apply inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold;
}

.status-badge--success {
  @apply bg-emerald-100 text-emerald-700;
}

.status-badge--info {
  @apply bg-sky-100 text-sky-700;
}

.status-badge--warning {
  @apply bg-amber-100 text-amber-700;
}

.status-badge--danger {
  @apply bg-rose-100 text-rose-700;
}

.action-btn {
  @apply text-muted-foreground hover:text-foreground;
}

:global(.orders-dropdown) {
  @apply rounded-2xl border border-border/40 bg-white p-1 text-sm shadow-lg;
}

:global(.status-dropdown) {
  @apply rounded-2xl border border-border/40 bg-white/95 p-2 text-sm shadow-lg;
}

.panel-footer {
  @apply flex flex-col gap-3 border-t border-border/40 pt-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between;
}

.orders-pagination {
  @apply !mx-0 !w-auto items-center gap-2;
}

.pagination-button {
  @apply inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-foreground disabled:opacity-40;
}

.pagination-number {
  @apply inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground;
}

.muted {
  @apply text-sm text-muted-foreground;
}
</style>
