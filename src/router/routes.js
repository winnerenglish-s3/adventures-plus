const routes = [
  {
    path: "/",
    component: () => import("pages/login.vue"),
    name: "login"
  },
  {
    path: "/main",
    component: () => import("pages/main.vue"),
    name: "main"
  },
  {
    path: "/vocab/:lv/:unit",
    component: () => import("pages/vocab.vue"),
    name: "vocab"
  },
  {
    path: "/vocabprint",
    component: () => import("pages/vocabprint.vue"),
    name: "vocabprint"
  },
  {
    path: "/grammar/:lv/:unit",
    component: () => import("pages/grammar.vue"),
    name: "grammar"
  },
  {
    path: "/reading/:lv/:unit",
    component: () => import("pages/reading.vue"),
    name: "reading"
  },
  {
    path: "/writing/:lv/:unit",
    component: () => import("pages/writing.vue"),
    name: "writing"
  },
  {
    path: "/phonics/:lv/:unit",
    component: () => import("pages/phonics.vue"),
    name: "phonics"
  },
  {
    path: "/ls/:lv/:unit",
    component: () => import("pages/ls.vue"),
    name: "ls"
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
