<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTag, NText, NDivider } from 'naive-ui'
import type { CreateScModule } from '@/types/system-creator'

const props = defineProps<{ modelValue: CreateScModule }>()
</script>

<template>
  <div>
    <NText depth="3" class="block mb-4">
      Review your module configuration before generating.
    </NText>

    <NDivider>Module Info</NDivider>
    <NDescriptions bordered :column="2" size="small">
      <NDescriptionsItem label="Name">
        <NText code>{{ modelValue.name }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem label="Label">{{ modelValue.label }}</NDescriptionsItem>
      <NDescriptionsItem label="Menu Label">{{ modelValue.menuLabel }}</NDescriptionsItem>
      <NDescriptionsItem label="Route">
        <NText code>/dashboard/sc/{{ modelValue.name }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem label="Access Level">
        <NTag :type="modelValue.accessLevel === 'public' ? 'success' : modelValue.accessLevel === 'admin' ? 'info' : 'warning'" size="small" bordered>
          {{ modelValue.accessLevel }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem label="Description">
        {{ modelValue.description || '-' }}
      </NDescriptionsItem>
    </NDescriptions>

    <NDivider>Fields ({{ modelValue.fields?.length || 0 }})</NDivider>
    <div v-if="modelValue.fields?.length">
      <div v-for="(field, i) in modelValue.fields" :key="i" class="flex items-center gap-2 mb-2">
        <NText code class="w-32">{{ field.name }}</NText>
        <NTag size="small" bordered>{{ field.type }}</NTag>
        <NTag v-if="field.required" size="small" type="warning" bordered>required</NTag>
        <NTag v-if="field.unique" size="small" type="info" bordered>unique</NTag>
        <NTag v-if="field.searchable" size="small" type="success" bordered>searchable</NTag>
        <NTag v-if="field.sortable" size="small" type="success" bordered>sortable</NTag>
        <NText depth="3" class="text-xs">{{ field.label }}</NText>
      </div>
    </div>
    <NText v-else depth="3">No fields defined.</NText>

    <template v-if="modelValue.relations?.length">
      <NDivider>Relations ({{ modelValue.relations.length }})</NDivider>
      <div v-for="(rel, i) in modelValue.relations" :key="i" class="flex items-center gap-2 mb-2">
        <NTag size="small" type="info" bordered>{{ rel.type }}</NTag>
        <NText code>{{ rel.name }}</NText>
        <NText depth="3">→</NText>
        <NText code>{{ rel.targetModule }}</NText>
      </div>
    </template>

    <template v-if="modelValue.layoutConfig">
      <NDivider>Layout Config</NDivider>
      <div class="space-y-2">
        <div v-if="modelValue.layoutConfig.browse">
          <NText class="text-sm" strong>Browse:</NText>
          <NText depth="3" class="text-xs ml-2">
            {{ modelValue.layoutConfig.browse.columnOrder.length }} columns configured
          </NText>
        </div>
        <div v-if="modelValue.layoutConfig.create">
          <NText class="text-sm" strong>Create Form:</NText>
          <NText depth="3" class="text-xs ml-2">
            {{ modelValue.layoutConfig.create.layout }} layout, {{ modelValue.layoutConfig.create.sections.length }} sections
          </NText>
        </div>
        <div v-if="modelValue.layoutConfig.update">
          <NText class="text-sm" strong>Update Form:</NText>
          <NText depth="3" class="text-xs ml-2">
            {{ modelValue.layoutConfig.update.layout }} layout, {{ modelValue.layoutConfig.update.sections.length }} sections
          </NText>
        </div>
      </div>
    </template>
  </div>
</template>
