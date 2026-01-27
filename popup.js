// popup.js
const startInput = document.getElementById("search-start");
const goalInput = document.getElementById("search-goal");
const randomStart = document.getElementById("random-start");
const randomGoal = document.getElementById("random-goal");
const stopwatch = document.getElementById("stopwatch");
const startRunBtn = document.getElementById("start-run");
const searchBlock = document.getElementById("search-block");
const returnBtn = document.getElementById("return");
const saveBtn = document.getElementById("save");
const statsReturnBtn = document.getElementById("stats-return");
const clearStatsBtn = document.getElementById("clear-stats");
const runDisplay = document.getElementById("run-display");
const statsDisplay = document.getElementById("stats-display");
const statsBarsNums = document.getElementById("stats-bars-nums");
const statsBars = document.getElementById("stats-bars");
const statsBarsItems = document.getElementById("stats-bars-items");
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

function fixInput(input) {
  console.log(input);
  inputArray = input.split("/");
  console.log(inputArray);
  inputArray.pop();
  inputArray.pop();
  input = inputArray.join("/") + "/";
  console.log(input);
  return input;
}



chrome.runtime.onMessage.addListener(async (message) => {           // listener for receiving info from navigating letterboxd pages

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

      await stop();
      let minutes = Math.floor(difference / 60000);
      let seconds = Math.floor((difference % 60000) / 1000);
      let milliseconds = Math.floor(difference % 1000);
      // Format time to ensure leading zeros
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;
      
      document.getElementById("minutes").textContent = minutes;
      document.getElementById("seconds").textContent = seconds;
      document.getElementById("milliseconds").textContent = milliseconds;


      searchBlock.style.display = "none";
      startBtns.style.display = "none";
      exitDiv.style.display = "none";
      returnBtn.style.display = "block";
      endBtns.style.display = "block";
      playSound('sounds/fnaf.mp3');
      playSound('sounds/happy_wheels.mp3');


      let { wins = 0 } = await chrome.storage.local.get("wins");          // stats calculations
      await wins++; 
      await chrome.storage.local.set( {wins} );


      let { winStreak = 0 } = await chrome.storage.local.get("winStreak");
      await winStreak++;
      await chrome.storage.local.set( {winStreak} );


      let { shortestPathLength = Infinity } = await chrome.storage.local.get("shortestPathLength");
      if (path.length < shortestPathLength) {
        shortestPathLength = path.length;
        await chrome.storage.local.set( {shortestPathLength} );
      }


      let { avgPathLength = 0 } = await chrome.storage.local.get("avgPathLength");
      avgPathLength = ((avgPathLength * (wins - 1)) + path.length) / wins;
      await chrome.storage.local.set( {avgPathLength} );


      let { longestPathLength = 0 } = await chrome.storage.local.get("longestPathLength");
      if (path.length > longestPathLength) {
        longestPathLength = path.length;
        await chrome.storage.local.set( {longestPathLength} );
      }
      

      let { shortestTime = Infinity } = await chrome.storage.local.get("shortestTime");
      if (difference < shortestTime) {
        shortestTime = difference;
        await chrome.storage.local.set( {shortestTime} );
      }
      

      let { avgTime = 0 } = await chrome.storage.local.get("avgTime");
      avgTime = ((avgTime * (wins - 1)) + difference) / wins;
      await chrome.storage.local.set( {avgTime} );


      let { longestTime = 0 } = await chrome.storage.local.get("longestTime");
      if (difference > longestTime) {
        longestTime = difference;
        await chrome.storage.local.set( {longestTime} );
      }

      let { mostVisited = {} } = await chrome.storage.local.get("mostVisited");
      path.forEach(item => {
        if (mostVisited[item]) {
          //console.log("revisited page");
          mostVisited[item]++;
        }
        else {
          mostVisited[item] = 1;
        }
        
        console.log(mostVisited);
      });
      await chrome.storage.local.set( {mostVisited} );

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
    document.getElementById("path").innerText = `${pathList}`;
  }
  else {
    path = [];
  }
});



startRunBtn.addEventListener("click", async () => {         // listener for initializing the run on button click
  if (goalInput.value && startInput.value) {
    if (goalInput.value.split("/").length > 6) {
      goalInput.value = fixInput(goalInput.value);
    }
    if (startInput.value.split("/").length > 6) {
      startInput.value = fixInput(startInput.value);
    }
    
    await startRun(goalInput.value, startInput.value);
    
  }
});

randomBtn.addEventListener("click", async () => {         // listener for random goal button
  // make a startRun function that basically does what the startRunBtn event listener does, passing in a goal url
  // need functionality to go to the url of a random movie and display the url of the goal
  // console.log("Random button clicked");

  dicePng.style.display = "none";
  randomText.style = "display: block; padding: 16px; font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 35px; height: 70px; position: relative; margin-top: 2px; bottom: 7px;";

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
      startInput.value = movies[startIndex].url;
      goalInput.value = movies[goalIndex].url;
      startRun(goalInput.value, startInput.value);
    }
  });
});

randomStart.addEventListener("click", async () => {
  //console.log("random start button clicked");
  startInput.value = await fillRandom();
});

randomGoal.addEventListener("click", async () => {
  goalInput.value = await fillRandom();
});

async function fillRandom() {
  if (Object.keys(movies).length === 0) {
    const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

    tab = tabs[0];

    await chrome.scripting.executeScript({    
      target: { tabId: tab.id },              
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(tab.id, { type: "randomPress" });

    while (Object.keys(movies).length === 0) {
      console.log("Waiting for movies to be populated...");
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
    }
  }

  return movies[Math.floor(Math.random() * Object.keys(movies).length)].url;
}

statsBtn.addEventListener("click", async () => {         // listener for stats button
  searchBlock.style.display = "none";
  startBtns.style.display = "none";
  exitDiv.style.display = "none";
  stopwatch.style.display = "none";

  statsDisplay.style.display = "block";
  statsBtns.style.display = "block";

  data = await chrome.storage.local.get(null);

  document.getElementById("winsNum").textContent = data.wins || 0;
  document.getElementById("winStreakNum").textContent = data.winStreak || 0;
  document.getElementById("shortestPathLengthNum").textContent = data.shortestPathLength || "N/A";
  document.getElementById("avgPathLengthNum").textContent = data.avgPathLength ? data.avgPathLength.toFixed(2) : "N/A";
  document.getElementById("longestPathLengthNum").textContent = data.longestPathLength || "N/A";
  document.getElementById("shortestTimeNum").textContent = data.shortestTime ? (data.shortestTime / 1000).toFixed(2) + "s" : "N/A";
  document.getElementById("avgTimeNum").textContent = data.avgTime ? (data.avgTime / 1000).toFixed(2) + "s" : "N/A";
  document.getElementById("longestTimeNum").textContent = data.longestTime ? (data.longestTime / 1000).toFixed(2) + "s" : "N/A";
  console.log("wins: ", data.wins);
  console.log("win streak: ", data.winStreak);
  console.log("shortest length: ", data.shortestPathLength);
  console.log("average length: ", data.avgPathLength);
  console.log("longest length:", data.longestPathLength);
  console.log("shortest time:", data.shortestTime);
  console.log("average time:", data.avgTime);
  console.log("longest time:", data.longestTime);
  console.log("most visited: \n", data.mostVisited);
  // finish for times and then probably make displays for those and then work on graph

  

  // dynamically create side by side vertical green bars for top 10 most visited pages with the counts on top, or substituting for 0 and "---" if undefined data
  statsBars.innerHTML = ""; // Clear previous bars
  statsBarsNums.innerHTML = "";
  statsBarsItems.innerHTML = "";

  let entries = [];
  

  if (data.mostVisited) {
    entries = Object.entries(data.mostVisited);
    entries.sort(([, a], [, b]) => b - a);
  }

  let item;
  let num;
  let highest = 0;

  for (let i = 0; i < 10; i++) {
    if (entries[i]) {
      // cut off item length to 20 characters with a ... at the end if longer
      item = entries[i][0];
      item = item.length > 20 ? item.slice(0, 17) + "..." : item;
      num = entries[i][1];
      highest = entries[0][1];
    }
    else {
      item = "---";
      num = 0;
    }
    
    //console.log(item);

    const barNum = document.createElement("div");
    barNum.className = "flex-child bar-num";
    barNum.style.width = "20px";
    barNum.style.marginRight = "16px";
    barNum.style.textAlign = "center";
    barNum.style.position = "relative";
    barNum.style.bottom = "-10px";
    barNum.innerText = num;

    const bar = document.createElement("div");
    bar.className = "flex-child bar";
    bar.style.width = "20px";
    if (num === 0) {
      bar.style.height = "2%";
    }
    else {
      bar.style.height = `${num / highest * 100}%`;
    }
    bar.style.marginRight = "16px";
    bar.style.textAlign = "center";
    bar.style.backgroundColor = "#00E054";

    const barItem = document.createElement("div");
    barItem.className = "flex-child rotate bar-item";
    barItem.style.width = "20px";
    barItem.style.marginRight = "16px";
    barItem.style.textAlign = "left";
    barItem.style.position = "relative";
    barItem.style.top = "-20px";
    barItem.innerText = item;

    



    statsBarsNums.appendChild(barNum);
    statsBars.appendChild(bar);
    statsBarsItems.appendChild(barItem);
  }

  

  // const { paths = [] } = await chrome.storage.local.get("paths");
  // let wins = 67
  // await chrome.storage.local.set({ wins });
  // console.log(await chrome.storage.local.get("wins"));
  
  await labelSpacing();
  await loadData();
});

function labelSpacing() {
  labels = document.getElementById("stats-bars-items").children;
  console.log(labels)
  const data = Array.from(labels).map(element => element.innerText);
  console.log(data);
  const items = data.map(item => item.toString());

  const longestLength = Math.max(
    ...items.map(str => str.length)
  );

  console.log("Longest label length:", longestLength);

  const charWidth = 7.5;          // px, for ~12pt font
  const angleRad = 60 * Math.PI / 180;

  const paddingBottom =
    Math.ceil(longestLength * charWidth * Math.sin(angleRad)) - 20;

  statsBarsItems.style.paddingBottom = `${paddingBottom}px`;
}

      
async function loadData() {
  document.getElementById("saved-runs-list").innerHTML = "";
  data = await chrome.storage.local.get("paths");
  if (!data.paths) {
    data.paths = [];
  }
  for (let i = 0; i < data.paths.length; i++) {

    const statsEntry = document.createElement("div");
    const timeEntry = document.createElement("span");
    statsEntry.style.border = "3px solid #444C56";
    statsEntry.style.padding = "6px 10px 12px";
    statsEntry.style.marginTop = "10px";
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
  // let { winStreak = 0 } = await chrome.storage.local.get("win-streak");
  let winStreak = 0;
  await chrome.storage.local.set( {winStreak} );
  returnToMenu();
});

returnBtn.addEventListener("click", async () => {         // listener for restarting on return button click
  returnToMenu();
});

statsReturnBtn.addEventListener("click", async () => {         // listener for returning from stats display
  returnToMenu();
});

clearStatsBtn.addEventListener("click", async () => {         // listener for clearing stats
  await chrome.storage.local.clear();

  document.getElementById("winsNum").textContent = 0;
  document.getElementById("winStreakNum").textContent = 0;
  document.getElementById("shortestPathLengthNum").textContent = "N/A";
  document.getElementById("avgPathLengthNum").textContent = "N/A";
  document.getElementById("longestPathLengthNum").textContent = "N/A";
  document.getElementById("shortestTimeNum").textContent = "N/A";
  document.getElementById("avgTimeNum").textContent = "N/A";
  document.getElementById("longestTimeNum").textContent = "N/A";

  Array.from(document.getElementsByClassName("bar-num")).forEach(element => {
    element.innerHTML = "0";
  });
  Array.from(document.getElementsByClassName("bar")).forEach(element => {
    element.style.height = "2%";
  });
  Array.from(document.getElementsByClassName("bar-item")).forEach(element => {
    element.innerHTML = "---";
  });
  labelSpacing();

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
  
});

function returnToMenu() {
  // randomBtn.innerHTML = randomHTML;
  // randomBtn.style = randomStyle;
  
  dicePng.style.display = "block";
  searchBlock.style.display = "block";
  startBtns.style.display = "block";
  stopwatch.style.display = "block";
  randomText.style.display = "none";
  returnBtn.style.display = "none";
  exitDiv.style.display = "none";
  runDisplay.style.display = "none";
  endBtns.style.display = "none";
  statsDisplay.style.display = "none";
  statsBtns.style.display = "none";
  saveBtn.textContent = "Save";
  document.getElementById("minutes").textContent = "00";
  document.getElementById("seconds").textContent = "00";
  document.getElementById("milliseconds").textContent = "000";
  difference = 0;
  path = [];
}

function getMovieOrCrewName(input) {
  const doc = new DOMParser().parseFromString(
    input,
    "text/html"
  );

  if (input.match("letterboxd.com/film")) {
      return (doc.querySelector("meta[property='og:title']").content);
  }
  else {
      let h1 = doc.querySelector("div[class='contextual-title']");
      let span = h1.querySelector("span[class='context']");
      return h1.textContent.replace(span.textContent, "").trim();
  }
}

function getDirectorAndCast(input) {
  const doc = new DOMParser().parseFromString(
    input,
    "text/html"
  );

  directorHTML = doc.querySelectorAll("span[class='prettify']");
  const directors = [...directorHTML].map(el => el.textContent);
  console.log(directors);

  castHTML = doc.querySelectorAll('div.cast-list.text-sluglist p a');
  const actors = [...castHTML].slice(0, 3).map(el => el.textContent);
  console.log(actors);

  return { directors, actors };
}

function getMoviesFromCrew(input) {
  const doc = new DOMParser().parseFromString(
    input,
    "text/html"
  );

  topMoviesHTML = doc.querySelectorAll('li.tooltip.griditem div.react-component');
  const topMovies = [...topMoviesHTML].slice(0, 5).map(el => el.getAttribute("data-item-name")); 
  console.log(topMovies);  

  return topMovies;
}

async function startRun(goalInputValue, startInputValue) {
  let uhhhhhhh = false;
  let directors, actors, goalName, topMovies = [];
  path = [];

  // get all recent letterboxd tabs
  const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

  
  tab = tabs[0]; // pick the first Letterboxd tab aka the most recent one aka the one the user is on

  if (startInputValue != tabs[0].url) {
    uhhhhhhh = true;
    chrome.tabs.sendMessage(tab.id, { type: "navigateToUrl", payload: startInputValue});
  }

  // console.log("Goal URL before fetching HTML:", goalInputValue);
  let response = await chrome.runtime.sendMessage({ type: "requestTargetHTML", payload: goalInputValue });
  let goalHTML = response["html"];
  let isFilmPage = response["isFilmPage"];



  goalName = getMovieOrCrewName(goalHTML);
  if (isFilmPage) {
    // grab director names and three first actors
    let response = getDirectorAndCast(goalHTML); 
    // console.log(response.directors, response.actors);
    directors = response["directors"];
    actors = response["actors"];

    if (directors.length === 0) {
      directors = ["N/A"];
    }
    if (actors.length === 0) {
      actors = ["N/A"];
    }
  }
  else {
    // grab three first films
    topMovies = getMoviesFromCrew(goalHTML);
    if (topMovies.length === 0) {
      topMovies = ["N/A"];
    }
  }

  
  




  await chrome.scripting.executeScript({    // pretty much refreshes the content script otherwise it's 'out of date' after the
    target: { tabId: tab.id },              // extension is refreshed and theres nothing to catch the message to refresh
    files: ["content.js"]
  });

  // Send a message to the content script running in that tab
  if (!uhhhhhhh) {
    chrome.tabs.sendMessage(tab.id, { type: "refresh" });
  }
  // hide goal text and box, display pertinent info and path
  searchBlock.style.display = "none";
  runDisplay.style.display = "block";
  // runDisplay.querySelector("label[for='goal']").innerHTML = `<b><br><div style="font-size: large; font-family: 'Graphik', sans-serif; font-weight: 600;">Target: </div></b><div style="font-size: small; font-family: 'Graphik', sans-serif; font-weight: 400; color: #99AABB;">${goalName}</div>`;
  
  if (isFilmPage) {
    document.getElementById("target").innerHTML = `
    <div style="display: flex; margin-top: 10px; align-items: stretch;">
      <div class="flex-child" style="border: 3px solid #444C56; width: 55%; padding: 10px; font-size: 30px; color: #00E054;">
        ${goalName}
      </div>
      <div class="flex-child" style="position: relative; width: 30%; margin-left: 10px; font-size: 20px; gap: 10px; display: flex; flex-direction: column; justify-content: space-between;">
        <div class="" style="border: 3px solid #444C56; width: 100%; padding: 10px; font-size: 12px;"><span style="color: #40BCF4; font-size: 16px;">${directors.join(', ')}</span><br>DIRECTOR(S)</div>
        <div class="" style="border: 3px solid #444C56; width: 100%; padding: 10px; font-size: 12px;"><span style="color: #FF8000; font-size: 16px;">${actors.join(', ')}</span><br>STARRING</div>
      </div>
    </div><br>`;
  }
  else {
    document.getElementById("target").innerHTML = `
    <div style="display: flex; margin-top: 10px; align-items: stretch;">
      <div class="flex-child" style="border: 3px solid #444C56; width: 35%; padding: 10px; font-size: 30px; color: #00E054;">
        ${goalName}
      </div>
      <div class="flex-child" style="border: 3px solid #444C56; padding: 10px; margin-left: 10px; width: 50%; font-size: 12px;">
        <span style="color: #40BCF4; font-size: 16px;">${topMovies.join('<br>')}</span><br>TOP MOVIES
      </div>
    </div><br>`;
  }



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

async function start() {
  // Start the stopwatch
  startTime = Date.now() - difference;
  tInterval = setInterval(updateDisplay, 10); // Update every 10ms for precision
  running = true;
}

async function stop() {
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
