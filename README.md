# SignSync: AI-Powered Indian Sign Language (ISL) Learning Platform

**SignSync** is a gamified, real-time AI platform designed to bridge the communication gap between the Deaf and hearing communities. By using computer vision and deep learning, it provides an engaging way to learn and practice Indian Sign Language with instant feedback.

---

## 🚀 Key Features

- **Real-time Recognition:** Live camera frame streaming with sub-second feedback.
- **Gamified Experience:** Interactive interface featuring levels, streaks, leaderboards, and rewards.
- **Privacy-Centric AI:** Processes 3D hand landmarks instead of storing raw video pixels.
- **High Robustness:** Trained on a massive composite dataset of **2.24 Lakh (224,000) images**.

---

## 🛠️ Tech Stack

### Frontend

- **React (TypeScript):** Robust UI development.
- **Vite:** High-performance bundling for a smooth user experience.
- **Socket.io-client:** Bi-directional WebSockets for low-latency data streaming.

### Backend & AI Pipeline

- **Flask:** Lightweight Python server to handle inference requests.
- **MediaPipe:** Real-time 3D hand landmark extraction (x, y, z coordinates).
- **MLP (Multi-Layer Perceptron):** Neural Network optimized for geometric coordinate classification.

---

## 🏗️ Architecture & Workflow

The system is designed for high efficiency, processing data in a specialized pipeline:

1.  **Data Capture:** Frontend captures video frames at **5 FPS**.
2.  **Streaming:** Frames are sent via **Socket.io** to the Flask backend.
3.  **Feature Extraction:** MediaPipe identifies hand landmarks and extracts **normalized 3D coordinates**.
4.  **Classification:** The **MLP Model** classifies the coordinates into one of the 108 signs.
5.  **Gamification Logic:** Feedback is sent back to the frontend to update the user's progress, streaks, and scores.

---

## 📊 Dataset Specifications

| Attribute          | Details                        |
| :----------------- | :----------------------------- |
| **Total Images**   | 224,000 (2.24 Lakh)            |
| **Distinct Signs** | 108                            |
| **Feature Type**   | Normalized Geometric Landmarks |
| **Core Model**     | Multi-Layer Perceptron (MLP)   |
