FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
  tesseract-ocr \
  python3 \
  python3-pip \
  python3-opencv \
  && rm -rf /var/lib/apt/lists/*

RUN pip3 install pytesseract

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
