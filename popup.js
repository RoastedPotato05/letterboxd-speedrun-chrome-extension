// popup.js
// const startInput = document.getElementById("search-start");
const goalInput = document.getElementById("search-goal");
const stopwatch = document.getElementById("stopwatch");
const startRunBtn = document.getElementById("start-run");
const searchBlock = document.getElementById("search-block");
const victory = document.getElementById("victory");
const returnBtn = document.getElementById("return");
const saveBtn = document.getElementById("save");
const statsReturnBtn = document.getElementById("stats-return");
const clearStatsBtn = document.getElementById("clear-stats");
const runDisplay = document.getElementById("run-display");
const statsDisplay = document.getElementById("stats-display");
const startBtns = document.getElementById("start-buttons");
const endBtns = document.getElementById("end-buttons");
const statsBtns = document.getElementById("stats-buttons");
const randomBtn = document.getElementById("random");
const dicePng = document.getElementById("dice-png");
const randomText = document.getElementById("random-text");
const statsBtn = document.getElementById("stats");
const exitBtn = document.getElementById("exit");
const exitDiv = document.getElementById("exit-div");

let randomHTML;
let randomStyle;
let startTime;
let updatedTime;
let difference = 0;
let data;
let tInterval;
let movies = {};
let running = false;
let uhhhhh = false;
let music = false;
let path = [];
const display = document.getElementById("display");

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

  if (message.type === "popularMovies") {
    console.log("Received popular movies:", message.payload);

    movies = message.payload;
  }
  if (message.type !== "letterboxdData") {
    return;
  }
  if (uhhhhh && running) {
    playSound('sounds/vine_boom.mp3');      // whenever a run starts 2 messages are sent and
  }                                         // i dont want 2 vine booms so idk just dont play the first one
  uhhhhh = true;
  
  if (running) {
    if (message.payload.url === goalInput.value) {    // win condition
      path.push(message.payload.item);
      stop();
      searchBlock.style.display = "none";
      startBtns.style.display = "none";
      exitDiv.style.display = "none";
      victory.style.display = "block";
      returnBtn.style.display = "block";
      endBtns.style.display = "block";
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
    
    await startRun(goalInput.value);
    
  }
});

randomBtn.addEventListener("click", async () => {         // listener for random goal button
  // make a startRun function that basically does what the startRunBtn event listener does, passing in a goal url
  // need functionality to go to the url of a random movie and display the url of the goal
  // console.log("Random button clicked");

  dicePng.style.display = "none";
  randomText.style = "display: block; padding: 16px; font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 35px; height: 70px; position: relative; margin-top: 2px;";

  const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

  tab = tabs[0];

  await chrome.scripting.executeScript({    
    target: { tabId: tab.id },              
    files: ["content.js"],
  });

  chrome.tabs.sendMessage(tab.id, { type: "randomPress" });

  if (Object.keys(movies).length === 0) {
    while (Object.keys(movies).length === 0) {
      console.log("Waiting for movies to be populated...");
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
    }
  }


  startIndex = Math.floor(Math.random() * Object.keys(movies).length);

  // Send a message to the content script running in that tab
  chrome.tabs.sendMessage(tab.id, { type: "navigateToUrl", payload: movies[startIndex].url});

  goalIndex = Math.floor(Math.random() * Object.keys(movies).length);

  while (goalIndex === startIndex) {
    goalIndex = Math.floor(Math.random() * Object.keys(movies).length);
  }

  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId === tab.id && info.status === "complete") {
      chrome.tabs.onUpdated.removeListener(listener);
      goalInput.value = movies[goalIndex].url;
      startRun(goalInput.value);
    }
  });
});

statsBtn.addEventListener("click", async () => {         // listener for stats button
  searchBlock.style.display = "none";
  startBtns.style.display = "none";
  exitDiv.style.display = "none";
  stopwatch.style.display = "none";

  statsDisplay.style.display = "block";
  statsBtns.style.display = "block";

  await loadData();
});

async function loadData() {
  document.getElementById("saved-runs-list").innerHTML = "";
  data = await chrome.storage.local.get("paths");
  if (!data.paths) {
    data.paths = [];
  }
  for (let i = 0; i < data.paths.length; i++) {

    const statsEntry = document.createElement("div");
    const timeEntry = document.createElement("span");
    const deleteBtn = document.createElement("button");
    statsEntry.style.border = "3px solid #444C56";
    statsEntry.style.padding = "6px 10px 12px";
    statsEntry.style.marginBottom = "10px";
    statsEntry.style.fontFamily = "'Graphik', sans-serif";
    statsEntry.style.fontSize = "14px";
    statsEntry.style.color = "#99AABB";

    let minutes = Math.floor(data.paths[data.paths.length - 1 - i].time / 60000);
    let seconds = Math.floor((data.paths[data.paths.length - 1 - i].time % 60000) / 1000);
    let milliseconds = Math.floor(data.paths[data.paths.length - 1 - i].time % 1000);
    // Format time to ensure leading zeros
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    timeEntry.innerHTML = `<b><span class="flex-child" style="font-size: 26px; width: 30%;">
                                <span id="stats-minutes" style="color: #FF8000">${minutes}</span>:<span id="stats-seconds" style="color: #00E054">${seconds}</span>.<span id="stats-milliseconds" style="color: #40BCF4">${milliseconds}</span></span></b>
                              <span class="flex-child" style="width: 30%;">
                                <button class="primary-orange delete-run" style="width: 32px; position: relative; right: -240px;"
                                run-index="${i}"><img src="images/trash.png" style="width: 24px; height: 24px; position: relative; right: 2.2px; top: 1px;"></button>
                              </span>`;
    statsEntry.appendChild(timeEntry);

    const pathEntry = document.createElement("div");
    pathEntry.textContent = `${data.paths[data.paths.length - 1 - i].path.join(" => ")}`;
    statsEntry.appendChild(pathEntry);

    document.getElementById("saved-runs-list").appendChild(statsEntry);
  }
}

function deleteRun(index) {
  data.paths.splice(data.paths.length - 1 - index, 1);
  chrome.storage.local.set({ paths: data.paths });
  console.log(data.paths);
}


document.addEventListener("click", async e => {
  if (!e.target.classList.contains("delete-run")) return;

  console.log("Delete button clicked");

  const index = parseInt(e.target.getAttribute("run-index"), 10);
  deleteRun(index);

  console.log(`Deleted run at index: ${index}`);

  await loadData();
});

exitBtn.addEventListener("click", async () => {         // listener for exiting the run
  stop();
  returnToMenu();
});

returnBtn.addEventListener("click", async () => {         // listener for restarting on return button click
  returnToMenu();
});

statsReturnBtn.addEventListener("click", async () => {         // listener for returning from stats display
  returnToMenu();
});

clearStatsBtn.addEventListener("click", async () => {         // listener for clearing stats
  await chrome.storage.local.set({ paths: [] });
  data.paths = [];
  document.getElementById("saved-runs-list").innerHTML = "";
});

saveBtn.addEventListener("click", async () => {         // listener for saving run path
  saveBtn.textContent = "Saved!";

  try {
    const { paths = [] } = await chrome.storage.local.get("paths");

    const id = paths.length;

    paths.push({ path, time:difference });

    await chrome.storage.local.set({ paths });
    // console.log(paths);
  } catch (error) {
    console.error("Error retrieving data:", error);
  }

  data.paths.push({ "path": path, "time": difference });

  await chrome.storage.local.set({ paths: data.paths });
  console.log(data.paths);
  
});

function returnToMenu() {
  // randomBtn.innerHTML = randomHTML;
  // randomBtn.style = randomStyle;
  
  dicePng.style.display = "block";
  searchBlock.style.display = "block";
  startBtns.style.display = "block";
  stopwatch.style.display = "block";
  randomText.style.display = "none";
  victory.style.display = "none";
  returnBtn.style.display = "none";
  exitDiv.style.display = "none";
  runDisplay.style.display = "none";
  endBtns.style.display = "none";
  statsDisplay.style.display = "none";
  statsBtns.style.display = "none";
  document.getElementById("minutes").textContent = "00";
  document.getElementById("seconds").textContent = "00";
  document.getElementById("milliseconds").textContent = "000";
  difference = 0;
}

async function startRun(goalInputValue) {
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
  runDisplay.querySelector("label[for='goal']").innerHTML = `<b><div style="font-size: large; font-family: 'Graphik', sans-serif; font-weight: 600;">Target URL: </div></b><div style="font-size: small; font-family: 'Graphik', sans-serif; font-weight: 400; color: #99AABB;">${goalInputValue}</div>`;
  


  // hide start run button, display exit button
  startBtns.style.display = "none";
  exitDiv.style.display = "block";

  // start stopwatch
  start();
  if (!music) {
    backgroundMusic('sounds/balatro.mp3');
    music = true
  }
}


// stopwatch stuff thanks google ai

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


async function backgroundMusic(url, volume = 0.10) {
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
