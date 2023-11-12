document.addEventListener('DOMContentLoaded', function() {
    const graphDataElement = document.getElementById('graphData');
    let graphData;

    // Try to parse the JSON data, or log an error if it fails
    try {
        const graphDataString = graphDataElement.getAttribute('data-graph').replace(/'/g, '"');
        console.log(graphDataString)
        graphData = JSON.parse(graphDataString);
        console.log(graphData)
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return;
    }

    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    // Continue with your code...
    // ...

    // Draw the time series line
    ctx.beginPath();
    ctx.moveTo(mapDateToX(timestamps[0]), mapRldiffToY(rldiffValues[0]));

    timestamps.forEach((timestamp, index) => {
        ctx.lineTo(mapDateToX(timestamp), mapRldiffToY(rldiffValues[index]));
    });

    ctx.strokeStyle = '#007bff'; // A nice blue color for the line
    ctx.stroke();
});
