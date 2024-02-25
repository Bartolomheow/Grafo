  // Get the canvas element
  var canvas = document.getElementById('myGraph');
  var ctx = canvas.getContext('2d');

  // Set canvas size to the window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var oldCanvasWidth = window.innerWidth;
  var oldCanvasHeight = window.innerHeight;

  let maxDepth = 3;
  

  let teams = ["A", "B", "C", "D", "E", "F", "G", "H"];
  let games = [];
  numNodes = [];
  
  class GameTree {
    constructor(label, depth, sx=null, dx=null) {
      this.label = label;
      this.sx = sx;
      this.dx = dx;
      this.x = null;
      this.y = null;
      this.clickable = true;
      this.depth = depth;
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

 
 

  function mergeGames(games) {
    let newGames = [];
    for (let i = 0; i < games.length; i++) {
        for (let j = i + 1; j < games.length; j++) {
            if (games[i].depth === games[j].depth) {
                // Create a new GameTree by merging the current pair of games
                games[i].clickable = false;
                games[j].clickable = false;
                let mergedGame = new GameTree(
                    games[i].label + games[j].label,
                    games[i].depth - 1,
                    games[i],
                    games[j]
                );

                // Add the merged game to the newGames array
                newGames.push(mergedGame);

                // Remove the merged games from the original array
                games.splice(j, 1);
                games.splice(i, 1);
                
                // Decrement i to account for the removed elements
                i--;

                // Break out of the inner loop after merging one pair
                break;
            }
        }
    }

    //console.log(newGames);
    return newGames;
  }

  // Sample graph data
  var graph = {
    nodes: [],
    edges: []
  };

  function drawTree(game) {
    console.log(game.label, game.depth, numNodes[game.depth] + 1, 2 ** game.depth + 1, canvas.width * (numNodes[game.depth] + 1) / (2 ** game.depth + 1), canvas.height * (game.depth + 1) / (maxDepth + 2))
    graph.nodes.push({
        id: game.label,
        x: canvas.width * (numNodes[game.depth] + 1) / (2 ** game.depth + 1),
        y: canvas.height * (game.depth + 1) / (maxDepth + 2)
    });
    numNodes[game.depth]++;
    if (game.sx != null) {
        graph.edges.push({ source: game.label, target: game.sx.label });
        drawTree(game.sx);
    }
    if (game.dx != null) {
        graph.edges.push({ source: game.label, target: game.dx.label });
        drawTree(game.dx);
    }
  }




  function drawTrees(games) {  
    for(i = 0; i < games.length; i++) 
      drawTree(games[i]);
  }

  function drawEdge(edge) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    var sourceNode = graph.nodes.find(node => node.id === edge.source);
    var targetNode = graph.nodes.find(node => node.id === edge.target);
    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    ctx.lineTo(targetNode.x, targetNode.y);
    ctx.stroke();
  }
  function drawNode(node) {
    ctx.fillStyle = 'white';
    let nodeSize = Math.min(canvas.width, canvas.height) * 0.075; // Adjust the factor as needed
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    let fontSize = nodeSize * 0.8/(Math.sqrt((node.id.length))); // Adjust the factor as needed
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(node.id, node.x-3/4*nodeSize, node.y, nodeSize*2);
    ctx.fillStyle = 'white';
  }

   // Function to draw the graph
  function drawGraph() {
    
    // Clear the canvas
    console.log(games);     
    for(i = 0; i <= maxDepth; i++) {
      numNodes[i] = 0;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrees(games);
    // Draw edges
    graph.edges.forEach(drawEdge);

    // Draw nodes
    graph.nodes.forEach(drawNode);
  }

  // Call the drawGraph function
  

  // Redraw the graph on window resize
 // Redraw the graph on window resize
// Redraw the graph on window resize
window.addEventListener('resize', function() {
  // Clear the canvas and update canvas dimensions
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Update graph size and redraw
  updateGraphSize();
  drawGraph();
});



// Function to update graph size based on the new canvas dimensions
function updateGraphSize() {
  graph.width = canvas.width;
  graph.height = canvas.height;

  // Update node positions based on the new canvas dimensions
  graph.nodes.forEach(function(node) {
    node.x = (node.x / oldCanvasWidth) * canvas.width;
    node.y = (node.y / oldCanvasHeight) * canvas.height;
  });

  // Update the old canvas dimensions
  oldCanvasWidth = canvas.width;
  oldCanvasHeight = canvas.height;
}

function start() {
  for(i = 0; i <= maxDepth; i++) {
    numNodes[i] = 0;
  }

  assert(teams.length === 2 ** maxDepth, "Number of teams must be a power of 2");

  for (i = 0; i<teams.length; i++) {
    games.push(new GameTree(teams[i], maxDepth));
  }

  games = mergeGames(games);
  games = mergeGames(games);
  games = mergeGames(games);
  drawGraph();
}
start();