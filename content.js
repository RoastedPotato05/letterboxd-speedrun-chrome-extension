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