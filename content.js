// content.js

console.log("Content script running...")

letterboxdData = {}


chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "refresh") {
        window.location.reload();
    }
    if (message.type === "navigateToUrl") { 
      console.log("Navigating to URL:", message.payload); 
      window.location.href = message.payload; 
    }
    if (message.type === "randomPress") {
      chrome.runtime.sendMessage(
      { type: "requestPopularHTML" },
      async response => {
        if (!response || response.error) {
          console.error("Failed to get HTML", response?.error);
          return;
        }

        console.log("Received HTML length:", response.html.length);

        const doc = new DOMParser().parseFromString(
          response.html,
          "text/html"
        );

        // const movies = [...doc.querySelectorAll(".film-poster")]
        //   .map(el => el.getAttribute("data-film-name"));

        movies = doc.querySelectorAll("li.posteritem > div.react-component");

        items = {};
        i = 0;

        for (let item of movies) {
            const title = item.getAttribute("data-item-name");
            const url = "https://letterboxd.com" + item.getAttribute("data-target-link");
            items[i] = { title: title, url: url };
            i += 1;
        }
        console.log(items);

        chrome.runtime.sendMessage({
            type: "popularMovies",
            payload: items
        });
    
      }
      );
    }
});

letterboxdData.url = document.querySelector("meta[property='og:url']").content;

if (letterboxdData.url.match("letterboxd.com/film")) {
    letterboxdData.item = document.querySelector("meta[property='og:title']").content;
}
else {
    h1 = document.querySelector("div[class='contextual-title']");
    span = h1.querySelector("span[class='context']");
    letterboxdData.item = h1.textContent.replace(span.textContent, "").trim();
}


chrome.runtime.sendMessage({
    type: "letterboxdData",
    payload: letterboxdData
});


console.log("Content script finished");