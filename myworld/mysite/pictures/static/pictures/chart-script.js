document.addEventListener('DOMContentLoaded', function() {
    const graphDataElement = document.getElementById('graphData');
    const graphDataString = graphDataElement.getAttribute('data-graph');
    let graphData;

    // Attempt to parse the JSON data
    try {
        graphData = JSON.parse(graphDataString);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return;
    }

    // Prepare the canvas and context
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    // Extract the timestamps and rldiff values
    const timestamps = graphData.map(entry => new Date(entry.timestamp));
    const rldiffValues = graphData.map(entry => entry.abs_rldiff);

    // Determine the min and max for timestamps and rldiff values
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));
    const minRldiff = Math.min(...rldiffValues);
    const maxRldiff = Math.max(...rldiffValues);

    // Map a date to an x-coordinate on the canvas
    const mapDateToX = (date) => {
        const timeSpan = maxDate - minDate;
        const offsetTime = date - minDate;
        return (offsetTime / timeSpan) * (canvas.width - 100) + 50;
    };

    // Map an rldiff value to a y-coordinate on the canvas
    const mapRldiffToY = (rldiff) => {
        const valueSpan = maxRldiff - minRldiff;
        return (canvas.height - 50) - (rldiff / valueSpan) * (canvas.height - 100);
    };

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the axes (optional)
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, canvas.height - 50);
    ctx.lineTo(canvas.width - 50, canvas.height - 50);
    ctx.stroke();

    // Plot the time series data
    ctx.beginPath();
    ctx.moveTo(mapDateToX(timestamps[0]), mapRldiffToY(rldiffValues[0]));
    timestamps.forEach((timestamp, index) => {
        ctx.lineTo(mapDateToX(timestamp), mapRldiffToY(rldiffValues[index]));
    });
    ctx.strokeStyle = '#007bff'; // A blue color for the line
    ctx.stroke();
});
