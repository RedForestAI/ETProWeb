import time
import tobii_research as tr

import logging

logger = logging.getLogger("tobii_pro_server")

def gaze_data_callback(gaze_data):
    # print(gaze_data)
    # Print gaze points of left and right eye
    print("Left eye: ({gaze_left_eye}) \t Right eye: ({gaze_right_eye})".format(
        gaze_left_eye=gaze_data['left_gaze_point_on_display_area'],
        gaze_right_eye=gaze_data['right_gaze_point_on_display_area']))

eye_trackers = tr.find_all_eyetrackers()
print(eye_trackers)

if len(eye_trackers) == 0:
    logger.error("Eyetracker not found")
    exit()

eye_tracker = eye_trackers[0]
eye_tracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True)
print("Subscribed")

time.sleep(5)

eye_tracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, gaze_data_callback)
print("Unsubscribed")
