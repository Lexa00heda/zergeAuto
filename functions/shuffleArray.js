export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * (i + 1));
        
        // Swap the current element with the random element
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}