const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let detector;
let gWidth=640;
let gHeight=480;

async function loadModel() {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: gWidth, height: gHeight },
        multiplier: 0.75
    });
}

async function detectPose(imageElement) {
    const poses = await detector.estimatePoses(imageElement, {
        maxPoses: 5,
        flipHorizontal: false,
        scoreThreshold: 0.5,
        nmsRadius: 20
    });

    drawPoses(poses);
}

function drawPoses(poses) {
    poses.forEach(pose => {
        pose.keypoints.forEach(keypoint => {
            // console.log(keypoint); // Log each keypoint
            if (keypoint.score > 0.5) {
                // Ensure x and y are available
                if (keypoint.x !== undefined && keypoint.y !== undefined) {
                    const { x, y } = keypoint;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                } else {
                    console.log("Key point position is undefined", keypoint);
                }
            }
        });
    });
}


imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(file);

    imageElement.onload = async () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height=imageElement.height;
        canvas.width=imageElement.width;
        ctx.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
        gWidth = canvas.width;
        gHeight = canvas.height;
        await detectPose(imageElement);
    };
});

window.onload = loadModel;
