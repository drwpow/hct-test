import better from "better-color-tools";
import { HCT } from "@material/material-color-utilities";

const c1Input = document.querySelector("#c1") as HTMLInputElement;
const c2Input = document.querySelector("#c2") as HTMLInputElement;

function init() {
  c1Input.value = `#${Math.floor(Math.random() * 255 ** 3).toString(16)}`;
  c2Input.value = `#${Math.floor(Math.random() * 255 ** 3).toString(16)}`;
}
init();

function render() {
  const c1 = better.from(c1Input.value);
  const c2 = better.from(c2Input.value);

  const c1HCT = HCT.fromInt(parseInt(c1.hex.replace("#", "ff"), 16));
  const c2HCT = HCT.fromInt(parseInt(c2.hex.replace("#", "ff"), 16));

  const hctEl = document.querySelector(".hct");
  const oklabEl = document.querySelector(".oklab");
  const oklchEl = document.querySelector(".oklch");
  const srgbEl = document.querySelector(".srgb");

  for (const parent of [hctEl, oklabEl, oklchEl, srgbEl]) {
    while (parent.lastElementChild) parent.lastElementChild.remove();
  }

  const STEPS = 11;

  for (let n = 0; n <= STEPS; n++) {
    // HCT
    const w2 = n / STEPS;
    const w1 = 1 - w2;
    const hctStep = document.createElement("div");
    let hue = 0;
    // go the short way around the color wheel, not the long way
    if (Math.abs(c1HCT.hue - c2HCT.hue) > 180) {
      if (c1HCT.hue < c2HCT.hue) {
        hue = (c1HCT.hue + 360) * w1 + c2HCT.hue * w2;
      } else {
        hue = c1HCT.hue * w1 + (c2HCT.hue + 360) * w2;
      }
    } else {
      hue = c1HCT.hue * w1 + c2HCT.hue * w2;
    }
    const hct = HCT.from(
      hue,
      c1HCT.chroma * w1 + c2HCT.chroma * w2,
      c1HCT.tone * w1 + c2HCT.tone * w2
    );
    const hctHex = hct.toInt().toString(16).substring(2); // first 2 are alpha (???)
    hctStep.style.backgroundColor = `#${hctHex}`;
    hctEl.appendChild(hctStep);

    // OKlab
    const oklabStep = document.createElement("div");
    const oklabmix = better.mix(c1.hex, c2.hex, n / STEPS, "oklab").hex;
    oklabStep.style.backgroundColor = oklabmix;
    oklabEl.appendChild(oklabStep);

    // Oklch
    const oklchStep = document.createElement("div");
    const oklchmix = better.mix(c1.hex, c2.hex, n / STEPS, "oklch").hex;
    oklchStep.style.backgroundColor = oklchmix;
    oklchEl.appendChild(oklchStep);

    // sRGB
    const srgbStep = document.createElement("div");
    const srgbMix = better.mix(c1.hex, c2.hex, n / STEPS, "sRGB").hex;
    srgbStep.style.backgroundColor = srgbMix;
    srgbEl.appendChild(srgbStep);
  }
}

render();

c1Input.addEventListener("change", render);
c2Input.addEventListener("change", render);
