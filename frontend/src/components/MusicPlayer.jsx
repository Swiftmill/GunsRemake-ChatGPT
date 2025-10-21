import React, { useEffect, useRef, useState } from 'react';
import { FiPauseCircle, FiPlayCircle, FiVolume2, FiVolumeX } from 'react-icons/fi';

const MusicPlayer = ({ trackUrl, autoPlay = false }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.6;
    if (autoPlay) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
  }, [autoPlay]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  if (!trackUrl) return null;

  return (
    <div className="glass-card flex items-center gap-4 px-5 py-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setPlaying(!playing)} className="text-3xl text-white hover:text-gunspink transition">
          {playing ? <FiPauseCircle /> : <FiPlayCircle />}
        </button>
        <div>
          <p className="font-semibold">Profile soundtrack</p>
          <p className="text-xs text-white/60">Autoplay enabled</p>
        </div>
      </div>
      <div className="ml-auto">
        <button onClick={() => setMuted(!muted)} className="text-xl text-white hover:text-gunspink transition">
          {muted ? <FiVolumeX /> : <FiVolume2 />}
        </button>
      </div>
      <audio ref={audioRef} src={trackUrl} loop />
    </div>
  );
};

export default MusicPlayer;
