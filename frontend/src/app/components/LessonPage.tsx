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
import io from 'socket.io-client';

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
  // --- States ---
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [prediction, setPrediction] = useState({
    label: 'Waiting...',
    confidence: '0%',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Refs ---
  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<any>(null);

  // 1. Socket.io Connection Logic
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
        // Success threshold: 90%
        setIsSuccess(parseFloat(data.confidence) > 90);
      },
    );

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // 2. Frame Capture Logic (Using react-webcam API)
  const captureAndSend = useCallback(() => {
    if (isCameraOn && socketRef.current?.connected && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socketRef.current.emit('image_frame', imageSrc);
      }
    }
  }, [isCameraOn]);

  // 3. Set up the 200ms processing loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isCameraOn && isConnected) {
      interval = setInterval(captureAndSend, 200);
    }
    return () => clearInterval(interval);
  }, [isCameraOn, isConnected, captureAndSend]);

  return (
    <div className='h-full flex flex-col bg-transparent font-sans select-none'>
      {/* Header */}
      <div className='bg-[#4e342e] border-b-8 border-[#3e2723] px-6 py-4 rounded-b-3xl shadow-xl z-20 mx-4 mt-2'>
        <div className='flex items-center gap-4'>
          <button
            onClick={onBack}
            className='p-3 bg-[#8d6e63] hover:bg-[#a1887f] rounded-xl border-b-4 border-[#5d4037] active:border-b-0 active:translate-y-1 transition-all'
          >
            <ArrowLeft className='w-6 h-6 text-[#efebe9]' />
          </button>
          <div className='flex-1'>
            <h1 className='text-2xl text-[#fff8e1] font-black drop-shadow-md'>
              {lessonTitle}
            </h1>
            <p className='text-sm text-[#d7ccc8] font-bold'>
              BrainWave 2.0 • SignVision 🐒
            </p>
          </div>

          {/* Server Connection Status */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${
              isConnected
                ? 'bg-[#1b5e20] border-[#66bb6a]'
                : 'bg-[#b71c1c] border-[#ef5350]'
            }`}
          >
            {isConnected ? (
              <Wifi className='w-5 h-5 text-[#66bb6a]' />
            ) : (
              <WifiOff className='w-5 h-5 text-[#ef5350]' />
            )}
            <span className='text-xs text-white font-black'>
              {isConnected ? 'ENGINE ONLINE' : 'ENGINE OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 md:p-6 pb-32'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6'>
          {/* Reference Column */}
          <div className='bg-[#8d6e63] rounded-3xl shadow-xl border-4 border-[#5d4037] p-2'>
            <div className='bg-[#fff3e0] rounded-2xl p-4 h-full'>
              <h2 className='text-xl text-[#3e2723] font-black flex items-center gap-2 mb-4'>
                <Video className='w-6 h-6' /> Sensei's Demo
              </h2>
              <div className='aspect-video bg-[#3e2723] rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center'>
                <span className='text-9xl animate-pulse'>👋</span>
              </div>
              <div className='bg-[#d7ccc8] p-4 rounded-xl border-2 border-[#a1887f]'>
                <h3 className='text-sm font-black text-[#3e2723]'>GOAL:</h3>
                <p className='text-sm font-bold text-[#4e342e]'>
                  Match the sign above. Watch your confidence bar grow!
                </p>
              </div>
            </div>
          </div>

          {/* Practice Column with react-webcam */}
          <div
            className={`bg-[#8d6e63] rounded-3xl shadow-xl border-4 p-2 transition-all duration-500 ${
              isSuccess
                ? 'border-[#76ff03] shadow-[0_0_30px_rgba(118,255,3,0.4)]'
                : 'border-[#5d4037]'
            }`}
          >
            <div className='bg-[#fff3e0] rounded-2xl p-4 h-full flex flex-col'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl text-[#3e2723] font-black flex items-center gap-2'>
                  <Camera className='w-6 h-6' /> Live AI Practice
                </h2>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`px-6 py-2 rounded-xl font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                    isCameraOn
                      ? 'bg-[#ef5350] text-white border-[#b71c1c]'
                      : 'bg-[#ffca28] text-[#3e2723] border-[#ff8f00]'
                  }`}
                >
                  {isCameraOn ? 'STOP' : 'START CAMERA'}
                </button>
              </div>

              <div className='aspect-video bg-[#3e2723] rounded-2xl mb-4 relative overflow-hidden border-4 border-[#5d4037] flex-1'>
                {isCameraOn ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat='image/jpeg'
                      videoConstraints={{
                        width: 640,
                        height: 480,
                        facingMode: 'user',
                      }}
                      className='w-full h-full object-cover transform scale-x-[-1]'
                    />
                    {/* Prediction Overlay */}
                    <div className='absolute top-4 right-4 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-white/20 shadow-2xl'>
                      <div className='flex items-center gap-4'>
                        <Brain
                          className={`w-6 h-6 ${
                            isSuccess ? 'text-[#76ff03]' : 'text-[#ffca28]'
                          }`}
                        />
                        <div className='flex flex-col'>
                          <span className='text-white text-[10px] font-black uppercase opacity-60'>
                            AI Analysis
                          </span>
                          <span className='text-white font-black text-xl leading-tight'>
                            {prediction.label}
                          </span>
                        </div>
                        <span className='text-[#76ff03] font-mono font-black text-2xl'>
                          {prediction.confidence}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='absolute inset-0 flex flex-col items-center justify-center text-white/20'>
                    <Camera className='w-16 h-16 mb-2' />
                    <p className='font-black text-xl'>CAM OFFLINE</p>
                  </div>
                )}
              </div>

              {/* Progress Feedback */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isSuccess
                    ? 'bg-[#c8e6c9] border-[#4caf50]'
                    : 'bg-[#b39ddb] border-[#7e57c2]'
                }`}
              >
                <div className='flex items-center justify-between mb-2'>
                  <h3
                    className={`text-xs font-black uppercase ${
                      isSuccess ? 'text-[#1b5e20]' : 'text-[#311b92]'
                    }`}
                  >
                    {isSuccess ? '✨ SIGN VERIFIED' : '🦉 LANDMARK STRENGTH'}
                  </h3>
                  {isSuccess && (
                    <Sparkles className='w-5 h-5 text-[#2e7d32] animate-bounce' />
                  )}
                </div>
                <div className='w-full bg-black/10 rounded-full h-4 overflow-hidden shadow-inner'>
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      isSuccess ? 'bg-[#4caf50]' : 'bg-[#7e57c2]'
                    }`}
                    style={{ width: prediction.confidence }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Nav */}
        <div className='bg-[#4e342e] rounded-3xl shadow-2xl border-b-8 border-[#3e2723] p-6 max-w-2xl mx-auto flex items-center justify-center gap-10'>
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className='p-4 bg-[#8d6e63] text-white rounded-2xl border-b-4 border-[#5d4037] disabled:opacity-30'
          >
            <SkipBack />
          </button>
          <div className='w-24 h-24 bg-[#ff6f00] text-white rounded-full border-b-8 border-[#e65100] flex items-center justify-center shadow-2xl'>
            <Play className='w-12 h-12 fill-current ml-2 text-white' />
          </div>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className='p-4 bg-[#ef6c00] text-white rounded-2xl border-b-4 border-[#e65100] disabled:opacity-30'
          >
            <SkipForward />
          </button>
        </div>
      </div>
    </div>
  );
}
