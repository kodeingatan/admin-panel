<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <n-card title="Activity Logs">
      <template #header-extra>
        <n-space>
          <n-select
            v-model:value="filterAction"
            placeholder="Action"
            clearable
            :options="actionOptions"
            style="width: 150px"
            @update:value="handleFilter"
          />
          <n-select
            v-model:value="filterEntity"
            placeholder="Entity"
            clearable
            :options="entityOptions"
            style="width: 150px"
            @update:value="handleFilter"
          />
          <n-select
            v-model:value="filterLevel"
            placeholder="Level"
            clearable
            :options="levelOptions"
            style="width: 120px"
            @update:value="handleFilter"
          />
        </n-space>
      </template>

      <DataTable
        :columns="columns"
        :data="logs"
        :loading="loading"
        :page="page"
        :limit="limit"
        :total="total"
        search-placeholder="Search activity logs..."
        :searchable-fields="searchableFields"
        @update:page="handlePageChange"
        @update:limit="handleLimitChange"
        @search="handleSearch"
      />
    </n-card>

    <n-drawer v-model:show="showDetail" :width="500" placement="right">
      <n-drawer-content title="Activity Log Detail">
        <template v-if="selectedLog">
          <n-descriptions :column="1" bordered label-placement="left">
            <n-descriptions-item label="ID">{{ selectedLog.id }}</n-descriptions-item>
            <n-descriptions-item label="User">
              {{ selectedLog.user ? `${selectedLog.user.firstName} ${selectedLog.user.lastName}` : 'System' }}
            </n-descriptions-item>
            <n-descriptions-item label="Action">
              <n-tag :type="getActionType(selectedLog.action)" size="small">{{ selectedLog.action }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Entity">
              <n-tag size="small">{{ selectedLog.entity }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Entity ID">{{ selectedLog.entityId ?? '-' }}</n-descriptions-item>
            <n-descriptions-item label="Level">
              <n-tag :type="getLevelType(selectedLog.level)" size="small">{{ selectedLog.level }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Description">{{ selectedLog.description ?? '-' }}</n-descriptions-item>
            <n-descriptions-item label="IP Address">{{ selectedLog.ipAddress ?? '-' }}</n-descriptions-item>
            <n-descriptions-item label="User Agent">{{ selectedLog.userAgent ?? '-' }}</n-descriptions-item>
            <n-descriptions-item label="Metadata">
              <pre v-if="selectedLog.metadata" style="white-space: pre-wrap; font-size: 12px;">{{ formatMetadata(selectedLog.metadata) }}</pre>
              <span v-else>-</span>
            </n-descriptions-item>
            <n-descriptions-item label="Created At">{{ selectedLog.createdAt }}</n-descriptions-item>
          </n-descriptions>
        </template>
      </n-drawer-content>
    </n-drawer>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { NTag, NSpace, NSelect, NCard, NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem } from 'naive-ui';
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue';
import DataTable from '@/components/common/DataTable/DataTable.vue';
import { activityLogService } from '@/services/activity-log.service';
import { useAuthStore } from '@/stores/auth.store';
import type { ActivityLog } from '@/types/activity-log';

const authStore = useAuthStore();
const logs = ref<ActivityLog[]>([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(20);
const total = ref(0);
const search = ref('');
const filterAction = ref<string | null>(null);
const filterEntity = ref<string | null>(null);
const filterLevel = ref<string | null>(null);
const showDetail = ref(false);
const selectedLog = ref<ActivityLog | null>(null);

const searchableFields = [
  { label: 'Description', value: 'description' },
  { label: 'Username', value: 'user.username' },
  { label: 'First Name', value: 'user.firstName' },
  { label: 'Last Name', value: 'user.lastName' },
];

const actionOptions = [
  { label: 'CREATE', value: 'CREATE' },
  { label: 'UPDATE', value: 'UPDATE' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'LOGIN', value: 'LOGIN' },
  { label: 'LOGOUT', value: 'LOGOUT' },
];

const entityOptions = [
  { label: 'User', value: 'User' },
  { label: 'Role', value: 'Role' },
  { label: 'Permission', value: 'Permission' },
  { label: 'Guard', value: 'Guard' },
  { label: 'Auth', value: 'Auth' },
];

const levelOptions = [
  { label: 'INFO', value: 'INFO' },
  { label: 'WARNING', value: 'WARNING' },
  { label: 'ERROR', value: 'ERROR' },
];

const getActionType = (action: string) => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    CREATE: 'success',
    UPDATE: 'warning',
    DELETE: 'error',
    LOGIN: 'info',
    LOGOUT: 'default',
  };
  return map[action] || 'default';
};

const getLevelType = (level: string) => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
  };
  return map[level] || 'default';
};

const formatMetadata = (metadata: string) => {
  try {
    return JSON.stringify(JSON.parse(metadata), null, 2);
  } catch {
    return metadata;
  }
};

const columns = [
  { title: 'ID', key: 'id', width: 60, sortable: true },
  {
    title: 'User',
    key: 'user',
    render(row: ActivityLog) {
      if (row.user) {
        return h('span', `${row.user.firstName} ${row.user.lastName}`);
      }
      return h('span', { style: { color: '#999' } }, 'System');
    },
  },
  {
    title: 'Action',
    key: 'action',
    width: 100,
    render(row: ActivityLog) {
      return h(NTag, { type: getActionType(row.action), size: 'small' }, { default: () => row.action });
    },
  },
  {
    title: 'Entity',
    key: 'entity',
    width: 100,
    render(row: ActivityLog) {
      return h(NTag, { size: 'small' }, { default: () => row.entity });
    },
  },
  { title: 'Description', key: 'description', ellipsis: { tooltip: true } },
  {
    title: 'Level',
    key: 'level',
    width: 80,
    render(row: ActivityLog) {
      return h(NTag, { type: getLevelType(row.level), size: 'small' }, { default: () => row.level });
    },
  },
  { title: 'Created At', key: 'createdAt', width: 180, sortable: true },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    render(row: ActivityLog) {
      return h(
        NTag,
        {
          size: 'small',
          style: 'cursor: pointer',
          onClick: () => {
            selectedLog.value = row;
            showDetail.value = true;
          },
        },
        { default: () => 'View' },
      );
    },
  },
];

const fetchLogs = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: page.value,
      limit: limit.value,
    };
    if (search.value) params.search = search.value;
    if (filterAction.value) params.action = filterAction.value;
    if (filterEntity.value) params.entity = filterEntity.value;
    if (filterLevel.value) params.level = filterLevel.value;

    const response = await activityLogService.findAll(params);
    logs.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (p: number) => {
  page.value = p;
  fetchLogs();
};

const handleLimitChange = (l: number) => {
  limit.value = l;
  page.value = 1;
  fetchLogs();
};

const handleSearch = (value: string) => {
  search.value = value;
  page.value = 1;
  fetchLogs();
};

const handleFilter = () => {
  page.value = 1;
  fetchLogs();
};

onMounted(() => {
  fetchLogs();
});
</script>
