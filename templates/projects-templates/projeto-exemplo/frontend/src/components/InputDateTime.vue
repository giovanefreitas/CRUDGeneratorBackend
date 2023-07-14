<template>
  <div>
    <div class="overline">
      {{ label }}
    </div>
      <div class="row">
        <div class="col-6">
          <input
            ref="day"
            v-model="day"
            required
            :label="dateLabel"
            :readonly="readonly"
            :disabled="disabled"
            :error="error"
            hide-details
            
            :filled="filled"
            :outlined="outlined"
            type="date"
            @focusout="leaveInput"
            @focus="enterInput"
            @blur="sendInput"
            data-test="input-dia"
          />
        </div>
        <div class="col-6">
          <input
            ref="time"
            v-model="time"
            required
            :label="timeLabel"
            :readonly="readonly"
            :disabled="disabled"
            :error="error"
            hide-details
            
            :filled="filled"
            :outlined="outlined"
            type="time"
            @focusout="leaveInput"
            @focus="enterInput"
            @blur="sendInput"
            data-test="input-hora"
          >
            <template v-if="clearable && !readonly" #append-outer>
              <button icon :disabled="!value" @click="clear">
                <button v-if="value"> mdi-close </button>
              </button>
            </template>
          </input>
        </div>
      </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

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
    hint: { type: String, default: "Data e hora" },
    label: { type: String, default: "" },
    timeLabel: {
      type: String,
      default: () => "Time",
    },
    dateLabel: {
      type: String,
      default: () => "Date",
    },
    incompleteErrorMessage: {
      type: String,
      default: () => "Date and Time needs to be filled",
    },
    dateformatErrorMessage: {
      type: String,
      default: () => "Wrong Dateformat",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    locale: {
      type: String,
      default: () => "en",
    },
  },
  data() {
    return {
      day: null,
      dayFormat: "####-##-##",
      time: null,
      timeFormat: "##:##",
      browserSupportsDateInput: true,
      localeFormat: null,
      error: false,
      errorMessages: "",
      dateFilled: () =>
        this.checkBothFieldsFilled() || this.incompleteErrorMessage,
    };
  },
  watch: {
    value: function () {
      this.parseValue();
    },
  },
  created() {
    this.setBrowserSupportsDateInput();
    if (this.isCustomTextMode()) {
      this.dayFormat = this.localeFormat
        .replace(/DD/, "##")
        .replace(/MM/, "##")
        .replace(/YYYY/, "####");
    }
    this.parseValue();
  },
  methods: {
    setBrowserSupportsDateInput() {
      var i = document.createElement("input");
      i.setAttribute("type", "date");
      this.browserSupportsDateInput = i.type !== "text";
    },
    clear() {
      this.errorMessages = "";
      this.time = null;
      this.day = null;
      this.$emit("input", this.getDate());
    },
    getDate() {
      if (this.day && this.time) {
        this.error = false;
        this.errorMessages = "";
        let date = new Date(this.day + "T" + this.time);

        return date.toISOString();
      }
      return null;
    },
    parseValue() {
      if (this.value) {
        let newDate = dayjs(this.value).toDate();
        this.day = this.parseDay(newDate);
        this.time = this.parseTime(newDate);
      } else {
        this.day = null;
        this.time = null;
      }
    },
    parseDay(timestamp) {
      return timestamp.toISOString().replace(/T.*/, "");
    },
    parseTime(timestamp) {
      return timestamp.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    leaveInput() {
      if (!this.checkBothFieldsFilled()) {
        this.error = true;
        this.errorMessages = this.incompleteErrorMessage;
      }
    },
    enterInput() {
      if (!this.checkBothFieldsFilled()) {
        this.error = false;
        this.errorMessages = "";
      }
    },
    sendInput() {
      if (this.checkBothFieldsFilled()) {
        try {
          let newDate = this.getDate();
          this.$emit("input", newDate);
        } catch (e) {
          this.error = true;
          this.errorMessages = this.dateformatErrorMessage;
        }
      }
    },
    checkBothFieldsFilled() {
      return !!(this.time && this.day) || (!this.time && !this.day);
    },
    isCustomTextMode() {
      return !this.browserSupportsDateInput && this.locale !== "en";
    },
  },
};
</script>
