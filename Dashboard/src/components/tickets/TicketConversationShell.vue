<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import TicketWorkspace from "@/components/tickets/TicketWorkspace.vue"
import type { TicketRecord } from "@/mock/data/tickets"
import { ticketCenterMock } from "@/mock/data/tickets"
import type { TicketMessage } from "@/mock/data/ticketConversations"
import { ticketConversationMock } from "@/mock/data/ticketConversations"
import type { SupportConversationMeta } from "@/mock/data/supportConversations"
import { getSupportThread } from "@/mock/data/supportConversations"
import { readAuthSession } from "@/lib/auth"

type ConversationContext = "ticket" | "support"

const DEFAULT_ROLE: UserRole = "admin"

const props = withDefaults(
  defineProps<{
    context?: ConversationContext
    ticketId?: string
    threadId?: string
    role?: UserRole
    activePath?: string
  }>(),
  {
    context: "ticket" as ConversationContext,
    activePath: "/tickets",
  },
)

function resolveInitialRole() {
  if (typeof window === "undefined")
    return DEFAULT_ROLE
  return readAuthSession()?.role ?? DEFAULT_ROLE
}

const sessionRole = ref<UserRole>(resolveInitialRole())

const resolvedRole = computed<UserRole>(() => props.role ?? sessionRole.value)

const tickets = computed(() => ticketCenterMock[resolvedRole.value].tickets)

const ticketDetail = computed<TicketRecord | undefined>(() => {
  if (props.context !== "ticket" || !props.ticketId) return undefined
  return tickets.value.find((ticket) => ticket.id === props.ticketId)
})

const allTicketMessages = ref<TicketMessage[]>([...ticketConversationMock.messages])
const supportThread = ref<SupportConversationMeta>(getSupportThread(props.threadId))
const supportMessages = ref<TicketMessage[]>([...supportThread.value.messages])

watch(
  () => props.threadId,
  (next) => {
    supportThread.value = getSupportThread(next)
    supportMessages.value = [...supportThread.value.messages]
  },
)

const currentMessages = computed(() => {
  if (props.context === "support") {
    return supportMessages.value
  }
  if (!props.ticketId) return []
  return allTicketMessages.value.filter((message) => message.ticketId === props.ticketId)
})

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
  () => [props.context, props.ticketId, props.threadId],
  () => {
    scrollToBottom()
  },
  { immediate: true },
)

watch(
  () => currentMessages.value.length,
  () => scrollToBottom(),
)

const backPath = computed(() => (props.context === "support" ? "/support" : "/tickets"))

const inputPlaceholder = computed(() =>
  props.context === "support" ? "输入想反馈给平台管理员的内容..." : "输入需要回复的内容...",
)

const authorMeta = computed(() => {
  if (resolvedRole.value === "admin") {
    return {
      type: "agent" as TicketMessage["authorType"],
      name: "平台客服",
    }
  }
  return {
    type: "requester" as TicketMessage["authorType"],
    name: "商家用户",
  }
})

const headerCopy = computed(() =>
  props.context === "support"
    ? {
        title: "联系管理员",
        subtitle: "直接向平台管理员反馈问题或需求。",
        backLabel: "返回联系页面",
      }
    : {
        title: "工单对话",
        subtitle: "与客户保持顺畅沟通，追踪处理进度。",
        backLabel: "返回工单中心",
      },
)

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

const supportContact = computed(() => (props.context === "support" ? supportThread.value : null))

const handleSendMessage = async () => {
  const targetId = props.context === "support" ? supportThread.value.id : props.ticketId
  const content = newMessage.value.trim()
  if (!content || !targetId) return
  sending.value = true
  const payload: TicketMessage = {
    id: `local-${Date.now()}`,
    ticketId: targetId,
    authorType: authorMeta.value.type,
    authorName: authorMeta.value.name,
    timestamp: new Date().toLocaleString("zh-CN", { hour12: false }),
    content,
  }
  // TODO: 接入后端发送接口，替换本地 mock 追加逻辑
  if (props.context === "support") {
    supportMessages.value = [...supportMessages.value, payload]
  } else {
    allTicketMessages.value = [...allTicketMessages.value, payload]
  }
  newMessage.value = ""
  scrollToBottom()
  sending.value = false
}

const handleBackToList = () => {
  if (typeof window !== "undefined") {
    window.location.href = backPath.value
  }
}
</script>

<template>
  <TicketWorkspace :role="resolvedRole" :active-path="props.activePath">
    <header class="surface-card conversation-header">
      <div>
        <button class="link-button" type="button" @click="handleBackToList">{{ headerCopy.backLabel }}</button>
        <p class="conversation-title">{{ headerCopy.title }}</p>
        <p class="conversation-subtitle">{{ headerCopy.subtitle }}</p>
      </div>
      <div class="conversation-meta" v-if="props.context === 'ticket' && ticketDetail">
        <p class="conversation-ticket">{{ ticketDetail.ticketNo }}</p>
        <span :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>
      <div class="conversation-meta conversation-meta--support" v-else-if="supportContact">
        <p class="conversation-ticket">{{ supportContact.subject }}</p>
        <span class="ticket-badge ticket-badge--progress">{{ supportContact.channel }}</span>
      </div>
    </header>

    <section class="surface-card conversation-board">
      <template v-if="props.context === 'ticket'">
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
      </template>
      <template v-else>
        <div class="support-summary" v-if="supportContact">
          <div>
            <p class="summary-title">{{ supportContact.subject }}</p>
            <p class="support-summary__channel">沟通渠道：{{ supportContact.channel }}</p>
          </div>
          <div class="support-contact">
            <div>
              <p class="support-contact__name">{{ supportContact.contact.name }}</p>
              <p class="support-contact__role">{{ supportContact.contact.role }}</p>
            </div>
            <span class="support-contact__sla">SLA：{{ supportContact.contact.responseSla }}</span>
          </div>
        </div>
        <div v-else class="support-summary support-summary--empty">
          <p class="summary-title">暂未加载到管理员信息</p>
          <p class="text-sm text-muted-foreground">请稍后重试或联系平台运维。</p>
        </div>
      </template>

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
        <textarea v-model="newMessage" class="chat-textarea" rows="3" :placeholder="inputPlaceholder"></textarea>
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
  </TicketWorkspace>
</template>

<style scoped>
@reference "../../styles/global.css";
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

.conversation-meta--support {
  @apply items-start text-left lg:items-end lg:text-right;
}

.support-summary {
  @apply flex flex-col gap-3 rounded-3xl bg-slate-50/60 px-5 py-4 text-sm text-muted-foreground;
}

.support-summary__channel {
  @apply text-xs text-muted-foreground;
}

.support-summary--empty {
  @apply border border-dashed border-border/60 text-center;
}

.support-contact {
  @apply flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground;
}

.support-contact__name {
  @apply text-base font-semibold text-foreground;
}

.support-contact__role {
  @apply text-xs text-muted-foreground;
}

.support-contact__sla {
  @apply rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary;
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
