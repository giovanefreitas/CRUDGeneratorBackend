<template>
  <div ref="dataTable">
    <slot name="top"></slot>
    <table class="table table-hover">
      <thead v-if="colunas.length">
        <tr>
          <th style="width:35px">
            <MutipleSelectCheckBox
              :key="multipleSelectStatus"
              :status="multipleSelectStatus"
              @change="toggleSelectAll"
            />
          </th>
          <th
            v-for="(header, index) in colunas"
            :key="index"
            :class="{
              sortable: header.sortable,
              none: header.sortable && header.sortType === 'none',
              desc: header.sortable && header.sortType === 'desc',
              asc: header.sortable && header.sortType === 'asc',
            }"
            :style="`width: ${header.width}`"
            @click="
              header.sortable && header.sortType
                ? updateSortField(header.value, header.sortType)
                : null
            "
          >
            <span class="header-text__wrapper">
              <span class="header-text">
                {{ header.text }}
              </span>
              <i
                v-if="header.sortable"
                :key="header.sortType ? header.sortType : 'none'"
                class="sortType-icon"
                :class="{ desc: header.sortType === 'desc' }"
              ></i>
            </span>
          </th>
        </tr>
      </thead>

      <tbody v-if="exibirCarregando || (items.length && colunas.length)">
        <tr v-if="exibirCarregando">
          <td colspan="100%">
            <indicador-carregando></indicador-carregando>
          </td>
        </tr>
        <tr
          v-for="item in items"
          :key="JSON.stringify(item)"
          @click="emits('clickRow', item)"
        >
          <td>
            <single-select-check-box
              :checked="item.$selecionado"
              data-test="checkbox-seleciona-registro"
              @change="toggleSelectItem(item)"
            />
          </td>
          <td v-for="(column, i) in colunas" :key="i">
            <slot
              v-if="slots[column.value]"
              :name="column.value"
              v-bind:item="item"
            />
            <template v-else>
              {{ generateColumnContent(column, item) }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!exibirCarregando && !items.length" class="data-table__message">
      Nenhum registro encotrado
    </div>

    <paginador-tabela
      :paginaAtual="paginaAtual"
      :totalRegistros="totalRegistros"
      :tamanhoPagina="tamanhoPagina"
      @exibir-pagina="(novaPagina) => emits('exibirPagina', novaPagina)"
    ></paginador-tabela>
  </div>
</template>

<script setup lang="ts">
import { useSlots, computed, toRefs, PropType, ref, watch, provide, onMounted } from "vue";
import MutipleSelectCheckBox from "./MutipleSelectCheckBox.vue";
import SingleSelectCheckBox from "./SingleSelectCheckBox.vue";
import IndicadorCarregando from "./IndicadorCarregando.vue";
import PaginadorTabela from "./PaginadorTabela.vue";

type ClientSortOptions = {
  sortBy: string;
  sortDesc: boolean;
};

type HeaderForRender = {
  text: string;
  value: string;
  sortable?: boolean;
  sortType?: string | "none";
  width?: string;
};

const props = defineProps({
  tamanhoPagina: {
    type: Number,
    required: true,
  },
  totalRegistros: {
    type: Number,
    required: true,
  },
  paginaAtual: {
    type: Number,
    required: true,
  },
  exibirCarregando: {
    type: Boolean,
    required: true,
  },
  colunas: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  itensSelecionados: {
    type: Array,
    required: true,
  },
});

const { tamanhoPagina, totalRegistros } = toRefs(props);

// slot
const slots = useSlots();

onMounted(()=>{
  console.log(slots);
})

// global dataTable $ref
const dataTable = ref();
provide("dataTable", dataTable);

// define emits
const emits = defineEmits([
  "update:itensSelecionados",
  "clickRow",
  "exibirPagina",
]);

const isMutipleSelectable = computed(() => props.itensSelecionados !== null);

const initClientSortOptions = (): ClientSortOptions | null => {
  if (props.sortBy !== "") {
    return {
      sortBy: props.sortBy,
      sortDesc: props.sortType === "desc",
    };
  }
  return null;
};

const clientSortOptions = ref<ClientSortOptions | null>(
  initClientSortOptions()
);

const getItemValue = (column, item) => {
  if (column.value.includes(".")) {
    let content: any = "";
    const keysArr = column.value.split(".");
    keysArr.forEach((key, index) => {
      content = index === 0 ? item[key] : content[key];
    });
    return content;
  }
  return item[column.value];
};

const generateColumnContent = (column, item) => {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(",") : content;
};

const multipleSelectStatus = computed(
  (): "allSelected" | "noneSelected" | "partSelected" => {
    if (props.itensSelecionados.length === 0) {
      return "noneSelected";
    }
    const isNoneSelected = props.itensSelecionados.every((itemSelected) => {
      if (props.items.findIndex((item) => itemSelected.id === item.id) !== -1) {
        return false;
      }
      return true;
    });
    if (isNoneSelected) return "noneSelected";

    if (props.itensSelecionados.length === props.items.length) {
      const isAllSelected = props.itensSelecionados.every((itemSelected) => {
        if (
          props.items.findIndex((item) => itemSelected.id === item.id) === -1
        ) {
          return false;
        }
        return true;
      });
      return isAllSelected ? "allSelected" : "partSelected";
    }

    return "partSelected";
  }
);

const updateSortField = (newSortBy: string, oldSortType: SortType | "none") => {
  let newSortType: SortType | null = null;
  if (oldSortType === "none") {
    newSortType = "asc";
  } else if (oldSortType === "asc") {
    newSortType = "desc";
  } else {
    newSortType = null;
  }

  if (newSortType === null) {
    clientSortOptions.value = null;
  } else {
    clientSortOptions.value = {
      sortBy: newSortBy,
      sortDesc: newSortType === "desc",
    };
  }
};

function toggleSelectAll(isChecked) {
  props.items.forEach((element) => {
    element.$selecionado = isChecked;
  });
  if (isChecked) {
    emits("update:itensSelecionados", [...props.items]);
  } else {
    emits("update:itensSelecionados", []);
  }
}

function toggleSelectItem(item) {
  item.$selecionado = !item.$selecionado;
  var novaSelecao = [...props.itensSelecionados];
  console.log("id selecionado: ", item.id);
  console.log("selecao atual", novaSelecao.length);

  if (item.$selecionado) {
    novaSelecao.push(item);
  } else {
    novaSelecao = novaSelecao.filter((element) => element.id != item.id);
  }
  console.log("nova selecao", novaSelecao.length);
  emits("update:itensSelecionados", novaSelecao);
}
</script>
