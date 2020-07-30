const SAMPLE_RATE = 44100;
const WAVETABLE_SAMPLES = 64;
const WAVETABLE_MASK = 64 - 1;
const SYNTH_SAMPLES_PER = SAMPLE_RATE / 60;
const VOICES_COUNT = 16;
const DELAY_LINE_LENGTH = SAMPLE_RATE;
const SONG_CHANNELS = 8;

async function go(core: string) {
  const { pow, sin, random } = Math;
  const mem = new WebAssembly.Memory({ initial: 10, maximum: 10 });
  const obj = await WebAssembly.instantiateStreaming(fetch(core), { js: { mem } });

  let dv = new DataView(mem.buffer);

  const pallete = new Uint32Array(mem.buffer, 0xffff, 256);
  const waveforms = new Float32Array(mem.buffer, 0xffff, 512);
  const voices = new Uint8Array(mem.buffer, 0xffff, VOICES_COUNT * 32);
  const patterns = new Uint8Array(mem.buffer, 0xffff, 8 * 10 * 32);
  const song = new Uint8Array(mem.buffer, 0xffff, 8 * 48);

  const delayLines = [];
  for (let i = 0; i < 32; ++i) {
    delayLines[i] = new Float32Array(DELAY_LINE_LENGTH);
  }

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

      let cameraX = dv.getInt16(ADDR_CAMERA_X);
      let cameraY = dv.getInt16(ADDR_CAMERA_Y);

      let mapWidth = dv.getUint8(ADDR_MAP_WIDTH);
      let mapHeight = dv.getUint8(ADDR_MAP_HEIGHT);

      let draw = (tiles, o, x, y) => out.drawImage(
        tiles,
        Math.floor(o / 16) * 8,
        (o % 16) * 8,
        8, 8,
        x * 8, y * 8,
        8, 8
      );

      for (let x = 0; x < 16; ++x) {
        for (let y = 0; y < 16; ++y) {
          const mx = cameraX + x;
          const my = cameraY + y;
          if (mx >= 0 && mx < mapWidth && my >= 0 && my < mapHeight) {
            const o = dv.getUint8(ADDR_MAP_DATA + mx * mapWidth + my);
            if (o > 0) {
              draw(tiles_0, o, x, y);
            }
          }
        }
      }


      for (let i = 0; i < 256; ++i) {
        const addr = ADDR_SPRITES + SPRITE_BYTES * i;
        const spriteIndex = dv.getUint8(addr);
        if (spriteIndex) {
          let x = dv.getInt16(addr + 1);
          let y = dv.getInt16(addr + 3);
          const mx = x - cameraX;
          const my = y - cameraY;
          if (mx >= 0 && mx < 16 && my >= 0 && my < 16) {
            draw(tiles_1, o, mx, my);
          }
        }
      }
    },
    (out_left, out_right, out_length) => {
      let 
      let rowLen = dv.getUint16(ADDR_PATTERN_ROW_LEN);
      let nf = (n, oct, det, detune) => (0.00390625 * pow(1.059463094, (n + (oct - 8) * 12 + det) - 128)) * (1 + 0.0008 * detune) * WAVETABLE_SAMPLES;

      let song_position = dv.getUint8(ADDR_SONG_POSITION);
      let pattern_position = dv.getUint8(ADDR_PATTERN_POSITION);
      let pattern_row_position = dv.getUint16(ADDR_PATTERN_ROW_POSITION);

      for (let i = 0; i < VOICES_COUNT; ++i) {
        if (i <= SONG_CHANNELS) {
          // add note events
        }


        let [
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
        ] = voices.slice(i * 32);

        let state_addr = ADDR_VOICE_STATES + i * 16;

        let state_position = dv.getInt32(state_addr);
        let state_low = dv.getFloat32(state_addr + 4);
        let state_band = dv.getFloat32(state_addr + 8);
        let c1 = dv.getFloat32(state_addr + 12);
        let c2 = dv.getFloat32(state_addr + 16);

        let len = env_attack + env_sustain + env_release;
        let wt1 = osc1_waveform * WAVETABLE_SAMPLES;
        let wt2 = osc2_waveform * WAVETABLE_SAMPLES;

        fx_delay_time = (fx_delay_time * rowLen) >> 1;
        fx_delay_amt /= 255;
        fx_pan_freq = pow(2, fx_pan_freq - 8) / rowLen * WAVETABLE_SAMPLES;
        lfo_freq = pow(2, lfo_freq - 8) / rowLen * WAVETABLE_SAMPLES;
        env_master /= 1e5;
        fx_pan_amt /= 512;
        lfo_amt /= 512;

        let q = fx_resonance / 255;


        let o1t = nf(n, osc1_oct, osc1_det, osc1_detune);
        let o2t = nf(n, osc2_oct, osc2_det, osc2_detune);


        for (i = 0; i < out_length; ++i) {
          let lfo = lfo_amt ? waveforms[lfo_waveform * WAVETABLE_SAMPLES + ((state_position * lfo_freq) & WAVETABLE_MASK)] * lfo_amt + 0.5 : 0;

          let s = 0;

          // Envelope
          let e = state_position < env_attack ? state_position / env_attack
            : state_position >= env_attack + env_sustain ? 1 - (state_position - env_attack - env_sustain) / env_release
              : 1;

          // Oscillator 1
          let t = o1t;
          if (lfo_osc1_freq) t += lfo;
          if (osc1_xenv) t *= e * e;
          c1 += t;
          s = waveforms[wt1 + (c1 & WAVETABLE_MASK)] * osc1_vol;

          // Oscillator 2
          t = o2t;
          if (osc2_xenv) t *= e * e;
          c2 += t;
          s += waveforms[wt2 + (c2 & WAVETABLE_MASK)] * osc2_vol;

          // Noise oscillator
          if (noise_fader) s += (2 * random() - 1) * noise_fader * e;

          // State variable filter
          let f = fx_freq;
          if (lfo_fx_freq) f *= lfo;
          f = 1.5 * waveforms[(f * WAVETABLE_SAMPLES / 2 / SAMPLE_RATE) & WAVETABLE_MASK];
          state_low += f * state_band;
          let high = q * (s - state_band) - state_low;
          state_band += f * high;

          s = fx_filter === 1 ? high
            : fx_filter === 2 ? state_low
              : fx_filter === 3 ? state_band
                : fx_filter === 4 ? state_low + high
                  : s;

          // Panning & master volume
          t = waveforms[(state_position * fx_pan_freq) & WAVETABLE_MASK] * fx_pan_amt + 0.5;
          s *= env_master;

          let rsample = (s * t);
          let lsample = (s * (1 - t));

          if (fx_delay_amt && state_position >= fx_delay_time) {
            rsample += synth_right_buffer[state_position - fx_delay_time] * fx_delay_amt;
            lsample += synth_left_buffer[state_position - fx_delay_time] * fx_delay_amt;
          }

          out_right[i] += synth_right_buffer[i] = rsample;
          out_left[i] += synth_left_buffer[i] = lsample;

          ++state_position;
        }

        dv.setInt32(state_addr, state_position);
        dv.setFloat32(state_addr + 4, state_low);
        dv.setFloat32(state_addr + 8, state_band);
        dv.setFloat32(state_addr + 12, c1);
        dv.setFloat32(state_addr + 16, c2);
      }

      dv.setUint8(ADDR_SONG_POSITION, song_position);
      dv.setUint8(ADDR_PATTERN_POSITION, pattern_position);
      dv.setUint16(ADDR_PATTERN_ROW_POSITION, pattern_row_position);
    }
  ];
}
