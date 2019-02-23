const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', redirect: 'goods' },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('pages/goods.vue')
      },
      { path: 'cart', name: 'cart', component: () => import('pages/cart.vue') },
      {
        path: 'trade',
        name: 'trade',
        component: () => import('pages/trade.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
