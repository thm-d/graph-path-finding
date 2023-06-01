const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const canvasSize = [ canvas.width, canvas.height ];

// 0 bloc / 1 sommet / 2 file / 3 visité / 4 départ / 5 arrivée
const drawSquare = (x, y, type, squareSize) => {
  ctx.strokeStyle = "#ddd";
  switch (type) {
    case 0:
      ctx.fillStyle = "#4b4b4b";
      break;
    case 1:
      ctx.fillStyle = "#f5f6fa";
      break;
    case 2:
      ctx.fillStyle = "#ffcccc";
      break;
    case 3:
      ctx.fillStyle = "#6a89cc";
      break;
    case 4:
      ctx.fillStyle = "#ff4d4d";
      break;
    case 5:
      ctx.fillStyle = "#32ff7e";
      break;
    default:
      break;
  }
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
};

export const drawMatrix = (matrix, matrixSize) => {
  const squareSize = canvasSize[0] / matrixSize[0];
  ctx.beginPath();
  for (let i = 0; i < matrixSize[0]; i++) {
    for (let j = 0; j < matrixSize[1]; j++) {
      drawSquare(i, j, matrix[i][j], squareSize);
    }
  }
  ctx.closePath();
};

export const drawFinalPath = (path, matrixSize) => {
  const squareSize = canvasSize[0] / matrixSize[0];
  ctx.beginPath();
  // [ '1-1', '1-2', '2-2', ... ]
  for (let i = 0; i < path.length - 1; i++) {
    if (i !== 0 && i !== path.length - 1) {
      const [ x, y ] = path[i].split("-").map(i => +i);
      ctx.fillStyle = "#fff200";
      ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
  }
  ctx.closePath();
};

