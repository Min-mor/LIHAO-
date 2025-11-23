<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{ total: number; pageSize?: number; page?: number }>(), {
  pageSize: 10,
  page: 1,
})

const emit = defineEmits<{ (e: "update:page", value: number): void }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const currentPage = computed({
  get: () => Math.min(Math.max(props.page, 1), pageCount.value),
  set: (value: number) => emit("update:page", value),
})

const canPrev = computed(() => currentPage.value > 1)
const canNext = computed(() => currentPage.value < pageCount.value)

const visiblePages = computed(() => {
  const total = pageCount.value
  const current = currentPage.value
  const pages = new Set<number>()
  const windowSize = 5

  if (total <= windowSize) {
    for (let i = 1; i <= total; i += 1) pages.add(i)
    return [...pages]
  }

  pages.add(1)
  pages.add(total)
  pages.add(current)
  pages.add(current - 1)
  pages.add(current + 1)
  pages.add(2)
  pages.add(total - 1)

  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
})

const pageItems = computed(() => {
  const pages = visiblePages.value
  const items: Array<{ type: "page" | "ellipsis"; value?: number }> = []

  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i]
    items.push({ type: "page", value: page })
    if (i < pages.length - 1 && pages[i + 1] - page > 1) {
      items.push({ type: "ellipsis" })
    }
  }

  return items
})

const gotoPage = (next: number) => {
  const target = Math.min(Math.max(next, 1), pageCount.value)
  emit("update:page", target)
}
</script>

<template>
  <div class="pagination">
    <button type="button" class="pagination-btn" :disabled="!canPrev" @click="gotoPage(currentPage - 1)">
      上一页
    </button>
    <div class="pagination-pages">
      <template v-for="(item, index) in pageItems" :key="`${item.type}-${item.value ?? index}`">
        <button
          v-if="item.type === 'page' && item.value"
          type="button"
          class="pagination-btn"
          :class="{ 'pagination-btn--active': currentPage === item.value }"
          @click="gotoPage(item.value)"
        >
          {{ item.value }}
        </button>
        <span v-else class="pagination-ellipsis">…</span>
      </template>
    </div>
    <button type="button" class="pagination-btn" :disabled="!canNext" @click="gotoPage(currentPage + 1)">
      下一页
    </button>
  </div>
</template>

<style scoped>
@reference "../../../styles/global.css";
.pagination {
  @apply flex items-center gap-2;
}

.pagination-pages {
  @apply flex items-center gap-1;
}

.pagination-btn {
  @apply min-w-16 rounded-2xl border border-border px-3 py-2 text-center text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-50;
}

.pagination-btn--active {
  @apply border-primary bg-primary text-white hover:text-white;
}

.pagination-ellipsis {
  @apply px-2 text-muted-foreground;
}
</style>
