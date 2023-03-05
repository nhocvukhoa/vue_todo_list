import { createRouter, createWebHistory } from "vue-router";

const TodoPage = () => import("./components/TodoPage");

const routes = [
  {
    path: "/",
    name: "todo-route",
    component: TodoPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
