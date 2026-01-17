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
  Timer,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

interface LessonPageProps {
  lessonId: number;
  lessonTitle: string;
  targetSign: string; // The specific sign/letter passed from the parent
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const VOWEL_STEPS = [
  {
    letter: 'A',
    title: 'Letter A',
    description: 'Make a fist with your thumb on the side.',
    image:
      'https://media.tenor.com/images/1c6183e390cbed58238122320b9e843b/tenor.png',
  }, // Placeholder GIF
  {
    letter: 'E',
    title: 'Letter E',
    description: 'Curl your fingers down, touching thumb to palm.',
    image: 'https://media.tenor.com/-XvU6oXgB6kAAAAC/asl-e.gif',
  },
  {
    letter: 'I',
    title: 'Letter I',
    description: 'Stick your pinky up, others down.',
    image: 'https://media.tenor.com/EdbG9gU24QYAAAAC/asl-i.gif',
  },
  {
    letter: 'O',
    title: 'Letter O',
    description: 'Form an O shape with fingers and thumb.',
    image: 'https://media.tenor.com/_d2X4yNzg5MAAAAC/asl-o.gif',
  },
  {
    letter: 'U',
    title: 'Letter U',
    description: 'Index and middle fingers up, others down.',
    image: 'https://media.tenor.com/A6u_C2y1C1AAAAAC/asl-u.gif',
  },
];

const NUMBERS_STEPS = [
  {
    letter: '1',
    title: 'Number 1',
    description: 'Point your index finger up, others down.',
    image: 'https://media.tenor.com/placeholder-1.gif',
  },
  {
    letter: '2',
    title: 'Number 2',
    description: 'Index and middle fingers up in a V shape.',
    image: 'https://media.tenor.com/placeholder-2.gif',
  },
  {
    letter: '3',
    title: 'Number 3',
    description: 'Thumb, index, and middle fingers up.',
    image: 'https://media.tenor.com/placeholder-3.gif',
  },
  {
    letter: '4',
    title: 'Number 4',
    description: 'Four fingers up, thumb down.',
    image: 'https://media.tenor.com/placeholder-4.gif',
  },
  {
    letter: '5',
    title: 'Number 5',
    description: 'All five fingers spread out.',
    image: 'https://media.tenor.com/placeholder-5.gif',
  },
  {
    letter: '6',
    title: 'Number 6',
    description: 'Thumb and pinky touching, other three up.',
    image: 'https://media.tenor.com/placeholder-6.gif',
  },
  {
    letter: '7',
    title: 'Number 7',
    description: 'Thumb and ring finger touching, others up.',
    image: 'https://media.tenor.com/placeholder-7.gif',
  },
  {
    letter: '8',
    title: 'Number 8',
    description: 'Thumb and middle finger touching, others up.',
    image: 'https://media.tenor.com/placeholder-8.gif',
  },
  {
    letter: '9',
    title: 'Number 9',
    description: 'Thumb and index finger touching, others up.',
    image: 'https://media.tenor.com/placeholder-9.gif',
  },
];

// Everyday consonants (split into everyday and rare as requested)
const EVERYDAY_CONSONANT_STEPS = [
  {
    letter: 'B',
    title: 'Letter B',
    description: 'Form the sign for B',
    image: '',
  },
  {
    letter: 'C',
    title: 'Letter C',
    description: 'Form the sign for C',
    image: '',
  },
  {
    letter: 'D',
    title: 'Letter D',
    description: 'Form the sign for D',
    image: '',
  },
  {
    letter: 'F',
    title: 'Letter F',
    description: 'Form the sign for F',
    image: '',
  },
  {
    letter: 'G',
    title: 'Letter G',
    description: 'Form the sign for G',
    image: '',
  },
  {
    letter: 'H',
    title: 'Letter H',
    description: 'Form the sign for H',
    image: '',
  },
  {
    letter: 'J',
    title: 'Letter J',
    description: 'Form the sign for J',
    image: '',
  },
  {
    letter: 'K',
    title: 'Letter K',
    description: 'Form the sign for K',
    image: '',
  },
  {
    letter: 'L',
    title: 'Letter L',
    description: 'Form the sign for L',
    image: '',
  },
  {
    letter: 'M',
    title: 'Letter M',
    description: 'Form the sign for M',
    image: '',
  },
  {
    letter: 'N',
    title: 'Letter N',
    description: 'Form the sign for N',
    image: '',
  },
  {
    letter: 'P',
    title: 'Letter P',
    description: 'Form the sign for P',
    image: '',
  },
  {
    letter: 'R',
    title: 'Letter R',
    description: 'Form the sign for R',
    image: '',
  },
  {
    letter: 'S',
    title: 'Letter S',
    description: 'Form the sign for S',
    image: '',
  },
  {
    letter: 'T',
    title: 'Letter T',
    description: 'Form the sign for T',
    image: '',
  },
  {
    letter: 'Y',
    title: 'Letter Y',
    description: 'Form the sign for Y',
    image: '',
  },
  {
    letter: 'W',
    title: 'Letter W',
    description: 'Form the sign for W',
    image: '',
  },
];

// Rare consonants
const RARE_CONSONANT_STEPS = [
  {
    letter: 'Q',
    title: 'Letter Q',
    description: 'Form the sign for Q',
    image: '',
  },
  {
    letter: 'V',
    title: 'Letter V',
    description: 'Form the sign for V',
    image: '',
  },
  {
    letter: 'X',
    title: 'Letter X',
    description: 'Form the sign for X',
    image: '',
  },
  {
    letter: 'Z',
    title: 'Letter Z',
    description: 'Form the sign for Z',
    image: '',
  },
];

// Daily Activities multi-step playback (includes College and Work as requested)
const DAILY_STEPS = [
  {
    letter: 'College',
    title: 'College',
    description: 'Sign for College',
    image: '',
  },
  { letter: 'Work', title: 'Work', description: 'Sign for Work', image: '' },
  { letter: 'Write', title: 'Write', description: 'Sign for Write', image: '' },
  { letter: 'Call', title: 'Call', description: 'Sign for Call', image: '' },
  { letter: 'Pray', title: 'Pray', description: 'Sign for Pray', image: '' },
  { letter: 'Stand', title: 'Stand', description: 'Sign for Stand', image: '' },
  { letter: 'Watch', title: 'Watch', description: 'Sign for Watch', image: '' },
  { letter: 'Hang', title: 'Hang', description: 'Sign for Hang', image: '' },
  {
    letter: 'Become',
    title: 'Become',
    description: 'Sign for Become',
    image: '',
  },
  {
    letter: 'Assistance',
    title: 'Assistance',
    description: 'Sign for Assistance',
    image: '',
  },
  { letter: 'Camp', title: 'Camp', description: 'Sign for Camp', image: '' },
];

export function LessonPage({
  lessonId,
  lessonTitle,
  targetSign,
  onBack,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: LessonPageProps) {
  // --- States ---
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [prediction, setPrediction] = useState({
    label: 'Waiting...',
    confidence: '0%',
  });
  const [peakScore, setPeakScore] = useState(0); // Persistent High Score
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when lesson changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [lessonId]);

  // --- Refs ---
  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<Socket | null>(null);

  // Check if this is a multi-step lesson (Vowels / Consonants / Daily Activities)
  const isVowelsLesson = lessonId === 11;
  const isEverydayConsonants = lessonId === 12;
  const isRareConsonants = lessonId === 14;
  const isDailyActivitiesLesson = lessonId >= 50 && lessonId <= 60;
  const isMultiStepLesson =
    isVowelsLesson ||
    isEverydayConsonants ||
    isRareConsonants ||
    isDailyActivitiesLesson;

  // Get the appropriate steps array
  const steps = isVowelsLesson
    ? VOWEL_STEPS
    : isEverydayConsonants
      ? EVERYDAY_CONSONANT_STEPS
      : isRareConsonants
        ? RARE_CONSONANT_STEPS
        : isDailyActivitiesLesson
          ? DAILY_STEPS
          : [];
  const currentStep = isMultiStepLesson ? steps[currentStepIndex] : null;

  const handleNext = () => {
    if (isMultiStepLesson && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (isMultiStepLesson) {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      }
      // Do NOT call onPrevious() when inside a multi-step lesson — user asked reverse only move one sign.
    } else {
      onPrevious();
    }
  };

  // Determine effective display values
  const displayTitle = currentStep ? currentStep.title : lessonTitle;
  const displayDescription = currentStep
    ? currentStep.description
    : 'Match the sign above. Watch your confidence bar grow!';

  // Dynamically load sign images from src/assets/signs using Vite's glob. Naming: <SIGNNAME>.jpg
  // We normalize file names and the provided sign name so matching is case-insensitive and ignores spaces/punctuation.
  const signImageModules = import.meta.glob(
    '../assets/signs/*.{jpg,jpeg,png}',
    { eager: true },
  ) as Record<string, { default: string }>;

  const normalize = (s: string) =>
    s
      ?.toString()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');

  const getSignImageUrl = (name?: string) => {
    if (!name) return null;

    // Build matching candidates: full normalized name, trailing digit(s), and trailing single char (for letters)
    const target = normalize(name);
    const candidates = new Set<string>();
    candidates.add(target);

    // Trailing digits (e.g., 'number1' -> '1')
    const trailingDigitsMatch = target.match(/([0-9]+)$/);
    if (trailingDigitsMatch) candidates.add(trailingDigitsMatch[1]);

    // Trailing single char (e.g., 'lettera' -> 'a')
    const trailingCharMatch = target.match(/([a-z0-9])$/);
    if (trailingCharMatch) candidates.add(trailingCharMatch[1]);

    for (const p in signImageModules) {
      const file = p.split('/').pop() || '';
      const base = file.split('.').slice(0, -1).join('.');
      const normBase = normalize(base);

      // Exact match to any candidate
      for (const cand of candidates) {
        if (normBase === cand) return signImageModules[p].default;
      }
    }

    return null;
  };

  const referenceImageUrl = currentStep
    ? currentStep.image
    : getSignImageUrl(targetSign);

  // Determine if there is a local sign asset for the effective sign name (works for multi-step letters like 'A')
  const effectiveSignName = isMultiStepLesson
    ? currentStep?.letter
    : targetSign;
  const signAssetUrl = getSignImageUrl(effectiveSignName);

  // Local storage key for per-sign peak scores
  const PEAK_STORAGE_KEY = 'bw_peak_scores_v1';

  const loadPeakScores = () => {
    try {
      const raw = localStorage.getItem(PEAK_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch (e) {
      console.error('Failed to load peak scores from localStorage', e);
      return {};
    }
  };

  const savePeakScores = (scores: Record<string, number>) => {
    try {
      localStorage.setItem(PEAK_STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.error('Failed to save peak scores to localStorage', e);
    }
  };

  const normalizedEffectiveName = (name?: string) =>
    name ? normalize(name) : null;

  // Load peak for the current sign when it changes, and reset transient success state
  useEffect(() => {
    const key = normalizedEffectiveName(effectiveSignName);
    setIsSuccess(false);
    if (key) {
      const scores = loadPeakScores();
      setPeakScore(scores[key] ?? 0);
    } else {
      setPeakScore(0);
    }
  }, [effectiveSignName]);

  // For multi-step lessons we use the step image in the demo area; for single sign lessons we show the image from assets if available, otherwise fall back to the waving emoji.
  const displayImage = currentStep ? (
    <img
      src={currentStep.image}
      alt={currentStep.title}
      className='w-full h-full object-contain'
    />
  ) : referenceImageUrl ? (
    <img
      src={referenceImageUrl}
      alt={targetSign}
      className='w-full h-full object-contain'
    />
  ) : (
    <span className='text-7xl md:text-9xl animate-pulse'>👋</span>
  );

  // If a local asset exists for the effective sign (including letters like 'A'), we'll render it below the demo guide as a reference image.
  const shouldShowReferenceAsset = Boolean(signAssetUrl);

  // Socket.io Connection Logic
  // 1. Socket Logic with Score Tracking
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    socketRef.current.on(
      'prediction_result',
      (data: { label: string; confidence: string }) => {
        setPrediction(data);
        const currentConf = parseFloat(data.confidence);

        // Determine the target we are looking for
        // If it's a multi-step lesson (Vowels or Numbers), we want the current step's letter, otherwise the lesson's targetSign
        const effectiveTarget = isMultiStepLesson
          ? currentStep?.letter
          : targetSign;

        // Update Real-time Success State
        // We check if the predicted label matches our effective target
        if (data.label === effectiveTarget) {
          const success = currentConf > 90;
          setIsSuccess(success);

          // Track Highest Score during the recording window and persist per-sign
          if (isRecording) {
            const key = normalizedEffectiveName(effectiveTarget);
            if (key) {
              setPeakScore(prev => {
                const newPeak = Math.max(prev, currentConf);
                const scores = loadPeakScores();
                scores[key] = newPeak;
                savePeakScores(scores);
                return newPeak;
              });
            } else {
              setPeakScore(prev => Math.max(prev, currentConf));
            }
          }
        } else {
          setIsSuccess(false);
        }
      },
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isRecording, targetSign, isMultiStepLesson, currentStep]);

  // 2. Control Logic
  const startTestingSession = () => {
    setIsCameraOn(true);
    setIsRecording(true);
    setCountdown(5);
  };

  const resetScore = () => {
    const key = normalizedEffectiveName(effectiveSignName);
    if (key) {
      const scores = loadPeakScores();
      delete scores[key];
      savePeakScores(scores);
    }
    setPeakScore(0);
    setPrediction({ label: 'Waiting...', confidence: '0%' });
  };

  // 3. Countdown Timer Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isRecording) {
      setIsRecording(false);
      setIsCameraOn(false); // Automatically turn off camera
    }
    return () => clearInterval(timer);
  }, [isRecording, countdown]);

  // 4. Frame Streaming Logic
  const captureAndSend = useCallback(() => {
    if (isCameraOn && socketRef.current?.connected && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socketRef.current.emit('image_frame', imageSrc);
      }
    }
  }, [isCameraOn]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isCameraOn && isConnected) {
      interval = setInterval(captureAndSend, 200);
    }
    return () => clearInterval(interval);
  }, [isCameraOn, isConnected, captureAndSend]);

  return (
    <div className='h-full flex flex-col bg-background font-mono select-none'>
      {/* Header */}
      <div className='bg-card/80 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-4 z-20'>
        <div className='flex items-center gap-4 max-w-7xl mx-auto'>
          <button
            onClick={onBack}
            className='p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div className='flex-1'>
            <h1 className='text-xl md:text-2xl text-foreground font-bold font-pixel pixel-text-shadow'>
              {displayTitle}
            </h1>
            <p className='text-sm text-muted-foreground'>
              BrainWave 2.0 • SignVision 🐒
            </p>
          </div>

          {/* Server Connection Status */}
          <div
            className={`flex items-center gap-2 px-3 md:px-4 py-2 border rounded-full transition-colors ${
              isConnected
                ? 'bg-accent/20 border-accent/50'
                : 'bg-destructive/20 border-destructive/50'
            }`}
          >
            {isConnected ? (
              <Wifi className='w-4 h-4 md:w-5 md:h-5 text-accent' />
            ) : (
              <WifiOff className='w-4 h-4 md:w-5 md:h-5 text-destructive' />
            )}
            <span className='text-xs text-foreground font-bold hidden md:inline'>
              {isConnected ? 'ENGINE ONLINE' : 'ENGINE OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 md:p-8 pb-32'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column: Reference & Results */}
          <div className='flex flex-col gap-6'>
            <div className='bg-white/5 rounded-3xl border border-white/10 p-4'>
              <h2 className='text-lg font-bold flex items-center gap-2 mb-4 font-pixel text-secondary'>
                <Video className='w-5 h-5' /> {displayTitle}
              </h2>
              <div className='aspect-video bg-black/40 border-2 border-white/5 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center shadow-inner'>
                {signAssetUrl ? (
                  <img
                    src={signAssetUrl as string}
                    alt={`${displayTitle} reference`}
                    className='w-full h-full object-contain'
                  />
                ) : currentStep ? (
                  <img
                    src={currentStep.image}
                    alt={currentStep.title}
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <span className='text-7xl md:text-9xl animate-pulse'>👋</span>
                )}
              </div>

              {/* Sign Description */}
              <div className='bg-white/5 rounded-xl border border-white/10 p-4 mb-4'>
                <h3 className='text-sm font-bold text-primary mb-2 flex items-center gap-2'>
                  <span>📝</span> Sign Description
                </h3>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  {displayDescription ||
                    'Practice this sign by following the demo guide above. Watch carefully and mimic the hand movements shown.'}
                </p>
                <div className='mt-3 pt-3 border-t border-white/10'>
                  <p className='text-xs text-gray-400'>
                    <span className='font-bold text-primary'>Target:</span>{' '}
                    {displayTitle}
                  </p>
                </div>
              </div>

              {/* HIGH SCORE DISPLAY */}
              <div className='bg-white/5 rounded-3xl border border-white/10 p-6 flex items-center justify-between overflow-hidden relative'>
                <div className='z-10'>
                  <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                    <Trophy className='w-4 h-4 text-yellow-500' />
                    <span className='text-xs font-bold uppercase tracking-widest'>
                      Highest Score
                    </span>
                  </div>
                  <h2 className='text-6xl font-black font-mono tracking-tighter'>
                    {peakScore.toFixed(1)}
                    <span className='text-2xl text-muted-foreground'>%</span>
                  </h2>
                </div>
                <button
                  onClick={resetScore}
                  className='p-3 hover:bg-white/10 rounded-full transition-colors z-10'
                  title='Reset High Score'
                >
                  <RotateCcw className='w-6 h-6 text-muted-foreground' />
                </button>
                {peakScore > 90 && (
                  <Sparkles className='absolute right-10 top-5 w-20 h-20 text-yellow-500/20 animate-pulse' />
                )}
              </div>
            </div>
          </div>

          {/* Practice Column with react-webcam */}
          <div
            className={`bg-white/5 backdrop-blur-md rounded-3xl border p-2 shadow-xl transition-all duration-500 ${
              isSuccess
                ? 'border-accent shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'border-white/10'
            }`}
          >
            {/* Right Column: Active Testing */}
            <div
              className={`bg-white/5 rounded-3xl border p-2 transition-all duration-500 ${isRecording ? 'border-primary ring-4 ring-primary/10' : 'border-white/10'}`}
            >
              <div className='bg-black/20 rounded-2xl p-4 h-full flex flex-col'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold flex items-center gap-2 font-pixel'>
                    <Camera className='w-6 h-6 text-primary' />
                    {isRecording
                      ? `Testing... ${countdown}s`
                      : 'Sign Recognition'}
                  </h2>
                  <button
                    onClick={startTestingSession}
                    disabled={isRecording || !isConnected}
                    className={`px-8 py-3 rounded-full font-bold transition-all border flex items-center gap-2 ${isRecording ? 'bg-red-500 text-white' : 'bg-primary text-black hover:scale-105'}`}
                  >
                    {isRecording ? (
                      <>
                        <Timer className='w-4 h-4 animate-spin' /> {countdown}s
                      </>
                    ) : (
                      'START 5S TEST'
                    )}
                  </button>
                </div>

                <div className='aspect-video bg-black/60 rounded-xl mb-4 relative overflow-hidden shadow-2xl'>
                  {isCameraOn ? (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat='image/jpeg'
                        forceScreenshotSourceSize // Added: ensures the frame matches the video size
                        onUserMedia={() =>
                          console.log('🎥 Camera Hardware Linked Successfully')
                        }
                        onUserMediaError={err =>
                          console.error('❌ Camera Hardware Error:', err)
                        }
                        videoConstraints={{
                          width: 640,
                          height: 480,
                          facingMode: 'user',
                        }}
                        className='w-full h-full object-cover transform scale-x-[-1]'
                      />
                      <div className='absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3'>
                        <Brain
                          className={`w-5 h-5 ${isSuccess ? 'text-accent' : 'text-primary'}`}
                        />
                        <span className='font-bold text-white text-lg'>
                          {prediction.label}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 bg-zinc-900/50'>
                      <Camera className='w-20 h-20 mb-4 opacity-10' />
                      <p className='font-pixel text-sm uppercase tracking-widest'>
                        Awaiting Calibration
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Feedback */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isSuccess
                      ? 'bg-accent/20 border-accent/50'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <h3
                      className={`text-xs font-bold uppercase ${
                        isSuccess ? 'text-accent' : 'text-secondary'
                      }`}
                    >
                      {isSuccess ? '✨ SIGN VERIFIED' : '🦉 LANDMARK STRENGTH'}
                    </h3>
                    {isSuccess && (
                      <Sparkles className='w-5 h-5 text-accent animate-bounce' />
                    )}
                    {/* Live Confidence Bar */}
                    <div className='mt-auto p-4 bg-black/40 rounded-xl border border-white/5'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-[10px] font-bold text-muted-foreground uppercase'>
                          Real-time Confidence
                        </span>
                        <span className='text-sm font-black text-accent'>
                          {prediction.confidence}
                        </span>
                      </div>
                      <div className='w-full bg-white/5 h-3 rounded-full overflow-hidden'>
                        <div
                          className={`h-full transition-all duration-200 ${isSuccess ? 'bg-accent shadow-[0_0_10px_#3b82f6]' : 'bg-primary'}`}
                          style={{ width: prediction.confidence }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer Nav */}
            <div className='bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6 max-w-2xl mx-auto flex items-center justify-center gap-6 md:gap-10 shadow-2xl mt-6'>
              <button
                onClick={handlePrevious}
                disabled={
                  !hasPrevious && (!isMultiStepLesson || currentStepIndex === 0)
                }
                className='p-3 md:p-4 bg-green-600 hover:bg-green-500 text-white rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg'
              >
                <SkipBack className='w-5 h-5 md:w-6 md:h-6' />
              </button>
              <div className='w-16 h-16 md:w-24 md:h-24 bg-primary hover:bg-primary/90 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer'>
                <Play className='w-8 h-8 md:w-12 md:h-12 fill-black text-black ml-1' />
              </div>
              <button
                onClick={handleNext}
                disabled={
                  !hasNext &&
                  (!isMultiStepLesson || currentStepIndex === steps.length - 1)
                }
                className='p-3 md:p-4 bg-accent hover:bg-accent/80 text-white rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg'
              >
                <SkipForward className='w-5 h-5 md:w-6 md:h-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
