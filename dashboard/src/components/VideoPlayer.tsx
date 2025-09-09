import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

type Props = {
  src?: string
}

export function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    let hls: Hls | undefined
    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }
    return () => {
      if (hls) hls.destroy()
    }
  }, [src])

  return (
    <video ref={videoRef} style={{ width: '100%', height: '100%' }} controls />
  )
}


