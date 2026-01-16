import pandas as pd
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import layers, models, callbacks
import pickle
import os


DATA_DIR = './Dataset'

CSV_FILE = 'brainwave_v4_newdata_relative.csv'
print(f"Loading dataset: {CSV_FILE}")

df = pd.read_csv(CSV_FILE, header=None, low_memory=False)

X = df.iloc[:, :-1].apply(pd.to_numeric, errors='coerce').fillna(0).values

y = df.iloc[:, -1].astype(str).values

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
class_names = label_encoder.classes_
num_classes = len(class_names)

print(f"Found {num_classes} classes: {class_names}")

with open('label_encoder_new.pkl', 'wb') as f:
    pickle.dump(label_encoder, f)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42)

model = models.Sequential([
    layers.Input(shape=(126,)),

    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.3),

    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),

    layers.Dense(64, activation='relu'),

    layers.Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

early_stop = callbacks.EarlyStopping(
    monitor='val_loss', patience=10, restore_best_weights=True)

print(f"🚀 Training started on {len(X_train)} samples...")
print("Classes identified by the AI:", label_encoder.classes_)
history = model.fit(
    X_train, y_train,
    epochs=300,
    batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=[early_stop],
    verbose=1
)

print("\n--- Performance Validation ---")

y_pred_probs = model.predict(X_test)
y_pred = np.argmax(y_pred_probs, axis=1)

actual_labels_in_model = label_encoder.classes_

indices = np.arange(len(actual_labels_in_model))

print(f"Model was trained on {len(actual_labels_in_model)} classes.")
print(f"Attempting to report on these specific classes.")


print("\nDetailed Classification Report:")
print(classification_report(
    y_test,
    y_pred,
    labels=indices,
    target_names=[str(cls) for cls in actual_labels_in_model],
    zero_division=0
))

plt.figure(figsize=(25, 20))
cm = confusion_matrix(y_test, y_pred, labels=indices)
sns.heatmap(cm, annot=False, cmap='Greens',
            xticklabels=actual_labels_in_model,
            yticklabels=actual_labels_in_model)

plt.title('BrainWave v2 - 107 Class Matrix (Aligned)')
plt.show()

model.save('signvision_model_v3.h5')
print("\n Model saved as 'signvision_model_v3.h5'")
