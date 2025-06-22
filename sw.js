const CACHE_NAME = 'dekita-medal-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Service Worker インストール時
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Service Worker アクティベート時
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 古いキャッシュを削除
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Claiming clients');
            return self.clients.claim();
        })
    );
});

// ネットワークリクエストの処理
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // キャッシュがあればそれを返す
                if (cachedResponse) {
                    return cachedResponse;
                }

                // ネットワークから取得を試行
                return fetch(event.request)
                    .then((response) => {
                        // レスポンスが有効でない場合はそのまま返す
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // レスポンスをクローンしてキャッシュに保存
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // ネットワークエラー時はオフラインページを返す（オプション）
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// バックグラウンド同期（将来の機能拡張用）
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync');
        // バックグラウンド同期処理をここに追加
    }
});

// プッシュ通知（将来の機能拡張用）
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'メダルを獲得しました！',
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '確認する',
                icon: './icon-192.png'
            },
            {
                action: 'close',
                title: '閉じる'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('できたよ！メダル', options)
    );
});

// 通知クリック処理
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    event.notification.close();

    if (event.action === 'explore') {
        // アプリを開く
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});
