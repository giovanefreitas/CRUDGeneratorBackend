<template>
  <div @click.stop.prevent="toggleChecked">
    <input type="checkbox" :checked="isChecked" :class="status" />
    <label for="checkbox" />
  </div>
</template>

<script setup>
import { computed } from "vue";

const emits = defineEmits(["change"]);

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator(value) {
      return ["noneSelected", "partSelected", "allSelected"].includes(value);
    },
  },
});

const isChecked = computed(() => props.status === "allSelected");

const toggleChecked = () => {
  emits("change", !isChecked.value);
};
</script>
