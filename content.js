// content.js

console.log("Content script running...")

letterboxdData = {}

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




chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "refresh") {
        window.location.reload();
    }
});

console.log("Content script finished");