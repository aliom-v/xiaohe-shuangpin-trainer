// Service Worker for 小鹤双拼练习器
const CACHE_NAME = 'xiaohe-shuangpin-v2'

// 核心静态资源 - 预缓存
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
]

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// 根据资源类型采用不同缓存策略
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return

  // 跳过 API 请求
  if (event.request.url.includes('/api/')) return

  const url = new URL(event.request.url)

  // 音效文件：缓存优先策略（加载后长期缓存）
  if (url.pathname.includes('/sounds/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request).then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
      })
    )
    return
  }

  // 其他资源：网络优先，失败时使用缓存
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 克隆响应用于缓存
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => {
        // 网络失败时使用缓存
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // 如果是导航请求，返回首页
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})
