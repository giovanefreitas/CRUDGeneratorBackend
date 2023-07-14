import { createRouter, createWebHistory } from 'vue-router'
import ListaAvaliacaoDiagnostica from '../views/ListaAvaliacaoDiagnostica.vue'
import PaginaInicial from '../views/PaginaInicial.vue'
import Selfxss from '../views/Selfxss.vue'
import Dashboard from "../views/Dashboard.vue";
import Admin from "../views/Admin.vue";
import Erro404 from "../views/Erro404.vue";
import AvaliacaoDiagnostica from '../views/AvaliacaoDiagnostica.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'caixa-entrada',
      component: PaginaInicial
    },
    {
      path: "/selfxss",
      name: "selfxss",
      component: Selfxss,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/avaliacoes-diagnosticas",
      name: "avaliacoes-diagnosticas",
      component: ListaAvaliacaoDiagnostica,
      meta: {
        requiresAuth: true,
        is_admin: false,
      },
    },
    {
      path: "/avaliacoes-diagnosticas/:id",
      name: "avaliacao-diagnostica",
      component: AvaliacaoDiagnostica,
      meta: {
        requiresAuth: true,
        is_admin: false,
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      meta: {
        requiresAuth: true,
        is_admin: true,
      },
    },
    {
      path: "/*",
      name: "erro404",
      component: Erro404,
      meta: {
        requiresAuth: false,
        is_admin: false,
      },
    },
  ]
})

export default router
