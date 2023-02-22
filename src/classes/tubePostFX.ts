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
      uniform sampler2D uFrameSampler;
      uniform float uTime;
      uniform vec2 uResolution;
      
      #define CURVE 1.4
      #define SCANLINE_DENSITY 400.0
      
      vec2 CurvedSurface(vec2 uv, float r)
      {
          return r * uv / sqrt(r * r - dot(uv, uv));
      }
      
      vec2 crtCurve(vec2 uv, float r)
      {
          vec2 res;
          vec2 dimensions = uResolution;
          r = CURVE * r;
      
          uv -= vec2(0.5, 0.5);
          uv = CurvedSurface(uv, r);
          uv += vec2(0.5, 0.5);
      
          return uv;
      }
      
      void main()
      {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          uv = crtCurve(uv, 1.0);
          
          vec4 color = texture2D(uMainSampler, uv);

          // Increase contrast
          color.rgb = (color.rgb - 0.5) * 1.8 + 0.9;

          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            color = vec4(0.0, 0.0, 0.0, 1.0);
        }
      
          // Add scanlines
          float scanline = floor(gl_FragCoord.y * SCANLINE_DENSITY / uResolution.y) / SCANLINE_DENSITY;
          if (mod(floor(gl_FragCoord.y), 2.0) == 0.0) {
              color.rgb *= 1.0 - scanline;
          } else {
              color.rgb *= scanline;
          }
      
          vec4 frame = texture2D(uFrameSampler, vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y));
          color = mix(color * 1.75, frame * 0.25, frame.a);
      
          gl_FragColor = color;
      }
      
      
      `,
    });
  }

  onPreRender() {
    this.set2f("uResolution", this.renderer.width, this.renderer.height);
    this.set1f("uTime", this.game.loop.time * 0.01);

    this.set1i(
      "uFrameSampler",
      this.renderer.setTextureSource(
        this.game.textures.get("frameTexture").source[0]
      )
    );
  }
}
