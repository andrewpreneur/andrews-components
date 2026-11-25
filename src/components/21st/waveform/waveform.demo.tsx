// Demo from 21st.dev: Waveform (Default) by thegridcn. https://21st.dev/thegridcn/waveform  saved 2026-11-25
import { Waveform } from "./waveform"

export default function WaveformDemo() {
  return (
    <div className="flex min-h-[240px] items-center justify-center bg-background p-8">
      <Waveform
        label="Audio Signal"
        bars={28}
        playing
        intensity="medium"
        className="w-80"
      />
    </div>
  )
}
