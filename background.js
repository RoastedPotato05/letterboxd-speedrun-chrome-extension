chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 480,
    height: 480
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
});