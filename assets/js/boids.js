export function initBoidsScene() {
  // Define the p5 sketch
  const sketch = (p) => {
    let flock;

    // Setup function
    p.setup = () => {
      const myCanvas = p.createCanvas(window.innerWidth, 643);
      myCanvas.parent('processing');
      p.colorMode(p.RGB, 255, 255, 255, 100);
      p.background(53, 53, 53, 100);

      flock = new Flock();

      // Add an initial set of boids into the system
      for (let i = 0; i < 5; i++) {
        const b = new Boid(p, p.width / 2, p.height / 2);
        flock.addBoid(b);
      }
    };

    // Draw function
    p.draw = () => {
      p.fill(40, 66, 50, 5);
      p.rect(0, 0, window.innerWidth, 643);
      flock.run();
    };

    // Add a new boid into the system on touch
    p.touchEnded = () => {
      flock.addBoid(new Boid(p, p.mouseX, p.mouseY));
    };

    // Flock class
    class Flock {
      constructor() {
        this.boids = []; // Initialize the array
      }

      run() {
        this.boids.forEach((boid) => boid.run(this.boids));
      }

      addBoid(b) {
        this.boids.push(b);
      }
    }

    // Boid class
    class Boid {
      constructor(p, x, y) {
        this.p = p;
        this.acceleration = p.createVector(0, 0);
        this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
        this.position = p.createVector(x, y);
        this.r = 200.0;
        this.maxspeed = 3; // Maximum speed
        this.maxforce = 0.05; // Maximum steering force
      }

      run(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.render();
      }

      applyForce(force) {
        this.acceleration.add(force);
      }

      flock(boids) {
        const sep = this.separate(boids).mult(1.5); // Separation
        const ali = this.align(boids).mult(1.0); // Alignment
        const coh = this.cohesion(boids).mult(1.0); // Cohesion

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
      }

      update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
      }

      borders() {
        if (this.position.x < -this.r) this.position.x = this.p.width + this.r;
        if (this.position.y < -this.r) this.position.y = this.p.height + this.r;
        if (this.position.x > this.p.width + this.r) this.position.x = -this.r;
        if (this.position.y > this.p.height + this.r) this.position.y = -this.r;
      }

      render() {
        const theta = this.velocity.heading() + this.p.radians(90);
        this.p.noFill();
        this.p.stroke(255, 40, 90, 100);
        this.p.strokeWeight(20);

        this.p.push();
        this.p.translate(this.position.x, this.position.y);
        this.p.rotate(theta);
        this.p.ellipse(0, 0, 300, 300);

        this.p.pop();
        this.p.noStroke();
      }

      separate(boids) {
        const desiredSeparation = 300.0;
        const steer = this.p.createVector(0, 0);
        let count = 0;

        boids.forEach((other) => {
          const d = p5.Vector.dist(this.position, other.position);
          if (d > 0 && d < desiredSeparation) {
            const diff = p5.Vector.sub(this.position, other.position).normalize().div(d);
            steer.add(diff);
            count++;
          }
        });

        if (count > 0) steer.div(count);

        if (steer.mag() > 0) {
          steer.normalize().mult(this.maxspeed).sub(this.velocity).limit(this.maxforce);
        }

        return steer;
      }

      align(boids) {
        const neighborDist = 70;
        const sum = this.p.createVector(0, 0);
        let count = 0;

        boids.forEach((other) => {
          const d = p5.Vector.dist(this.position, other.position);
          if (d > 0 && d < neighborDist) {
            sum.add(other.velocity);
            count++;
          }
        });

        if (count > 0) {
          sum.div(count).normalize().mult(this.maxspeed);
          return p5.Vector.sub(sum, this.velocity).limit(this.maxforce);
        }

        return this.p.createVector(0, 0);
      }

      cohesion(boids) {
        const neighborDist = 50;
        const sum = this.p.createVector(0, 0);
        let count = 0;

        boids.forEach((other) => {
          const d = p5.Vector.dist(this.position, other.position);
          if (d > 0 && d < neighborDist) {
            sum.add(other.position);
            count++;
          }
        });

        if (count > 0) {
          sum.div(count);
          return this.seek(sum);
        }

        return this.p.createVector(0, 0);
      }

      seek(target) {
        const desired = p5.Vector.sub(target, this.position).normalize().mult(this.maxspeed);
        return p5.Vector.sub(desired, this.velocity).limit(this.maxforce);
      }
    }
  };

  // Create the p5 instance
  new p5(sketch);
}