  // Get the canvas element
  var canvas = document.getElementById('myGraph');
  var ctx = canvas.getContext('2d');

  // Set canvas size to the window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var oldCanvasWidth = window.innerWidth;
  var oldCanvasHeight = window.innerHeight;
  let nodeConst = 0.06;

  let maxDepth = 4;
  //sortare i nodi per profondità
  //le label dei nodi devono essere uniche, bugfixxa
  // problema di aggiornamento label :)))))))
  // mi sa che c'è un problema di bottoni non eliminati :))))
  // gestire i bottoni premuti :)

  let teams = ["Alberico", "Bartolomeo", "Marta","Damon", "Everest", "Francesco", "Geronimo", "Hilton", "Icaro", "Jago", "Karl", "Lorenzo", "Michele", "Napoleone", "Oscar", "Pietro"];

  let maxteamlength = 0;
  for(i = 0; i < teams.length; i++) {
    if(teams[i].length > maxteamlength) {
      maxteamlength = teams[i].length;
    }
  }
  let games = [];
  numNodes = [];
  
  class GameTree {
    static idCounter = 0;
    
    constructor(label, depth, sx=null, dx=null) {
      this.label = label+ '_' + GameTree.idCounter++;
      this.sx = sx;
      this.dx = dx;
      this.clickable = true;
      this.clicked = false;
      this.depth = depth;
    }
  }

  class LimitedStack {
    constructor(limit) {
      this.limit = limit;
      this.stack = [];
    }
    

    push(value) {
      if (this.stack.length >= this.limit) {
        this.stack.shift();
      }
      this.stack.push(JSON.parse(JSON.stringify(value)));
    }

    pop() { 
      return this.stack.pop();
    }
  }

  let stackModifiche = new LimitedStack(10);

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  document.addEventListener("keydown", function(event) {
    // Check if the "Ctrl" key is pressed and the key pressed is "Z"
    if (event.ctrlKey && event.key === "z") {
      // Handle the "Ctrl+Z" event
      handleGoBackArrowClick();
    }
  });

  function handleGoBackArrowClick() {
    //console.log("Before pop: ", stackModifiche.stack, games);
    popped = stackModifiche.pop();
    //console.log("Popped: ", popped);
    if(popped != undefined) {
      games = popped;
    }
    //console.log("After pop: ", stackModifiche.stack, games);
    drawGraph(true);
  };
 
  function updateWinner(games){
    for(let i = 0; i < games.length; i++) {
      //console.log(graph.nodes.find(node => node.id === games[i].label));
      //console.log(graph.nodes.find(node => node.id === games[i].label).clicked);
      
      //console.log("grafo", graph.nodes)
      let nodosx = graph.nodes.find(node => node.id === games[i].sx.label);
      let nododx = graph.nodes.find(node => node.id === games[i].dx.label);
      
      //console.log("nodo sinistro cliccato: ", nodosx, nodosx.clicked)
      if(games[i].sx != null &&  nodosx.clicked) {
        games[i].label = games[i].sx.label.split("_")[0]+'_' + GameTree.idCounter++;
        //nodo.id = games[i].label;
        games[i].sx.clicked = true;
        games[i].sx.clickable = false;
        games[i].dx.clickable = false;
      }
      if(games[i].dx != null && nododx.clicked) {
        games[i].label = games[i].dx.label.split("_")[0]+'_' + GameTree.idCounter++;
        //nodo.id = games[i].label;
        games[i].dx.clicked = true;
        games[i].sx.clickable = false;
        games[i].dx.clickable = false;
      }
      //console.log("nodi update winner", nodosx, nododx);
    }
  }


  function mergeGames(games, first = false) {
    let newGames = [];
    for (let i = 0; i < games.length; i++) {
        for (let j = i + 1; j < games.length; j++) {
            //console.log(graph.nodes.find(node => node.id === games[i].label));
            label1 = games[i].label.split("_")[0];
            label2 = games[j].label.split("_")[0];
            if (games[i].depth === games[j].depth && label1 != "?" && label2 != "?"){
                // Create a new GameTree by merging the current pair of games

                let mergedGame = new GameTree(
                    "?",
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
    // Add the remaining games to the newGames array
    newGames = games.concat(newGames);
    newGames.sort((a, b) => a.depth - b.depth);
    console.log("newGames" ,newGames);
    return newGames;
  }

  // Sample graph data
  var graph = {
    nodes: [],
    edges: []
  };

  function drawTree(game) {

    //console.log("drawTree", game.label, "cliccabile", game.clickable, "cliccato",  game.clicked)
    //console.log(game.label, game.depth, numNodes[game.depth] + 1, 2 ** game.depth + 1, canvas.width * (numNodes[game.depth] + 1) / (2 ** game.depth + 1), canvas.height * (game.depth + 1) / (maxDepth + 2))
    graph.nodes.push({
        id: game.label,
        x: canvas.width * (numNodes[game.depth] + 1) / (2 ** game.depth + 1),
        y: canvas.height * (game.depth + 1) / (maxDepth + 2),
        clickable: game.clickable,
        clicked: game.clicked
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
    graph.nodes = [];
    graph.edges = [];
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

  function handleclick(node) {
    //drawPressedButton(node);
    if(confirm("Ha vinto " + node.id.split("_")[0] + "?") == false){
      return;
    }
    node.clicked = true;
    graph.nodes.find(n => n.id === node.id).clicked = true;
    //console.log(node.id + " cliccato", node.clicked, node);
    let lastlen = games.length;
    //let lastGame = JSON.parse(JSON.stringify(games));
    //console.log("Before updateWinner:", node);
    stackModifiche.push(games);
    updateWinner(games);
    //console.log("After updateWinner:", node);
    

    games = mergeGames(games);
    drawGraph();
  }

  let clickhandler = []
  let overhandler = []

  function curryEvent(node, nodeSize, functionName) {
    return function (event) {
        functionName(event, node, nodeSize);
    };
  }


    
    // Function to draw the node circle
function drawNodeCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

// Function to draw the node label
function drawNodeLabel(text, x, y, nodeSize) {
  ctx.fillStyle = 'black';
  let fontSize = nodeSize * 0.8 / (Math.sqrt(text.length)); // Adjust the factor as needed
  ctx.font = `${fontSize}px Arial`;
  ctx.fillText(text, x - (text.length) / (maxteamlength + 2) * nodeSize, y, nodeSize * 2);
  ctx.fillStyle = 'white';
}

// Function to draw the shadow
function drawNodeShadow() {
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = -2;
  ctx.shadowOffsetY = 0.5;
}

// Function to reset shadow properties
function resetShadowProperties() {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function createButton(text, top, left, className, node, radius) {
  var button = document.createElement("button");
  button.innerHTML = text;
  let boxShadowdefault = "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset";
  let boxShadowpressed = "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset";
  let boxShadowhover = "rgba(45, 85, 255, 0.4) 5px 5px, rgba(45, 85, 255, 0.3) 10px 10px, rgba(45, 85, 255, 0.2) 15px 15px, rgba(45, 85, 255, 0.1) 20px 20px, rgba(45, 85, 255, 0.05) 25px 25px";

  // Position the button
  button.style.position = "absolute";
  button.style.top = top-radius + "px";
  button.style.left = left-radius + "px";

  button.style.width = 2*radius + "px";
  button.style.height = 2*radius + "px";

  button.style.textShadow = "1px 1px 2px rgba(0,0,0,0.5)";

  button.style.backgroundColor = "rgba(173,216,230, 1)";
  //button.style.border = "none";

  button.style.color = "black";

  button.style.shadowBlur = 5;
  button.style.shadowColor = "black";
  button.style.shadowOffsetX = -2;
  button.style.shadowOffsetY = 2;
  button.style.boxShadow = boxShadowdefault;
  



  // Add class to the button
  button.classList.add(className);

  // Make the button circular
  button.style.borderRadius = "50%";

  if (node.clickable && scrivi !== "?") {
  // Add click event listener to the button
    button.addEventListener("click", function() {
        button.style.boxShadow= boxShadowpressed;
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        sleep(1).then(() => { handleclick(node); });

    });

    button.addEventListener("mouseover", function() {
        button.style.cursor = "pointer";
        button.style.boxShadow= boxShadowhover+", " + boxShadowdefault; 
    });
    button.addEventListener("mouseout", function() {
        button.style.boxShadow= boxShadowdefault;
    });
  }
  // Append the button to the body
  document.body.appendChild(button);
}


// Function to draw the entire node
function drawNode(node) {
  ctx.fillStyle = 'white';
  let nodeSize = Math.min(canvas.width, canvas.height) * nodeConst; // Adjust the factor as needed

  // Draw the button shadow
  //drawNodeShadow();

  // Draw the node circle
  //drawNodeCircle(node.x, node.y, nodeSize);

  // Reset shadow properties
  //resetShadowProperties();

  // Draw the node label
  scrivi = node.id.split("_")[0];
  drawNodeLabel("", node.x, node.y, nodeSize);

  createButton(scrivi, node.y, node.x, "removeable", node, nodeSize);
  
}


function removeSpecificButtons() {
  var removeableButtons = document.querySelectorAll(".removeable");

  removeableButtons.forEach(function(button) {
      button.remove();
  });
}

   // Function to draw the graph
  function drawGraph(back = false) {
    
    // Clear the canvas
    for(i = 0; i <= maxDepth; i++) {
      numNodes[i] = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    removeSpecificButtons();
    drawTrees(games);
    // Draw edges
    graph.edges.forEach(drawEdge);
    // Draw nodes
    graph.nodes.forEach(drawNode);
  }

  // Call the drawGraph function
  

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
  // Get maxTeams and teams from local storage
  const storedMaxTeams = localStorage.getItem("maxTeams");
  const storedTeams = localStorage.getItem("teams");

  // Use the stored values or set default values
  const maxTeams = storedMaxTeams ? parseInt(storedMaxTeams) : 8;
  teams = storedTeams ? JSON.parse(storedTeams) : ["Alberico", "Bartolomeo", "Marta", "Damon", "Everest", "Francesco", "Geronimo", "Hilton", "Icaro", "Jago", "Karl", "Lorenzo", "Michele", "Napoleone", "Oscar", "Pietro"];

  // Set maxDepth based on the length of teams
  maxDepth = Math.log2(teams.length);
  nodeConst = 0.1-0.012*maxDepth;
  // Reset the games array
  games = [];

  // Check if the number of teams is a power of 2
  assert(teams.length === 2 ** maxDepth, "Number of teams must be a power of 2");

  // Initialize the games array
  for (let i = 0; i < teams.length; i++) {
    games.push(new GameTree(teams[i], maxDepth));
  }

  // Merge games and draw the graph
  games = mergeGames(games, true);
  drawGraph();
}

// Call the start function
start();