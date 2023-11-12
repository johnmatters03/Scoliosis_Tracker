const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const diff=document.getElementById('shoulderdiff');
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

    return drawPoses(poses);
}

function drawPoses(poses) {
    let rldiff = 0;
    let dictionary = {};
    poses.sort((a, b) => b.score - a.score);
    if (poses.length > 0)
    {
        let pose = poses[0];
        pose.keypoints.forEach(keypoint => {
            if (keypoint.name == "left_shoulder") rldiff = rldiff - keypoint.y;
            if (keypoint.name == "right_shoulder") rldiff = rldiff + keypoint.y;

            // console.log(keypoint); // Log each keypoint
            if (keypoint.score > 0.5) {
                // Ensure x and y are available
                if (keypoint.x !== undefined && keypoint.y !== undefined) {
                    const { x, y } = keypoint;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    dictionary[keypoint.name] = [keypoint.x, keypoint.y];
                } else {
                    console.log("Key point position is undefined", keypoint);
                }
            }
        });

        diff.textContent = rldiff;
        dictionary["rldiff"] = [rldiff];
        console.log("rldiff: ", rldiff);
        return dictionary;
    }

    
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
        let dataDict = await detectPose(imageElement);
        let dataDictStr = JSON.stringify(dataDict);
        //let timestamp = Date.now();
        let formData = new FormData();
        formData.append('image', file);
        formData.append('data_dict', dataDictStr);
        //formData.append('upload_date', timestamp);
        fetch('/pictures/', {
            method: 'POST',
            body: formData
          })
          .then(response => response.text())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
    };
});

window.onload = loadModel;
