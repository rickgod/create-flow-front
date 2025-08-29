import { createRouter, createWebHistory } from "vue-router";
import ProjectConfig from "../views/ProjectConfig.vue";

const routes = [
  {
    path: "/",
    redirect: "/project-config",
  },
  {
    path: "/project-config",
    name: "ProjectConfig",
    component: ProjectConfig,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
