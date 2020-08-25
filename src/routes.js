const routes = [
    {
        path: '/',
        component: () => import('./components/child/SupportNavBar/WordManager/WordManager.vue')
    },
    {
        path: '/activity',
        component: () => import('./components/child/SupportNavBar/Activity/Activity.vue'),
        children: [
            {
                path: '/activity/chat/:id',
                component: () => import('./components/child/SupportNavBar/Activity/Chat.vue'),
                name: 'chat'
            }
        ]
    }
]

export default routes