# 说明

该文件夹主要用于存放后端项目

# 项目结构

````
backend/
├── src/
│   └── ... (源代码)
└── README.md
````

# 核心功能模块
## 1.认证模块
## 2.
## 3.


type NavMethod = 'navigateTo' | 'switchTab' | 'reLaunch'

interface NavigationItem {
  text: string
  icon: string
  pagePath: string
  method?: NavMethod
}

const tabbarItems = computed<NavigationItem[]>(() => [
  { text: '首页', icon: 'home', pagePath: '/pages/home/index', method: 'reLaunch' },
  { text: '交通', icon: 'send', pagePath: '/pages/traffic/index', method: 'navigateTo' },
  { text: '订单', icon: 'calendar', pagePath: '/pages/order/index', method: 'navigateTo' },
  { text: '更多', icon: 'more', pagePath: '/pages/more/index', method: 'navigateTo' },
  { text: '我的', icon: 'user', pagePath: '/pages/profile/index', method: 'navigateTo' },
])

