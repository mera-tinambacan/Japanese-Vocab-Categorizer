document.getElementById('processButton').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput').value;
    console.log("Input text:", textInput);

    try {
        const response = await fetch('https://japanese-vocab-categorizer.vercel.app/api/server.js');
        if (!response.ok) {
            throw new Error("Failed to fetch vocab");
        }

        const vocabList = await response.json();
        console.log("Vocab List:", vocabList);

        const vocabMap = {};
        let n5Count = 0;
        let n4Count = 0;
        let n3Count = 0;

        vocabList.forEach(vocab => {
            vocabMap[vocab.word] = vocab.level;
        });

        console.log("Vocab Map:", vocabMap);

        // Escape special characters in words for the regex
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const vocabWords = Object.keys(vocabMap).map(escapeRegExp).join('|');
        const regex = new RegExp(`(${vocabWords})`, 'g');

        const processedText = textInput.replace(regex, (match) => {
            const level = vocabMap[match];
            console.log(`Matched: "${match}", Level: ${level}`);

            // Increment the count for each level
            if (level === "N5") n5Count++;
            else if (level === "N4") n4Count++;
            else if (level === "N3") n3Count++;

            return `<span class="${level}">${match}</span>`;
        });

        // Update the vocab summary counts
        document.getElementById('n5-count').textContent = n5Count;
        document.getElementById('n4-count').textContent = n4Count;
        document.getElementById('n3-count').textContent = n3Count;

        document.getElementById('output').innerHTML = processedText;
        console.log("Processed Text:", processedText);

    } catch (error) {
        console.error("Error processing request:", error);
        document.getElementById('output').innerHTML = "Error processing text. Please try again.";
    }
});
