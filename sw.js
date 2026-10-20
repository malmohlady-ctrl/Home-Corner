/* Home Corner service worker — cache-first offline support */
const CACHE = "workout-v8";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
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
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || fetch(event.request))
  );
});
