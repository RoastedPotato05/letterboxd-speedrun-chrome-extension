chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 420,
    height: 265
  });
});


// // background.js
// // Handles search scraping and start-run coordination.

// const LETTERBOXD_SEARCH_BASE = "https://letterboxd.com/search/";

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg && msg.type === "search") {
//   const url = LETTERBOXD_SEARCH_BASE + encodeURIComponent(msg.query) + "/";

//   fetch(url)
//     .then(r => r.text())
//     .then(html => {
//       const results = parseLetterboxdSearch(html);
//       sendResponse({ results });
//     })
//     .catch(err => {
//       console.error("search error", err);
//       sendResponse({ results: [] });
//     });

//   return true; // keep async sendResponse alive
// }


//   if (msg && msg.type === "runFinished") {
//     // Save result to storage.local and open results page
//     chrome.storage.local.set({ lastRun: msg.data }, () => {
//       const url = chrome.runtime.getURL("results.html");
//       chrome.tabs.create({ url });
//     });
//     sendResponse({ ok: true });
//   }

//   if (msg && msg.type === "startRun") {
//     // { startURL, goalURL }
//     // Save to storage and navigate the active tab to startURL
//     chrome.storage.local.set({ wikiRun: { startURL: msg.startURL, goalURL: msg.goalURL } }, () => {
//       chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//         if (tabs[0]) {
//           chrome.tabs.update(tabs[0].id, { url: msg.startURL });
//         } else {
//           chrome.tabs.create({ url: msg.startURL });
//         }
//       });
//     });
//     sendResponse({ ok: true });
//   }
// });

// // Fetch and scrape the search page HTML to produce results
// function parseLetterboxdSearch(html) {
//   const doc = new DOMParser().parseFromString(html, "text/html");
//   const results = [];

//   const items = doc.querySelectorAll("li.search-result");

//   items.forEach(li => {
//     const a = li.querySelector("a");
//     if (!a) return;

//     const href = a.getAttribute("href");
//     if (!href) return;

//     const url = "https://letterboxd.com" + href;

//     // Try to extract possible title types

//     let title =
//       a.querySelector(".film-title")?.textContent.trim() ||
//       a.querySelector(".person-name")?.textContent.trim() ||
//       a.querySelector(".studio-name")?.textContent.trim() ||
//       a.querySelector(".list-title")?.textContent.trim() ||
//       null;

//     if (!title) return;

//     let year = a.querySelector(".film-year")?.textContent.trim() || null;

//     results.push({
//       title: year ? `${title} (${year})` : title,
//       url
//     });
//   });

//   return results;
// }
