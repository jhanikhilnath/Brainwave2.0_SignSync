import cv2
import mediapipe as mp
import numpy as np
import os
import csv

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.1
)


def extract_relative_landmarks(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    data_row = []
    if results.multi_hand_landmarks:

        sorted_hands = sorted(results.multi_hand_landmarks,
                              key=lambda h: h.landmark[0].x)

        for hand_landmarks in sorted_hands[:2]:
            wrist = hand_landmarks.landmark[0]

            for lm in hand_landmarks.landmark:
                data_row.extend([
                    lm.x - wrist.x,
                    lm.y - wrist.y,
                    lm.z - wrist.z
                ])

    while len(data_row) < 126:
        data_row.append(0.0)

    return data_row


DATA_DIR = './Dataset'
OUTPUT_CSV = 'brainwave_processed_data.csv'
classes = sorted([d for d in os.listdir(DATA_DIR)
                 if os.path.isdir(os.path.join(DATA_DIR, d))])

print(classes)

with open(OUTPUT_CSV, mode='w', newline='') as f:
    writer = csv.writer(f)
    counter = 0

    for label in classes:
        class_path = os.path.join(DATA_DIR, label)
        images = os.listdir(class_path)
        total = len(images)
        detected = 0
        counter += 1

        print(
            f"\n>> Processing Class: {label} | Class Number {counter}/{len(classes)}")

        for idx, img_name in enumerate(images):
            res = extract_relative_landmarks(
                os.path.join(class_path, img_name))

            if res and any(val != 0.0 for val in res):
                writer.writerow(res + [label])
                detected += 1

            if (idx + 1) % 50 == 0 or (idx + 1) == total:
                print(f"   Progress: {idx + 1}/{total} | Detected: {detected}")

print(f"\nRelative data saved to {OUTPUT_CSV}")
