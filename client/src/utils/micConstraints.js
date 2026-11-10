/**
 * Microphone settings that favour the person closest to the microphone —
 * for classrooms where other students are talking nearby.
 *
 * - autoGainControl OFF: automatic gain turns the volume up during pauses,
 *   which is exactly when it pulls in the neighbours' voices.
 * - noiseSuppression / echoCancellation ON: removes steady room noise.
 * - voiceIsolation: asks the browser/OS for its "voice isolation" processing
 *   where it exists (ignored elsewhere — unknown constraints are skipped).
 *
 * Software can only reduce other voices, not remove them. A headset or
 * holding the phone 10–15 cm from the mouth helps far more.
 */
export function nearVoiceConstraints({ noiseSuppression = true, echoCancellation = true } = {}) {
  return {
    channelCount: 1,
    echoCancellation,
    noiseSuppression,
    autoGainControl: false,
    voiceIsolation: true,
  };
}
