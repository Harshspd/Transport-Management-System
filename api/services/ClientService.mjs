import Client from "../models/Client.mjs";
import natural from 'natural';
class ClientService {

    async findClientInDatabase(clientName, account_id) {
        try {
            // Fetch all clients for matching
            const clients = await Client.find({ account_id });
            if (clients.length === 0) {
                return null;
            }

            const metaphone = natural.Metaphone;
            const inputKey = metaphone.process(clientName); // Generate Metaphone key for the input

            let bestMatches = []; // Array to hold potential matches

            clients.forEach((client) => {
                if (!client.name || typeof client.name !== 'string') return; // Skip invalid names

                // Generate Metaphone key for the client name
                const clientKey = metaphone.process(client.name);

                // Calculate Dice Coefficient
                const diceScore = natural.DiceCoefficient(inputKey, clientKey);

                // Calculate String Similarity
                const stringSimilarityScore = natural.JaroWinklerDistance(clientName, client.name);

                // Combine scores (weighted average or sum, adjust weights as needed)
                const combinedScore = (diceScore * 0.5) + (stringSimilarityScore * 0.5);

                bestMatches.push({
                    client,
                    combinedScore,
                    diceScore,
                    stringSimilarityScore,
                });
            });

            // Sort matches by combinedScore in descending order
            bestMatches.sort((a, b) => b.combinedScore - a.combinedScore);
            // Filter matches based on a similarity threshold
            const similarityThreshold = 0.7;
            const filteredMatches = bestMatches.filter(match => match.combinedScore > similarityThreshold);
            // Return matches or null if no good match found

            return filteredMatches.length > 0 ? filteredMatches[0].combinedScore > 0.99 ? filteredMatches[0] : filteredMatches : null;

        } catch (error) {
            console.error('Error searching for client in database:', error);
            return null;
        }
    }

    async createClient(name, account_id) {
        return await Client.create({ name, account_id })
    }
}
export default new ClientService();
