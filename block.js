function Block(genome) {
  this.brain = genome;
  this.brain.score = 0;

  this.pos = createVector(START_X, START_Y);
  this.vel = createVector();
  this.acc = createVector();

  this.radius = 10;
  this.in_air = false;
  this.platforms_completed = 0;
  blocks.push(this);

  this.update = function() {
    if (this.in_air) return;
    else if (this.platforms_completed == terrain.length) return;
    else this.jump();
    this.update_pos();
  }

  this.update_pos = function() {
    //this.acc.y += 0.01;   // gravity
    this.vel.add(this.acc);
    this.vel.limit(10);
    this.acc.mult(0);
    this.pos.add(this.vel);

    // collision checks
    //this.check_collision();
  }

  this.show = function() {
    fill(200, 30, 30);
    rect(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
  }

  this.jump = function() {
    // Jumps in a certain direction based on the brains' output.
    var input = this.get_input();
    var output = this.brain.activate(input);
    // this.accx = output[0];
    // this.accy = output[1];
  }

  this.get_input = function() {
    // Gets all the input for the input nodes based on the terrain and itself.
    var next_platform = terrain[this.platforms_completed];
    var dest_x = next_platform[0] + next_platform[2] / 2;
    var dest_y = next_platform[1];
    return [this.x, this.y, dest_x, dest_y];
  }

  this.score = function() {
    return platforms_completed;
  }
}
