import {
  ArrowLeft,
  Play,
  SkipBack,
  SkipForward,
  Video,
  Camera,
  Brain,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { io, Socket } from 'socket.io-client';

// Ensure this matches your Flask server
const SOCKET_SERVER_URL = 'http://localhost:5000';

interface LessonPageProps {
  lessonTitle: string;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function LessonPage({
  lessonTitle,
  onBack,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: LessonPageProps) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [prediction, setPrediction] = useState({
    label: 'Waiting...',
    confidence: '0%',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<Socket | null>(null);

  // Socket.io Connection Logic
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to BrainWave Engine');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from Server');
      setIsConnected(false);
    });

    socketRef.current.on(
      'prediction_result',
      (data: { label: string; confidence: string }) => {
        setPrediction(data);
        setIsSuccess(parseFloat(data.confidence) > 90);
      }
    );

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Frame Capture Logic
  const captureAndSend = useCallback(() => {
    if (isCameraOn && socketRef.current?.connected && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socketRef.current.emit('image_frame', imageSrc);
      }
    }
  }, [isCameraOn]);

  // Set up the 200ms processing loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isCameraOn && isConnected) {
      interval = setInterval(captureAndSend, 200);
    }
    return () => clearInterval(interval);
  }, [isCameraOn, isConnected, captureAndSend]);

  return (
    <div className="h-full flex flex-col bg-background font-mono select-none">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-4 z-20">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl text-foreground font-bold font-pixel pixel-text-shadow">
              {lessonTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              BrainWave 2.0 • SignVision 🐒
            </p>
          </div>

          {/* Server Connection Status */}
          <div
            className={`flex items-center gap-2 px-3 md:px-4 py-2 border rounded-full transition-colors ${isConnected
                ? 'bg-accent/20 border-accent/50'
                : 'bg-destructive/20 border-destructive/50'
              }`}
          >
            {isConnected ? (
              <Wifi className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            ) : (
              <WifiOff className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
            )}
            <span className="text-xs text-foreground font-bold hidden md:inline">
              {isConnected ? 'ENGINE ONLINE' : 'ENGINE OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6">
          {/* Reference Column */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-2 shadow-xl">
            <div className="bg-black/20 rounded-2xl p-4 h-full">
              <h2 className="text-xl text-foreground font-bold flex items-center gap-2 mb-4 font-pixel">
                <Video className="w-5 h-5 md:w-6 md:h-6 text-secondary" /> Sensei's Demo
              </h2>
              <div className="aspect-video bg-black/40 border-2 border-white/5 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center shadow-inner">
                <span className="text-7xl md:text-9xl animate-pulse">👋</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-primary">GOAL:</h3>
                <p className="text-sm text-muted-foreground">
                  Match the sign above. Watch your confidence bar grow!
                </p>
              </div>
            </div>
          </div>

          {/* Practice Column with react-webcam */}
          <div
            className={`bg-white/5 backdrop-blur-md rounded-3xl border p-2 shadow-xl transition-all duration-500 ${isSuccess
                ? 'border-accent shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'border-white/10'
              }`}
          >
            <div className="bg-black/20 rounded-2xl p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-foreground font-bold flex items-center gap-2 font-pixel">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-primary" /> Live AI Practice
                </h2>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`px-4 py-2 rounded-full font-bold transition-all border ${isCameraOn ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30' : 'bg-primary/20 border-primary text-primary hover:bg-primary/30'}`}
                >
                  {isCameraOn ? 'STOP' : 'START CAM'}
                </button>
              </div>

              <div className="aspect-video bg-black/40 border-2 border-white/5 rounded-xl mb-4 relative overflow-hidden flex-1 shadow-inner">
                {isCameraOn ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 640,
                        height: 480,
                        facingMode: 'user',
                      }}
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    {/* Prediction Overlay */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 backdrop-blur-md px-3 md:px-5 py-2 md:py-3 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 md:gap-4">
                        <Brain
                          className={`w-5 h-5 md:w-6 md:h-6 ${isSuccess ? 'text-accent' : 'text-primary'
                            }`}
                        />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[10px] font-bold uppercase">
                            AI Analysis
                          </span>
                          <span className="text-foreground font-bold text-base md:text-xl leading-tight">
                            {prediction.label}
                          </span>
                        </div>
                        <span className="text-accent font-mono font-bold text-xl md:text-2xl">
                          {prediction.confidence}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Camera className="w-12 h-12 md:w-16 md:h-16 mb-2 opacity-50" />
                    <p className="font-bold text-lg md:text-xl">CAM OFFLINE</p>
                  </div>
                )}
              </div>

              {/* Progress Feedback */}
              <div
                className={`p-4 rounded-xl border transition-all ${isSuccess
                    ? 'bg-accent/20 border-accent/50'
                    : 'bg-white/5 border-white/10'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-xs font-bold uppercase ${isSuccess ? 'text-accent' : 'text-secondary'
                      }`}
                  >
                    {isSuccess ? '✨ SIGN VERIFIED' : '🦉 LANDMARK STRENGTH'}
                  </h3>
                  {isSuccess && (
                    <Sparkles className="w-5 h-5 text-accent animate-bounce" />
                  )}
                </div>
                <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${isSuccess ? 'bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-secondary'
                      }`}
                    style={{ width: prediction.confidence }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Nav */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6 max-w-2xl mx-auto flex items-center justify-center gap-6 md:gap-10 shadow-2xl">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
          >
            <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="w-16 h-16 md:w-24 md:h-24 bg-primary hover:bg-primary/90 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <Play className="w-8 h-8 md:w-12 md:h-12 fill-black text-black ml-1" />
          </div>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="p-3 md:p-4 bg-accent hover:bg-accent/80 text-white rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          >
            <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
