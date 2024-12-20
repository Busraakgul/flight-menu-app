// import formidable from "formidable";
// import fs from "fs";
// import path from "path";
// import Tesseract from "tesseract.js"; // Tesseract OCR library for text extraction
// import translate from "google-translate-api-x"; // Google Translate API for translating text

// // Disable body parsing for handling form-data (used by formidable for file uploads)
// export const config = {
//   api: { bodyParser: false },
// };

// export default async function handler(req, res) {
//   // Check if the request method is POST
//   if (req.method === "POST") {
//     try {
//       // Prepare the upload directory to store files
//       const uploadDir = path.join(process.cwd(), "/public/uploads");

//       // If the directory doesn't exist, create it recursively
//       if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//       // Use the formidable library to parse the incoming form-data (file upload)
//       const form = formidable({ uploadDir, keepExtensions: true });

//       // Parse the form data from the incoming request
//       form.parse(req, async (err, fields, files) => {
//         // Handle any error during the file upload
//         if (err) {
//           console.error("File upload error:", err);
//           return res.status(500).json({ error: "File upload failed." });
//         }

//         // Extract the uploaded file's path
//         const file = files.file[0]; 
//         const filePath = file.filepath;

//         // Perform OCR (Optical Character Recognition) using Tesseract.js
//         const { data: { text } } = await Tesseract.recognize(filePath, "eng+tur", {
//           logger: (m) => console.log(m), // Log OCR processing steps
//         });

//         // Log the raw text extracted by OCR
//         console.log("OCR Raw Text:", text);

//         // List of unwanted words to filter out from the OCR text
//         const unwantedWords = [
//           "menu", "Menu", "Menü", "local", "before landing", "Kalkış",
//           "service", "finished", "apologize", "take-off", "landing",
//           "Item", "available", "understanding", "prepared", "Islamic","Lütfen"
//         ];

//         // List of unwanted regex patterns (to filter out irrelevant lines)
//         const unwantedPatterns = [
//           /(?:^| )veya or(?: |$)/i,   // "veya or" in the line
//           /(?:^| )[-_]+ ?[a-zA-Z]?$/i, // Hyphen or dash-like patterns
//           /(?:thank you for your understanding)/i, // Thank you messages
//           /yemeklerimiz.*islamic principles/i, // Islamic principles message
//           /^\d+$/                      // Purely numeric lines (no text)
//         ];

//         // Create a regular expression to match any unwanted words
//         const regex = new RegExp(`\\b(${unwantedWords.join("|")})\\b`, "i");

//         // Process the OCR text to filter out unwanted lines and prepare menu items
//         const menuItems = text
//           .split("\n") // Split text into lines
//           .map((line) => line.trim()) // Trim whitespace from each line
//           .filter((line) => {
//             const isUnwantedWord = regex.test(line); // Check for unwanted words
//             const isUnwantedPattern = unwantedPatterns.some((pattern) => pattern.test(line)); // Check for unwanted patterns
//             const isNumeric = /^\d+(\.\d+)?$/.test(line); // Check if the line is numeric
//             return line && !isUnwantedWord && !isUnwantedPattern && !isNumeric && line.length > 2; // Filter lines
//           })
//           .map((item, index) => ({ id: index + 1, description: item })); // Prepare the final list of menu items

//         // Log the filtered menu items
//         console.log("Filtered Menu Items:", menuItems);

//         // Optional translation step: Translate menu items to the specified language (default: English)
//         const language = fields.language || "en"; // Get the target language from the form fields or default to "en"
//         const translatedMenuItems = await Promise.all(
//           menuItems.map(async (item) => {
//             try {
//               // Translate each menu item description
//               const result = await translate(item.description, { to: language });
//               return { ...item, translatedDescription: result.text }; // Add translated description to the item
//             } catch (err) {
//               console.error("Translation error:", err);
//               return { ...item, translatedDescription: "Translation failed" }; // Handle translation errors
//             }
//           })
//         );

//         // Respond with the original OCR text and the translated menu items
//         res.status(200).json({ text, menuItems: translatedMenuItems });
//       });
//     } catch (error) {
//       // Handle any errors during the OCR or file processing
//       console.error("OCR processing error:", error);
//       res.status(500).json({ error: "OCR process failed." });
//     }
//   } else {
//     // Handle requests with methods other than POST (e.g., GET)
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }
// }


import formidable from "formidable";
import fs from "fs";
import os from "os";
import path from "path";
import Tesseract from "tesseract.js";
import translate from "google-translate-api-x";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Geçici dosya yükleme dizini
  const uploadDir = os.tmpdir();
  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form Parse Error:", err);
      return res.status(500).json({ error: "Failed to parse form data." });
    }

    if (!files.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const file = files.file[0];
      console.log("Processing file at path:", file.filepath);

      // OCR işlemi (Tesseract.js)
      const { data: { text } } = await Tesseract.recognize(file.filepath, "eng+tur", {
        langPath: path.join(process.cwd(), "/public/lang"), // Dil dosyalarının yolu
        logger: (m) => console.log("Tesseract Log:", m), // İşlem logları
      });

      console.log("OCR Text:", text);

      // İstenmeyen kelimeler ve desenler
      const unwantedWords = [
        "menu", "Menu", "Menü", "local", "before landing", "Kalkış",
        "service", "finished", "apologize", "take-off", "landing",
        "Item", "available", "understanding", "prepared", "Islamic", "Lütfen"
      ];

      const unwantedPatterns = [
        /(?:^| )veya or(?: |$)/i,   // "veya or" içeren satırlar
        /(?:^| )[-_]+ ?[a-zA-Z]?$/i, // Tireli veya kısa satırlar
        /(?:thank you for your understanding)/i, // Teşekkür mesajları
        /yemeklerimiz.*islamic principles/i, // İslami ilke mesajları
        /^\d+$/                      // Tamamen sayısal satırlar
      ];

      const regex = new RegExp(`\\b(${unwantedWords.join("|")})\\b`, "i");

      // OCR sonuçlarını filtreleme
      const menuItems = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => {
          const isUnwantedWord = regex.test(line);
          const isUnwantedPattern = unwantedPatterns.some((pattern) => pattern.test(line));
          const isNumeric = /^\d+(\.\d+)?$/.test(line);
          return line && !isUnwantedWord && !isUnwantedPattern && !isNumeric && line.length > 2;
        })
        .map((item, index) => ({ id: index + 1, description: item }));

      console.log("Filtered Menu Items:", menuItems);

      // Çeviri işlemi
      const language = fields.language || "en";
      const translatedMenuItems = await Promise.all(
        menuItems.map(async (item) => {
          try {
            const result = await translate(item.description, { to: language });
            return { ...item, translatedDescription: result.text };
          } catch (err) {
            console.error("Translation Error:", err);
            return { ...item, translatedDescription: "Translation failed" };
          }
        })
      );

      // Yanıt
      res.status(200).json({ success: true, text, menuItems: translatedMenuItems });
    } catch (error) {
      console.error("OCR Processing Error:", error);
      res.status(500).json({ error: "OCR process failed." });
    }
  });
}
