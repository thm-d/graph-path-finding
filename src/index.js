import "./assets/styles/index.scss";
import { Priority_queue_min } from "./assets/javascripts/priority_queue_min";
import { drawFinalPath, drawMatrix } from "./assets/javascripts/canvas";


const matrixSize = [ 50, 50 ];
const matrix = [];
const startingVertex = [ 1, 1 ];
const endingVertex = [ 41, 48 ];
const nbrOfObstacles = 500;

// 0 bloc / 1 sommet / 2 file / 3 visité / 4 départ / 5 arrivée
for (let i = 0; i < matrixSize[0]; i++) {
  matrix[i] = [];
  for (let j = 0; j < matrixSize[1]; j++) {
    matrix[i][j] = 1;
  }
}

for (let i = 0; i < nbrOfObstacles; i++) {
  const x = Math.floor(Math.random() * matrixSize[0]);
  const y = Math.floor(Math.random() * matrixSize[0]);
  matrix[x][y] = 0;
}

matrix[startingVertex[0]][startingVertex[1]] = 4;
matrix[endingVertex[0]][endingVertex[1]] = 5;

const getManhattanDistance = (x, y, endingVertex) => {
  return Math.abs(x - endingVertex[0]) + Math.abs(y - endingVertex[1]);
};

const getAdjacencyVertices = (x, y, matrix, matrixSize) => {
  const adjacencyVertices = [];
  // north
  if (y > 0 && matrix[x][y - 1] !== 0) {
    adjacencyVertices.push([ x, y - 1 ]);
  }
  // west
  if (x > 0 && matrix[x - 1][y] !== 0) {
    adjacencyVertices.push([ x - 1, y ]);
  }
  // south
  if (y < matrixSize[1] - 1 && matrix[x][y + 1] !== 0) {
    adjacencyVertices.push([ x, y + 1 ]);
  }
  // east
  if (x < matrixSize[0] - 1 && matrix[x + 1][y] !== 0) {
    adjacencyVertices.push([ x + 1, y ]);
  }
  return adjacencyVertices;
};

const astar = async (matrix, matrixSize, startingVertex, endingVertex, cb) => {
  const dist = {};
  const prev = {};
  const heap = new Priority_queue_min();
  const score = {};

  for (let i = 0; i < matrixSize[0]; i++) {
    for (let j = 0; j < matrixSize[1]; j++) {
      const vertexName = `${ i }-${ j }`;
      score[vertexName] = getManhattanDistance(i, j, endingVertex);
      prev[vertexName] = null;
      if (i === startingVertex[0] && j === startingVertex[j]) {
        dist[vertexName] = 0;
        heap.insert({ vertex: [ i, j ], priority: score[vertexName] });
      } else {
        dist[vertexName] = Infinity;
      }
    }
  }

  while (!heap.isEmpty()) {
    await cb();
    const { vertex: currentVertex } = heap.extractMin();
    if ((currentVertex[0] !== startingVertex[0] || currentVertex[1] !== startingVertex[1])
      && (currentVertex[0] !== endingVertex[0] || currentVertex[1] !== endingVertex[1])) {
      matrix[currentVertex[0]][currentVertex[1]] = 3;
    }
    if (currentVertex[0] === endingVertex[0] && currentVertex[1] === endingVertex[1]) {
      const path = [ `${ endingVertex[0] }-${ endingVertex[1] }` ];
      let prevVertex = prev[`${ endingVertex[0] }-${ endingVertex[1] }`];
      while (prevVertex) {
        path.push(prevVertex);
        prevVertex = prev[prevVertex];
      }
      return path.reverse();
    } else {
      const currentVertexName = `${ currentVertex[0] }-${ currentVertex[1] }`;
      const distance = dist[currentVertexName] + 1;
      for (let adjacencyVertex of getAdjacencyVertices(currentVertex[0], currentVertex[1], matrix, matrixSize)) {
        const adjacencyVertexName = `${ adjacencyVertex[0] }-${ adjacencyVertex[1] }`;
        if (dist[adjacencyVertexName] > distance) {
          dist[adjacencyVertexName] = distance;
          prev[adjacencyVertexName] = currentVertexName;
          score[adjacencyVertexName] = distance + getManhattanDistance(adjacencyVertex[0], adjacencyVertex[1], endingVertex);
          if ((adjacencyVertex[0] !== startingVertex[0] || adjacencyVertex[1] !== startingVertex[1])
            && (adjacencyVertex[0] !== endingVertex[0] || adjacencyVertex[1] !== endingVertex[1])) {
            matrix[adjacencyVertex[0]][adjacencyVertex[1]] = 2;
          }
          heap.insert({
            vertex: adjacencyVertex,
            priority: score[adjacencyVertexName]
          });
        }
      }
    }
  }
};

const main = async () => {
  const path = await astar(matrix, matrixSize, startingVertex, endingVertex, async () => {
    drawMatrix(matrix, matrixSize);
    return new Promise(r => setTimeout(r, 10));
  });
  path && drawFinalPath(path, matrixSize);
};

main();

const restart = document.querySelector("#restart");
const divContent = document.querySelector(".content");
restart.addEventListener("click", () => {
  location.reload();
});


