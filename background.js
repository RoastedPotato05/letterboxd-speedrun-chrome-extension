chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://letterboxd.com/", active: true });
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 475,
    height: 610
  });
});

let cachedPopularHTML = null;

function parsePopularMovies(html) {
  console.log("Parsing popular movies from HTML...");
  console.log("Has film-poster:", html.includes("film-poster"));
  console.log("Has data-film-slug:", html.includes("data-film-slug"));
  console.log("HTML sample:", html.substring(0, 1000));
  const items = {};
  let i = 0;
  const re = /data-item-slug="([^"]+)"[^>]*data-item-name="([^"]+)"|data-item-name="([^"]+)"[^>]*data-item-slug="([^"]+)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const slug  = match[1] || match[4];
    const title = match[2] || match[3];
    items[i] = { title, url: `https://letterboxd.com/film/${slug}/` };
    console.log(`Parsed movie: ${title} (${slug})`);
    i++;
  }
  return items;
}

async function fetchPopularPages(totalPages = 10) {
  let combinedHTML = '';

  for (let page = 1; page <= totalPages; page++) {
    const url = `https://letterboxd.com/csi/films/films-browser-list/popular/?esiAllowFilters=true&page=${page}`;

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
  if (msg.type === "requestPopularMovies") {

    // If already fetched, reuse cached version
    if (cachedPopularHTML) {
      const items = parsePopularMovies(cachedPopularHTML);
      chrome.runtime.sendMessage({ type: "popularMovies", payload: items });
      return;
    }

    console.log("Fetching popular pages...");

    fetchPopularPages()
      .then(html => {
        console.log("Fetched popular pages: ", html.length);
        const items = parsePopularMovies(html);
        console.log("Parsed popular movies: ", items);
        chrome.runtime.sendMessage({ type: "popularMovies", payload: items });
      })
      .catch(err => console.error("fetchPopularPages error:", err));
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