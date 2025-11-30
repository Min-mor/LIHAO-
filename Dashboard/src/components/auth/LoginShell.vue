<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from "vue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  loginOrRegisterWithCode,
  loginWithPassword,
  sendVerificationCode,
} from "@/config/api"
import type { UserRole } from "@/components/dashboard/types"
import { writeAuthSession, type AuthSession } from "@/lib/auth"

interface AuthResult {
  token: string
  role: UserRole
  isNew?: boolean
  /** 展示名称（昵称/商家名），来源于后端登录返回 */
  displayName?: string
  /** 头像链接，可选 */
  avatar?: string | null
}

const props = withDefaults(
  defineProps<{
    redirectOnSuccess?: boolean
  }>(),
  {
    redirectOnSuccess: true,
  },
)

const emit = defineEmits<{
  (e: "login-success", payload: AuthSession): void
}>()

const loginMode = ref<"code" | "password">("code")
const loading = ref(false)
const countdown = ref(0)
const status = reactive<{ type: "success" | "error" | ""; message: string }>({
  type: "",
  message: "",
})

const form = reactive({
  phone: "",
  code: "",
  password: "",
})

const phoneRegex = /^1\d{10}$/
const isCodeMode = computed(() => loginMode.value === "code")
const phoneValid = computed(() => phoneRegex.test(form.phone))

let timer: ReturnType<typeof setInterval> | null = null

function resetStatus() {
  status.type = ""
  status.message = ""
}

function showStatus(type: "success" | "error", message: string) {
  status.type = type
  status.message = message
}

function startCountdown() {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

async function handleSendCode() {
  resetStatus()
  if (!phoneValid.value) {
    showStatus("error", "请输入正确的手机号")
    return
  }
  if (countdown.value > 0) return
  try {
    const res = await sendVerificationCode(form.phone)
    showStatus("success", res?.message ?? "验证码已发送")
    startCountdown()
  } catch (error) {
    showStatus("error", error instanceof Error ? error.message : "验证码发送失败")
  }
}

function handleAuthSuccess(result: AuthResult) {
  const sessionPayload: AuthSession = {
    token: result.token,
    role: result.role,
    phone: form.phone,
    isNew: result.isNew,
    displayName: result.displayName,
    avatar: result.avatar,
  }
  writeAuthSession(sessionPayload)
  emit("login-success", sessionPayload)

  if (props.redirectOnSuccess && typeof window !== "undefined") {
    window.location.href = "/"
  }
}

async function handleSubmit() {
  resetStatus()
  if (!phoneValid.value) {
    showStatus("error", "请输入正确的手机号")
    return
  }
  loading.value = true
  try {
    if (isCodeMode.value) {
      if (!form.code) {
        showStatus("error", "请输入验证码")
        loading.value = false
        return
      }
      const res = await loginOrRegisterWithCode({ phone: form.phone, code: form.code })
      showStatus("success", res.isNew ? "注册成功，已自动登录" : "登录成功")
      handleAuthSuccess(res)
    } else {
      if (!form.password) {
        showStatus("error", "请输入密码")
        loading.value = false
        return
      }
      const res = await loginWithPassword({ phone: form.phone, password: form.password })
      showStatus("success", "登录成功")
      handleAuthSuccess(res)
    }
  } catch (error) {
    showStatus("error", error instanceof Error ? error.message : "登录失败，请稍后再试")
  } finally {
    loading.value = false
  }
}

function switchMode(mode: "code" | "password") {
  if (loginMode.value === mode) return
  loginMode.value = mode
  form.code = ""
  form.password = ""
  resetStatus()
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="auth-page">
    <section class="auth-hero">
      <div class="hero-inner">
        <p class="hero-badge">Trip 商家平台</p>
        <h1>让生意更高效</h1>
        <p class="hero-desc">
          通过智能数据与营销工具，帮助商家实时掌握门店运营表现。
        </p>
      </div>
    </section>
    <section class="auth-panel">
      <div class="auth-card">
        <header class="card-header">
          <div>
            <p class="card-title">登录商家中心</p>
            <p class="card-subtitle">默认手机号验证码登录，可切换密码方式</p>
          </div>
          <div class="mode-toggle">
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--active': isCodeMode }"
              type="button"
              @click="switchMode('code')"
            >
              手机号登录
            </button>
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--active': !isCodeMode }"
              type="button"
              @click="switchMode('password')"
            >
              密码登录
            </button>
          </div>
        </header>
        <form class="card-body" @submit.prevent="handleSubmit">
          <label class="field-label" for="phone">手机号</label>
          <Input
            id="phone"
            v-model="form.phone"
            placeholder="请输入 11 位手机号"
            type="tel"
            autocomplete="tel"
          />

          <template v-if="isCodeMode">
            <label class="field-label" for="code">验证码</label>
            <div class="code-row">
              <Input
                id="code"
                v-model="form.code"
                placeholder="短信验证码"
                inputmode="numeric"
                autocomplete="one-time-code"
              />
              <Button
                type="button"
                variant="outline"
                :disabled="!phoneValid || countdown > 0"
                @click="handleSendCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </Button>
            </div>
          </template>

          <template v-else>
            <label class="field-label" for="password">密码</label>
            <Input
              id="password"
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              autocomplete="current-password"
            />
            <p class="field-tip">密码登录仅限管理员或已设置密码的商家</p>
          </template>

          <Button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '处理中...' : isCodeMode ? '验证码登录/注册' : '密码登录' }}
          </Button>

          <p v-if="status.message" class="status-text" :class="status.type">
            {{ status.message }}
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "../../styles/global.css";
.auth-page {
  @apply min-h-screen flex flex-col bg-primary text-white lg:flex-row;
  font-family: 'Noto Serif SC', 'Noto Sans SC', system-ui, -apple-system, BlinkMacSystemFont;
}

.auth-hero {
  @apply flex-1 flex items-center justify-center px-10 py-16;
  background: linear-gradient(135deg, #20b970 0%, #1a9a60 100%);
}

.hero-inner {
  @apply max-w-md space-y-4;
}

.hero-badge {
  @apply inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm uppercase tracking-widest;
}

.hero-inner h1 {
  @apply text-4xl font-semibold text-white;
}

.hero-desc {
  @apply text-white/80 text-base leading-relaxed;
}

.auth-panel {
  @apply flex flex-1 items-center justify-center bg-white px-6 py-12 text-foreground;
}

.auth-card {
  @apply w-full max-w-md rounded-[32px] border border-border bg-white/95 p-8 shadow-lg;
}

.card-header {
  @apply flex flex-col gap-4;
}

.card-title {
  @apply text-2xl font-semibold text-foreground;
}

.card-subtitle {
  @apply text-sm text-muted-foreground;
}

.mode-toggle {
  @apply inline-flex rounded-2xl bg-muted p-1;
}

.toggle-btn {
  @apply rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition;
}

.toggle-btn--active {
  @apply bg-white text-primary shadow-sm;
}

.card-body {
  @apply mt-6 flex flex-col gap-3;
}

.field-label {
  @apply text-sm font-medium text-muted-foreground;
}

.code-row {
  @apply flex items-center gap-2;
}

.field-tip {
  @apply text-xs text-muted-foreground;
}

.submit-btn {
  @apply mt-4 h-11 rounded-xl text-base font-semibold;
}

.status-text {
  @apply text-sm;
}

.status-text.success {
  @apply text-emerald-600;
}

.status-text.error {
  @apply text-destructive;
}

@media (max-width: 1023px) {
  .auth-page {
    @apply bg-white text-foreground;
  }
  .auth-hero {
    @apply hidden;
  }
  .auth-panel {
    @apply w-full px-4 py-10 bg-[--background];
  }
}
</style>
