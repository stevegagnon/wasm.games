```
0x0000  DELTA_TIME                4  f32 time since last update
0x0004  GAMEPADS                 16  4 4 byte 32 button gamepads
0x0014  MOUSE                     4  mouse state X / Y / buttons / scroll

0x0018  CAMERA_X                  2  i16
0x001a  CAMERA_Y                  2  i16
0x001c  BORDER_COLOR              4  24-bit RGB color

0x0020  TILES_PALETTE          1024  256 x 32-bit RGBA colors
0x0000  TILES_0               16384  128x128 8-bit image with 16x16 8x8 tiles
0x0000  TILES_1               16384  128x128 8-bit image with 16x16 8x8 tiles

0x0000  MAP_WIDTH                 1  u8 width of bg map in tiles
0x0000  MAP_HEIGHT                1  u8 height of bg map in tiles
0x0000  MAP_DATA              16384  reserved for tile engine

0x0000  SPRITES                4096  256 16 byte sprites

0x0000  WAVEFORMS              2048  16 waveforms each 32 x f32 values
0x0000  VOICES                  512  16 voices
0x0000  PATTERNS               2560  8x10x32 u8 notes
0x0000  SONG                    384  8x48 u8 pattern indexes
0x0000  PATTERN_ROW_LEN           2  samples in every pattern row, calculated from BPM
0x0000  SONG_POSITION             1  current row in song
0x0000  PATTERN_POSITION          1  current row in pattern
0x0000  PATTERN_ROW_POSITION      2  current position in pattern row
0x0000  PLAYING_VOICE             4  16 2-bit voice status, [0] = playing, [1] = mute
0x0000  VOICE_STATES            256  16 16 byte voice states

0x0000  ?FRAME_OUT             65536
0x0000  ?AUDIO_OUT              5880  735 stereo f32 samples

```

```
SPRITE
INDEX          u8
X              i16
Y              i16
```

```
VOICE 29/32 bytes used
LFO_FX_FREQ    u8
LFO_FREQ       u8
LFO_AMT        u8
LFO_WAVEFORM   u8
OSC1_WAVEFORM  u8
OSC1_VOL       u8
OSC1_OCT       u8
OSC1_DET       u8
OSC1_DETUNE    u8
OSC1_XENV      u8
LFO_OSC1_FREQ  u8
OSC2_WAVEFORM  u8
OSC2_VOL       u8
OSC2_OCT       u8
OSC2_DET       u8
OSC2_DETUNE    u8
OSC2_XENV      u8
NOISE_FADER    u8
ENV_ATTACK     u8
ENV_SUSTAIN    u8
ENV_RELEASE    u8
ENV_MASTER     u8
FX_FILTER      u8
FX_FREQ        u8
FX_RESONANCE   u8
FX_DELAY_TIME  u8
FX_DELAY_AMT   u8
FX_PAN_FREQ    u8
FX_PAN_AMT     u8
```

```
VOICE STATE 12/16 bytes
POSITION       i32
LOW            f32
BAND           f32
```
