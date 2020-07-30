interface SonantXChannel {
  osc1_oct: number,
  osc1_det: number,
  osc1_detune: number,
  osc1_xenv: number,
  osc1_vol: number,
  osc1_waveform: number,
  osc2_oct: number,
  osc2_det: number,
  osc2_detune: number,
  osc2_xenv: number,
  osc2_vol: number,
  osc2_waveform: number,
  noise_fader: number,
  env_attack: number,
  env_sustain: number,
  env_release: number,
  env_master: number,
  fx_filter: number,
  fx_freq: number,
  fx_resonance: number,
  fx_delay_time: number,
  fx_delay_amt: number,
  fx_pan_freq: number,
  fx_pan_amt: number,
  lfo_osc1_freq: number,
  lfo_fx_freq: number,
  lfo_freq: number,
  lfo_amt: number,
  lfo_waveform: number,
  p: number[],
  c: { n: number[] }[]
}

interface SonantXSong {
  songLen: number;
  songData: SonantXChannel[],
  rowLen: number,
  endPattern: number,
}

export function packSonantXSong(song: SonantXSong, mem: DataView) {
  (new Uint8Array(mem.buffer)).fill(0);

  mem.setUint8(0, song.songLen); // SONG_LENGTH
  mem.setUint16(1, song.rowLen); // PATTERN_ROW_LEN

  for (let i = 0; i < song.songData.length; ++i) {
    const channel = song.songData[i];
    let offset = 3 + i * 32;
    mem.setUint8(offset++, channel.osc1_oct);
    mem.setUint8(offset++, channel.osc1_det);
    mem.setUint8(offset++, channel.osc1_detune);
    mem.setUint8(offset++, channel.osc1_xenv);
    mem.setUint8(offset++, channel.osc1_vol);
    mem.setUint8(offset++, channel.osc1_waveform);
    mem.setUint8(offset++, channel.osc2_oct);
    mem.setUint8(offset++, channel.osc2_det);
    mem.setUint8(offset++, channel.osc2_detune);
    mem.setUint8(offset++, channel.osc2_xenv);
    mem.setUint8(offset++, channel.osc2_vol);
    mem.setUint8(offset++, channel.osc2_waveform);
    mem.setUint8(offset++, channel.noise_fader);
    mem.setUint8(offset++, channel.env_attack);
    mem.setUint8(offset++, channel.env_sustain);
    mem.setUint8(offset++, channel.env_release);
    mem.setUint8(offset++, channel.env_master);
    mem.setUint8(offset++, channel.fx_filter);
    mem.setUint8(offset++, channel.fx_freq);
    mem.setUint8(offset++, channel.fx_resonance);
    mem.setUint8(offset++, channel.fx_delay_time);
    mem.setUint8(offset++, channel.fx_delay_amt);
    mem.setUint8(offset++, channel.fx_pan_freq);
    mem.setUint8(offset++, channel.fx_pan_amt);
    mem.setUint8(offset++, channel.lfo_osc1_freq);
    mem.setUint8(offset++, channel.lfo_fx_freq);
    mem.setUint8(offset++, channel.lfo_freq);
    mem.setUint8(offset++, channel.lfo_amt);
    mem.setUint8(offset++, channel.lfo_waveform);

    for (let j = 0; j < channel.c.length; ++j) {
      const c = channel.c[j];
      offset = 515 + i * 320 + j * 32;
      for (const n of c.n) {
        mem.setUint8(offset++, n);
      }
    }

    offset = 3075 + i * 48;
    for (const p of channel.p) {
      mem.setUint8(offset++, p);
    }
  }
}


/*

const song = {
  "songLen": 21,
  "songData": [
      {
          "osc1_oct": 5,
          "osc1_det": 0,
          "osc1_detune": 0,
          "osc1_xenv": 1,
          "osc1_vol": 214,
          "osc1_waveform": 0,
          "osc2_oct": 5,
          "osc2_det": 0,
          "osc2_detune": 0,
          "osc2_xenv": 1,
          "osc2_vol": 204,
          "osc2_waveform": 0,
          "noise_fader": 229,
          "env_attack": 50,
          "env_sustain": 6363,
          "env_release": 1818,
          "env_master": 158,
          "fx_filter": 3,
          "fx_freq": 7924,
          "fx_resonance": 240,
          "fx_delay_time": 6,
          "fx_delay_amt": 74,
          "fx_pan_freq": 4,
          "fx_pan_amt": 232,
          "lfo_osc1_freq": 0,
          "lfo_fx_freq": 1,
          "lfo_freq": 6,
          "lfo_amt": 231,
          "lfo_waveform": 0,
          "p": [
              1,
              1,
              1,
              1
          ],
          "c": [
              {
                  "n": [
                      0,
                      0,
                      0,
                      0,
                      147,
                      0,
                      147,
                      0,
                      0,
                      0,
                      147,
                      0,
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      147,
                      0,
                      0,
                      147,
                      0,
                      0,
                      0,
                      147,
                      0,
                      147,
                      0,
                      0,
                      0
                  ]
              }
          ]
      },
      {
          "osc1_oct": 6,
          "osc1_det": 0,
          "osc1_detune": 0,
          "osc1_xenv": 1,
          "osc1_vol": 255,
          "osc1_waveform": 0,
          "osc2_oct": 6,
          "osc2_det": 0,
          "osc2_detune": 0,
          "osc2_xenv": 1,
          "osc2_vol": 255,
          "osc2_waveform": 0,
          "noise_fader": 14,
          "env_attack": 50,
          "env_sustain": 150,
          "env_release": 8181,
          "env_master": 161,
          "fx_filter": 2,
          "fx_freq": 5900,
          "fx_resonance": 240,
          "fx_delay_time": 6,
          "fx_delay_amt": 66,
          "fx_pan_freq": 0,
          "fx_pan_amt": 0,
          "lfo_osc1_freq": 0,
          "lfo_fx_freq": 0,
          "lfo_freq": 0,
          "lfo_amt": 0,
          "lfo_waveform": 0,
          "p": [
              1,
              1,
              1,
              1
          ],
          "c": [
              {
                  "n": [
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      147,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              }
          ]
      },
      {
          "osc1_oct": 7,
          "osc1_det": 0,
          "osc1_detune": 0,
          "osc1_xenv": 0,
          "osc1_vol": 192,
          "osc1_waveform": 2,
          "osc2_oct": 7,
          "osc2_det": 0,
          "osc2_detune": 16,
          "osc2_xenv": 1,
          "osc2_vol": 191,
          "osc2_waveform": 3,
          "noise_fader": 0,
          "env_attack": 50000,
          "env_sustain": 48181,
          "env_release": 50000,
          "env_master": 112,
          "fx_filter": 4,
          "fx_freq": 11024,
          "fx_resonance": 240,
          "fx_delay_time": 6,
          "fx_delay_amt": 121,
          "fx_pan_freq": 3,
          "fx_pan_amt": 67,
          "lfo_osc1_freq": 0,
          "lfo_fx_freq": 1,
          "lfo_freq": 4,
          "lfo_amt": 254,
          "lfo_waveform": 0,
          "p": [
              1,
              2,
              3,
              4
          ],
          "c": [
              {
                  "n": [
                      150,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      152,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              },
              {
                  "n": [
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      154,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              },
              {
                  "n": [
                      142,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      145,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              },
              {
                  "n": [
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      149,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              }
          ]
      },
      {
          "osc1_oct": 5,
          "osc1_det": 0,
          "osc1_detune": 0,
          "osc1_xenv": 0,
          "osc1_vol": 192,
          "osc1_waveform": 0,
          "osc2_oct": 5,
          "osc2_det": 0,
          "osc2_detune": 16,
          "osc2_xenv": 0,
          "osc2_vol": 153,
          "osc2_waveform": 3,
          "noise_fader": 0,
          "env_attack": 41818,
          "env_sustain": 26363,
          "env_release": 66363,
          "env_master": 130,
          "fx_filter": 2,
          "fx_freq": 11024,
          "fx_resonance": 240,
          "fx_delay_time": 6,
          "fx_delay_amt": 102,
          "fx_pan_freq": 0,
          "fx_pan_amt": 0,
          "lfo_osc1_freq": 0,
          "lfo_fx_freq": 1,
          "lfo_freq": 7,
          "lfo_amt": 217,
          "lfo_waveform": 0,
          "p": [
              1,
              2,
              3,
              4
          ],
          "c": [
              {
                  "n": [
                      150,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              },
              {
                  "n": [
                      147,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              },
              {
                  "n": [
                      142,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              },
              {
                  "n": [
                      145,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                  ]
              }
          ]
      }
  ],
  "rowLen": 5513,
  "endPattern": 5
};


const mem = new Uint8ClampedArray(3459);

packSonantXSong(song, new DataView(mem.buffer));

// @ts-ignore
process.stdout.write(Buffer.from(mem.buffer));

*/