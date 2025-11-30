<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { BellRing, Filter, Pencil, Plus, Search, Trash2 } from "lucide-vue-next"
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { fetchProductList, updateProductStatus, type BackendProduct } from "@/config/api"
import {
  merchantProductsMock,
  type MerchantProduct,
  type ProductStatus,
} from "@/mock/data/products"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "merchant",
  activePath: "/products",
})

type MerchantProductEx = MerchantProduct & {
  description?: string
  hotelOrNo?: boolean
  hotel?: string | null
}

const products = ref<MerchantProductEx[]>(merchantProductsMock.list.map(product => ({ ...product })))
const ITEMS_PER_PAGE = 5
const currentPage = ref(1)

const searchTerm = ref("")
const statusFilter = ref<"all" | ProductStatus>("all")
const categoryFilter = ref<"all" | string>("all")
const showFilters = ref(false)

function mapBackendStatusToProductStatus(status: boolean): ProductStatus {
  return status ? "published" : "unpublished"
}

function buildInventoryFromStock(stock: number) {
  const tone: "default" | "warning" = stock <= 5 ? "warning" : "default"
  const label = tone === "warning" ? `仅剩 ${stock}` : `剩余 ${stock}`
  return { total: stock, label, tone }
}

function mapBackendProductToMerchant(product: BackendProduct): MerchantProductEx {
  return {
    id: String(product.id),
    name: product.name,
    sku: `TRIP-${product.id}`,
    cover: "",
    category: product.destination,
    price: product.price,
    inventory: buildInventoryFromStock(product.stock),
    status: mapBackendStatusToProductStatus(product.status),
    updatedAt: "",
    description: product.description,
    hotelOrNo: product.hotelOrNo,
    hotel: product.hotel,
  }
}

onMounted(async () => {
  try {
    const pageData = await fetchProductList({ page: 1, limit: 50 })
    const mapped = pageData.records.map(mapBackendProductToMerchant)
    products.value = mapped
  } catch (error) {
    console.warn("加载商品列表失败，使用本地 mock 数据作为兜底", error)
    products.value = merchantProductsMock.list.map(product => ({ ...product }))
  }
})

const filteredProducts = computed(() =>
  products.value.filter(product => {
    const search = searchTerm.value.trim().toLowerCase()
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.id.toLowerCase().includes(search)

    const status = product.status
    const matchesStatus = statusFilter.value === "all" ? true : status === statusFilter.value

    const category = product.category
    const matchesCategory = categoryFilter.value === "all" ? true : category === categoryFilter.value

    return matchesSearch && matchesStatus && matchesCategory
  }),
)

const totalProducts = computed(() => products.value.length)
const publishedCount = computed(() => products.value.filter(product => product.status === "published").length)
const draftCount = computed(() => products.value.filter(product => product.status === "unpublished").length)
const visibleCount = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(visibleCount.value / ITEMS_PER_PAGE)))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE)
})

const shownCount = computed(() => {
  const max = visibleCount.value
  const currentMax = currentPage.value * ITEMS_PER_PAGE
  return Math.min(currentMax, max)
})

const destinationOptions = computed(() => {
  const set = new Set<string>()
  products.value.forEach(product => {
    if (product.category)
      set.add(product.category)
  })
  return Array.from(set)
})

const statusOptions = computed(() => [
  { value: "published" as ProductStatus, label: "已上架" },
  { value: "unpublished" as ProductStatus, label: "已下架" },
])

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

async function handleStatusChange(product: MerchantProductEx, checked: boolean) {
  const previousStatus = product.status
  const nextStatus: ProductStatus = checked ? "published" : "unpublished"

  products.value = products.value.map(item =>
    item.id === product.id ? { ...item, status: nextStatus } : item,
  )

  const numericId = Number(product.id)
  if (Number.isNaN(numericId))
    return

  try {
    await updateProductStatus({ id: numericId, status: nextStatus === "published" })
  } catch (error) {
    console.warn("更新商品状态失败，回滚本地状态", error)
    products.value = products.value.map(item =>
      item.id === product.id ? { ...item, status: previousStatus } : item,
    )
  }
}

function deleteProduct(productId: string) {
  products.value = products.value.filter(product => product.id !== productId)
}

function inventoryToneClass(tone: "default" | "warning") {
  return tone === "warning" ? "text-destructive font-semibold" : "text-muted-foreground"
}

function statusBadgeClass(status: ProductStatus) {
  return status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
}

function resetFilters() {
  searchTerm.value = ""
  statusFilter.value = "all"
  categoryFilter.value = "all"
}
</script>

<template>
  <SidebarProvider class="products-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="products-inset">
      <div class="products-grid">
        <div class="products-main">
          <section class="surface-card welcome-card">
            <div class="welcome-body">
              <div class="welcome-header">
                <div>
                  <p class="welcome-title">您好，商家伙伴！</p>
                  <p class="welcome-desc">欢迎回来，关注最新销售走势。</p>
                </div>
                <button class="notify-button" type="button">
                  <BellRing class="icon-md" />
                  <span class="notify-dot" />
                </button>
              </div>
              <div class="search-row">
                <div class="search-input-wrapper">
                  <Search class="icon-sm text-muted-foreground" />
                  <input
                    v-model="searchTerm"
                    type="search"
                    placeholder="搜索目的地、订单等"
                    class="search-input"
                  />
                </div>
                <button class="filter-btn" type="button" @click="showFilters = !showFilters">
                  <Filter class="icon-sm" />
                  筛选
                </button>
                <button class="primary-btn" type="button">
                  搜索
                </button>
              </div>
            </div>
          </section>

          <section v-if="showFilters" class="surface-card filter-panel">
            <div class="filter-grid">
              <label class="filter-field">
                <span>目的地</span>
                <select v-model="categoryFilter" class="filter-select">
                  <option value="all">全部</option>
                  <option v-for="category in destinationOptions" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </label>
              <label class="filter-field">
                <span>发布状态</span>
                <select v-model="statusFilter" class="filter-select">
                  <option value="all">全部</option>
                  <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </label>
            </div>
            <div class="filter-actions">
              <button class="ghost-btn" type="button" @click="resetFilters">重置</button>
              <button class="primary-btn" type="button" @click="showFilters = false">完成</button>
            </div>
          </section>

          <section class="surface-card product-toolbar">
            <div>
              <p class="toolbar-title">商品管理</p>
              <p class="toolbar-subtitle">添加、编辑并管理您的旅行商品。</p>
            </div>
            <div class="toolbar-actions">
              <button class="ghost-btn" type="button">
                <Filter class="icon-sm" />
                高级筛选
              </button>
              <button class="primary-btn" type="button">
                <Plus class="icon-sm" />
                新建商品
              </button>
            </div>
          </section>

          <section class="surface-card product-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[280px] text-left">
                    <div class="table-head-cell">
                      <input type="checkbox" class="table-checkbox" />
                      <span>产品名称</span>
                    </div>
                  </TableHead>
                  <TableHead class="text-left w-[140px]">目的地</TableHead>
                  <TableHead class="text-left w-32">价格</TableHead>
                  <TableHead class="text-left w-32">库存</TableHead>
                  <TableHead class="text-left w-40">状态</TableHead>
                  <TableHead class="text-right w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="product in paginatedProducts" :key="product.id" class="product-row">
                  <TableCell class="product-cell product-cell--name">
                    <div class="table-product">
                      <input type="checkbox" class="table-checkbox" />
                      <div class="product-info">
                        <div class="product-media">
                          <img v-if="product.cover" :src="product.cover" :alt="product.name" />
                          <div v-else class="product-avatar-fallback">
                            {{ product.name?.[0] || "旅" }}
                          </div>
                        </div>
                        <div>
                          <p class="product-name">{{ product.name }}</p>
                          <p class="product-meta">编号：#{{ product.id }}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell class="product-cell product-cell--category">
                    <p class="product-category">{{ product.category }}</p>
                  </TableCell>
                  <TableCell class="product-cell product-cell--price">
                    <p class="product-price">￥{{ product.price.toFixed(2) }}</p>
                  </TableCell>
                  <TableCell class="product-cell product-cell--inventory">
                    <p :class="inventoryToneClass(product.inventory.tone)">{{ product.inventory.label }}</p>
                  </TableCell>
                  <TableCell class="product-cell product-cell--status">
                    <div class="status-cell">
                      <span class="status-badge" :class="statusBadgeClass(product.status)">
                        {{ product.status === 'published' ? '已发布' : '未发布' }}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell class="product-cell product-cell--actions">
                    <div class="table-actions">
                      <Switch
                        class="table-switch"
                        :model-value="product.status === 'published'"
                        @update:model-value="($event: boolean) => handleStatusChange(product, $event)"
                      />
                      <button class="icon-button" type="button">
                        <Pencil class="icon-sm" />
                      </button>
                      <button class="icon-button icon-button--danger" type="button" @click="deleteProduct(product.id)">
                        <Trash2 class="icon-sm" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <footer class="table-footer">
              <p>显示 {{ shownCount }} / {{ visibleCount }} 个商品</p>
              <Pagination
                v-model:page="currentPage"
                class="pagination !mx-0 !w-auto"
                :items-per-page="ITEMS_PER_PAGE"
                :total="visibleCount"
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
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.products-shell {
  @apply bg-muted/20 text-sm text-foreground;
}

.products-inset {
  @apply min-h-screen;
}

.products-grid {
  @apply px-4 py-6 lg:px-10;
}

.products-main {
  @apply flex flex-col gap-6;
}

.surface-card {
  @apply rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-black/5;
}

.welcome-card {
  @apply px-7 py-6;
}

.welcome-body {
  @apply flex flex-col gap-4;
}

.welcome-header {
  @apply flex flex-wrap items-center justify-between gap-4;
}

.welcome-title {
  @apply text-3xl font-semibold text-foreground;
}

.welcome-desc {
  @apply text-base text-muted-foreground;
}

.notify-button {
  @apply relative flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground;
}

.notify-dot {
  @apply absolute -right-0.5 -top-0.5 inline-flex size-3 rounded-full bg-destructive;
}

.search-row {
  @apply flex flex-wrap items-center gap-3;
}

.search-input-wrapper {
  @apply flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-5 py-3;
}

.search-input {
  @apply w-full bg-transparent text-base outline-none placeholder:text-muted-foreground;
}

.filter-btn {
  @apply inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground;
}

.primary-btn {
  @apply inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90;
}

.icon-md {
  @apply size-5;
}

.icon-sm {
  @apply size-4;
}

.filter-panel {
  @apply space-y-4;
}

.filter-grid {
  @apply grid gap-4 md:grid-cols-2;
}

.filter-field {
  @apply flex flex-col gap-2 text-sm font-medium text-muted-foreground;
}

.filter-select {
  @apply rounded-2xl border border-border bg-transparent px-4 py-2 text-sm text-foreground;
}

.filter-actions {
  @apply flex justify-end gap-3;
}

.product-toolbar {
  @apply flex flex-wrap items-center gap-4;
}

.toolbar-title {
  @apply text-2xl font-semibold;
}

.toolbar-subtitle {
  @apply text-sm text-muted-foreground;
}

.toolbar-stats {
  @apply flex flex-wrap gap-3 text-xs uppercase text-muted-foreground;
}

.toolbar-actions {
  @apply ml-auto flex gap-3;
}

.product-table {
  @apply p-0;
}

.table-head-cell {
  @apply flex items-center gap-3;
}

.table-checkbox {
  @apply size-4 rounded border border-border;
}


.table-product {
  @apply flex items-center gap-4;
}

.product-info {
  @apply flex items-center gap-3;
}

.product-media {
  @apply flex items-center justify-center;
}

.product-info img {
  @apply size-12 rounded-2xl object-cover;
}

.product-avatar-fallback {
  @apply flex size-12 items-center justify-center rounded-2xl bg-muted text-base font-semibold text-muted-foreground;
}

.product-name {
  @apply text-sm font-semibold text-foreground;
}

.product-meta {
  @apply text-xs text-muted-foreground;
}

.product-category {
  @apply text-sm text-muted-foreground;
}

.product-price {
  @apply text-base font-semibold text-foreground;
}

.status-badge {
  @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold;
}


.status-cell {
  @apply flex items-center gap-3;
}

.table-actions {
  @apply flex items-center justify-end gap-3;
}

.table-switch {
  @apply shrink-0;
}

.icon-button {
  @apply inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground;
}

.icon-button--danger {
  @apply border-destructive/40 text-destructive hover:bg-destructive/10;
}

.table-footer {
  @apply flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm text-muted-foreground;
}

.pagination {
  @apply inline-flex items-center gap-2;
}

.pagination-index {
  @apply inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary;
}

.ghost-btn {
  @apply inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground;
}

.primary-btn {
  @apply inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90;
}
</style>
