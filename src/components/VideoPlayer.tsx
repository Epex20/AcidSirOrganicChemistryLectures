import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  X,
  Download
} from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
  isOpen: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState('Auto');
  const [isBuffering, setIsBuffering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
  const resolutions = [
    { label: 'Auto', value: 'auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
    { label: '360p', value: '360' }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement || 
           (document as any).webkitFullscreenElement || 
           (document as any).mozFullScreenElement || 
           (document as any).msFullscreenElement)
      );
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default behavior for all our handled keys
      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const newVolumeUp = Math.min(1, video.volume + 0.1);
          video.volume = newVolumeUp;
          setVolume(newVolumeUp);
          setIsMuted(newVolumeUp === 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newVolumeDown = Math.max(0, video.volume - 0.1);
          video.volume = newVolumeDown;
          setVolume(newVolumeDown);
          setIsMuted(newVolumeDown === 0);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullscreen]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    const isCurrentlyFullscreen = !!(
      document.fullscreenElement || 
      (document as any).webkitFullscreenElement || 
      (document as any).mozFullScreenElement || 
      (document as any).msFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const changeResolution = (resolution: string, label: string) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;
    
    setSelectedResolution(label);
    
    // For now, we'll just show the selection since we can't actually change resolution
    // In a real implementation, you would have different quality URLs
    console.log(`Resolution changed to: ${label}`);
    
    // If you had different quality URLs, you would do:
    // video.src = getVideoUrlForResolution(resolution);
    // video.currentTime = currentTime;
    // if (wasPlaying) video.play();
    
    setShowSettings(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `${title}.webm`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    togglePlay();
  };

  const handleVideoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFullscreen();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div 
        ref={containerRef}
        className={`relative bg-black focus:outline-none ${isFullscreen ? 'w-screen h-screen' : 'w-full max-w-6xl h-full max-h-[90vh]'}`}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        tabIndex={0}
      >
        {/* Video Title */}
        <div className={`absolute top-4 left-4 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-white text-sm sm:text-lg font-semibold bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
            {title}
          </h3>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-30 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <X size={20} />
        </button>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain focus:outline-none"
          onClick={handleVideoClick}
          onDoubleClick={handleVideoDoubleClick}
          preload="metadata"
        />

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          {!isPlaying && !isBuffering && (
            <div className="p-4 bg-black/50 text-white rounded-full">
              <Play size={48} fill="white" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skip(-10)}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
                title="Skip backward 10s (←)"
              >
                <SkipBack size={20} />
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skip(10)}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
                title="Skip forward 10s (→)"
              >
                <SkipForward size={20} />
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
                  title="Mute/Unmute (M)"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider hidden sm:block"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Settings */}
              <div className="relative">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-all mr-2"
                  title="Download Video"
                >
                  <Download size={20} />
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>

                {showSettings && (
                  <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-48">
                    {/* Playback Speed */}
                    <div className="mb-4">
                      <p className="text-white text-sm font-semibold mb-2">Playback Speed</p>
                      <div className="grid grid-cols-3 gap-1">
                        {playbackSpeeds.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => changePlaybackRate(speed)}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              playbackRate === speed
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resolution */}
                    <div>
                      <p className="text-white text-sm font-semibold mb-2">Quality</p>
                      <div className="space-y-1">
                        {resolutions.map((resolution) => (
                          <button
                            key={resolution.value}
                            onClick={() => changeResolution(resolution.value, resolution.label)}
                            className={`block w-full text-left px-2 py-1 text-sm rounded transition-all ${
                              selectedResolution === resolution.label
                                ? 'bg-indigo-600 text-white'
                                : 'text-white hover:bg-white/20'
                            }`}
                          >
                            {resolution.label}
                            {selectedResolution === resolution.label && (
                              <span className="ml-2 text-xs">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-all"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className={`absolute top-16 left-4 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-white text-xs bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            Space: Play/Pause • ←/→: Skip • ↑/↓: Volume • F: Fullscreen • M: Mute • Download Available
          </div>
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #4f46e5;
            cursor: pointer;
            border: 2px solid white;
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #4f46e5;
            cursor: pointer;
            border: 2px solid white;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VideoPlayer;