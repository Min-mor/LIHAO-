<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { TicketRecord } from "@/mock/data/tickets"
import { ticketCenterMock } from "@/mock/data/tickets"
import type { TicketMessage } from "@/mock/data/ticketConversations"
import { ticketConversationMock } from "@/mock/data/ticketConversations"

const props = withDefaults(defineProps<{ ticketId: string; role?: UserRole; activePath?: string }>(), {
  role: "admin",
  activePath: "/tickets",
})

const tickets = ticketCenterMock.tickets

const ticketDetail = computed<TicketRecord | undefined>(() => tickets.find((ticket) => ticket.id === props.ticketId))

const allMessages = ref<TicketMessage[]>([...ticketConversationMock.messages])

const currentMessages = computed(() => allMessages.value.filter((message) => message.ticketId === props.ticketId))

const newMessage = ref("")
const sending = ref(false)

const chatContainer = ref<HTMLDivElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

watch(
  () => props.ticketId,
  () => {
    scrollToBottom()
  },
  { immediate: true },
)

watch(
  () => currentMessages.value.length,
  () => scrollToBottom(),
)

const handleSendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content || !ticketDetail.value) return
  sending.value = true
  const payload: TicketMessage = {
    id: `local-${Date.now()}`,
    ticketId: props.ticketId,
    authorType: "agent",
    authorName: "平台客服",
    timestamp: new Date().toLocaleString("zh-CN", { hour12: false }),
    content,
  }
  allMessages.value = [...allMessages.value, payload]
  newMessage.value = ""
  scrollToBottom()
  sending.value = false
}

const handleBackToList = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/tickets"
  }
}

const statusBadgeClass = computed(() => {
  switch (ticketDetail.value?.status) {
    case "pending":
      return "ticket-badge ticket-badge--pending"
    case "processing":
      return "ticket-badge ticket-badge--progress"
    case "completed":
      return "ticket-badge ticket-badge--completed"
    default:
      return "ticket-badge"
  }
})

const statusLabel = computed(() => {
  switch (ticketDetail.value?.status) {
    case "pending":
      return "待处理"
    case "processing":
      return "处理中"
    case "completed":
      return "已完成"
    default:
      return "--"
  }
})
</script>

<template>
  <SidebarProvider class="ticket-conversation-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="ticket-conversation-inset">
      <div class="ticket-conversation-grid">
        <section class="ticket-conversation-main">
          <header class="surface-card conversation-header">
            <div>
              <button class="link-button" type="button" @click="handleBackToList">返回工单中心</button>
              <p class="conversation-title">工单对话</p>
              <p class="conversation-subtitle">与客户保持顺畅沟通，追踪处理进度。</p>
            </div>
            <div class="conversation-meta" v-if="ticketDetail">
              <p class="conversation-ticket">{{ ticketDetail.ticketNo }}</p>
              <span :class="statusBadgeClass">{{ statusLabel }}</span>
            </div>
          </header>

          <section class="surface-card conversation-board">
            <div class="ticket-summary" v-if="ticketDetail">
              <div>
                <p class="summary-title">{{ ticketDetail.description }}</p>
                <div class="summary-info">
                  <span>{{ ticketDetail.issueType }}</span>
                  <span>{{ ticketDetail.serviceType }}</span>
                </div>
              </div>
              <div class="summary-meta">
                <p>提单人：{{ ticketDetail.requester }}</p>
                <p>创建时间：{{ ticketDetail.createdAt }}</p>
              </div>
            </div>
            <div v-else class="ticket-summary ticket-summary--empty">
              <p class="summary-title">未找到对应工单</p>
              <p class="text-sm text-muted-foreground">请返回工单中心重新选择。</p>
            </div>

            <div ref="chatContainer" class="chat-panel">
              <template v-if="currentMessages.length">
                <div
                  v-for="message in currentMessages"
                  :key="message.id"
                  :class="['chat-message', message.authorType === 'agent' ? 'chat-message--agent' : 'chat-message--requester']"
                >
                  <div class="chat-bubble">
                    <p class="chat-author">{{ message.authorName }}</p>
                    <p class="chat-content">{{ message.content }}</p>
                    <p class="chat-timestamp">{{ message.timestamp }}</p>
                  </div>
                </div>
              </template>
              <div v-else class="chat-empty">
                <p>暂无对话记录，欢迎发送第一条消息。</p>
              </div>
            </div>

            <div class="chat-input-area">
              <textarea
                v-model="newMessage"
                class="chat-textarea"
                rows="3"
                placeholder="输入需要回复的内容..."
              ></textarea>
              <button
                type="button"
                class="primary-btn chat-send"
                :disabled="!newMessage.trim() || sending"
                @click="handleSendMessage"
              >
                发送
              </button>
            </div>
          </section>
        </section>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.ticket-conversation-shell {
  @apply bg-muted/30 text-sm text-foreground;
}

.ticket-conversation-inset {
  @apply min-h-screen;
}

.ticket-conversation-grid {
  @apply flex min-h-screen justify-center px-4 py-6 lg:px-12;
}

.ticket-conversation-main {
  @apply flex w-full max-w-5xl flex-col gap-5;
}

.surface-card {
  @apply rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.conversation-header {
  @apply flex flex-col gap-3 border border-border/60 lg:flex-row lg:items-center lg:justify-between;
}

.conversation-title {
  @apply text-2xl font-semibold;
}

.conversation-subtitle {
  @apply text-sm text-muted-foreground;
}

.conversation-meta {
  @apply flex flex-col items-start gap-2 text-sm text-muted-foreground lg:items-end;
}

.conversation-ticket {
  @apply text-base font-semibold text-foreground;
}

.ticket-badge {
  @apply rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground;
}

.ticket-badge--pending {
  @apply bg-amber-100 text-amber-700;
}

.ticket-badge--progress {
  @apply bg-sky-100 text-sky-700;
}

.ticket-badge--completed {
  @apply bg-emerald-100 text-emerald-700;
}

.conversation-board {
  @apply flex flex-col gap-5 border border-border/60;
}

.ticket-summary {
  @apply flex flex-col gap-2 rounded-3xl bg-slate-50/60 px-5 py-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between;
}

.summary-title {
  @apply text-base font-semibold text-foreground;
}

.summary-info {
  @apply flex flex-wrap items-center gap-2 text-xs uppercase text-muted-foreground;
}

.summary-meta {
  @apply text-xs text-muted-foreground lg:text-right;
}

.chat-panel {
  @apply flex max-h-[520px] flex-col gap-4 overflow-y-auto rounded-3xl bg-background/80 px-6 py-6;
}

.chat-message {
  @apply flex;
}

.chat-message--agent {
  @apply justify-end text-right;
}

.chat-message--requester {
  @apply justify-start text-left;
}

.chat-bubble {
  @apply max-w-[85%] rounded-3xl border border-border/60 bg-white px-4 py-3 text-sm shadow-sm;
}

.chat-message--agent .chat-bubble {
  @apply border-primary/30 bg-primary/5;
}

.chat-author {
  @apply text-xs font-semibold uppercase text-muted-foreground;
}

.chat-content {
  @apply mt-1 whitespace-pre-line text-base text-foreground;
}

.chat-timestamp {
  @apply mt-2 text-xs text-muted-foreground;
}

.chat-empty {
  @apply py-16 text-center text-muted-foreground;
}

.chat-input-area {
  @apply flex flex-col gap-3 rounded-3xl border border-dashed border-border/60 bg-white/60 px-5 py-4 shadow-inner;
}

.chat-textarea {
  @apply w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-base outline-none placeholder:text-muted-foreground;
}

.chat-send {
  @apply self-end px-6 py-2;
}

.link-button {
  @apply text-sm text-primary hover:underline;
}
</style>
