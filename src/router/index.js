import { createRouter, createWebHashHistory } from "vue-router";
import routerView from "@/components/routerView.vue"
const routes = [
  {
    path: "/",
    component: () => import("../views/framework.vue"),
    hidden: true,
    redirect: "/menu1/index",
    children: [
      {
        path: "/menu1",
        name: "menu1",
        component: routerView,
        children:[
          {
            path: "/menu1/index",
            name: "Home",
            component:  () =>
            import(/* webpackChunkName: "about" */ "../views/Home.vue"),
          },
          {
            path: "/menu1/about",
            name: "About",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(/* webpackChunkName: "about" */ "../views/About.vue"),
          },
          {
            path: "/menu1-3",
            name: "menu1-3",
            component: routerView,
            children:[
              {
                path: "/menu1-3/page1",
                name: "Page1",
                component: () => import("../views/page1.vue"),
              },
            ]
          },
        ]
      },
     
      
      {
        path: "/menu2",
        name: "menu2",
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
