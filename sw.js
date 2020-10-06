const nombreCache = "apv-v5";
const archivos = [
    "/",
    "/index.html",
    "/error.html",
    "/css/bootstrap.css",
    "/css/styles.css",
    "/js/app.js",
    "/js/apv.js",
];

self.addEventListener("install", (e) => {
    console.log("Instalado el Service Worker");

    e.waitUntil(
        caches.open(nombreCache).then((cache) => {
            console.log("Cacheando");
            cache.addAll(archivos);
        })
    );
});

self.addEventListener("activate", (e) => {
    console.log("Service Worker activado");

    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== nombreCache)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", (e) => {
    console.log("Fetch...", e);

    e.respondWith(
        caches
            .match(e.request)
            .then((respuestaCache) => {
                return respuestaCache;
            })
            .catch(() => caches.match("/error.html"))
    );
});
