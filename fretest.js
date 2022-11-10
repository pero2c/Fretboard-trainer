let notesArraySharps = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

let notesArrayFlats = ["A♭", "A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G"];

let tuningSet = {
  standard: ["E", "A", "D", "G", "B", "E"],
  dropD: ["D", "A", "D", "G", "B", "E"],
  dStandard: ["D", "G", "C", "F", "A", "D"],
  dropC: ["C", "G", "C", "F", "A", "D"],
  cStandard: ["C", "F", "A#", "D#", "G", "C"]
}

let currentTuning = tuningSet.standard;

let customTuning;

let customTuningActive = false;

let markerFretNumbers = [3, 5, 7, 9, 15, 17, 19, 21];

let doubleMarkerFretNumbers = [12, 24];

let stringQuantity = currentTuning.length;

let fretQuantity = 24;

let currentFret = "null";

let solution;

let noteToFretGameActive = false;

let score = 0;

let timeElapsed = 0;

let timeLimit = 60;

let fretButtonCSS = document.styleSheets[0].cssRules[3];

let fretFontSize = fretButtonCSS.style.getPropertyValue("font-size");

//VARIABLES FOR HTML ELEMENTS

let tableBody = document.getElementById("table-body");
let questionBox = document.getElementById("questionbox");
let answerBox = document.getElementById("answerbox");
let scoreTracker = document.getElementById("scoretracker");
let showNoteToggle = document.getElementById("shownotetoggle");
let startButton = document.getElementById("startbutton");
let resetButton = document.getElementById("resetbutton");
let timeLimitInput = document.getElementById("timelimit");
let highScoreTracker = document.getElementById("highscore");
let timeCounter = document.getElementById("timecount");
let tuningSelector = document.getElementById("tuningselector");
let stringQuantitySelector = document.getElementById("stringquantityselector");
let stringToggleDiv = document.getElementById("stringtogglediv");
let customTuningCheckbox = document.getElementById("customtuningcheckbox");

function advance(note, steps) {
  let stepsTaken = 0;
  let startingPosition = notesArraySharps.indexOf(note);
  for(let i = startingPosition; i < notesArraySharps.length; i++){
    if(stepsTaken == steps){
      return notesArraySharps[i];
    }
    if(i == notesArraySharps.length - 1){
      i = -1;
    }
    stepsTaken++;
  }
}

function noteArray(stringBaseNote) {
  let point = notesArraySharps.indexOf(stringBaseNote);
  let baseArray = notesArraySharps.slice(point).concat(notesArraySharps.slice(0, point));
  return baseArray
  .concat(baseArray)
  .concat(baseArray[0]);
}

function fretInfo(string, note, fret, id){
  currentFret = {string: string, note: note, fret: fret, id: id};
  checkSolution();
  console.log(currentFret);
}

//TABLE STUFF

function clearTable() {
  let table = document.querySelector('table');
  table.remove();
}

function createTable(tuning, stringsnumber = stringQuantity) {
  //guitar tunings are written with thickest thing first, but we need to start our table with the thinnest string
  let myTuning = [...tuning];
  myTuning.reverse();
  let tbl = document.createElement("table");
  let tblBody = document.createElement("tbody");
  tbl.setAttribute("id", "fret-table");
  tblBody.setAttribute("id", "table-body")
  for(let i = 0; i < stringsnumber; i++){
    let row = document.createElement("tr");
    row.setAttribute("id", `string-${i + 1}`);
  
  for(let j = 0; j <= fretQuantity; j++){
    let cell = document.createElement("td");
    let arr = noteArray(myTuning[i]);
    let btn = document.createElement("button");
    btn.textContent = `${arr[j]}`;
    btn.setAttribute("id", `${i + 1}-${arr[j]}`);
    btn.setAttribute("class", "fret-button");
    btn.addEventListener("click", () => fretInfo(i, arr[j], j, btn.id));
    cell.setAttribute("class", "fret-cell");
    cell.appendChild(btn);
    row.appendChild(cell);
    if(j == 0) {
      cell.setAttribute("class", "empty-note");
      btn.setAttribute("class", "empty-button");
    }
  }
  tblBody.appendChild(row);
}

//create fret markers and append them to table

const markerRow = document.createElement("tr");

  for(let k = 0; k < fretQuantity + 1; k++){
    const markerCell = document.createElement("td");
    if(markerFretNumbers.includes(k)){
      markerCell.textContent = "⚫"
    } else if(doubleMarkerFretNumbers.includes(k)) {
      markerCell.textContent = "⚫⚫"
    }
      else {
      markerCell.textContent = null;
  }
  markerCell.setAttribute("class", "marker-cell");
  markerRow.appendChild(markerCell);
}
tblBody.appendChild(markerRow);

//finalizing the table

tbl.appendChild(tblBody);
document.body.appendChild(tbl);
document.getElementById("tablediv").appendChild(tbl);
}

//create string toggle checkboxes

function createStringToggles() {
  for(let i = 0; i < stringQuantity; i++){
    let myDiv = document.createElement("div");
    myDiv.className = ("stringtogglediv")
    let stringToggle = document.createElement("input");
    stringToggle.type = ("checkbox");
    stringToggle.id = (`stringtoggle-${i + 1}`);
    stringToggle.className = ("togglecheckbox");
    stringToggle.checked = true;
    myDiv.appendChild(stringToggle);
    stringToggleDiv.appendChild(myDiv);
  }
}

//"GAME" STUFF

function randomSelector() {
  let activeStrings = checkActiveStrings();
  let myNum = activeStrings.length;
  let magicNum = Math.floor(Math.random() * myNum);
  let randomString = activeStrings[magicNum];
  let randomNote = notesArraySharps[Math.floor(Math.random() * notesArraySharps.length)];
  highlighter(randomString);
  solution = `${randomString}-${randomNote}`;
  questionBox.textContent = `${randomNote}`;
}

function checkSolution() {

function correctAnswer() {
  answerBox.textContent = "Correct";
  if(noteToFretGameActive){
    score++;
    scoreTracker.textContent = `Score: ${score}`;
  }
}

function wrongAnswer() {
  answerBox.textContent = "Wrong"
}

currentFret.id == solution ? correctAnswer() : wrongAnswer(); 
randomSelector();
}

//highlight the string the user needs to find the note on

function highlighter(string) {
for(let i = 1; i <= stringQuantity; i++) {
  document.getElementById(`string-${i}`).className = "normal-string";
}
document.getElementById(`string-${string}`).className = "highlighted-string";
}

//high score tracker

let scores = [];

function setHighScore() {
let highScore = scores.reduce((a, b) => Math.max(a, b), 0);
highScoreTracker.textContent = `High score: ${highScore}`;
}

//timer stuff

function setText() {
  timeCounter.textContent = `Time: ${timeElapsed}`;
}

function setTimeLimit() {
  timeLimit = timeLimitInput.value;
}

function count() {

    timeElapsed++;
    setText();

  if(timeElapsed == timeLimit){
    clearInterval(myInterval)
    scores.push(score);
    setHighScore();
    noteToFretGameActive = false;
    startButton.disabled = false;
  }
}

function startTimer() {
  randomSelector();
  startButton.disabled = true;
  if(noteToFretGameActive == false){
    timeElapsed = 0;
  }
  myInterval = setInterval(count, 1000);
  noteToFretGameActive = true;
}

function stopTimer() {
  clearInterval(myInterval);
  timeElapsed = 0;
  setText();
  score = 0;
  scoreTracker.textContent = `Score: ${score}`
  noteToFretGameActive = false;
  startButton.disabled = false;
}

startButton.addEventListener("click", startTimer);

resetButton.addEventListener("click", stopTimer);

timeLimitInput.addEventListener("change", setTimeLimit);

//UTILITIES

  //show or hide notes  

function setTuning() {

  let myTuning = tuningSelector.value;
    switch(myTuning) {
      case "estandard":
        currentTuning = tuningSet.standard;
        break;
      case "dropd":
        currentTuning = tuningSet.dropD;
        break;
      case "dstandard":
        currentTuning = tuningSet.dStandard;
        break;
      case "dropc":
        currentTuning = tuningSet.dropC;
        break;
      case "cstandard":
        currentTuning = tuningSet.cStandard;
        break;
    }
    clearTable();
    createTable(currentTuning);
}

tuningSelector.addEventListener("change", setTuning);

showNoteToggle.addEventListener("change", toggleNoteView);

function toggleNoteView() {
  if(showNoteToggle.checked){
    fretButtonCSS.style.setProperty("font-size", "15px");
  } else {
    fretButtonCSS.style.setProperty("font-size", "0px");
  }
}

let customTuningSelectors = document.getElementById("customtuningselectors");

function createCustomTuningControls() {

if(customTuningActive) {
  for(let i = 0; i < stringQuantity; i++) {
  
    let noteSelector = document.createElement("select");
    for(let j = 0; j < notesArraySharps.length; j++){
      noteSelector.add(new Option(notesArraySharps[j], notesArraySharps[j]));
    }
    noteSelector.id = `customstring-${i}`;
    noteSelector.className = "noteselector"
    noteSelector.addEventListener("change", setCustomTuning);
    customTuningSelectors.appendChild(noteSelector);
}
console.log("ran createCustomTuningControls")
}

}

function setCustomTuning() {
let myArr = [];

if(customTuningActive) {
  for(let i = 0; i < stringQuantity; i++) {
    myArr.push(document.getElementById(`customstring-${i}`).value)
  }
  
  currentTuning = myArr;
  
  clearTable();
  createTable(myArr);
}
}

function setStringQuantity() {
//clear existing controls so they don't stack up
  //clear string toggles
  let toggles = document.getElementsByClassName("stringtogglediv");
  Array.from(toggles).forEach((toggle) => toggle.remove());
  //clear custom note selectors
  let selectors = document.getElementsByClassName("noteselector");
  Array.from(selectors).forEach((selector) => selector.remove());
    if(customTuningActive) {
      stringQuantity = parseInt(stringQuantitySelector.value, 10);
    } else {
      stringQuantity = 6;
    }

createStringToggles();
createCustomTuningControls();
setCustomTuning();
}

stringQuantitySelector.addEventListener("change", setStringQuantity);

function toggleCustomTuningControls() {
  let selectors = document.getElementsByClassName("noteselector");

  if(!customTuningCheckbox.checked) {
    customTuningActive = false;
    setStringQuantity();
    setTuning();
    Array.from(selectors).forEach((selector) => selector.disabled = true);
    tuningSelector.disabled = false;
    stringQuantitySelector.disabled = true;
  }

  if(customTuningCheckbox.checked) {
    customTuningActive = true;
    setStringQuantity();
    setCustomTuning();
    Array.from(selectors).forEach((selector) => selector.disabled = false);
    tuningSelector.disabled = true;
    stringQuantitySelector.disabled = false;
  }
}

customTuningCheckbox.addEventListener("change", toggleCustomTuningControls);

function checkActiveStrings() {
  let myArr = [];
  for(let i = 1; i <= stringQuantity; i++) {
    let checkbox = document.getElementById(`stringtoggle-${i}`);
    if(checkbox.checked){
      myArr.push(i);
    }
  }
  return myArr;
}

function init() {

  stringQuantitySelector.value = "6";

  tuningSelector.value = "estandard";

  customTuningCheckbox.checked = false;

  createTable(tuningSet.standard);

  createCustomTuningControls();

  setStringQuantity();

  toggleCustomTuningControls();

  randomSelector();

  score = 0;

  timeLimitInput.value = 60;

}

init();