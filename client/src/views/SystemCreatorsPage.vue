<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NDrawer, NDrawerContent, NText, NTag, NSpace, NDescriptions, NDescriptionsItem } from 'naive-ui'
import { useAuthStore } from '@/stores/auth.store'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import ScTable from '@/features/system-creators/components/ScTable.vue'
import type { ScModule } from '@/types/system-creator'

const authStore = useAuthStore()
const router = useRouter()
const showDetail = ref(false)
const selectedModule = ref<ScModule | null>(null)

function handleCreate() {
  router.push('/dashboard/system-creators/create')
}

function handleDetail(mod: ScModule) {
  selectedModule.value = mod
  showDetail.value = true
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <ScTable @create="handleCreate" @detail="handleDetail" />

    <NDrawer v-model:show="showDetail" :width="480" placement="right">
      <NDrawerContent :title="selectedModule?.label || 'Module Detail'" closable>
        <NDescriptions bordered v-if="selectedModule">
          <NDescriptionsItem label="Name">
            <NText code>{{ selectedModule.name }}</NText>
          </NDescriptionsItem>
          <NDescriptionsItem label="Label">{{ selectedModule.label }}</NDescriptionsItem>
          <NDescriptionsItem label="Menu Label">{{ selectedModule.menuLabel }}</NDescriptionsItem>
          <NDescriptionsItem label="Route Path">
            <NText code>{{ selectedModule.routePath }}</NText>
          </NDescriptionsItem>
          <NDescriptionsItem label="Access Level">
            <NTag :type="selectedModule.accessLevel === 'public' ? 'success' : selectedModule.accessLevel === 'admin' ? 'info' : 'warning'" size="small" bordered>
              {{ selectedModule.accessLevel }}
            </NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="Status">
            <NTag :type="selectedModule.isActive ? 'success' : 'default'" size="small" bordered>
              {{ selectedModule.isActive ? 'Active' : 'Inactive' }}
            </NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="Fields">
            <NSpace :size="4" v-if="Array.isArray(selectedModule.fieldsConfig)">
              <NTag v-for="f in selectedModule.fieldsConfig" :key="f.name" size="small" bordered>
                {{ f.label }} ({{ f.type }})
              </NTag>
            </NSpace>
            <NText depth="3" v-else>No fields</NText>
          </NDescriptionsItem>
          <NDescriptionsItem label="Relations" v-if="selectedModule.relationsConfig?.length">
            <NSpace :size="4">
              <NTag v-for="r in selectedModule.relationsConfig" :key="r.name" size="small" type="info" bordered>
                {{ r.name }} → {{ r.targetModule }} ({{ r.type }})
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Created">{{ new Date(selectedModule.createdAt).toLocaleString() }}</NDescriptionsItem>
          <NDescriptionsItem label="Updated">{{ new Date(selectedModule.updatedAt).toLocaleString() }}</NDescriptionsItem>
        </NDescriptions>
      </NDrawerContent>
    </NDrawer>
  </AppLayout>
</template>
