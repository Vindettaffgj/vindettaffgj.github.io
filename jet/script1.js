let lastBettingTime = 0;
let tokenIndex = 0;
let coefficientHistory = []; // Array to store past coefficients

const tokens = [
    "demo",
    "demo",
    "demo"
];

function getAuthorizationToken() {
    const token = tokens[tokenIndex];
    tokenIndex = (tokenIndex + 1) % tokens.length;
    return `Bearer ${token}`;
}

function getRan(min, max) {
    return Math.random() * (max - min) + min;
}

async function checkSignal() {
    let randomNumber1 = getRan(1.1, 5.0).toFixed(2);
    const url = 'https://crash-gateway-cr.100hp.app/state?id_n=1play_luckyjet';
    const response = await fetch(url, {
        headers: {
            'Authorization': getAuthorizationToken()
        }
    });
    const data = await response.json();
    const state = data.current_state;

    let responseText = document.getElementById('responseText');
    if (!responseText) {
        console.error('Element with ID responseText not found.');
        return;
    }

    if (state === "betting" && Date.now() - lastBettingTime > 5000) {
        let resultText = `${randomNumber1}x`;
        document.getElementById("responseText").textContent = resultText;
        localStorage.setItem('resultText', resultText);
        responseText.className = 'text betting';        
        lastBettingTime = Date.now();
    } else if (state === "ending") {
        responseText.textContent = "Waiting..";
        responseText.className = 'text fly';
    } 
}

function fetchDataAndUpdate() {
    const url = 'https://crash-gateway-cr.100hp.app/state?id_n=1play_luckyjet';
    fetch(url, {
        headers: {
            'Authorization': getAuthorizationToken()
        }
    })
        .then(response => response.json())
        .then(data => {
            const kef = parseFloat(data.current_coefficients);
            updateCoefficients(kef);

            // Add the coefficient to the history
            coefficientHistory.push(kef);

            // Predict the next coefficient using the history
            const predictedCoefficient = predictNextCoefficient(coefficientHistory);

            // Display the prediction
            displayPrediction(predictedCoefficient);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateCoefficients(coefficients) {
    const coefficientsDiv = document.getElementById('coefficients');
    if (!coefficientsDiv) {
        console.error('Element with ID coefficients not found.');
        return;
    }

    if (coefficients !== 1) {
        coefficientsDiv.innerText = `x${coefficients}`; 
        coefficientsDiv.classList.remove('smallt');
        coefficientsDiv.classList.add('kif');
    } 
}

// Implement the prediction logic
function predictNextCoefficient(history) {
    // You need to implement this function using a suitable prediction algorithm.
    // This is a placeholder.
    // You might use a simple moving average or a more sophisticated machine learning model.

    if (history.length < 2) {
        return "Insufficient data"; 
    }
    
    const lastTwoCoefficients = history.slice(-5);
    return lastTwoCoefficients.reduce((sum, current) => sum + current, 0) / 5;
}

function displayPrediction(predictedCoefficient) {
    const predictionDiv = document.getElementById('prediction');
    if (!predictionDiv) {
        console.error('Element with ID prediction not found.');
        return;
    }
    predictionDiv.innerText = `Predicted: x${predictedCoefficient}`;
}


fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 100);
let intervalId = setInterval(checkSignal, 100);
checkSignal();