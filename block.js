function Block(genome) {
  this.brain = genome;
  this.brain.score = 0;
  this.status = 0;  // status of this block. 0 is normal, 1 is dead and 2 has finished.

  this.pos = createVector(START_X, START_Y);
  this.vel = createVector();
  this.acc = createVector();

  this.radius = 20;
  this.in_air = false;
  this.jumps = 20;  // max amount of jumps before stopping

  this.platforms_completed = new Array(terrain.length).fill(0);
  this.current_platform = -1;
  blocks.push(this);

  this.update = function() {
    if (this.status == 2) return;
    else if (!this.in_air) this.jump();
    this.update_pos();
    this.brain.score = this.score();
  }

  this.update_pos = function() {
    if (this.in_air) this.acc.y += 0.1;   // gravity
    this.vel.add(this.acc);
    this.vel.limit(10);
    this.acc.mult(0);
    this.pos.add(this.vel);

    this.check_collision();
    if (this.pos.y > height) this.status = 1;
  }

  this.show = function() {
    fill(200, 30, 30);
    rect(this.pos.x, this.pos.y, this.radius, this.radius);
  }

  this.jump = function() {
    // Jumps in a certain direction based on the brains' output.
    if (this.jumps == 1) status = 2; 
    var input = this.get_input();
    var output = this.brain.activate(input);
    if (output[0] < 0) console.log(output);
    this.acc.x = 3 * output[0];
    this.acc.y = -3 * output[1];
    this.in_air = true;
    this.jumps -= 1;
  }

  this.get_input = function() {
    // Gets all the input for the input nodes based on the terrain and itself.
    var next_platform = terrain[this.current_platform + 1];
    var dest_x = next_platform[0] + next_platform[2] / 2;
    var dest_y = next_platform[1];
    return [this.x, this.y, dest_x, dest_y];
  }

  this.score = function() {
    // score is equal to amount of platforms completed.
    return this.platforms_completed.reduce((a, b) => a + b, 0);
  }

  this.check_collision = function() {
    // here we go again
    var x = this.pos.x;
    var y = this.pos.y;
    var r = this.radius;
    for (var i = 0; i < terrain.length; i++) {
      var rect = terrain[i];

      if (x + r / 2 > rect[0] && x + r / 2 < rect[0] + rect[2] && y + r > rect[1]) {
        // we are landing on top of a platform
        //this.vel.y = 0;  // keep this instead of line below to see bhops
        this.vel.mult(0);
        this.pos.y = rect[1] - r;
        this.in_air = false;
        this.platforms_completed[i] = true;
        this.current_platform = i;
        if (this.score() == terrain.length) this.status = 2;  // we have done everything
        break;
      }

      else if (x <= rect[0] && x + r > rect[0] && y > rect[1] - r) {
        // we are hitting the left side of a platform
        this.vel.x = this.vel.x < 0 ? this.vel.x : 0 ;
        this.pos.x = rect[0] - r;
        break;
      }
      else if (x < rect[0] + rect[2] && x + r > rect[0] + rect[2] && y > rect[1] - r) {
        // we are hitting the right side of a platform
        if (this.vel.x < 0) {
            this.vel.x = 0;
            this.pos.x = rect[0] + rect[2];
        }

        break;
      }

    }
  }
}
