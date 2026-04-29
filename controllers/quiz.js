const pool = require("../db");
const axios = require("axios");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateAIQuiz = async (req, res) => {
  const { topic, count = 10, difficulty = "", duration = 15 } = req.body;

  if (!topic) return res.status(400).json({ error: "Konu belirtilmeli." });

  const difficultyText = difficulty ? ` Zorluk seviyesi: ${difficulty}.` : "";
  const prompt = `"${topic}" konusunda ${count} soruluk bir quiz oluştur.${difficultyText}

Kurallar:
- Her sorunun tam olarak 4 farklı seçeneği olsun
- Seçenekler gerçek cevap metinleri olsun, asla "A", "B", "C", "D" gibi harf kullanma
- Sadece bir seçenek doğru olsun, geri kalanlar makul ama yanlış olsun
- "correct" alanı doğru seçeneğin 0'dan başlayan indexi olsun (0, 1, 2 veya 3)
- Tüm bilgiler doğru ve güncel olsun
- Yanıt olarak yalnızca geçerli bir JSON array döndür, başka hiçbir şey yazma

Format:
[
  {
    "text": "Türkiye'nin başkenti neresidir?",
    "options": ["İstanbul", "Ankara", "İzmir", "Bursa"],
    "correct": 1
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "Sen bir quiz uzmanısın. Verilen konuda doğru, eğitici ve net sorular oluşturursun. Yanıt olarak yalnızca geçerli JSON array döndürürsün."
        },
        { role: "user", content: prompt }
      ],
    });

    const jsonText = completion.choices[0].message.content;
    let questions;

    try {
      questions = JSON.parse(jsonText);
    } catch (err) {
      return res.status(400).json({ error: "Gelen veri JSON formatında değil." });
    }

    // veritabanına kaydet
    const quizTitle = `${topic} - AI Quiz`;
    const quiz = await pool.query(
      "INSERT INTO quizzes(title, user_id) VALUES($1, $2) RETURNING id",
      [quizTitle, req.userId]
    );

    for (const q of questions) {
      await pool.query(
        "INSERT INTO questions(quiz_id, text, options, correct, duration) VALUES($1, $2, $3, $4, $5)",
        [
          quiz.rows[0].id,
          q.text,
          JSON.stringify(q.options),
          q.correct,
          duration
        ]
      );
    }

    res.json({ quizId: quiz.rows[0].id });

  } catch (err) {
    console.error("OpenAI hatası:", err);
    res.status(500).json({ error: "Yapay zeka yanıtı alınamadı." });
  }
};

exports.createQuiz = async (req, res) => {
  const { title, questions } = req.body;
  const quiz = await pool.query("INSERT INTO quizzes(title, user_id) VALUES($1, $2) RETURNING id", [title, req.userId]);

  for (const q of questions) {
    await pool.query(
      `INSERT INTO questions(quiz_id, text, options, correct, duration, image_url, video_url)
       VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        quiz.rows[0].id,
        q.text,
        JSON.stringify(q.options),
        q.correct,
        q.duration || 15,
        q.image_url || null,
        q.video_url || null
      ]
    );
  }

  res.json({ message: "Quiz created" });
};

exports.startQuiz = async (req, res) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await pool.query("INSERT INTO sessions(quiz_id, code) VALUES($1, $2)", [req.params.quizId, code]);
  res.json({ code });
};