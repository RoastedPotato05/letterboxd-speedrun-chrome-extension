// popup.js
// const startInput = document.getElementById("search-start");
const goalInput = document.getElementById("search-goal");
const startRunBtn = document.getElementById("start-run");
const status = document.getElementById("status");
const searchBlock = document.getElementById("search-block");
const victory = document.getElementById("victory");
const returnBtn = document.getElementById("return");
const runDisplay = document.getElementById("run-display");

let startTime;
let updatedTime;
let difference = 0;
let tInterval;
let running = false;
let uhhhhh = false;
let music = false;
let path = [];
const display = document.getElementById("display");
const startStopButton = document.getElementById("startStopButton");
const resetButton = document.getElementById("resetButton");

function fixGoalInput() {
  console.log(goalInput.value);
  inputArray = goalInput.value.split("/");
  console.log(inputArray);
  inputArray.pop();
  inputArray.pop();
  goalInput.value = inputArray.join("/") + "/";
  console.log(goalInput.value);
}



chrome.runtime.onMessage.addListener((message) => {           // listener for receiving info from navigating letterboxd pages
  
  if (uhhhhh && running) {
    playSound('sounds/vine_boom.mp3');      // whenever a run starts 2 messages are sent and
  }                                         // i dont want 2 vine booms so idk just dont play the first one
  uhhhhh = true;
  
  if (running) {
    if (message.payload.url === goalInput.value) {
      path.push(message.payload.item);
      stop();
      searchBlock.style.display = "none";
      startRunBtn.style.display = "none";
      victory.style.display = "block";
      returnBtn.style.display = "block";
      playSound('sounds/fnaf.mp3');
      playSound('sounds/happy_wheels.mp3');
      
    }
    else {
      item = message.payload.item;
      if (path.includes(item)) {
        index = path.findIndex(x => x === item);
        path = path.slice(0, index)
      }
      path.push(item);
    }

    pathList = path.join(" => ");
    runDisplay.querySelector("label[for='path']").innerHTML = `<br/><div style="font-size: large; font-family: 'Graphik', sans-serif; font-weight: 600;"><b>Path:</b></div><div style="font-size: small; font-family: 'Graphik', sans-serif; font-weight: 400; color: #99AABB;">${pathList}</div>`;
  }
  else {
    path = [];
  }
});



startRunBtn.addEventListener("click", async () => {         // listener for initializing the run on button click
  if (goalInput.value) {
    if (goalInput.value.split("/").length > 6) {
      fixGoalInput();
    }
    

    // get all recent letterboxd tabs
    const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

    tab = tabs[0]; // pick the first Letterboxd tab aka the most recent one aka the one the user is on

    await chrome.scripting.executeScript({    // pretty much refreshes the content script otherwise it's 'out of date' after the
      target: { tabId: tab.id },              // extension is refreshed and theres nothing to catch the message to refresh
      files: ["content.js"]
    });

    // Send a message to the content script running in that tab
    chrome.tabs.sendMessage(tab.id, { type: "refresh" });

    // hide goal text and box, display "path"
    searchBlock.style.display = "none";
    runDisplay.style.display = "block";
    runDisplay.querySelector("label[for='goal']").innerHTML = `<b><div style="font-size: large; font-family: 'Graphik', sans-serif; font-weight: 600;">Target URL: </div></b><div style="font-size: small; font-family: 'Graphik', sans-serif; font-weight: 400; color: #99AABB;">${goalInput.value}</div>`;
    


    // hide start run button
    startRunBtn.style.display = "none";

    // start stopwatch
    start();
    if (!music) {
      backgroundMusic('sounds/balatro.mp3');
      music = true
    }
  }
});

returnBtn.addEventListener("click", async () => {         // listener for restarting on return button click
  searchBlock.style.display = "block";
  startRunBtn.style.display = "block";
  victory.style.display = "none";
  returnBtn.style.display = "none";
  document.getElementById("minutes").textContent = "00";
  document.getElementById("seconds").textContent = "00";
  document.getElementById("milliseconds").textContent = "000";
  difference = 0;
});


function startStop() {                      // stopwatch stuff thanks google ai
  if (running) {
    stop();
  }
  else {
    start();
  }
}

function start() {
  // Start the stopwatch
  startTime = Date.now() - difference;
  tInterval = setInterval(updateDisplay, 10); // Update every 10ms for precision
  running = true;
}

function stop() {
  // Stop the stopwatch
  clearInterval(tInterval);
  running = false;
  difference = Date.now() - startTime; // Save elapsed time
}

function reset() {
    // Stop the timer, reset values, and update display to zero
    clearInterval(tInterval);
    running = false;
    difference = 0;
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.getElementById("milliseconds").textContent = "000";
}

function updateDisplay() {
    updatedTime = new Date(Date.now() - startTime);

    let minutes = updatedTime.getUTCMinutes();
    let seconds = updatedTime.getUTCSeconds();
    let milliseconds = updatedTime.getUTCMilliseconds();
    // Format time to ensure leading zeros
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("milliseconds").textContent = milliseconds;
}


const audioContext = new (window.AudioContext || window.webkitAudioContext)();      // sound effects

async function getBuffer(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

async function playSound(url, volume = 0.1) {
  if (audioContext.state === 'suspended') {
    await audioContext.resume(); // unlock audio on user interaction
  }

  const soundBuffer = await getBuffer(url);
  const source = audioContext.createBufferSource();
  source.buffer = soundBuffer;

  // Create a gain node to control volume
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume; // 0 = silent, 1 = full volume

   source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start(0); // Play immediately
}


async function backgroundMusic(url, volume = 0.15) {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const buffer = await getBuffer(url);

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  source.buffer = buffer;
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);  

  currentSource = source;
  source.start();
}
