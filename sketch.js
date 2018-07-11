PLAYER_AMOUNT = 20;
MUTATION_RATE = 0.3;
ELITISM_AMOUNT = 1;
START_HIDDEN_SIZE = 2;

START_X = 0;
START_Y = 200;

var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.Architect;
Config.warnings = false;

var terrain;  // A list of rectangles
var neat;
var blocks = [];   // All the blocks currently playing

var fastmode = 0;
var randmode = 0;  // makes the terrain random
var buttons = [];  // List of button objects

function setup() {
  createCanvas(1000, 600);
  load_images();
  terrain = generate_terrain()//generate_terrain();
  strokeWeight(3);
  textSize(32);
  initNeat();
  startEvaluation();
}

function draw() {
  clear();
  background(150, 230, 255);
  draw_terrain();
  for (var i = 0; i < 150 * fastmode + 1; i++) {  // Run evolution frames
    run_evolution();   // Drawing takes most time, skipping this speeds up
  }
  display_interface();  // draw buttons and text
}

function generate_terrain() {
  if (!randmode) return boring_terrain();
  var i = 0;
  var rectangles = [];
  while (i < width - 60) {
    i += 50 + random(50);   // x position of a new block
    var w = 60 + random(30);   // width of this block
    color = [random(10, 30), random(70, 150), random(0, 10)];
    if (i + w > width) break;
    rectangles.push([i, height - random(300) - 50, w, height, color]);
    i += w;
  }
  return rectangles;
}

function boring_terrain() {
  // returns the same map every time, for testing purposes.
  return [[60, 400, 100, 300, [40, 50, 60]],
  [300, 400, 100, 300, [40, 50, 60]], [500, 200, 140, 600, [40, 50, 60]],
  [700, 550, 100, 300, [40, 50, 60]]]
}

function draw_terrain() {
  for (let r of terrain) {    // We loop through all rectangles and draw them
    fill(r[4]);
    rect(r[0], r[1], r[2], r[3], 10);  // draws with parameters, 10 for rounded corners
  }
}

function initNeat() {
  neat = new Neat(
    2, 2, null,
    { mutation: Methods.Mutation.ALL, //[Methods.Mutation.MOD_WEIGHT, Methods.Mutation.MOD_BIAS],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: ELITISM_AMOUNT,
      network: new Architect.Random(
        2, START_HIDDEN_SIZE, 2
      )
    }
  )
}

function startEvaluation() {
  blocks = [];

  for (let genome of neat.population) {
    new Block(genome);
  }
  terrain = generate_terrain();
}

function endEvaluation() {
  var output = "Generation " + neat.generation + " done! \t\t";
  output += "average score: " + neat.getAverage() + "\t\t";
  output += "Best: " + neat.getFittest().score;
  console.log(output);

  neat.sort();

  var newPopulation = [];

  for (var i = 0; i < ELITISM_AMOUNT; i++) {  // Gets best blocks and transfers
    newPopulation.push(neat.population[i]);   // them to next generation
  }

  for (var i = 0; i < PLAYER_AMOUNT - ELITISM_AMOUNT; i++) {
    newPopulation.push(neat.getOffspring());
  }

  neat.population = newPopulation;
  neat.mutate();
  neat.generation++;
  startEvaluation();
}

function run_evolution() {
  if (check_end()) return;
  for (let block of blocks) {
    block.update();
    if (!fastmode) block.show();
  }
}

function check_end() {
  finished = true;
  for (let block of blocks) {
    if (block.status == 0) finished = false;  // A block is still moving
  }
  if (finished) {
    endEvaluation();
    return true;
  }
  return false;
}

function mousePressed() {
  // checks if mouse is inside any of the buttons and if so, toggles a var.
  if (buttons[0].inside(mouseX, mouseY)) fastmode = 1 - fastmode;
  else if (buttons[2].inside(mouseX, mouseY)) randmode = 1 - randmode;
}

function load_images() {
  buttons.push(new Button("images/ff_0.png", width - 70, 10, 0.5, 0.5));
  buttons.push(new Button("images/ff_1.png", width - 70, 10, 0.5, 0.5));
  buttons.push(new Button("images/rand_0.png", width - 130, 10, 0.5, 0.5));
  buttons.push(new Button("images/rand_1.png", width - 130, 10, 0.5, 0.5));
}

function display_interface() {
  // Displays all elements of the user interface.
  fill(0);
  text("Generation " + neat.generation, 20, 52);
  buttons[fastmode].show();
  buttons[randmode + 2].show();
}
