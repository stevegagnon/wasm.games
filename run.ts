const WAVETABLE_SAMPLES = 32;
const WAVETABLE_MASK = 32 - 1;

const SYNTH_SAMPLES_PER = 44100 / 60;

async function go(core: string) {
  const { pow, sin } = Math;
  const mem = new WebAssembly.Memory({ initial: 10, maximum: 10 });
  const obj = await WebAssembly.instantiateStreaming(fetch(core), { js: { mem } });

  let bytes = new Uint8ClampedArray(mem.buffer);

  let mapWidth = new Uint8ClampedArray(mem.buffer, 0xffff, 1);
  let mapHeight = new Uint8ClampedArray(mem.buffer, 0xffff, 1);
  let cameraX = new Int16Array(mem.buffer, 0xffff, 1);
  let cameraY = new Int16Array(mem.buffer, 0xffff, 1);
  const pallete = new Uint32Array(mem.buffer, 0xffff, 256);
  const waveforms = new Float32Array(mem.buffer, 0xffff, 512);

  let synth_out_left = new Float32Array(SYNTH_SAMPLES_PER);
  let synth_out_right = new Float32Array(SYNTH_SAMPLES_PER);
  let synth_right_buffer = new Float32Array(SYNTH_SAMPLES_PER);
  let synth_left_buffer = new Float32Array(SYNTH_SAMPLES_PER);

  for (let i = 0; i < WAVETABLE_SAMPLES; ++i) {
    let v = i / WAVETABLE_SAMPLES;
    let f = v % 1;
    waveforms[i] = sin(v * 6.283184);
    waveforms[WAVETABLE_SAMPLES + i] = f - .5;
    waveforms[2 * WAVETABLE_SAMPLES + i] = f < 0.5 ? 1 : -1;
    waveforms[3 * WAVETABLE_SAMPLES + i] = f < 0.5 ? f * 4 - 1 : 3 - f * 4;
  }

  let updateTiles = (canvas: HTMLCanvasElement, tiles) => {
    let pixels = new Uint32Array(128 * 128);
    for (let i = 0; i < 128 * 128; ++i) {
      pixels[i] = pallete[tiles[i]];
    }
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(pixels.buffer), 128, 128), 0, 0);
  }

  return [
    () => {
      updateTiles(tiles_0, new Uint8ClampedArray(mem.buffer, 0xffff, 16384));
      updateTiles(tiles_1, new Uint8ClampedArray(mem.buffer, 0xffff, 16384));

      let camera = new Int16Array(mem.buffer, ADDR_CAMERA, 2);
      let cameraX = camera[0];
      let cameraY = camera[1];
      let mapWidth = bytes[ADDR_MAP_WIDTH];
      let mapHeight = bytes[ADDR_MAP_HEIGHT];

      let draw = (tiles, o, x, y) => out.drawImage(
        tiles,
        Math.floor(o / 16) * 8,
        (o % 16) * 8,
        8,
        8,
        x * 8,
        y * 8,
        8,
        8
      );

      for (let x = 0; x < 16; ++x) {
        for (let y = 0; y < 16; ++y) {
          const mx = cameraX + x;
          const my = cameraY + y;
          if (mx >= 0 && mx < mapWidth && my >= 0 && my < mapHeight) {
            const o = bytes[ADDR_MAP_DATA + mx * mapWidth + my];
            if (o > 0) {
              draw(tiles_0, o, x, y);
            }
          }
        }
      }


      for (let i = 0; i < 256; ++i) {
        const o = SPRITE_BYTES * i;
        if (o > 0) {
          const p = new Int16Array(memory.buffer, o + 1);
          const index = memory[o];
          let x = p[0];
          let y = p[1];
          const mx = x - cameraX;
          const my = y - cameraY;
          if (mx >= 0 && mx < 16 && my >= 0 && my < 16) {
            draw(tiles_1, o, mx, my);
          }
        }
      }
    },
    () => {
      let nf = (n, oct, det, detune) => (0.00390625 * pow(1.059463094, (n + (oct - 8) * 12 + det) - 128)) * (1 + 0.0008 * detune) * WAVETABLE_SAMPLES;

      for (let
        [
          lfo_fx_freq,
          lfo_freq,
          lfo_amt,
          lfo_waveform,
          osc1_waveform,
          osc1_vol,
          osc1_oct,
          osc1_det,
          osc1_detune,
          osc1_xenv,
          lfo_osc1_freq,
          osc2_waveform,
          osc2_vol,
          osc2_oct,
          osc2_det,
          osc2_detune,
          osc2_xenv,
          noise_fader,
          env_attack,
          env_sustain,
          env_release,
          env_master,
          fx_filter,
          fx_freq,
          fx_resonance,
          fx_delay_time,
          fx_delay_amt,
          fx_pan_freq,
          fx_pan_amt,
        ]
        of voices) {

        let len = env_attack + env_sustain + env_release;
        let wt1 = osc1_waveform * WAVETABLE_SAMPLES;
        let wt2 = osc2_waveform * WAVETABLE_SAMPLES;
        let pos = 0;

        fx_delay_time = (fx_delay_time * rowLen) >> 1;
        fx_delay_amt /= 255;
        fx_pan_freq = pow(2, fx_pan_freq - 8) / rowLen * wt_size;
        lfo_freq = pow(2, lfo_freq - 8) / rowLen * wt_size;
        env_master /= 1e5;
        fx_pan_amt /= 512;

        right_buffer.fill(0);

        if (lfo_amt) {
          lfo_amt /= 512;
          for (i = 0; i < sample_count; ++i) {
            left_buffer[i] = osc[lfo_waveform][(i * lfo_freq) & WAVETABLE_MASK] * lfo_amt + 0.5;
          }
        }

        for (let pattern of p) {
          let rows = 32;
          if (pattern) {
            for (let n of c[pattern - 1].n) {
              if (n) {
                let c1 = 0, c2 = 0;
                let o1t = nf(n, osc1_oct, osc1_det, osc1_detune);
                let o2t = nf(n, osc2_oct, osc2_det, osc2_detune);

                for (i = len - 1; i >= 0; --i) {
                  let k = i + pos;

                  // Envelope
                  let e = i < env_attack ? i / env_attack
                    : i >= env_attack + env_sustain ? 1 - (i - env_attack - env_sustain) / env_release
                      : 1;

                  // Oscillator 1
                  let t = o1t;
                  if (lfo_osc1_freq) t += left_buffer[k];
                  if (osc1_xenv) t *= e * e;
                  c1 += t;
                  let rsample = waveforms[wt1 + (c1 & WAVETABLE_MASK)] * osc1_vol;

                  // Oscillator 2
                  t = o2t;
                  if (osc2_xenv) t *= e * e;
                  c2 += t;
                  rsample += waveforms[wt2 + (c2 & WAVETABLE_MASK)] * osc2_vol;

                  // Noise oscillator
                  if (noise_fader) rsample += (2 * random() - 1) * noise_fader * e;

                  right_buffer[k] += rsample * e;
                }
              }
              pos += rowLen;
              --rows;
            }
          }

          pos += rowLen * rows;
        }

        let low = 0;
        let band = 0;
        let q = fx_resonance / 255;

        for (i = 0; i < sample_count; ++i) {
          let s = right_buffer[i];

          // State variable filter
          let f = fx_freq;;
          if (lfo_fx_freq) f *= left_buffer[i];
          f = 1.5 * sin_wt[(f * wt_size / 2 / SAMPLE_RATE) & WAVETABLE_MASK];
          low += f * band;
          let high = q * (s - band) - low;
          band += f * high;

          s = fx_filter === 1 ? high
            : fx_filter === 2 ? low
              : fx_filter === 3 ? band
                : fx_filter === 4 ? low + high
                  : s;

          // Panning & master volume
          let t = sin_wt[(i * fx_pan_freq) & WAVETABLE_MASK] * fx_pan_amt + 0.5;
          s *= env_master;

          let rsample = (s * t);
          let lsample = (s * (1 - t));

          if (fx_delay_amt && i >= fx_delay_time) {
            rsample += right_buffer[i - fx_delay_time] * fx_delay_amt;
            lsample += left_buffer[i - fx_delay_time] * fx_delay_amt;
          }

          out_right[i] += right_buffer[i] = rsample;
          out_left[i] += left_buffer[i] = lsample;
        }
      }
    }
  ];



}



/*
function renderGraphics(
  out: CanvasRenderingContext2D,
  tiles_0: HTMLCanvasElement,
  tiles_1: HTMLCanvasElement,
  memory: Uint8ClampedArray,
) {
  let mapWidth = memory[ADDR_MAP_WIDTH];
  let mapHeight = memory[ADDR_MAP_HEIGHT];
  let cameraX = new Int16Array(memory.buffer, ADDR_CAMERA_X)[0];
  let cameraY = new Int16Array(memory.buffer, ADDR_CAMERA_Y)[0];
  let pallete = new Uint32Array(memory.buffer, ADDR_TILES_PALETTE);
  let updateTiles = (canvas: HTMLCanvasElement, offset) => {
    let pixels = new Uint32Array(128 * 128);
    for (let i = 0; i < 128 * 128; ++i) {
      pixels[i] = pallete[memory[offset + i]];
    }
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(pixels.buffer), 128, 128), 0, 0);
  }


  updateTiles(tiles_0, ADDR_TILES_0);
  updateTiles(tiles_1, ADDR_TILES_1);

  let draw = (tiles, o, x, y) => out.drawImage(
    tiles,
    Math.floor(o / 16) * 8,
    (o % 16) * 8,
    8,
    8,
    x * 8,
    y * 8,
    8,
    8
  );

  for (let x = 0; x < 16; ++x) {
    for (let y = 0; y < 16; ++y) {
      const mx = cameraX + x;
      const my = cameraY + y;
      if (mx >= 0 && mx < mapWidth && my >= 0 && my < mapHeight) {
        const o = memory[ADDR_MAP_DATA + mx * mapWidth + my];
        if (o > 0) {
          draw(tiles_0, o, x, y);
        }
      }
    }
  }


  for (let i = 0; i < 256; ++i) {
    const o = SPRITE_BYTES * i;
    if (o > 0) {
      const p = new Int16Array(memory.buffer, o + 1);
      const index = memory[o];
      let x = p[0];
      let y = p[1];
      const mx = x - cameraX;
      const my = y - cameraY;
      if (mx >= 0 && mx < 16 && my >= 0 && my < 16) {
        draw(tiles_1, o, mx, my);
      }
    }
  }
}
*/