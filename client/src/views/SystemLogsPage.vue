<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <n-card title="System Logs">
      <template #header-extra>
        <n-space>
          <n-select
            v-model:value="selectedFile"
            placeholder="Select log file"
            :options="fileOptions"
            style="width: 250px"
            @update:value="handleFileChange"
          />
          <n-select
            v-model:value="filterLevel"
            placeholder="Level"
            clearable
            :options="levelOptions"
            style="width: 120px"
            @update:value="handleFilter"
          />
          <n-button @click="handleRefresh" :loading="loading">
            Refresh
          </n-button>
        </n-space>
      </template>

      <n-space v-if="stats" style="margin-bottom: 16px">
        <n-statistic label="Total Entries" :value="stats.total" />
        <n-statistic v-for="(count, level) in stats.byLevel" :key="level" :label="String(level)" :value="count" />
      </n-space>

      <n-data-table
        :columns="logColumns"
        :data="logEntries"
        :loading="loading"
        :max-height="600"
        :scroll-x="1200"
        striped
      />

      <n-space v-if="stats && stats.total > logEntries.length" justify="center" style="margin-top: 16px">
        <n-pagination
          v-model:page="currentPage"
          :page-count="Math.ceil(stats.total / pageSize)"
          @update:page="handlePageChange"
        />
      </n-space>
    </n-card>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed } from 'vue';
import {
  NCard, NDataTable, NSelect, NSpace, NTag, NStatistic, NPagination, NButton,
} from 'naive-ui';
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue';
import { systemLogService } from '@/services/system-log.service';
import { useAuthStore } from '@/stores/auth.store';
import type { LogEntry, SystemLogFile, SystemLogStats } from '@/types/system-log';
import type { DataTableColumns } from 'naive-ui';

const authStore = useAuthStore();
const files = ref<SystemLogFile[]>([]);
const selectedFile = ref<string | null>(null);
const logEntries = ref<LogEntry[]>([]);
const stats = ref<SystemLogStats | null>(null);
const loading = ref(false);
const filterLevel = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(100);

const fileOptions = computed(() =>
  files.value.map((f) => ({
    label: `${f.filename} (${(f.size / 1024).toFixed(1)} KB)`,
    value: f.filename,
  })),
);

const levelOptions = [
  { label: 'INFO', value: 'INFO' },
  { label: 'WARN', value: 'WARN' },
  { label: 'ERROR', value: 'ERROR' },
  { label: 'DEBUG', value: 'DEBUG' },
  { label: 'TRACE', value: 'TRACE' },
];

const getLevelType = (level: string) => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'default',
    TRACE: 'default',
  };
  return map[level] || 'default';
};

const logColumns: DataTableColumns<LogEntry> = [
  { title: 'Timestamp', key: 'timestamp', width: 220 },
  {
    title: 'Level',
    key: 'level',
    width: 80,
    render(row) {
      return h(NTag, { type: getLevelType(row.level), size: 'small' }, { default: () => row.level });
    },
  },
  { title: 'Context', key: 'context', width: 150 },
  { title: 'Message', key: 'message', ellipsis: { tooltip: true } },
];

const fetchFiles = async () => {
  try {
    const response = await systemLogService.getFiles();
    files.value = response.data;
    if (files.value.length > 0 && !selectedFile.value) {
      selectedFile.value = files.value[0].filename;
      fetchContent();
    }
  } catch (error) {
    console.error('Failed to fetch log files:', error);
  }
};

const fetchContent = async () => {
  if (!selectedFile.value) return;

  loading.value = true;
  try {
    const params: any = {
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
    };
    if (filterLevel.value) params.level = filterLevel.value;

    const [contentRes, statsRes] = await Promise.all([
      systemLogService.getContent(selectedFile.value, params),
      systemLogService.getStats(selectedFile.value),
    ]);

    logEntries.value = contentRes.data.lines;
    stats.value = statsRes.data;
  } catch (error) {
    console.error('Failed to fetch log content:', error);
  } finally {
    loading.value = false;
  }
};

const handleFileChange = () => {
  currentPage.value = 1;
  fetchContent();
};

const handleFilter = () => {
  currentPage.value = 1;
  fetchContent();
};

const handleRefresh = () => {
  fetchContent();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchContent();
};

onMounted(() => {
  fetchFiles();
});
</script>
