import { GridEngine } from "grid-engine";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'rpg-template',
  url: '',
  version: '',
  width: 800,
  height: 600,
  backgroundColor: 0x3a404d,
  type: Phaser.AUTO,
  render: {
    antialias: false,
  },
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
};