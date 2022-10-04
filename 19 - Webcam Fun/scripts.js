const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  // The Navigator interface represents the state and the identity of the user agent.
  // 簡單來說就是使用者的 電腦 / 瀏覽器 本身
  // 可以取用使用者的 cookie / 電腦設備（如果有 expose 給 web api） 的資訊
  // 這裡想要取得 使用者的 錄影權限 / 但不要聲音
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((mediaStream) => {
      console.log(mediaStream);

      // srcObject 接收  MediaStream, MediaSource, Blob, or File  格式 （ 包含我們現在從鏡頭拿到的就是 MediaStream ）
      // doc: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
      video.srcObject = mediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`OH NO!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width);
  console.log(height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    // 讓我們能在 canvas 上面畫圖
    // 使用方法可以像
    // drawImage( source,dx,dy,width,height )
    // dx: distance from parent object's left
    // dy: distance from parent object's height
    // doc : https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage
    ctx.drawImage(video, 0, 0, width, height);
    // getImageData(x from,y from, w ,h)  拿到一個 ImagaData 描述 canvas 区域隐含的像素数据
    // doc: https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    // pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
