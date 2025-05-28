import mongoose from "mongoose";
import OpenAI from "openai";
import Country from "../models/Country.mjs";

class UtilityService {
    validateDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!regex.test(dateString)) {
            return false;
        }
    
        const date = new Date(dateString);
    
        if (isNaN(date.getTime())) {
            console.log('Invalid date object');
            return false;
        }
    
        if (date.toISOString().split('T')[0] !== dateString) {
            return false;
        }
    
        return true;
    }
    validateObjectId(id){
        return mongoose.Types.ObjectId.isValid(id)
    }
    sanitizeFileName (name) {

        return name.replace(/[\/\\:*?"<>|#]/g, '_').trim()
    }
    async parseJSONFromInput(inputText)
    {
      const prompt = `You are an assistant that generates invoice data as pure structured JSON. Extract details from the following input and generate the JSON response without any explanations or formatting. Include only the fields that are explicitly present in the input. For the "currency" field, ensure it is the country shorthand representation (e.g., "Dollar" -> "US", "Euro" -> "EU", etc.).
        Input: "${inputText}"
        
        Output only the JSON object:
        {
          "client": "<string>",
          "due_date": "<ISO 8601 date>",
          "currency": "<country shorthand>",
          "language": "<string>",
          "invoice_number": "<string>",
          "reference_number": "<string>",
          "items": [
            {
              "name": "<string>",
              "description": "<string>",
              "quantity": <number>,
              "price": <number>,
              "linetotal": <number>
            }
          ],
          "discounts": [],
          "taxes": [],
          "notes": "<string>",
          "terms": "<string>"
        }
        `;
        const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert in generating JSON from natural language." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        });
        const invoice = JSON.parse(response?.choices[0]?.message?.content);
        return invoice;
    }
    async fetchCurrencyId(currencyName){
      const currency = await Country.find({
        currency: { $regex: `^${currencyName}`, $options: 'i' } 
      });
      return currency.length ? currency[0] :null;
    }    
     getDateRangeForDays(days,field='created_on') {
        if (days && !isNaN(days)) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() - days);
          return { [field]: { $gte: endDate, $lte: startDate } };
        }
        return {};
      }

  }

export default new UtilityService(); // Exporting an instance of the class
