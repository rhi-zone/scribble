export { GraphicsContext, initCanvas, createCanvas, clearCanvas } from "./graphics";
export { initInput, flushInput, isKeyDown, isKeyPressed, isKeyReleased, isMouseDown, isMousePressed, isMouseReleased, mouseX, mouseY } from "./input";
export { save, load, remove } from "../../../shared/ts/platform/persistence";
export { scheduleTimeout, cancelTimeout, requestFrame } from "../../../shared/ts/platform/timing";
export { loadBuffer, playSfx, playMusic, stopMusic, setMusicVolume } from "../../../shared/ts/platform/audio";
