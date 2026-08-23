<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  NDrawer, NDrawerContent,
  NTag, NButton, NSpace, NSpin, NImage,
} from 'naive-ui'
import { Edit } from '@vicons/carbon'
import api from '@/services/api'
import type { ScModule } from '@/types/system-creator'

const props = defineProps<{
  visible: boolean
  entityId: number | null
  module: ScModule
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'edit', item: any): void
}>()

const item = ref<any | null>(null)
const loading = ref(false)

watch(() => props.visible, async (val) => {
  if (val && props.entityId) {
    loading.value = true
    try {
      const { data } = await api.get(`/generated/${props.module.name}/${props.entityId}`)
      item.value = data
    } catch {
      item.value = null
    } finally {
      loading.value = false
    }
  }
})

function resolveImageUrl(val: string): string {
  if (!val) return ''
  if (val.startsWith('http') || val.startsWith('/api/')) return val
  return `/api/storage/general/${val}`
}
</script>

<style scoped>
.detail-view {
  display: flex;
  flex-direction: column;
}

.detail-field {
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.detail-field:last-child {
  border-bottom: none;
}

.detail-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 4px;
}

.detail-value {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.5;
  word-break: break-word;
}

.detail-value--text {
  font-weight: 400;
  color: #334155;
}

.detail-value--mono {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 13px;
}
</style>

<template>
  <NDrawer :show="visible" @update:show="(v) => emit('update:visible', v)" :width="400">
    <NDrawerContent :title="`${module.label} Detail`">
      <NSpin :show="loading">
        <div v-if="item" class="detail-view">
          <div class="detail-field">
            <span class="detail-label">ID</span>
            <span class="detail-value">{{ item.id }}</span>
          </div>

          <template v-for="field in module.fieldsConfig" :key="field.name">
            <div class="detail-field">
              <span class="detail-label">{{ field.label }}</span>

              <template v-if="field.type === 'boolean'">
                <NTag size="small" :type="item[field.name] ? 'success' : 'error'" round>
                  {{ item[field.name] ? 'Yes' : 'No' }}
                </NTag>
              </template>

              <template v-else-if="field.type === 'image' && item[field.name]">
                <NImage
                  :src="resolveImageUrl(item[field.name])"
                  width="128"
                  height="128"
                  object-fit="cover"
                  style="border-radius: 4px;"
                  :fallback-src="'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22128%22 height=%22128%22/%3E%3Ctext x=%2264%22 y=%2264%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%2394a3b8%22 font-size=%2212%22%3ENo Image%3C/text%3E%3C/svg%3E'"
                />
              </template>

              <template v-else-if="field.type === 'select-relation' && item[field.name]">
                <NTag size="small" type="info" round>
                  {{ item[field.name][field.relationLabel || 'name'] ?? '-' }}
                </NTag>
              </template>

              <template v-else-if="field.type === 'multiple-select-relation' && item[field.name]?.length">
                <NSpace :size="4">
                  <NTag v-for="(rel, idx) in item[field.name]" :key="idx" size="small" type="info" round>
                    {{ rel[field.relationLabel || 'name'] ?? '-' }}
                  </NTag>
                </NSpace>
              </template>

              <template v-else-if="field.type === 'date' && item[field.name]">
                <span class="detail-value detail-value--mono">
                  {{ new Date(item[field.name]).toLocaleDateString() }}
                </span>
              </template>

              <template v-else-if="field.type === 'datetime' && item[field.name]">
                <span class="detail-value detail-value--mono">
                  {{ new Date(item[field.name]).toLocaleString() }}
                </span>
              </template>

              <template v-else-if="field.type === 'json' && item[field.name]">
                <span class="detail-value detail-value--mono detail-value--text">
                  {{ typeof item[field.name] === 'string' ? item[field.name] : JSON.stringify(item[field.name], null, 2) }}
                </span>
              </template>

              <template v-else-if="field.type === 'file' && item[field.name]">
                <NButton size="small" text tag="a" :href="item[field.name]" target="_blank">
                  Download
                </NButton>
              </template>

              <template v-else-if="field.type === 'url' && item[field.name]">
                <NButton size="small" text tag="a" :href="item[field.name]" target="_blank">
                  {{ item[field.name] }}
                </NButton>
              </template>

              <template v-else>
                <span class="detail-value">{{ item[field.name] ?? '-' }}</span>
              </template>
            </div>
          </template>

          <div class="detail-field">
            <span class="detail-label">Created At</span>
            <span class="detail-value detail-value--mono">{{ item.createdAt ? new Date(item.createdAt).toLocaleString() : '-' }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Updated At</span>
            <span class="detail-value detail-value--mono">{{ item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-' }}</span>
          </div>
        </div>
      </NSpin>
      <template #footer>
        <NSpace>
          <NButton type="primary" @click="item && emit('edit', item)">
            <template #icon><Edit /></template>
            Edit
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
