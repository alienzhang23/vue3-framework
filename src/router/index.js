import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    component: () => import("../views/framework.vue"),
    hidden: true,
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "Home",
        component: Home,
      },
      {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/About.vue"),
      },
      {
        path: "/page1",
        name: "Page1",
        component: () => import("../views/page1.vue"),
      },
      {
        path: "/page2",
        name: "Page2",
        component: () => import("../views/page2.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("../views/login.vue"),
    
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
