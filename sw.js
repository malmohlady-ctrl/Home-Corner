/* Home Corner service worker — cache-first offline support */
const CACHE = "workout-v13";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "player.js",
  "player.css",
  "music/playlist.json",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "coach/abs-crunches.mp3",
  "coach/abs-intro.mp3",
  "coach/abs-leg-raises.mp3",
  "coach/abs-plank.mp3",
  "coach/abs-russian-twists.mp3",
  "coach/back-to-work.mp3",
  "coach/combo-1-1-2.mp3",
  "coach/combo-1-2-3-2.mp3",
  "coach/combo-1-2-3.mp3",
  "coach/combo-1-2-5-2.mp3",
  "coach/combo-1-2.mp3",
  "coach/combo-1-3-2.mp3",
  "coach/combo-1-6-3-2.mp3",
  "coach/combo-2-3-2.mp3",
  "coach/combo-2-4-2.mp3",
  "coach/combo-2-5-2-3.mp3",
  "coach/combo-3-2-3.mp3",
  "coach/combo-5-2-3.mp3",
  "coach/core-bicycle.mp3",
  "coach/core-climbers.mp3",
  "coach/core-dead-bug.mp3",
  "coach/core-ready.mp3",
  "coach/core-side-left.mp3",
  "coach/core-side-right.mp3",
  "coach/done-boxing.mp3",
  "coach/done-core.mp3",
  "coach/done-dumbbell.mp3",
  "coach/empty-tank.mp3",
  "coach/ex-01.mp3",
  "coach/ex-02.mp3",
  "coach/ex-03.mp3",
  "coach/ex-04.mp3",
  "coach/ex-05.mp3",
  "coach/ex-06.mp3",
  "coach/ex-07.mp3",
  "coach/ex-08.mp3",
  "coach/ex-09.mp3",
  "coach/ex-10.mp3",
  "coach/ex-11.mp3",
  "coach/ex-12.mp3",
  "coach/ex-13.mp3",
  "coach/ex-14.mp3",
  "coach/ex-15.mp3",
  "coach/ex-16.mp3",
  "coach/ex-17.mp3",
  "coach/ex-18.mp3",
  "coach/ex-19.mp3",
  "coach/ex-20.mp3",
  "coach/ex-21.mp3",
  "coach/ex-22.mp3",
  "coach/ex-23.mp3",
  "coach/ex-24.mp3",
  "coach/ex-25.mp3",
  "coach/ex-26.mp3",
  "coach/ex-27.mp3",
  "coach/ex-28.mp3",
  "coach/ex-29.mp3",
  "coach/get-ready.mp3",
  "coach/rest-shake.mp3",
  "coach/rest.mp3",
  "coach/round1-intro.mp3",
  "coach/round2-intro.mp3",
  "coach/round3-intro.mp3",
  "coach/round4-intro.mp3",
  "coach/warm-arms.mp3",
  "coach/warm-bounce.mp3",
  "coach/warm-torso.mp3"
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k.startsWith("workout-")).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
function rangeSlice(fullResponse, rangeHeader) {
  return fullResponse.blob().then((blob) => {
    const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader || "");
    let start = 0;
    let end = blob.size - 1;
    if (m) {
      if (m[1] === "" && m[2] !== "") {
        start = Math.max(0, blob.size - parseInt(m[2], 10));
      } else {
        if (m[1] !== "") start = parseInt(m[1], 10);
        if (m[2] !== "") end = Math.min(parseInt(m[2], 10), blob.size - 1);
      }
    }
    if (start > end || start >= blob.size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": "bytes */" + blob.size }
      });
    }
    const part = blob.slice(start, end + 1);
    return new Response(part, {
      status: 206,
      headers: {
        "Content-Range": "bytes " + start + "-" + end + "/" + blob.size,
        "Content-Length": String(part.size),
        "Accept-Ranges": "bytes",
        "Content-Type": "audio/mpeg"
      }
    });
  });
}
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.includes("/music/") && url.pathname.endsWith(".mp3")) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(event.request, { ignoreSearch: true }).then((cached) => {
          const range = event.request.headers.get("Range");
          if (cached) {
            return range ? rangeSlice(cached.clone(), range) : cached;
          }
          return fetch(url.href).then((res) => {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return range ? rangeSlice(res.clone(), range) : res;
          });
        })
      )
    );
    return;
  }
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || fetch(event.request))
  );
});
