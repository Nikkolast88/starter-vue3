import NotFound from '~/layouts/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'hello',
    component: () => import('~/components/HelloWorld.vue'),
  },
  {
    path: '/footer',
    name: 'footer',
    component: () => import('~/pages/FooterPage/FooterPage.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

export default routes
