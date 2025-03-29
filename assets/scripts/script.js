const panel_one = document.getElementById("scroll-target_one");
const panel_two = document.getElementById("scroll-target_two");
const panel_three = document.getElementById("scroll-target_three");

panel_one.addEventListener("click", () => {
  const headerSection = document.querySelector(".header_section");
  headerSection.scrollIntoView({ behavior: "smooth" });
});
panel_two.addEventListener("click", () => {
  const headerSection = document.querySelector(".header_section_two");
  headerSection.scrollIntoView({ behavior: "smooth" });
});

panel_three.addEventListener("click", () => {
  const headerSection = document.querySelector(".header_section_three");
  headerSection.scrollIntoView({ behavior: "smooth" });
});
function allowDrop(event) {
  event.preventDefault(); // Разрешаем сброс

  const target = event.target;
  if (
    target.classList.contains("square_tile") &&
    target.style.backgroundImage === ""
  ) {
    event.dataTransfer.dropEffect = "copy";
  } else {
    event.dataTransfer.dropEffect = "none";
  }
}

function drag(event) {
  const draggedElement = event.target;
  event.dataTransfer.setData("text/plain", draggedElement.className);
}

function setTargetBackground(target, draggedElement) {
  const backgroundImage =
    window.getComputedStyle(draggedElement).backgroundImage;
  target.style.backgroundImage = backgroundImage;
  target.style.backgroundColor = "#5a7248";
}

function allTilesFilled() {
  const squareTiles = document.querySelectorAll(".square_tile");
  return Array.from(squareTiles).every(
    (tile) => tile.style.backgroundImage !== ""
  );
}

function updateText() {
  const textElement = document.getElementById("lost_bug");
  textElement.innerHTML = "Отлично!";
}

function setBugImage() {
  const bugTile = document.querySelector(".square_tile17");
  bugTile.style.backgroundImage = "url(/assets/images/bug.png)";
}

function drop(event) {
  event.preventDefault();

  const data = event.dataTransfer.getData("text/plain");
  const draggedElement = document.querySelector(`.${data.replace(/ /g, ".")}`);
  const target = event.target;

  if (!draggedElement) {
    console.error("Элемент не найден:", data);
    return;
  }

  const validTargets = {
    btn_arrow_2: ["square_tile5", "square_tile8"],
    btn_arrow_3: ["square_tile13"],
    btn_arrow_4: [
      "square_tile2",
      "square_tile3",
      "square_tile10",
      "square_tile11",
      "square_tile15",
      "square_tile16",
    ],
    btn_arrow_5: ["square_tile4"],
    btn_arrow_6: ["square_tile6"],
    btn_arrow_7: ["square_tile7"],
    btn_arrow_8: ["square_tile9"],
    btn_arrow_9: ["square_tile12"],
    btn_arrow_10: ["square_tile14"],
  };

  for (const [btnClass, targetClasses] of Object.entries(validTargets)) {
    if (
      draggedElement.classList.contains(btnClass) &&
      targetClasses.some((cls) => target.classList.contains(cls))
    ) {
      setTargetBackground(target, draggedElement);

      if (allTilesFilled()) {
        updateText();
        setBugImage();
      }

      return;
    }
  }

  console.error(
    "Элемент не может быть сброшен: ячейка уже занята или недопустима"
  );
}

const draggableElements = document.querySelectorAll(".btn");
draggableElements.forEach((element) => {
  element.addEventListener("dragstart", drag);
});

const squareTiles = document.querySelectorAll(".square_tile");
squareTiles.forEach((square) => {
  square.addEventListener("drop", drop);
  square.addEventListener("dragover", allowDrop);
});

document.querySelectorAll(".bug").forEach((bug) => {
  bug.addEventListener("click", function () {
    this.classList.add("rotate");
  });
});
// Пазл

const pazzleParts = document.querySelectorAll(".pazzle_part");
let currentDraggable = null;
let offsetX, offsetY;

pazzleParts.forEach((part) => {
  part.addEventListener("dragstart", (e) => {
    currentDraggable = part;
    offsetX = e.clientX - part.getBoundingClientRect().left;
    offsetY = e.clientY - part.getBoundingClientRect().top;

    setTimeout(() => {
      part.style.display = "none";
    }, 0);
  });

  part.addEventListener("dragend", () => {
    setTimeout(() => {
      if (currentDraggable) {
        currentDraggable.style.display = "block";
        currentDraggable = null;
      }
    }, 0);
  });
});

const frame = document.querySelector(".frame");
const frameCells = document.querySelectorAll(".frame_cell");
const textFour = document.getElementById("text_four");

frame.addEventListener("dragover", (e) => {
  e.preventDefault(); // Разрешаем перетаскивание
});

frame.addEventListener("drop", (e) => {
  e.preventDefault();
  const rect = frame.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (currentDraggable) {
    // Устанавливаем позицию с учетом смещения
    currentDraggable.style.left = `${x - offsetX}px`;
    currentDraggable.style.top = `${y - offsetY}px`;
  }
});
frame.addEventListener("mousemove", (e) => {
  if (currentDraggable) {
    currentDraggable.style.display = "block";
    currentDraggable.style.position = "absolute";
    currentDraggable.style.left = `${e.clientX - offsetX}px`;
    currentDraggable.style.top = `${e.clientY - offsetY}px`;
  }
});

frameCells.forEach((cell) => {
  cell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cell.addEventListener("drop", (e) => {
    e.preventDefault();

    if (currentDraggable) {
      const computedStyle = getComputedStyle(currentDraggable);
      const backgroundImage = computedStyle.backgroundImage;

      if (cell.style.backgroundImage.length === 0) {
        cell.style.backgroundImage = backgroundImage;
        cell.style.backgroundSize = "cover";
        currentDraggable.style.display = "none";
        currentDraggable = null;
      }

      checkAllCellsFilled();
    }
  });
});

function checkAllCellsFilled() {
  let allFilled = true;

  frameCells.forEach((cell) => {
    if (!cell.style.backgroundImage) {
      allFilled = false;
    }
  });

  if (allFilled) {
    textFour.textContent = "Отлично!";
  }
}
