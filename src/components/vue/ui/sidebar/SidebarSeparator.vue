<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@vue/lib/utils'
import { Separator } from '@vue/ui/separator'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <Separator
    data-sidebar="separator"
    :class="cn('mx-2 w-auto bg-sidebar-border', props.class)"
  >
    <slot />
  </Separator>
</template>
