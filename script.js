document.getElementById('processButton').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput').value;
    console.log("Input text:", textInput);

    try {
        // const response = await fetch('http://localhost:5000/api/vocab');
        const response = await fetch('/api/vocab');
        if (!response.ok) {
            throw new Error("Failed to fetch vocab");
        }

        const vocabList = await response.json();
        console.log("Vocab List:", vocabList);

        // Sort vocabList by length of word in descending order
        vocabList.sort((a, b) => b.word.length - a.word.length);

        const vocabMap = {};
        let n5Count = 0;
        let n4Count = 0;
        let n3Count = 0;

        vocabList.forEach(vocab => {
            vocabMap[vocab.word] = {
                level: vocab.level,
                on: vocab.on,
                kun: vocab.kun,
                eng: vocab.eng
            };
        });

        console.log("Vocab Map:", vocabMap);

        // Escape special characters in words for the regex
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Create the regex pattern from the vocab words
        const vocabWords = Object.keys(vocabMap).map(escapeRegExp).join('|');
        const regex = new RegExp(`(${vocabWords})`, 'g');

        const processedText = textInput.replace(regex, (match) => {
            const vocab = vocabMap[match];
            const level = vocab.level;

            // Increment the count for each level
            if (level === "N5") n5Count++;
            else if (level === "N4") n4Count++;
            else if (level === "N3") n3Count++;

            return `<span class="vocab-word ${level}" data-level="${level}" data-on="${vocab.on}" data-kun="${vocab.kun}" data-eng="${vocab.eng}">${match}</span>`;
        });

        // Update the vocab summary counts
        document.getElementById('n5-count').textContent = n5Count;
        document.getElementById('n4-count').textContent = n4Count;
        document.getElementById('n3-count').textContent = n3Count;

        document.getElementById('output').innerHTML = processedText;
        console.log("Processed Text:", processedText);

        // Add hover event for custom tooltip
        const vocabWordsElements = document.querySelectorAll('.vocab-word');

        vocabWordsElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerHTML = `Level: ${element.getAttribute('data-level')}<br>On: ${element.getAttribute('data-on')}<br>Kun: ${element.getAttribute('data-kun')}<br>Eng: ${element.getAttribute('data-eng')}`;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
                tooltip.style.visibility = 'visible'; // Ensure visibility
            });

            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });

    } catch (error) {
        console.error("Error processing request:", error);
        document.getElementById('output').innerHTML = "Error processing text. Please try again.";
    }
});