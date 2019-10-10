self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-site-cache-v1').then(function(cache) {
            return cache.addAll([
                '.',
                'index.html',
                'gallery/snowTroopers.jpg',
                'gallery/bountyHunters.jpg',
                'gallery/myLittleVader.jpg',
                'star-wars-logo.jpg',
                'style.css',
                'image-list.js',
                'app.js',
                'sw.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
                let responseClone = response.clone();

                caches.open('my-site-cache-v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                return caches.match('gallery/myLittleVader.jpg');
            });
        }
    }));
});