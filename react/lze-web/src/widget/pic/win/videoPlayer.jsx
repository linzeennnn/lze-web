import React, { useState, useRef, useEffect } from 'react';
import { FillIcon, Icon } from '../../../utils/icon';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const longPressTimerRef = useRef(null); 
  const prevRateRef = useRef(1.0);        
  const progressBarRef = useRef(null); // 用于计算点击位置

  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [preVolume, setPreVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // 拖拽状态锁

  const speedOptions = [0.5, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0];

  // --- 逻辑函数 ---

  const resetTimer = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 2000);
    }
  };

  const seek = (amount) => {
    if (!videoRef.current) return;
    const newTime = videoRef.current.currentTime + amount;
    videoRef.current.currentTime = Math.min(Math.max(newTime, 0), duration);
    resetTimer();
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.warn(err));
    } else {
      videoRef.current.pause();
    }
  };

  const toggleFullScreen = (e) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleSpeedChange = (rate) => {
    const r = parseFloat(rate);
    videoRef.current.playbackRate = r;
    setPlaybackRate(r);
    setShowSpeedMenu(false);
    resetTimer();
  };

  // --- 进度条模拟逻辑 ---

  const handleProgressMove = (e) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    
    const newTime = (percentage / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleProgressMove(e); // 点击即跳转
    resetTimer();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) handleProgressMove(e);
    };
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, duration]);

  // --- 事件监听 ---

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') e.preventDefault();
      switch (e.code) {
        case 'Space':
          togglePlay();
          break;
        case 'ArrowLeft':
          if (!e.repeat) seek(-5);
          break;
        case 'ArrowRight':
          if (!e.repeat) {
            seek(5);
            longPressTimerRef.current = setTimeout(() => {
              prevRateRef.current = videoRef.current.playbackRate;
              videoRef.current.playbackRate = 3.0;
              setPlaybackRate(3.0);
              setIsLongPressing(true);
            }, 500);
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowRight') {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        if (isLongPressing) {
          videoRef.current.playbackRate = prevRateRef.current;
          setPlaybackRate(prevRateRef.current);
          setIsLongPressing(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [duration, isLongPressing]);

  useEffect(() => {
    const handleFsChange = () => setFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isDragging) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    setProgress((current / videoRef.current.duration) * 100 || 0);
  };

  return (
    <div
      mode="dark"
      ref={containerRef}
      className="video-container"
      onMouseMove={resetTimer}
      onMouseLeave={() => isPlaying && (timerRef.current = setTimeout(() => setShowControls(false), 500))}
      onClick={() => setShowSpeedMenu(false)}
      onDoubleClick={toggleFullScreen}
      onContextMenu={(e) => {
        e.preventDefault();
        seek(5);
      }}
      style={{ 
        position: 'relative', 
        backgroundColor: '#000',
        cursor: (showControls || !isPlaying) ? 'default' : 'none' 
      }}
    >
      {isLongPressing && (
        <div className='speed-notice'>
          ▶▶▶
        </div>
      )}

      <video
        autoPlay
        ref={videoRef}
        src={src}
        className={"video-element " + (fullScreen ? "fullScreen-video" : "")}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        onClick={togglePlay}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      <div
        className={`controls-wrapper ${showControls || !isPlaying ? 'visible' : 'hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='progress-box'>
          <button className="control-button btn" onClick={togglePlay}>
            {isPlaying ? FillIcon('pause') : FillIcon('play')}
          </button>
          
          {/* 这里将 input 替换为 div，保留原有 className */}
          <div 
            ref={progressBarRef}
            className="progress-slider"
            onMouseDown={handleMouseDown}
          >
           <div
           className='progress-bar'
           style={{
               width: `${progress}%`,
               ransition: isDragging ? 'none' : 'transform 0.1s linear'
            }} />
            <div
           className='progress-dot'
           style={{
               left:`${progress}%`
            }} />
          </div>
          
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <span className="time-display">
              {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
              {Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
              {Math.floor(duration / 60).toString().padStart(2, '0')}:
              {Math.floor(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className='control-right'>
            <div className="volume-group">
              <button className='btn volume-btn' onClick={() => {
                if (volume === 0) {
                  setVolume(preVolume);
                  videoRef.current.volume = preVolume;
                } else {
                  setPreVolume(volume);
                  setVolume(0);
                  videoRef.current.volume = 0;
                }
              }}>
                {volume === 0 ? Icon("mute") : Icon("volume")}
              </button>
              <input
                type="range"
                className="volume-slider"
                min="0" max="1" step="0.1"
                value={volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  videoRef.current.volume = v;
                }}
                style={{ "--volume": `${volume * 100}%` }}
              />
            </div>

            <div className="speed-group" style={{ position: 'relative' }}>
              {showSpeedMenu && (
                <div className="speed-menu" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                  {speedOptions.slice().reverse().map(rate => (
                    <div
                      key={rate}
                      className={`speed-item ${playbackRate === rate ? 'active' : ''}`}
                      onClick={() => handleSpeedChange(rate)}
                    >
                      {rate}x
                    </div>
                  ))}
                </div>
              )}
              <button
                className="btn speed-btn"
                onClick={() => { setShowSpeedMenu(!showSpeedMenu); resetTimer(); }}
              >
                {`${playbackRate}x`}
              </button>
            </div>

            <button className="control-button btn" onClick={toggleFullScreen}>
              {fullScreen ? Icon("minimize") : Icon("maximize")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;