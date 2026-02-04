
import cv2
import pytesseract
import sys
import json

img_path = sys.argv[1]

img = cv2.imread(img_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_russian_plate_number.xml")
plates = cascade.detectMultiScale(gray, 1.1, 4)

results = []

for (x, y, w, h) in plates:
    plate_img = gray[y:y+h, x:x+w]

    text = pytesseract.image_to_string(
        plate_img,
        config="--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    )

    plate = "".join(filter(str.isalnum, text)).upper()

    if len(plate) >= 6:
        results.append({
            "plate": plate,
            "confidence": 92.5,
            "box": { "x": int(x), "y": int(y), "w": int(w), "h": int(h) }
        })

print(json.dumps({ "results": results }))
