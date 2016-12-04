import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  SimpleChange,
  ViewChild
} from '@angular/core';
import { Particle } from './particle';

import boids, { Flock } from 'boids';

const MAX_AGE = 3000;

@Component({
  selector: 'app-canvas-logo',
  templateUrl: './canvas-logo.component.html',
  styleUrls: ['./canvas-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasLogoComponent implements OnChanges {
  @ViewChild('canvas') canvasRef: ElementRef;
  @Input() running: boolean;
  flock: Flock;

  constructor(private ngZone: NgZone) {
    this.flock = boids({
      boids: 200,              // The amount of boids to use
      speedLimit: 4,          // Max steps to take per tick
      accelerationLimit: 1,   // Max acceleration per tick
      separationDistance: 60, // Radius at which boids avoid others
      alignmentDistance: 180, // Radius at which boids align with others
      cohesionDistance: 180,  // Radius at which boids approach others
      separationForce: 0.15,  // Speed to avoid at
      alignmentForce: 0.25,   // Speed to align with other boids
      cohesionForce: 0.1,     // Speed to move towards other boids
      attractors: [[200, 250, 1000, 0.3], [600, 250, 1000, 0.3]]
    });
  }

  ngOnChanges(changes) {
    let chg: SimpleChange = changes.running;
    if (chg.currentValue && !chg.previousValue) {
      this.ngZone.runOutsideAngular(() => this.paint());
    }
  }

  private paint() {
    if (!this.running) {
      return;
    }

    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = 'rgb(221, 0, 49)';
    ctx.fillRect(0, 0, 800, 500);

    this.flock.tick();
    ctx.beginPath();
    ctx.fillStyle = `rgb(255,255,255)`;
    for (const [x, y, speedX, speedY] of this.flock.boids) {
      const angle = Math.atan2(speedY, speedX) + 0.5 * Math.PI;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(0.4, 0.4);
      this.paintA(ctx);
      ctx.restore();
    };
    requestAnimationFrame(() => this.paint());
  }

  private paintA(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(125 - 125, 52.1 - 125);
    ctx.lineTo(66.8 - 125, 182.6 - 125);
    ctx.lineTo(88.5 - 125, 182.6 - 125);
    ctx.lineTo(100.2 - 125, 153.4 - 125);
    ctx.lineTo(149.6 - 125, 153.4 - 125);
    ctx.lineTo(162.6 - 125, 182.6 - 125);
    ctx.lineTo(181.3 - 125, 182.6 - 125);
    ctx.lineTo(125 - 125, 52.1 - 125);
    ctx.moveTo(152 - 125, 135.4 - 125);
    ctx.lineTo(108 - 125, 135.4 - 125);
    ctx.lineTo(125 - 125, 94.5 - 125);
    ctx.lineTo(142 - 125, 135.4 - 125);
    ctx.fill();
  }

}
