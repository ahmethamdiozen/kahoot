const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz");
const auth = require("../middleware/auth");
const pool = require("../db");

router.post("/create", auth, quizController.createQuiz);
router.post("/start/:quizId", auth, quizController.startQuiz);

router.get("/my", auth, async (req, res) => {
  const result = await pool.query("SELECT id, title FROM quizzes WHERE user_id = $1", [req.userId]);
  res.json(result.rows);
});

router.get("/:id/questions", auth, async (req, res) => {
  const result = await pool.query(
    `SELECT id, text, options, correct, duration, image_url, video_url
     FROM questions
     WHERE quiz_id = $1
     ORDER BY id`,
    [req.params.id]
  );
  res.json(result.rows);
});

router.get("/:id", auth, async (req, res) => {
  const quiz = await pool.query(
    "SELECT id, title FROM quizzes WHERE id = $1 AND user_id = $2",
    [req.params.id, req.userId]
  );

  const questions = await pool.query(
    `SELECT id, text, options, correct, duration, image_url, video_url
     FROM questions
     WHERE quiz_id = $1
     ORDER BY id`,
    [req.params.id]
  );

  res.json({
    quiz: quiz.rows[0],
    questions: questions.rows,
  });
});

router.put("/:id", auth, async (req, res) => {
  const { title, questions } = req.body;

  await pool.query("UPDATE quizzes SET title = $1 WHERE id = $2 AND user_id = $3", [
    title,
    req.params.id,
    req.userId,
  ]);

  await pool.query("DELETE FROM questions WHERE quiz_id = $1", [req.params.id]);

  for (const q of questions) {
    await pool.query(
      `INSERT INTO questions (quiz_id, text, options, correct, duration, image_url, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        req.params.id,
        q.text,
        JSON.stringify(q.options),
        q.correct,
        q.duration || 15,
        q.image_url || null,
        q.video_url || null
      ]
    );
  }

  res.json({ message: "Quiz güncellendi" });
});

router.delete("/:id", auth, async (req, res) => {
  await pool.query("DELETE FROM quizzes WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
  res.json({ message: "Quiz silindi" });
});

module.exports = router;
