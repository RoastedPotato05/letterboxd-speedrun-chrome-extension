// // results.js
// document.getElementById("close").addEventListener("click", () => window.close());

// function formatDuration(ms) {
//   const s = Math.floor(ms / 1000);
//   const m = Math.floor(s / 60);
//   const remS = s % 60;
//   return `${m}:${remS.toString().padStart(2, "0")}`;
// }

// chrome.storage.local.get(["lastRun"], data => {
//   const run = data && data.lastRun;
//   if (!run) {
//     document.getElementById("meta").textContent = "No run data found.";
//     return;
//   }
//   const metaEl = document.getElementById("meta");
//   metaEl.innerHTML = `
//     <strong>From:</strong> <a href="${run.startURL}" target="_blank">${run.startURL.replace("https://letterboxd.com","")}</a>
//     &nbsp;&nbsp;
//     <strong>To:</strong> <a href="${run.goalURL}" target="_blank">${run.goalURL.replace("https://letterboxd.com","")}</a>
//     <br/>
//     <strong>Time:</strong> ${formatDuration(run.durationMs)} &nbsp; <strong>Steps:</strong> ${run.steps}
//   `;

//   const pathEl = document.getElementById("path");
//   pathEl.innerHTML = "";
//   for (const step of run.path) {
//     const li = document.createElement("li");
//     const a = document.createElement("a");
//     a.href = step.url;
//     a.target = "_blank";
//     a.textContent = step.title + " — " + step.url.replace("https://letterboxd.com","");
//     li.appendChild(a);
//     pathEl.appendChild(li);
//   }
// });
