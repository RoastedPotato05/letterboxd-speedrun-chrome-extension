chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://letterboxd.com/", active: true });
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 475,
    height: 540
  });
});

let cachedPopularHTML = null;

async function fetchPopularPages(totalPages = 10) {
  let combinedHTML = '';

  for (let page = 1; page <= totalPages; page++) {
    const url = `https://letterboxd.com/films/ajax/popular/page/${page}/?esiAllowFilters=true`;

    try {
      const res = await fetch(url);
      const html = await res.text();
      combinedHTML += html; // just concatenate the HTML fragments
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err);
    }
  }

  cachedPopularHTML = combinedHTML;
  return combinedHTML;
}

async function requestTargetHTML(url) {
  let html;
  try {
      const res = await fetch(url);
      html = await res.text();
  } catch (err) {
    console.error(`Error fetching URL ${url}:`, err);
    return null;
  }
  return html;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "requestPopularHTML") {

    // If already fetched, reuse it
    if (cachedPopularHTML) {
      sendResponse({ html: cachedPopularHTML });
      return;
    }

    fetchPopularPages()
      .then(html => sendResponse({ html }))
      .catch(err => sendResponse({ error: err.message }));

    return true; // async
  }
  if (msg.type === "requestTargetHTML") {
    const url = msg.payload;
    //console.log("Fetching HTML for URL:", url);

    const isFilmPage = url.includes("letterboxd.com/film");

    requestTargetHTML(url)
      .then(html => { sendResponse({html, isFilmPage}); })
      .catch(err => { sendResponse({html:null, isFilmPage});
    });
    return true; // async
  }

});

chrome.webNavigation.onCommitted.addListener(
  async (details) => {
    if (details.transitionQualifiers?.includes("forward_back")) {
      //console.log("Back/forward navigation detected:", details.url);

      const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

      tab = tabs[0];

      // chrome.tabs.sendMessage(tab.id, { type: "refresh" });
      await chrome.scripting.executeScript({    
        target: { tabId: tab.id },              
        files: ["content.js"],
      });


    }
  },
  { url: [{ schemes: ["http", "https"] }] }
);