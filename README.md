```
DELTA_TIME         4  f32 time since last update
GAMEPADS          16  state for 4 gamepads
MOUSE              4  mouse state X / Y / buttons / scroll

CAMERA_X           2  i16
CAMERA_Y           2  i16
BORDER_COLOR       4  24-bit RGB color

TILES_PALETTE   1048  256 x 32-bit RGBA colors
TILES_0        16384  128x128 8-bit image with 16x16 8x8 tiles
TILES_1        16384  128x128 8-bit image with 16x16 8x8 tiles

MAP_WIDTH          1  u8 width of bg map in tiles
MAP_HEIGHT         1  u8 height of bg map in tiles
MAP_DATA       16384  reserved for tile engine

SPRITES         3328  256 sprites

WAVEFORMS        128  16 waveforms each 32 x f32 values
VOICES           464  16 voices
PATTERNS        2560  8x10x32 u8 notes
SONG             384  8x48 u8 pattern indexes
PLAYING_VOICE      4  16 2-bit voice status, [0] = playing, [1] = mute
VOICE_STATES     192  16 voice states
```

```
SPRITE
INDEX          u8
FLIP_X         u8
FLIP_Y         u8
SIZE           u8
FRAMES         u8
ALGO           u8
SPEED          u8
SCALE          u8
ROTATE         u8
X              i16
Y              i16
```

```
VOICE
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
VOICE STATE
POSITION       i32
LOW            f32
BAND           f32
```
