<template>
  <v-app>
    <v-navigation-drawer
      v-model="sidebar"
      app
    >
      <v-list
        class="blue darken-1"
        nav
      >
        <v-list-item>
          <v-list-item-icon>
            <button
              v-show="sidebar"
              icon
              class="hidden-xs-only"
              @click="showHideSidebar()"
            >
              <i class="bi bi-arrow-up-circle"></i>
            </button>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="title">
              Gestão VIP
            </v-list-item-title>
            <v-list-item-subtitle> {{ versaoApp }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      

      <v-list
        nav
        data-test="menu-lateral-logado"
      >
        <v-list-item
          link
          to="/dashboard"
        >
          <v-list-item-icon>
            <i class="bi bi-pie-chart-fill"></i>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Início</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/about"
        >
          <v-list-item-content>
            <v-list-item-title>Sobre</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/admin"
        >
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/tecnicos"
        >
          <v-list-item-content>
            <v-list-item-title>Técnicos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      flat
      color="blue darken-1"
    >
      <button
        v-show="!sidebar"
        @click="showHideSidebar()"
      />

      <div class="btn-toolbar" role="toolbar" v-show="!sidebar">
        Gestão VIP
      </h1>

      

      <v-menu
        v-if="usuario"
        bottom
        min-width="300px"
        rounded
        offset-y
      >
        <template #activator="{ on }">
          <button
            icon
            x-large
            v-on="on"
          >
            <v-avatar
              color="brown"
              size="48"
            >
              <img
                v-if="usuario.foto"
                :src="usuario.foto"
                :alt="usuario.nome"
              >
              <span
                v-if="!usuario.foto"
                class="text-h5"
              >{{
                usuario.iniciais
              }}</span>
            </v-avatar>
          </button>
        </template>
        <div class="card">
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="blue lighten-4">
                <img
                  v-if="usuario.foto"
                  :src="usuario.foto"
                  :alt="usuario.nome"
                >
                <span
                  v-if="!usuario.foto"
                  class="text-h5"
                >{{
                  usuario.iniciais
                }}</span>
              </v-avatar>
              <h3>{{ usuario.nome }}</h3>
              <p class="text-caption mt-1">
                {{ usuario.email }}
              </p>
              
              <button
                depressed
                rounded
                text
              >
                Edit Account
              </button>
              
              <button
                depressed
                rounded
                text
                @click="logout"
              >
                Sair <i class="bi bi-box-arrow-left"></i>
              </button>
            </div>
          </v-list-item-content>
        </div>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <div class="container"  fluid>
        <!-- If using vue-router -->
        <router-view />
      </div>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sidebar: true,
      usuario: null,
    };
  },
  computed: {
    versaoApp() {
      return import.meta.env.VITE_APP_VERSAO;
    },
  },
  created() {
    if (window.innerWidth > 1270){
      if (localStorage.getItem("sidebar")){
        this.sidebar = localStorage.getItem("sidebar") == "true";
      } else {
        this.sidebar = true;
      }
    } else {
      this.sidebar = false;
    }
    
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!this.usuario.foto) {
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
      let initials = [...this.usuario.nome.matchAll(rgx)] || [];
      this.usuario.iniciais = (
        (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
      ).toUpperCase();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("usuario", null);
      localStorage.removeItem("jwt", null);
      this.$router.push({ name: "home" });
    },
    showHideSidebar() {
      this.sidebar = !this.sidebar;
      localStorage.setItem("sidebar", JSON.stringify(this.sidebar));
    },
  },
};
</script>
