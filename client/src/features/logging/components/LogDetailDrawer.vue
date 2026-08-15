<script setup lang="ts">
import {
  NDrawer, NDrawerContent, NCode, NButton, NSpace, NIcon, NTag,
} from 'naive-ui'
import { Launch, Copy, Document } from '@vicons/carbon'
import type { LogEntry } from '@/types/system-log'
import LogLevelBadge from './LogLevelBadge.vue'

const props = defineProps<{
  visible: boolean
  entry: LogEntry | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

function openInVSCode(path?: string, line?: number) {
  if (!path) return
  const uri = line ? `vscode://file/${path}:${line}` : `vscode://file/${path}`
  window.open(uri, '_blank')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <NDrawer :show="visible" @update:show="emit('update:visible', $event)" :width="520" placement="right">
    <NDrawerContent title="Log Detail">
      <template v-if="entry">
        <div class="space-y-5">
          <!-- Header: Level + Timestamp -->
          <div class="flex items-center justify-between">
            <LogLevelBadge :level="entry.level" size="medium" />
            <span class="text-xs text-gray-400 font-mono">{{ entry.timestamp }}</span>
          </div>

          <!-- Context -->
          <div>
            <div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Context</div>
            <NTag size="small" :bordered="false" type="info">{{ entry.context }}</NTag>
          </div>

          <!-- Message -->
          <div>
            <div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Message</div>
            <div class="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap break-all leading-relaxed">
              {{ entry.message }}
            </div>
          </div>

          <!-- Stack Trace -->
          <div v-if="entry.stackTrace">
            <div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Stack Trace</div>
            <div class="bg-gray-900 rounded-lg p-3 overflow-x-auto">
              <NCode :code="entry.stackTrace" language="typescript" class="text-xs" />
            </div>
          </div>

          <!-- Raw Line -->
          <div v-if="entry.rawLine">
            <div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Raw Line</div>
            <div class="bg-gray-50 rounded-lg p-3 overflow-x-auto">
              <NCode :code="entry.rawLine" class="text-xs" />
            </div>
          </div>

          <!-- Code Link Actions -->
          <div v-if="entry.codePath" class="pt-2 border-t border-gray-100">
            <div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Source Code</div>
            <div class="text-xs text-gray-500 font-mono mb-2 truncate" :title="entry.codePath">
              {{ entry.codePath }}<template v-if="entry.codeLine">:{{ entry.codeLine }}</template>
            </div>
            <NSpace :size="8">
              <NButton size="small" type="primary" secondary @click="openInVSCode(entry.codePath, entry.codeLine)">
                <template #icon><NIcon><Launch /></NIcon></template>
                Open in VS Code
              </NButton>
              <NButton size="small" @click="copyToClipboard(entry.codePath!)">
                <template #icon><NIcon><Copy /></NIcon></template>
                Copy Path
              </NButton>
              <NButton v-if="entry.codeLine" size="small" @click="copyToClipboard(String(entry.codeLine!))">
                <template #icon><NIcon><Document /></NIcon></template>
                Line {{ entry.codeLine }}
              </NButton>
            </NSpace>
          </div>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
