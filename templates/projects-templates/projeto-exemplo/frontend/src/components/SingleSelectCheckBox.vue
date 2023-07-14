<template>
  <div @click.stop.prevent="emits('change')">
    <input type="checkbox" :checked="checked" />
    <label for="checkbox" />
  </div>
</template>

<script setup>
const emits = defineEmits(["change"]);

defineProps({
  checked: { type: Boolean, required: true, default: false },
});
</script>
