from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask import Flask
import os
import pickle
import tensorflow as tf
import mediapipe as mp
import numpy as np
import base64
import cv2
import eventlet
eventlet.monkey_patch()  # Must be at the very top for real-time performance


# 1. Initialization
app = Flask(__name__)
# Enable CORS for standard HTTP requests
CORS(app, resources={r"/*": {"origins": "*"}})
# Enable CORS for WebSockets - Crucial for React communication
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Suppress TensorFlow GPU/CPU logging noise
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# 2. Load AI Assets
MODEL_PATH = 'signvision_model_v3.h5'
LABEL_PATH = 'label_encoder_new.pkl'

if os.path.exists(MODEL_PATH) and os.path.exists(LABEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(LABEL_PATH, 'rb') as f:
        label_encoder = pickle.load(f)
    print("✅ BrainWave AI Engine Loaded.")
else:
    print("❌ Error: Assets not found in the project directory!")

# 3. MediaPipe Setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)


def extract_features(image):
    """Converts raw image into 126 wrist-relative coordinates."""
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)
    data_row = []

    if results.multi_hand_landmarks:
        # Sort hands by X coordinate to ensure consistency
        sorted_hands = sorted(results.multi_hand_landmarks,
                              key=lambda h: h.landmark[0].x)

        for hand_landmarks in sorted_hands[:2]:
            wrist = hand_landmarks.landmark[0]
            for lm in hand_landmarks.landmark:
                # Relative Math: Subtracting wrist coordinates from every point
                data_row.extend([
                    lm.x - wrist.x,
                    lm.y - wrist.y,
                    lm.z - wrist.z
                ])

    # Feature Padding: Always return 126 values to satisfy the model input shape
    while len(data_row) < 126:
        data_row.append(0.0)

    return data_row

# 4. Socket.io Event Handling


@socketio.on('image_frame')
def handle_frame(data):
    print(f"📸 Received frame! Data length: {len(data) if data else 0}")
    try:
        # Validate data integrity
        if not data or ',' not in data:
            return

        # Decode Base64 image from React canvas
        img_b64 = data.split(',')[1]
        img_bytes = base64.b64decode(img_b64)

        if len(img_bytes) == 0:
            return

        img_arr = np.frombuffer(img_bytes, dtype=np.uint8)
        frame = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)

        if frame is None or frame.size == 0:
            return

        # Feature Extraction
        features = extract_features(frame)

        # Predictive Logic
        if any(val != 0.0 for val in features):
            input_data = np.array([features])
            prediction = model.predict(input_data, verbose=0)

            idx = np.argmax(prediction)
            confidence = float(prediction[0][idx])
            label = label_encoder.inverse_transform([idx])[0]

            # Return results to React client
            emit('prediction_result', {
                'label': str(label),
                'confidence': f"{confidence * 100:.1f}%"
            })
        else:
            # If no hands are in view
            emit('prediction_result', {
                'label': "No Hand Detected",
                'confidence': "0%"
            })

    except Exception as e:
        # Log error but keep the server running
        print(f"⚠️ Frame Skip: {e}")


@socketio.on('connect')
def handle_connect():
    print('🔌 React App Connected to SignVision Engine')


@socketio.on('disconnect')
def handle_disconnect():
    print('❌ Client Disconnected')


# 5. Entry Point
if __name__ == '__main__':
    print("🚀 BrainWave 2.0 Backend is LIVE on http://localhost:5000")
    # Using 0.0.0.0 allows other devices on your local network to connect
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
