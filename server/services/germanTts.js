/**
 * German text-to-speech for the Goethe module.
 *
 * Uses Azure neural voices (native German speakers, plus Austrian and Swiss
 * voices at B2/C1 as in the real exam) when AZURE_SPEECH_KEY and
 * AZURE_SPEECH_REGION are set. Falls back to the OpenAI voices — which read
 * German with a slight English accent — if Azure is not configured or a
 * request fails, so audio is never lost.
 *
 * Callers keep using the six logical voice names (alloy, nova, shimmer, onyx,
 * echo, fable); this module maps them to real German voices.
 *
 * Env:
 *   GOETHE_TTS_PROVIDER = "azure" | "openai"   (default: azure when configured)
 *   GOETHE_TTS_MODEL                            (OpenAI fallback model, default tts-1-hd)
 */
const axios = require("axios");
const { OpenAI } = require("openai");

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";
const OPENAI_TTS_MODEL = process.env.GOETHE_TTS_MODEL || "tts-1-hd";
const OPENAI_VOICES = ["alloy", "nova", "shimmer", "onyx", "echo", "fable"];

let openaiClient = null;
function openai() {
  if (!openaiClient) openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openaiClient;
}

// Standard German (Germany) for every level.
const AZURE_VOICES = {
  alloy: { name: "de-DE-KatjaNeural", locale: "de-DE" }, // announcer / moderator / examiner
  nova: { name: "de-DE-AmalaNeural", locale: "de-DE" }, // woman 1
  shimmer: { name: "de-DE-LouisaNeural", locale: "de-DE" }, // woman 2
  onyx: { name: "de-DE-ConradNeural", locale: "de-DE" }, // man 1
  echo: { name: "de-DE-KillianNeural", locale: "de-DE" }, // man 2
  fable: { name: "de-DE-KlausNeural", locale: "de-DE" }, // man 3
};

// B2/C1 recordings include speakers from Austria and Switzerland.
const AZURE_REGIONAL_OVERRIDES = {
  shimmer: { name: "de-AT-IngridNeural", locale: "de-AT" },
  echo: { name: "de-CH-JanNeural", locale: "de-CH" },
};

function azureEnabled() {
  if ((process.env.GOETHE_TTS_PROVIDER || "").toLowerCase() === "openai") return false;
  return Boolean(SPEECH_KEY);
}

function pickAzureVoice(voice, level) {
  const key = OPENAI_VOICES.includes(voice) ? voice : "nova";
  if (["B2", "C1"].includes(level) && AZURE_REGIONAL_OVERRIDES[key]) return AZURE_REGIONAL_OVERRIDES[key];
  return AZURE_VOICES[key];
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 0.92 → "-8%", 1.05 → "+5%" */
function prosodyRate(speed) {
  const pct = Math.round(((Number(speed) || 1) - 1) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

async function azureSpeech({ text, voice, speed, level }) {
  const v = pickAzureVoice(voice, level);
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${v.locale}"><voice name="${v.name}"><prosody rate="${prosodyRate(speed)}">${escapeXml(text)}</prosody></voice></speak>`;
  const res = await axios.post(`https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, ssml, {
    headers: {
      "Ocp-Apim-Subscription-Key": SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
      "User-Agent": "bandlogic-server",
    },
    responseType: "arraybuffer",
    timeout: 60000,
  });
  const buffer = Buffer.from(res.data);
  if (!buffer.length) throw new Error("Azure TTS returned no audio");
  return buffer;
}

async function openaiSpeech({ text, voice, speed }) {
  const res = await openai().audio.speech.create({
    model: OPENAI_TTS_MODEL,
    voice: OPENAI_VOICES.includes(voice) ? voice : "nova",
    input: text,
    response_format: "mp3",
    speed: Number(speed) || 1.0,
  });
  return Buffer.from(await res.arrayBuffer());
}

let warnedAzureFailure = false;

/**
 * Returns an mp3 Buffer of `text` spoken in German.
 * @param {{ text: string, voice?: string, speed?: number, level?: string }} opts
 */
async function synthesizeGerman({ text, voice = "nova", speed = 1.0, level = "B1" }) {
  const input = String(text || "").slice(0, 4000);
  if (!input.trim()) throw new Error("TTS: empty text");

  if (azureEnabled()) {
    try {
      return await azureSpeech({ text: input, voice, speed, level });
    } catch (err) {
      if (!warnedAzureFailure) {
        warnedAzureFailure = true;
        const status = err.response?.status ? ` (HTTP ${err.response.status})` : "";
        console.warn(`Azure German TTS failed${status}: ${err.message} — falling back to OpenAI voices.`);
      }
    }
  }
  return openaiSpeech({ text: input, voice, speed });
}

module.exports = { synthesizeGerman, azureEnabled, pickAzureVoice, prosodyRate, escapeXml };
