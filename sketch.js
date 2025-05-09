// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleRadius = 50; // 圓的半徑
let isDragging = false; // 是否正在拖動圓
let isThumbDragging = false; // 是否正在用大拇指拖動圓
let previousX = null; // 上一個圓心的 X 座標
let previousY = null; // 上一個圓心的 Y 座標

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 畫出中間的圓
  fill(0, 0, 255, 150); // 半透明藍色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 畫出圓心的軌跡
  if ((isDragging || isThumbDragging) && previousX !== null && previousY !== null) {
    stroke(isThumbDragging ? 0 : 255, isThumbDragging ? 255 : 0, 0); // 綠色或紅色線條
    strokeWeight(10); // 線條粗細為 10
    line(previousX, previousY, circleX, circleY);
  }

  // 更新上一個圓心的位置
  previousX = circleX;
  previousY = circleY;

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let isCircleMoved = false; // 檢查是否有手指移動圓
    let isThumbCircleMoved = false; // 檢查是否有大拇指移動圓

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部的關鍵點和連線
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        stroke(0, 255, 0); // 設定線條顏色
        strokeWeight(2);

        // 連接手指的關鍵點
        for (let i = 0; i < 4; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }
        for (let i = 5; i < 8; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }
        for (let i = 9; i < 12; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }
        for (let i = 13; i < 16; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }
        for (let i = 17; i < 20; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // 檢查食指 (keypoints[8]) 和大拇指 (keypoints[4]) 是否同時碰觸圓的邊緣
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleRadius && dThumb < circleRadius) {
          // 如果食指和大拇指同時碰觸到圓，讓圓跟隨手指移動
          circleX = (indexFinger.x + thumb.x) / 2;
          circleY = (indexFinger.y + thumb.y) / 2;
          isCircleMoved = true;
        } else if (dThumb < circleRadius) {
          // 如果只有大拇指碰觸到圓，讓圓跟隨大拇指移動
          circleX = thumb.x;
          circleY = thumb.y;
          isThumbCircleMoved = true;
        }
      }
    }

    // 更新拖動狀態
    isDragging = isCircleMoved;
    isThumbDragging = isThumbCircleMoved;

    if (!isDragging && !isThumbDragging) {
      previousX = null;
      previousY = null;
    }
  }
}
