document.getElementById('processButton').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput').value;
    console.log("Input text:", textInput); // Log the input text

    const response = await fetch('http://localhost:5000/api/vocab');
    const vocabList = await response.json();
    console.log("Vocab List:", vocabList); // Log the fetched vocabulary list

    const vocabMap = {};
    vocabList.forEach(vocab => {
        vocabMap[vocab.word] = vocab.level;
    });

    console.log("Vocab Map:", vocabMap); // Log the created vocab map

    // Create a regex pattern from the vocab words
    const vocabWords = Object.keys(vocabMap).join('|');
    const regex = new RegExp(`(${vocabWords})`, 'g');

    // Process the input text and color code
    const processedText = textInput.replace(regex, (match) => {
        const level = vocabMap[match];
        console.log(`Matched: "${match}", Level: ${level}`); // Log matched words
        return `<span class="${level}">${match}</span>`;
    });

    document.getElementById('output').innerHTML = processedText;
    console.log("Processed Text:", processedText); // Log the processed text
});
