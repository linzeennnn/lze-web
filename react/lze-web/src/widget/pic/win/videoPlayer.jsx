import React, { useState, useRef, useEffect } from 'react';
import { FillIcon, Icon } from '../../../utils/icon';
import { useGlobal } from '../global';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const longPressTimerRef = useRef(null); 
  const prevRateRef = useRef(1.0);        
  const progressBarRef = useRef(null); // 用于计算点击位置
  const loopPlay = useGlobal((state) => state.loopPlay)
  const mediaWin = useGlobal((state) => state.mediaWin);
  const pageNum = useGlobal((state) => state.pageNum);
  const vidList = useGlobal((state) => state.vidList)[pageNum - 1];
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

  const [hoverTime, setHoverTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const speedOptions = [0.5, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0];

  const formatTime = (time) => {
    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = Math.floor(Math.max(0, time % 60)).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const resetTimer = () => {
  if (!showControls) {
    setShowControls(true);
  }

  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  if (isPlaying) {
    timerRef.current = setTimeout(() => {
      setShowControls(false);
      setShowSpeedMenu(false);
    }, 2000);
  }
};
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };
}, []);
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

  // --- 新增：处理视频播放结束的逻辑 ---
  const handleVideoEnded = () => {
    if (loopPlay === "single") {
      // 单曲循环：直接重置时间并播放
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      let nextIndex = mediaWin.index;
      if (loopPlay === "sequence") {
        // 顺序播放：索引 + 1，如果到末尾则回到 0
        nextIndex = (mediaWin.index + 1) % vidList.length;
      } else if (loopPlay === "random") {
        // 随机播放：生成一个不同于当前的随机索引
        if (vidList.length > 1) {
          while (nextIndex === mediaWin.index) {
            nextIndex = Math.floor(Math.random() * vidList.length);
          }
        }
      }
      // 更新全局状态，触发 src 变化
      useGlobal.setState({ mediaWin: { ...mediaWin, index: nextIndex } });
    }
  };

  const handleProgressMove = (e) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    const newTime = (percentage / 100) * duration;
    videoRef.current.currentTime = newTime;
    if (isDragging) {
      setCurrentTime(newTime);
    }
    setProgress(percentage);
  };

  const handleProgressHover = (e) => {
    if (!progressBarRef.current || isDragging) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    setHoverTime(percentage * duration);
    setIsHovering(true);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsHovering(false);
    handleProgressMove(e);
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
      className={`video-container ${showControls || !isPlaying ? 'visible' : 'hidden'}`}
      onMouseMove={resetTimer}
      onMouseLeave={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        if (isPlaying) {
          setShowControls(false);
        }
      }}
      onClick={() => setShowSpeedMenu(false)}
      onDoubleClick={toggleFullScreen}
      onContextMenu={(e) => {
        e.preventDefault();
        seek(5);
      }}
    >
      {isLongPressing && (
        <div className='speed-notice'>
          ▶▶▶
        </div>
      )}

      {isHovering && !isDragging && (
        <div className='vid-time-preview'>
          {formatTime(hoverTime)}
        </div>
      )}

      <video
        autoPlay={true}
        // 注意：这里将原有的 loop={true} 改为 false，因为我们要手动控制 onEnded 逻辑
        loop={loopPlay === "single"}
        ref={videoRef}
        src={mediaWin.url + vidList[mediaWin.index]}
        className={"video-element " + (fullScreen ? "fullScreen-video" : "")}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setDuration(videoRef.current.duration);
          videoRef.current.playbackRate = playbackRate; // 确保切歌后倍速不变
        }}
        onEnded={handleVideoEnded} // 绑定结束逻辑
        onClick={togglePlay}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      <div
        className={`controls-wrapper ${showControls || !isPlaying ? 'visible' : 'hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='vid-progress-box'>
          <button className="control-button btn" onClick={togglePlay}>
            {isPlaying ? FillIcon('pause') : FillIcon('play')}
          </button>
          
          <div 
            ref={progressBarRef}
            className="progress-slider"
            onMouseDown={handleMouseDown}
            onMouseMove={handleProgressHover}
            onMouseLeave={() => setIsHovering(false)}
          >
           <div
           className='progress-bar'
           style={{
               width: `${progress}%`,
               transition: isDragging ? 'none' : 'transform 0.1s linear'
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
              {formatTime(currentTime)} / {formatTime(duration)}
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
            <div className='loop-box' onClick={()=>{switchLoop()}}>
                {loopPlay=="single"&&<button className='btn loop-btn'>{Icon("loopSingle")}</button>}
                {loopPlay=="sequence"&&<button className='btn loop-btn'>{Icon("loopSequence")}</button>}
                {loopPlay=="random"&&<button className='btn loop-btn'>{Icon("loopRandom")}</button>}
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

function switchLoop(){
  const global = useGlobal.getState()
  let setvalue
  switch (global.loopPlay) {
    case "single":
      setvalue = "sequence"
      break;
    case "sequence":
      setvalue = "random"
      break;
    case "random":
      setvalue = "single"
      break;
    default:
      setvalue = "sequence"
  }
  useGlobal.setState({ loopPlay: setvalue })
}