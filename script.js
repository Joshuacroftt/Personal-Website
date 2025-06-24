function redirect(link) {
    window.location.href = link;
}

function helloWorld(id) {
    document.getElementById(id).innerText = "Hello World";
}

function revealText() {
    const textElement = document.createElement("div");
    const buttonElement = document.getElementById("aboutButton");
    textElement.id = "revealText";
    textElement.textContent = "Hello Hello";
    buttonElement.appendChild(textElement);
    
}
let audioContext;
let stream;
let streamSource;
let analyzer;
let binArray;
let canvas = document.getElementById("visualizer");
let ctx = canvas.getContext("2d");
const RADIUS = 200;
const GAINDIVISOR = 256;
let BIN_COUNT;
ctx.beginPath();
ctx.arc(RADIUS, RADIUS, RADIUS, 0, 2 * Math.PI);
ctx.clip();
const cx = RADIUS
const cy = RADIUS

async function setup() {
    stream = await navigator.mediaDevices.getUserMedia({video:false, audio:true});
    audioContext = new AudioContext();
    streamSource = audioContext.createMediaStreamSource(stream);
    analyzer = audioContext.createAnalyser();
    streamSource.connect(analyzer);
    analyzer.fftSize = 512;
    binArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(binArray);
    BIN_COUNT = binArray.length / 8;
    traverseCircle(RADIUS);
}

let posArray = [];
function traverseCircle(radius) {
    for (let i = 0; i < BIN_COUNT; i++) {
        const angle = (i / BIN_COUNT) * 2 * Math.PI;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        posArray.push([x, y]);
    }
}

function draw() {
    analyzer.getByteFrequencyData(binArray);
    requestAnimationFrame(draw);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 213, 220, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let x = 0;
    for (let i = 0; i < BIN_COUNT; i++) {
        if (binArray[i] < 20) {
            binArray[i] = 0;
        }
        /*  x1 = cx + Radius * cos(angle) :   pos x of edge of circle
            x2 = cx + radius *cos(angle) - barLength :   x pos of bar for a spectrum going inwards
            x2  x1 - barLength 
        */
        const x1 = posArray[i][0];
        const y1 = posArray[i][1];
        const barLength = (binArray[i] ** 2) / GAINDIVISOR;
        const angle = (i / BIN_COUNT) * 2 * Math.PI;
        const x2 = x1 - barLength * Math.cos(angle);
        const y2 = y1 - barLength * Math.sin(angle);
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgb(${binArray[i] + 100}, 50, 50)`;
        ctx.stroke();
    }
}

function drawGraph() {
    analyzer.getByteFrequencyData(binArray);
    requestAnimationFrame(drawGraph);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 213, 220, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let x = 0;
    ctx.moveTo(cx, cy);
    ctx.beginPath();
    for (let i = 0; i < BIN_COUNT; i++) {
        if (binArray[i] < 20) {
            binArray[i] = 0;
        }
        /*  x1 = cx + Radius * cos(angle) :   pos x of edge of circle
            x2 = cx + radius *cos(angle) - barLength :   x pos of bar for a spectrum going inwards
            x2  x1 - barLength 
        */

        const barLength = binArray[i] ** 2 / GAINDIVISOR;
        const angle = (i / BIN_COUNT) * 2 * Math.PI;
        const x = cx + (RADIUS - barLength) * Math.cos(angle);
        const y = cy + (RADIUS - barLength) * Math.sin(angle);

        if (i == 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

    }
    ctx.closePath();
    ctx.fillStyle = `rgba(100, 50, 50, 0.6)`;
    ctx.fill();
}