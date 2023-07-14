<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <input-cep
          v-model="endereco.cep"
          label="CEP"
          data-test="input-cep"
          @keydown.enter="focusNext"
          @change="buscaCEP"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <input
          v-model="endereco.logradouro"
          label="Endereço"
          data-test="input-logradouro"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
      <div class="col-4">
        <!-- Parece errado usar toUpperCase() no número, mas ele pode ser S/N -->
        <input
          label="Número"
          :value="endereco.numero ? endereco.numero.toUpperCase() : ''"
          @input="endereco.numero = $event.toUpperCase()"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <input
          v-model="endereco.complemento"
          label="Complemento"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <input
          v-model="endereco.bairro"
          label="Bairro"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <input
          v-model="endereco.municipio"
          label="Município"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
      <div class="col-4">
        <input
          label="UF"
          :value="endereco.uf ? endereco.uf.toUpperCase() : ''"
          @input="endereco.uf = $event.toUpperCase()"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <input
          v-model="endereco.pontoReferencia"
          label="Ponto de referência"
          @keydown.enter="focusNext"
          @change="emitChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import validadores from "@/helper/validadores";
import InputCep from "./Cep.vue";

export default {
  components: {
    InputCep,
  },
  props: { value: { type: Object, default: null } },
  data: () => ({
    regrasCEP: [validadores.obrigatorio, validadores.cep],
    endereco: {},
  }),
  watch: {
    value(newValue) {
      this.endereco = Object.assign({}, newValue);
    },
  },
  mounted(){
    this.endereco = Object.assign({}, this.value);
  },
  methods: {
    emitChange(){
      console.log('recebido: ', this.endereco.cep);
      this.$emit('input', this.endereco);
    },

    focusNext(e) {
      const inputs = Array.from(
        e.target.form.querySelectorAll('input[type="text"]')
      );
      const index = inputs.indexOf(e.target);

      if (index < inputs.length) {
        inputs[index + 1].focus();
      }
    },

    buscaCEP() {
      console.log('Valor atual: ', this.endereco.cep);
      if (this.endereco.cep && this.endereco.cep.length == 8) {
        var cep = this.endereco.cep.replaceAll(".", "").replaceAll("-", "");
        axios
          .get("https://viacep.com.br/ws/" + cep + "/json/")
          .then((response) => {
            if (response.status == 200 && !response.data.erro) {
              if (!this.endereco.logradouro) {
                this.endereco.logradouro = response.data.logradouro;
              }
              if (!this.endereco.bairro) {
                this.endereco.bairro = response.data.bairro;
              }
              // if (!this.endereco.complemento) {
              //   this.endereco.complemento = response.data.complemento;
              // }
              if (!this.endereco.municipio) {
                this.endereco.municipio = response.data.localidade;
              }
              if (!this.endereco.uf) {
                this.endereco.uf = response.data.uf;
              }

              this.$emit('input', this.endereco);
            }
          });
      }
    },
  },
};
</script>
