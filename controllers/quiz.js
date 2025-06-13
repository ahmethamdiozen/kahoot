const pool = require("../db");

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
