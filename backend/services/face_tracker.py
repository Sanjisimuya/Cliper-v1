import os
import cv2
import numpy as np
from typing import List, Dict, Any, Tuple
from config import settings

class FaceTrackerService:
    def __init__(self):
        # Initialize OpenCV Haar Cascade Face Detector as universally supported fallback
        self.cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        self.face_cascade = cv2.CascadeClassifier(self.cascade_path)

    def track_faces_and_generate_crop_trajectory(
        self,
        video_path: str,
        start_time: float,
        end_time: float,
        target_aspect_ratio: float = 9 / 16,
        sample_fps: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Samples video frames between start_time and end_time, detects speaker faces,
        and computes a smoothed 9:16 crop window pan trajectory.
        """
        trajectory: List[Dict[str, Any]] = []
        if not os.path.exists(video_path):
            return self._generate_default_trajectory(start_time, end_time)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return self._generate_default_trajectory(start_time, end_time)

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 1920)
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 1080)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 1)

        # 9:16 target crop width inside horizontal 16:9
        # e.g. for 1080 height, crop_width = 1080 * 9 / 16 = 608
        crop_h = frame_height
        crop_w = int(crop_h * target_aspect_ratio)
        if crop_w > frame_width:
            crop_w = frame_width
            crop_h = int(crop_w / target_aspect_ratio)

        frame_interval = max(1, int(fps / sample_fps))
        start_frame = int(start_time * fps)
        end_frame = min(total_frames, int(end_time * fps))

        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        current_frame = start_frame

        raw_x_centers: List[Tuple[float, float]] = [] # (time, center_x)
        default_center_x = frame_width / 2.0

        while current_frame <= end_frame:
            ret, frame = cap.read()
            if not ret:
                break

            if (current_frame - start_frame) % frame_interval == 0:
                t = round(current_frame / fps, 2)
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = self.face_cascade.detectMultiScale(
                    gray, scaleFactor=1.15, minNeighbors=4, minSize=(60, 60)
                )

                if len(faces) > 0:
                    # Select largest face (most likely the primary speaker)
                    largest_face = max(faces, key=lambda b: b[2] * b[3])
                    fx, fy, fw, fh = largest_face
                    detected_center_x = fx + (fw / 2.0)
                    raw_x_centers.append((t, detected_center_x))
                else:
                    # Keep previous or center
                    prev_x = raw_x_centers[-1][1] if raw_x_centers else default_center_x
                    raw_x_centers.append((t, prev_x))

            current_frame += 1

        cap.release()

        if not raw_x_centers:
            return self._generate_default_trajectory(start_time, end_time)

        # Apply exponential moving average smoothing to prevent camera jitter
        smoothed_centers: List[float] = []
        alpha = 0.25  # smoothing factor (0 = static, 1 = raw instantaneous)
        current_smoothed = raw_x_centers[0][1]

        for _, raw_x in raw_x_centers:
            current_smoothed = alpha * raw_x + (1 - alpha) * current_smoothed
            smoothed_centers.append(current_smoothed)

        # Convert to crop bounding boxes
        for i, (t, _) in enumerate(raw_x_centers):
            cx = smoothed_centers[i]
            # Center crop_w around cx and clamp within [0, frame_width - crop_w]
            crop_x = int(cx - (crop_w / 2.0))
            crop_x = max(0, min(crop_x, frame_width - crop_w))
            crop_y = int((frame_height - crop_h) / 2.0)

            trajectory.append({
                "timestamp": t,
                "crop_x": crop_x,
                "crop_y": crop_y,
                "crop_w": crop_w,
                "crop_h": crop_h,
                "speaker_center_x": round(cx, 1)
            })

        return trajectory

    def _generate_default_trajectory(self, start_time: float, end_time: float) -> List[Dict[str, Any]]:
        """Fallback trajectory for center-crop with slight dynamic camera drift."""
        trajectory = []
        duration = max(1.0, end_time - start_time)
        steps = int(duration * 2)
        frame_width = 1920
        frame_height = 1080
        crop_w = 608
        crop_h = 1080
        center_x = (frame_width - crop_w) // 2

        for step in range(steps + 1):
            t = round(start_time + (step * 0.5), 2)
            # subtle organic drift to feel alive
            drift = int(np.sin(step * 0.4) * 20)
            trajectory.append({
                "timestamp": t,
                "crop_x": center_x + drift,
                "crop_y": 0,
                "crop_w": crop_w,
                "crop_h": crop_h,
                "speaker_center_x": float(center_x + drift + (crop_w // 2))
            })
        return trajectory

face_tracker_service = FaceTrackerService()
