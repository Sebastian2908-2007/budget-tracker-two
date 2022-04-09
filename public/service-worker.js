
/*files we want the service worker to cache */
const FILES_TO_CACHE = [
    '/',
   "./index.html",
   "./js/index.js",
   "./js/idb.js",
   "./css/styles.css",
   " https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
   " https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
   "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0",
   "./icons/icon-192x192.png"

];

/*Service worker Constraints*/
const APP_PREFIX = "budget-tracker";
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

/*install the service worker */
self.addEventListener('install',function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE)
        })
    );
})
/**activate service worker */
self.addEventListener('activate',function(e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if(cacheKeepList.indexOf(key) === -1) {
                    console.log('delting cache : ' + keyList[i] );
                    return caches.delete(keylist[i]);
                }
              })
            );
            
        })
    );
});

// fetch resources from cache 
self.addEventListener('fetch',function(e) {
    console.log("fetch request : " + e.request.url);

    e.respondWith(
        caches.match(e.request).then(function (request) {
            if(request) {
                console.log('responding with cache : ' + e.request.url);
                return request;
            }else{
                console.log('file is not cached, fetching : ' + e.request.url);
                return fetch(e.request);
            }
        })
    );
});