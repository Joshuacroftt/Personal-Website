function redirect(link) {
    window.location.href = link;
}

function helloWorld(id) {
    document.getElementById(id).innerText = "Hello World";
}

let audioContext;
let stream;
let streamSource;
let analyzer;
let binArray;
let canvas;
let ctx;

async function setup() {
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
    audioContext = new AudioContext();
    streamSource = audioContext.createMediaStreamSource(stream);
    analyzer = audioContext.createAnalyser();
    streamSource.connect(analyzer);
    analyzer.fftSize = 256;
    binArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(binArray);
    canvas = document.getElementById("visualizer");
    ctx = canvas.getContext("2d");

}

function draw() {
    analyzer.getByteFrequencyData(binArray);
    requestAnimationFrame(draw);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / binArray.length;
    let x = 0;
    for (let i = 0; i < binArray.length; i++) {
        const barHeight = binArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}