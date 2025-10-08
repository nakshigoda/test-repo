let values = [];
let blocks = [];
let i = 0, j = 0;
let sorting = false;
let intervalId;
let stepMode = false;
let historyStack = [];

function getSpeedFromSlider() {
  const slider = document.getElementById("speedControl");
  const level = parseInt(slider.value);
  return 1200 - (level * 200);
}

function updateSpeedLabel() {
  document.getElementById("speedValue").textContent = document.getElementById("speedControl").value;
}

// Start: auto-play mode
function startVisualization() {
  const input = document.getElementById("userInput").value;
  values = input.split(",").map(Number).filter(n => !isNaN(n));
  if (values.length === 0) return alert("Enter valid numbers!");

  resetBlocks();
  createBlocks(values);
  i = 0;
  j = 0;
  sorting = true;
  stepMode = false;
  historyStack = [];
  highlightLine(0);
  bubbleSortStep();
}

// Next: step-by-step mode
function nextStep() {
  if (!sorting) {
    const input = document.getElementById("userInput").value;
    values = input.split(",").map(Number).filter(n => !isNaN(n));
    if (values.length === 0) return alert("Enter valid numbers!");

    resetBlocks();
    createBlocks(values);
    i = 0;
    j = 0;
    sorting = true;
    historyStack = [];
  }

  stepMode = true;
  bubbleSortStep();
}

// Bubble Sort step logic
function bubbleSortStep() {
  if (!sorting) return;

  if (i < values.length) {
    highlightLine(0); // outer loop

    if (j < values.length - i - 1) {
      highlightLine(1); // inner loop
      highlight(j, j + 1);
      updatePointers(i, j);
      highlightLine(2); // comparison

      if (values[j] > values[j + 1]) {
        highlightLine(3); // swap

        historyStack.push({
          i,
          j,
          swapped: true,
          prevArray: [...values],
        });

        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        animateSwap(j, j + 1);
        [blocks[j], blocks[j + 1]] = [blocks[j + 1], blocks[j]];
      } else {
        historyStack.push({
          i,
          j,
          swapped: false,
          prevArray: [...values],
        });
      }

      j++;
    } else {
      j = 0;
      i++;
    }

    if (!stepMode) {
      intervalId = setTimeout(bubbleSortStep, getSpeedFromSlider());
    }
  } else {
    sorting = false;
    markSorted();
    highlightLine(-1);
  }
}

function createBlocks(arr) {
  const container = document.getElementById("blockContainer");
  container.innerHTML = "";
  blocks = [];

  arr.forEach((val, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "block-wrapper";

    const pointer = document.createElement("div");
    pointer.className = "pointer";
    pointer.id = `pointer-${idx}`;

    const block = document.createElement("div");
    block.className = "block";
    block.innerText = val;

    wrapper.appendChild(pointer);
    wrapper.appendChild(block);
    container.appendChild(wrapper);

    blocks.push(block);
  });
}


function updateBlocks() {
  blocks.forEach((block, index) => {
    block.innerText = values[index];
  });
}

function highlight(a, b) {
  blocks[a].style.backgroundColor = "#ff5722";
  blocks[b].style.backgroundColor = "#ff5722";

  setTimeout(() => {
    if (blocks[a]) blocks[a].style.backgroundColor = "#4caf50";
    if (blocks[b]) blocks[b].style.backgroundColor = "#4caf50";
  }, 400);
}

function markSorted() {
  blocks.forEach(block => {
    block.style.backgroundColor = "#2196f3";
  });
}

function pause() {
  clearTimeout(intervalId);
  sorting = false;
}

function reset() {
  pause();
  values = [];
  blocks = [];
  i = 0;
  j = 0;
  stepMode = false;
  historyStack = [];
  document.getElementById("blockContainer").innerHTML = "";
  document.getElementById("userInput").value = "";
  highlightLine(-1);
  document.querySelectorAll(".pointer").forEach(p => p.innerHTML = "");
}

function resetBlocks() {
  const container = document.getElementById("blockContainer");
  container.innerHTML = "";
  blocks = [];
}

function animateSwap(index1, index2) {
  const block1 = blocks[index1];
  const block2 = blocks[index2];

  const distance = (index2 - index1) * 60;

  block1.style.transform = `translateX(${distance}px)`;
  block2.style.transform = `translateX(${-distance}px)`;

  setTimeout(() => {
    block1.style.transform = "";
    block2.style.transform = "";

    const container = document.getElementById("blockContainer");
    if (block2.nextSibling === block1) {
      container.insertBefore(block1, block2);
    } else {
      container.insertBefore(block2, block1);
    }
  }, 500);
}

function highlightLine(lineNum) {
  for (let i = 0; i <= 3; i++) {
    const line = document.getElementById(`line${i}`);
    if (line) {
      line.classList.toggle("highlight", i === lineNum);
    }
  }
}
function updatePointers(iIndex, jIndex) {
  // Clear all previous pointer labels
  document.querySelectorAll(".pointer").forEach(p => p.innerHTML = "");

  if (typeof iIndex === "number") {
    const iPointer = document.getElementById(`pointer-${iIndex}`);
    if (iPointer) iPointer.innerHTML += `<span class="ipointer">i</span>`;
  }

  if (typeof jIndex === "number") {
    const jPointer = document.getElementById(`pointer-${jIndex}`);
    if (jPointer) jPointer.innerHTML += `<span class="jpointer">j</span>`;
  }
}

function undoStep() {
  if (!stepMode || historyStack.length === 0) {
    alert("Undo only works in step mode and after at least one step.");
    return;
  }

  const lastStep = historyStack.pop();
  values = [...lastStep.prevArray];

  i = lastStep.i;
  j = lastStep.j;

  createBlocks(values);
  highlightLine(lastStep.swapped ? 3 : 2);

  blocks[j].style.backgroundColor = "#ff9800";
  blocks[j + 1].style.backgroundColor = "#ff9800";
  setTimeout(() => {
    blocks[j].style.backgroundColor = "#4caf50";
    blocks[j + 1].style.backgroundColor = "#4caf50";
  }, 300);
}
