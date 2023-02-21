import * as Phaser from "phaser";

export default class TubePostFX extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game: game,
      name: "TubePostFX",
      renderTarget: true,
      fragShader: `
      precision mediump float;

      uniform sampler2D uMainSampler;
      uniform float uTime;
      uniform vec2 uResolution;
      
      #define CURVE 1.7
      
      vec2 CurvedSurface(vec2 uv, float r)
      {
          return r * uv/sqrt(r * r - dot(uv, uv));
      }
      
      vec2 crtCurve(vec2 uv, float r)
      {
          vec2 res;
          vec2 dimensions = uResolution;
          r = CURVE * r;
      
          uv -= vec2(0.5, 0.5);
          uv = CurvedSurface(uv, r);
          uv += vec2(0.5, 0.5);
      
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
              return vec2(-1.0, -1.0);
          }
      
          return uv;
      }
      
      void main()
      {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          uv = crtCurve(uv, 1.0);
      
          if (uv.x < 0.0) {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              return;
          }
      
          if (uv.y < 0.0) {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              return;
          }
      
          if (uv.x > 1.0) {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              return;
          }
      
          if (uv.y > 1.0) {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              return;
          }
      
          vec4 color = texture2D(uMainSampler, uv);
      
          gl_FragColor = color;
      }
      
      `,
    });
  }

  onPreRender() {
    this.set2f("uResolution", this.renderer.width, this.renderer.height);
    this.set1f("uTime", this.game.loop.time * 0.01);
    //this.set1f("ScaledScanLinePeriod", 0.01);
    //this.set1f("ScaledGaussianSigma", 0.01);
  }
}
