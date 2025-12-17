// content.js

console.log("Content script running...")

url = document.querySelector("meta[property='og:url']").content;
chrome.runtime.sendMessage({
    type: "url",
    value: url
});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "refresh") {
        window.location.reload();
    }
});

console.log("Content script finished");
// window.location.reload();



// // Inject a small script into page to hook history API so we get SPA navigation events.
// (function injectHistorySpy() {
//   const script = document.createElement("script");
//   script.textContent = `
//     (function() {
//       const _push = history.pushState;
//       const _replace = history.replaceState;
//       history.pushState = function() {
//         const res = _push.apply(this, arguments);
//         window.dispatchEvent(new CustomEvent('lbx_navigation'));
//         return res;
//       };
//       history.replaceState = function() {
//         const res = _replace.apply(this, arguments);
//         window.dispatchEvent(new CustomEvent('lbx_navigation'));
//         return res;
//       };
//       window.addEventListener('popstate', () => window.dispatchEvent(new CustomEvent('lbx_navigation')));
//     })();
//   `;
//   (document.head||document.documentElement).appendChild(script);
//   script.remove();
// })();

// let activeRun = null; // { startURL, goalURL, started, startTime, path: [{title,url,timestamp}] }
// let lastRecordedUrl = location.href;

// // Utility to compare two letterboxd URLs by pathname (ignore trailing slash)
// function normalizePath(u) {
//   try {
//     const p = new URL(u, location.origin).pathname.replace(/\/+$/, "");
//     return p;
//   } catch (e) {
//     return u;
//   }
// }

// function isLetterboxdInternal(url) {
//   try {
//     const u = new URL(url, location.origin);
//     return u.hostname === location.hostname;
//   } catch (e) {
//     return false;
//   }
// }

// function getPageMeta() {
//   const title = document.querySelector("h1") ? document.querySelector("h1").innerText.trim() : document.title;
//   return { title: title || document.title, url: location.href, ts: Date.now() };
// }

// async function loadRunState() {
//   return new Promise(resolve => {
//     chrome.storage.local.get(["wikiRun"], data => {
//       resolve(data && data.wikiRun ? data.wikiRun : null);
//     });
//   });
// }

// async function clearRunState() {
//   return new Promise(resolve => {
//     chrome.storage.local.remove(["wikiRun"], () => resolve());
//   });
// }

// async function init() {
//   const run = await loadRunState();
//   if (!run) return;
//   // If there's an active run saved, start tracking only when we are on the startURL.
//   activeRun = {
//     startURL: run.startURL,
//     goalURL: run.goalURL,
//     started: false,
//     startTime: null,
//     path: []
//   };
//   // If we are already on the start, start immediately
//   if (normalizePath(location.href) === normalizePath(activeRun.startURL)) {
//     startTimerAndRecord();
//   }
//   // Otherwise wait for navigation to start
// }

// function startTimerAndRecord() {
//   if (!activeRun) return;
//   if (activeRun.started) return;
//   activeRun.started = true;
//   activeRun.startTime = Date.now();
//   // record the initial page
//   const meta = getPageMeta();
//   activeRun.path.push(meta);
//   lastRecordedUrl = location.href;
//   showBadgeTimer(); // optional UI feedback via badge (if wanted)
//   console.log("WikiRun started at", new Date(activeRun.startTime), meta);
// }

// // record a page visit if internal and different from last
// function recordIfNew() {
//   if (!activeRun || !activeRun.started) return;
//   const cur = location.href;
//   if (!isLetterboxdInternal(cur)) return;
//   if (normalizePath(cur) === normalizePath(lastRecordedUrl)) return;
//   const meta = getPageMeta();
//   activeRun.path.push(meta);
//   lastRecordedUrl = cur;
//   console.log("Recorded:", meta.title, cur);
//   checkForGoal();
// }

// // Stop the run: save results and notify background to open results page
// function finishRun() {
//   if (!activeRun || !activeRun.started) return;
//   const endTime = Date.now();
//   const totalMs = endTime - activeRun.startTime;
//   const data = {
//     startURL: activeRun.startURL,
//     goalURL: activeRun.goalURL,
//     startTime: activeRun.startTime,
//     endTime,
//     durationMs: totalMs,
//     steps: activeRun.path.length,
//     path: activeRun.path
//   };
//   // clear wikiRun from storage (we're done)
//   clearRunState().then(() => {
//     chrome.runtime.sendMessage({ type: "runFinished", data }, resp => {
//       // finished
//       activeRun = null;
//       console.log("Run finished", data);
//     });
//   });
// }

// function checkForGoal() {
//   if (!activeRun) return;
//   if (normalizePath(location.href) === normalizePath(activeRun.goalURL)) {
//     finishRun();
//   }
// }

// function showBadgeTimer() {
//   // Optional: post message to background to set extension badge - omitted for lightweight template.
// }

// // listen for SPA navigation events
// window.addEventListener("lbx_navigation", () => {
//   // small delay to allow DOM update
//   setTimeout(() => {
//     if (!activeRun) {
//       // check if a saved run exists (maybe popup started one after page load)
//       loadRunState().then(run => {
//         if (run) {
//           activeRun = {
//             startURL: run.startURL,
//             goalURL: run.goalURL,
//             started: false,
//             startTime: null,
//             path: []
//           };
//           if (normalizePath(location.href) === normalizePath(activeRun.startURL)) startTimerAndRecord();
//         }
//       });
//       return;
//     }
//     // If run exists but not started and we navigated to start, start
//     if (!activeRun.started && normalizePath(location.href) === normalizePath(activeRun.startURL)) {
//       startTimerAndRecord();
//       return;
//     }
//     recordIfNew();
//   }, 250);
// });

// // Also track normal clicks (in case navigation doesn't trigger pushState)
// document.addEventListener("click", (e) => {
//   // let the navigation happen, then check afterwards
//   setTimeout(() => {
//     if (!activeRun) return;
//     recordIfNew();
//   }, 300);
// });

// // Also check on page load (in case popup navigated us)
// window.addEventListener("load", () => {
//   setTimeout(() => {
//     loadRunState().then(run => {
//       if (!run) return;
//       // If we are on the start page and run exists, start
//       activeRun = {
//         startURL: run.startURL,
//         goalURL: run.goalURL,
//         started: false,
//         startTime: null,
//         path: []
//       };
//       if (normalizePath(location.href) === normalizePath(activeRun.startURL)) startTimerAndRecord();
//     });
//   }, 300);
// });

// // initialize from stored run if present
// init();
