import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import pickle
import os

model = tf.keras.models.load_model('signvision_model.h5')

with open('label_encoder_new.pkl', 'rb') as f:
    label_encoder = pickle.load(f)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7)

cap = cv2.VideoCapture(0)

prediction_history = []

print("SignSync Model is LIVE. Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    data_row = []
    if results.multi_hand_landmarks:

        sorted_hands = sorted(results.multi_hand_landmarks,
                              key=lambda h: h.landmark[0].x)

        for hand_landmarks in sorted_hands[:2]:
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            wrist = hand_landmarks.landmark[0]
            for lm in hand_landmarks.landmark:
                data_row.extend([
                    lm.x - wrist.x,
                    lm.y - wrist.y,
                    lm.z - wrist.z
                ])

    while len(data_row) < 126:
        data_row.append(0.0)

    if any(val != 0.0 for val in data_row):
        prediction = model.predict(np.array([data_row]), verbose=0)
        idx = np.argmax(prediction)
        confidence = prediction[0][idx]
        current_label = label_encoder.inverse_transform([idx])[0]

        prediction_history.append(current_label)
        if len(prediction_history) > 5:
            prediction_history.pop(0)

        stable_label = max(set(prediction_history),
                           key=prediction_history.count)

        prob_percent = f"{confidence * 100:.1f}%"
        bg_color = (0, 180, 0) if confidence > 0.85 else (0, 100, 255)

        cv2.rectangle(frame, (0, 0), (450, 80), bg_color, -1)
        cv2.putText(frame, f"{stable_label} ({prob_percent})", (20, 55),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.4, (255, 255, 255), 3)

    cv2.imshow('BrainWave2.0 - Relative Tracking', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
