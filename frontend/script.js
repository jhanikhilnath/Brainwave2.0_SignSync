const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const signLabel = document.getElementById('detected-sign');
const accFill = document.getElementById('accuracy-fill');

let model;
let sequence = [];
// IMPORTANT: This must match the alphabetical order of your MODEL_SIGNS folders
const ACTIONS = ['1. loud', '2. hello', '3. thanks'];

async function loadModel() {
  model = await tf.loadLayersModel('isl_model_nik/model.json', {
    strict: false,
  });
  console.log('BrainWave DNN Loaded!');
}

function extractKeypoints(results) {
  // Mirroring your Python logic: [33 pose, 21 LH, 21 RH] * 3 coords
  let pose = results.poseLandmarks
    ? results.poseLandmarks.map(res => [res.x, res.y, res.z]).flat()
    : new Array(33 * 3).fill(0);
  let lh = results.leftHandLandmarks
    ? results.leftHandLandmarks.map(res => [res.x, res.y, res.z]).flat()
    : new Array(21 * 3).fill(0);
  let rh = results.rightHandLandmarks
    ? results.rightHandLandmarks.map(res => [res.x, res.y, res.z]).flat()
    : new Array(21 * 3).fill(0);

  // Normalization (relative to Nose - index 0 of pose)
  let refX = pose[0] || 0,
    refY = pose[1] || 0,
    refZ = pose[2] || 0;

  for (let i = 0; i < pose.length; i += 3) {
    pose[i] -= refX;
    pose[i + 1] -= refY;
    pose[i + 2] -= refZ;
  }
  for (let i = 0; i < lh.length; i += 3) {
    lh[i] -= refX;
    lh[i + 1] -= refY;
    lh[i + 2] -= refZ;
  }
  for (let i = 0; i < rh.length; i += 3) {
    rh[i] -= refX;
    rh[i + 1] -= refY;
    rh[i + 2] -= refZ;
  }

  return [...pose, ...lh, ...rh];
}

async function onResults(results) {
  const keypoints = extractKeypoints(results);
  sequence.push(keypoints);

  // Maintain a sliding window of the last 30 frames
  if (sequence.length > 30) sequence.shift();

  if (sequence.length === 30 && model) {
    // Expand dimensions to [batch, timesteps, features] -> [1, 30, 225]
    const inputTensor = tf.tensor3d([sequence]);
    const prediction = model.predict(inputTensor);
    const scores = await prediction.data();

    const maxIdx = scores.indexOf(Math.max(...scores));
    const confidence = scores[maxIdx];
    console.log(confidence, ACTIONS[maxIdx]);

    // Only log to console if the model is > 80% sure
    if (confidence > 0.8) {
      console.log(
        `Detected Sign: %c${ACTIONS[maxIdx]}`,
        'color: #00ff00; font-weight: bold;',
        `(${Math.round(confidence * 100)}%)`,
      );
    }

    // Clean up memory
    inputTensor.dispose();
    prediction.dispose();
  }
  // Draw landmarks for the "Cool Tech" feel
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: '#00FF00',
    lineWidth: 2,
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: '#FF0000',
    lineWidth: 1,
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: '#0000FF',
    lineWidth: 1,
  });
  canvasCtx.restore();
}

const holistic = new Holistic({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
});

holistic.setOptions({
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});

loadModel().then(() => camera.start());
