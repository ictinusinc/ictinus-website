import backgroundImage from '@/projects/background-no-ripple.jpg';

export function initSummitScene() {
  const sketch = (p) => {
    const block_size = 45;
    const block_core = 1;
    const block_move_distance = 10;
    const block_move_range = 70;
    const block_scale = 0.02;
    const ripple_speed = 0.24;

    let show_ripples = false;
    let show_info = false;

    let mouse_speed;
    let fps, avgFps = 0;
    let prevFrame = 0;
    let prevTime = 0;
    let fpsInterval = 1000;

    let blocks = [];
    let ripples = [];
    let img;

    p.setup = () => {
      const canvasDiv = document.getElementById('ripples');
      const rippleWidth = canvasDiv.offsetWidth;
      const rippleHeight = canvasDiv.offsetHeight;

      const sketchCanvas = p.createCanvas(rippleWidth, rippleHeight);
      sketchCanvas.parent('ripples');

      p.noStroke();
      p.fill(233, 230);
      p.rectMode(p.CENTER);
      p.noSmooth();

      img = p.loadImage(
        backgroundImage,
        () => {
          console.log('Background image loaded successfully.');
        },
        (err) => {
          console.error('Failed to load background image.', err);
        }
      );

      const left_padding = Math.round(p.width % block_size) / 2;
      const top_padding = Math.round(p.height % block_size) / 2;

      blocks = Array.from({ length: Math.floor(p.height / block_size) }, (_, y) =>
        Array.from({ length: Math.floor(p.width / block_size) }, (_, x) =>
          new Block(
            p,
            left_padding + block_size * (x + 0.5),
            top_padding + block_size * (y + 0.5)
          )
        )
      );
    };

    p.draw = () => {
      if (p.keyIsDown(32)) {
        if (p.random() < p.pow(fps / 60, 3)) {
          ripples.push(new Ripple(p, p.random(p.width), p.random(p.height), 0.4));
        }
      } else {
        if (p.random() < p.pow(fps / 60, 3) / 16) {
          ripples.push(new Ripple(p, p.random(p.width), p.random(p.height), 0.1));
        }
      }
      fps = p.frameRate();

      if (p.millis() - prevTime > fpsInterval) {
        avgFps = (p.frameCount - prevFrame) / fpsInterval * 1000;
        prevFrame = p.frameCount;
        prevTime = p.millis();
      }

      mouse_speed = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);

      if (!img) {
        console.warn('Background image not loaded yet.');
        return;
      }

      // Render the background
      p.image(img, 0, 0, p.width, p.height);
      p.rectMode(p.CENTER);

      ripples.forEach((ripple) => {
        ripple.updateRadius();
        ripple.checkKill();
      });

      if (show_ripples) {
        p.strokeWeight(2);
        ripples.forEach((ripple) => {
          ripple.draw();
        });
      }

      p.noStroke();
      blocks.forEach((line) =>
        line.forEach((block) => {
          block.calcDiff(ripples);
          block.render();
        })
      );

      if (show_info) {
        p.rectMode(p.CORNER);
        p.fill(20, 200);
        p.rect(0, 0, 120, 64);
        p.fill(220);
        p.textFont('monospace', 16);
        p.text('Ripples: ' + ripples.length, 10, 24);
        p.text('FPS: ' + avgFps, 10, 48);
      }
    };

    p.mouseMoved = () => {
      if (p.random() < p.pow(fps / 60, 3) * mouse_speed / 30) {
        ripples.push(new Ripple(p, p.mouseX, p.mouseY, 0.15 * mouse_speed / 40));
      }
    };

    p.mouseDragged = () => {
      if (p.random() < p.pow(fps / 60, 3) * mouse_speed / 20) {
        ripples.push(new Ripple(p, p.mouseX, p.mouseY, 0.6 * mouse_speed / 40));
      }
    };

    p.keyPressed = () => {
      if (p.keyCode === 73) {
        show_info = !show_info;
      } else if (p.keyCode === 82) {
        show_ripples = !show_ripples;
      }
    };

    class Block {
      constructor(p, x, y) {
        this.p = p;
        this.pos = p.createVector(x, y);
      }

      render() {
        this.p.fill(255, cubicInOut(this.amp / 2, 60, 240, 15));
        this.p.rect(
          this.pos.x + this.diff.x,
          this.pos.y + this.diff.y,
          (block_core + this.amp * block_scale) * 8,
          block_core + this.amp * block_scale * 0.8
        );
        this.p.rect(
          this.pos.x + this.diff.x,
          this.pos.y + this.diff.y,
          block_core + this.amp * block_scale * 0.8,
          (block_core + this.amp * block_scale) * 8
        );
      }

      calcDiff(ripples) {
        this.diff = this.p.createVector(0, 0);
        this.amp = 0;

        ripples.forEach((ripple) => {
          const distance =
            this.p.dist(this.pos.x, this.pos.y, ripple.pos.x, ripple.pos.y) -
            ripple.currRadius;
          if (distance < 0 && distance > -block_move_range * 2) {
            const angle = p5.Vector.sub(this.pos, ripple.pos).heading();
            const localAmp = cubicInOut(
              -Math.abs(block_move_range + distance) + block_move_range,
              0,
              block_move_distance,
              block_move_range
            ) * ripple.scale;
            this.amp += localAmp;
            const movement = p5.Vector.fromAngle(angle).mult(localAmp);
            this.diff.add(movement);
          }
        });
      }
    }

    class Ripple {
      constructor(p, x, y, scale) {
        this.p = p;
        this.pos = p.createVector(x, y);
        this.initTime = p.millis();
        this.currRadius = 0;
        this.endRadius = Math.max(
          p.dist(this.pos.x, this.pos.y, 0, 0),
          p.dist(this.pos.x, this.pos.y, 0, p.height),
          p.dist(this.pos.x, this.pos.y, p.width, 0),
          p.dist(this.pos.x, this.pos.y, p.height, p.width)
        ) + block_move_range;
        this.scale = scale;
      }

      checkKill() {
        if (this.currRadius > this.endRadius) {
          ripples.splice(ripples.indexOf(this), 1);
        }
      }

      updateRadius() {
        this.currRadius = (this.p.millis() - this.initTime) * ripple_speed;
      }

      draw() {
        this.p.stroke(255, cubicInOut(this.scale, 30, 120, 1));
        this.p.noFill();
        this.p.ellipse(
          this.pos.x,
          this.pos.y,
          this.currRadius * 2,
          this.currRadius * 2
        );
      }
    }

    function cubicInOut(t, b, c, d) {
      if (t <= 0) return b;
      if (t >= d) return b + c;
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }
  };

  new p5(sketch);
}