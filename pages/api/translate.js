import translate from "google-translate-api-x";
export default async function handler(req, res) {
  const { text, language } = req.body;

  try {
    const result = await translate(text, { to: language });
    res.status(200).json({ translatedText: result.text });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed." });
  }
}
