function Button(imageName, xpos, ypos, w, h) {
  // A class for making buttons easier.
  this.img = loadImage(imageName);
  this.x = xpos;
  this.y = ypos;
  this.w = w;
  this.h = h;

  this.show = function() {
    image(this.img, this.x, this.y, this.img.width * this.w, this.img.height * this.h);
  }

  this.inside = function(x, y) {
    return (x > this.x && x < this.x + this.img.width * this.w &&
        y > this.y && y < this.y + this.img.height * this.h)
  }
}
