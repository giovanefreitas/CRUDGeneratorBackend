<template>
  <input :value="formatarValor(modelValue)" @input="emits('update:modelValue', removerMascara($event.target.value))"
    :maxlength="16" @keypress="keyPress" />
</template>

<script setup>
import { computed } from "@vue/runtime-core";

const props = defineProps({
  modelValue: String,
})

const emits = defineEmits(['update:modelValue'])

function getInputMask() {
  if (removerMascara(props.modelValue).length > 11)
    return "##.###.###/####-##";
  else return "###.###.###-##";
}

function formatarValor(value) {
  if (value) {
    return formatCpfCnpj(value, getInputMask());
  } else {
    return "";
  }
}

function removerMascara(value) {
  if (value) {
    return value.replace(/[^\d]+/g, "");
  } else {
    return "";
  }
}

function formatCpfCnpj(value, mask) {
  value = removerMascara(value);
  let result = "";
  let count = 0;
  if (value) {
    let arrayValue = value.toString().split("");
    let arrayMask = mask.toString().split("");
    for (var i = 0; i < arrayMask.length; i++) {
      if (i < arrayValue.length + count) {
        if (arrayMask[i] === "#") {
          result = result + arrayValue[i - count];
        } else {
          result = result + arrayMask[i];
          count++;
        }
      }
    }
  }
  return result;
}

function keyPress($event) {
  let keyCode = $event.keyCode ?? $event.which;
  if (keyCode < 48 || keyCode > 57) {
    $event.preventDefault();
  }
}

</script>