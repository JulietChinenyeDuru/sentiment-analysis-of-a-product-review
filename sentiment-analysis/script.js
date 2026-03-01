const reviewInput = document.getElementById('reviewInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const result = document.getElementById('result');
const exampleBtns = document.querySelectorAll('.example-btn');

const positiveWords = [
    'amazing', 'excellent', 'great', 'good', 'love', 'best', 'perfect', 'awesome',
    'fantastic', 'wonderful', 'brilliant', 'outstanding', 'superb', 'recommend',
    'happy', 'satisfied', 'quality', 'beautiful', 'impressive', 'worth', 'nice',
    'pleased', 'delighted', 'exceptional', 'incredible', 'fabulous', 'terrific'
];

const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'disappointing',
    'waste', 'useless', 'broken', 'defective', 'cheap', 'hate', 'regret',
    'disappointed', 'unhappy', 'unsatisfied', 'inferior', 'pathetic', 'garbage',
    'junk', 'fail', 'failed', 'problem', 'issue', 'never', 'avoid', 'refund'
];

analyzeBtn.addEventListener('click', analyzeSentiment);

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        reviewInput.value = btn.dataset.text;
        analyzeSentiment();
    });
});

function analyzeSentiment() {
    const text = reviewInput.value.trim().toLowerCase();
    
    if (!text) {
        alert('Please enter a review to analyze');
        return;
    }
    
    const words = text.split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    const foundPositive = [];
    const foundNegative = [];
    
    words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        
        if (positiveWords.includes(cleanWord)) {
            positiveCount++;
            if (!foundPositive.includes(cleanWord)) {
                foundPositive.push(cleanWord);
            }
        }
        
        if (negativeWords.includes(cleanWord)) {
            negativeCount++;
            if (!foundNegative.includes(cleanWord)) {
                foundNegative.push(cleanWord);
            }
        }
    });
    
    // Calculate sentiment
    const totalSentimentWords = positiveCount + negativeCount;
    let sentiment, icon, positiveScore, negativeScore, neutralScore;
    
    if (totalSentimentWords === 0) {
        sentiment = 'Neutral';
        icon = '😐';
        positiveScore = 33;
        neutralScore = 34;
        negativeScore = 33;
    } else {
        const ratio = positiveCount - negativeCount;
        
        if (ratio > 0) {
            sentiment = 'Positive';
            icon = '😊';
            positiveScore = Math.min(70 + (ratio * 5), 95);
            negativeScore = Math.max(5, 30 - (ratio * 5));
            neutralScore = 100 - positiveScore - negativeScore;
        } else if (ratio < 0) {
            sentiment = 'Negative';
            icon = '😞';
            negativeScore = Math.min(70 + (Math.abs(ratio) * 5), 95);
            positiveScore = Math.max(5, 30 - (Math.abs(ratio) * 5));
            neutralScore = 100 - positiveScore - negativeScore;
        } else {
            sentiment = 'Mixed';
            icon = '😐';
            positiveScore = 40;
            negativeScore = 40;
            neutralScore = 20;
        }
    }
    
    displayResults(sentiment, icon, positiveScore, neutralScore, negativeScore, foundPositive, foundNegative);
}

function displayResults(sentiment, icon, positiveScore, neutralScore, negativeScore, foundPositive, foundNegative) {
    document.getElementById('sentimentIcon').textContent = icon;
    document.getElementById('sentimentLabel').textContent = sentiment;
    document.getElementById('confidenceScore').textContent = `Confidence: ${Math.max(positiveScore, negativeScore, neutralScore)}%`;
    
    document.getElementById('positiveWords').textContent = foundPositive.length > 0 ? foundPositive.join(', ') : 'None detected';
    document.getElementById('negativeWords').textContent = foundNegative.length > 0 ? foundNegative.join(', ') : 'None detected';
    
    document.getElementById('positiveBar').style.width = positiveScore + '%';
    document.getElementById('neutralBar').style.width = neutralScore + '%';
    document.getElementById('negativeBar').style.width = negativeScore + '%';
    
    document.getElementById('positivePercent').textContent = Math.round(positiveScore) + '%';
    document.getElementById('neutralPercent').textContent = Math.round(neutralScore) + '%';
    document.getElementById('negativePercent').textContent = Math.round(negativeScore) + '%';
    
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
