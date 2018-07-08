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

var terrain;  // A list of rectangles
var neat;
var blocks = [];   // All the blocks currently playing

var fastmode = 0;

function setup() {
  createCanvas(1000, 600);
  terrain = generate_terrain();
  strokeWeight(3);
  initNeat();
  startEvaluation();
}

function draw() {
  clear();
  background(150, 230, 255);
  draw_terrain();
  for (var i = 0; i < 150 * fastmode + 1; i++) {
    run_evolution();
  }
}

function generate_terrain() {
  var i = 0;
  var rectangles = [];
  while (i < width - 60) {
    i += 50 + random(50);   // x position of a new block
    var w = 30 + random(30);   // width of this block
    color = [random(10, 30), random(70, 150), random(0, 10)];
    if (i + w > width) break;
    rectangles.push([i, height - random(300) - 50, w, height, color]);
    i += w;
  }
  return rectangles;
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
    { mutation: [Methods.Mutation.MOD_WEIGHT, Methods.Mutation.MOD_BIAS],//Methods.Mutation.ALL,
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
    //genome = neat.population[genome];
    new Block(genome);
  }
    terrain = generate_terrain();
}

function endEvaluation() {
  console.log("Generation " + neat.generation + " done, average score: " + neat.getAverage());
  console.log("Best specimen: " + neat.getFittest().score);

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
  // toggles fastmode between 0 and 1
  fastmode = (fastmode == 0);
}
