<template>
    <input
      ref="input"
      v-model="day"
      :label="label"
      :readonly="readonly"
      :disabled="disabled"
      :error="error"
      hide-details
      
      :filled="filled"
      :outlined="outlined"
      type="date"
      @focus="enterInput"
      @blur="sendInput"
    />
</template>

<script>

export default {
  name: "VuetifyDatetimeInput",
  props: {
    value: { type: String, default: "" },
    readonly: Boolean,
    disabled: Boolean,
    hideDetails: Boolean,
    filled: Boolean,
    outlined: Boolean,
    clearable: Boolean,
    persistentHint: Boolean,
    hint: { type: String, default: "" },
    label: { type: String, default: "" },
    incompleteErrorMessage: {
      type: String,
      default: () => "Data inválida.",
    },
    dateformatErrorMessage: {
      type: String,
      default: () => "Data inválida.",
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    day: null,
    error: false,
    errorMessages: "",
  }),
  watch: {
    value: function () {
      this.error = false;
      this.errorMessages = "";
      this.parseValue();
    },
  },
  mounted() {
    this.parseValue();
  },
  methods: {
    getDate() {
      if (this.day) {
        this.error = false;
        this.errorMessages = "";
        let date = new Date(this.day);

        return date.toISOString();
      }
      return null;
    },
    parseValue() {
      if (this.value) {
        let newDate = new Date(this.value);
        this.day = newDate.toISOString().replace(/T.*/, "");
      } else {
        this.day = null;
      }
    },
    enterInput() {
      if (!this.day) {
        this.error = false;
        this.errorMessages = "";
      }
    },
    sendInput() {
      if (this.day) {
        try {
          let newDate = this.getDate();
          this.$emit("input", newDate);
        } catch (e) {
          this.error = true;
          this.errorMessages = this.dateformatErrorMessage;
        }
      }
    },
  },
};
</script>
