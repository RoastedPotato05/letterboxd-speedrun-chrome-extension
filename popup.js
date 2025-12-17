// popup.js
// const startInput = document.getElementById("search-start");
const goalInput = document.getElementById("search-goal");
const startRunBtn = document.getElementById("start-run");
const status = document.getElementById("status");
const searchBlock = document.getElementById("search-block");
const victory = document.getElementById("victory");
const returnBtn = document.getElementById("return");

let startTime;
let updatedTime;
let difference = 0;
let tInterval;
let running = false;
const display = document.getElementById("display");
const startStopButton = document.getElementById("startStopButton");
const resetButton = document.getElementById("resetButton");


chrome.runtime.onMessage.addListener((message) => {
  if (message.value === goalInput.value) {
    startStop();
    searchBlock.style.display = "none";
    startRunBtn.style.display = "none";
    victory.style.display = "block";
    returnBtn.style.display = "block";
  }
});

startRunBtn.addEventListener("click", async () => {
  if (goalInput.value) {
    // get all recent letterboxd tabs
    const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

    tab = tabs[0]; // pick the first Letterboxd tab aka the most recent one aka the one the user is on

    await chrome.scripting.executeScript({    // pretty much refreshes the content script otherwise it's 'out of date' after the
      target: { tabId: tab.id },              // extension is refreshed and theres nothing to catch the message to refresh
      files: ["content.js"]
    });

    // Send a message to the content script running in that tab
    chrome.tabs.sendMessage(tab.id, { type: "refresh" });

    // start stopwatch
    startStop();
  }
});

returnBtn.addEventListener("click", async () => {
  searchBlock.style.display = "block";
  startRunBtn.style.display = "block";
  victory.style.display = "none";
  returnBtn.style.display = "none";
  display.innerHTML = "00:00.000"
  difference = 0;
});



startStopButton.addEventListener("click", startStop);
resetButton.addEventListener("click", reset);

function startStop() {
    if (!running) {
        // Start the stopwatch
        startTime = Date.now() - difference;
        tInterval = setInterval(updateDisplay, 10); // Update every 10ms for precision
        startStopButton.innerHTML = "Stop";
        running = true;
    } else {
        // Stop the stopwatch
        clearInterval(tInterval);
        startStopButton.innerHTML = "Start";
        running = false;
        difference = Date.now() - startTime; // Save elapsed time
    }
}

function reset() {
    // Stop the timer, reset values, and update display to zero
    clearInterval(tInterval);
    running = false;
    difference = 0;
    startStopButton.innerHTML = "Start";
    display.innerHTML = "00:00.000";
}

function updateDisplay() {
    updatedTime = new Date(Date.now() - startTime);
    let hours = updatedTime.getUTCHours();
    let minutes = updatedTime.getUTCMinutes();
    let seconds = updatedTime.getUTCSeconds();
    let milliseconds = updatedTime.getUTCMilliseconds();
    // Format time to ensure leading zeros
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;
    display.innerHTML = minutes + ":" + seconds + "." + milliseconds;
}

// display.innerHTML = goalInput.value


// let startItem = null;
// let goalItem = null;
// let searchTimer = null;

// function debounce(fn, wait) {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), wait);
//   };
// }

// async function doSearch(query) {
//   if (!query || query.trim().length === 0) return [];
//   return new Promise((resolve) => {
//     chrome.runtime.sendMessage({ type: "search", query }, resp => {
//       resolve((resp && resp.results) || []);
//     });
//   });
// }

// function renderResults(listEl, items, onSelect) {
//   listEl.innerHTML = "";
//   if (!items || items.length === 0) {
//     const li = document.createElement("li");
//     li.textContent = "No results";
//     listEl.appendChild(li);
//     return;
//   }
//   for (const it of items) {
//     const li = document.createElement("li");
//     if (it.thumb) {
//       const img = document.createElement("img");
//       img.src = it.thumb;
//       li.appendChild(img);
//     }
//     const txt = document.createElement("div");
//     txt.innerHTML = `<strong>${escapeHtml(it.name)}</strong><div style="font-size:12px;color:#666">${it.url.replace("https://letterboxd.com","")}</div>`;
//     li.appendChild(txt);
//     li.addEventListener("click", () => onSelect(it));
//     listEl.appendChild(li);
//   }
// }

// function escapeHtml(s) {
//   return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
// }

// const doStartSearch = debounce(async () => {
//   const q = startInput.value.trim();
//   startResults.innerHTML = "<li>Searching…</li>";
//   const items = await doSearch(q);
//   renderResults(startResults, items, (it) => {
//     startItem = it;
//     startChosen.textContent = `${it.name} — ${it.url.replace("https://letterboxd.com", "")}`;
//     startResults.innerHTML = "";
//     maybeEnableStart();
//   });
// }, 300);

// const doGoalSearch = debounce(async () => {
//   const q = goalInput.value.trim();
//   goalResults.innerHTML = "<li>Searching…</li>";
//   const items = await doSearch(q);
//   renderResults(goalResults, items, (it) => {
//     goalItem = it;
//     goalChosen.textContent = `${it.name} — ${it.url.replace("https://letterboxd.com", "")}`;
//     goalResults.innerHTML = "";
//     maybeEnableStart();
//   });
// }, 300);

// startInput.addEventListener("input", doStartSearch);
// goalInput.addEventListener("input", doGoalSearch);

// function maybeEnableStart() {
//   startRunBtn.disabled = !(startItem && goalItem);
// }

// startRunBtn.addEventListener("click", async () => {
//   if (!startItem || !goalItem) return;
//   startRunBtn.disabled = true;
//   status.textContent = "Starting run…";
//   chrome.runtime.sendMessage({ type: "startRun", startURL: startItem.url, goalURL: goalItem.url }, resp => {
//     if (resp && resp.ok) {
//       status.textContent = "Run started — navigate in the tab to begin. Timer will start on the start page.";
//     } else {
//       status.textContent = "Error starting run.";
//     }
//     setTimeout(() => { startRunBtn.disabled = false; }, 700);
//   });
// });

// // optionally load last run info (nice UX)
// document.addEventListener("DOMContentLoaded", () => {
//   chrome.storage.local.get(["wikiRun"], data => {
//     if (data && data.wikiRun) {
//       status.textContent = "Saved run: will start on next Start Run (or when you click Start).";
//     }
//   });
// });
