const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

export function chunkText(text) {
    const chunks = [];
    let startIndex = 0;


    while (startIndex < text.length) {
        const end = Math.min(
            startIndex + CHUNK_SIZE,
            text.length
        );

        const chunk = text.slice(startIndex, end).trim();

        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        if (end === text.length) {
            break;
        }

        startIndex += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}