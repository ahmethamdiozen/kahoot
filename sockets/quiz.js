const pool = require("../db");

module.exports = (io) => {
  const sessions = {};

  io.on("connection", (socket) => {
    socket.on("join_room", async ({ name, code }) => {
      console.log("joined!")
      const session = (await pool.query("SELECT * FROM sessions WHERE code = $1", [code])).rows[0];
      if (!session) return;
      socket.join(code);
      if (!sessions[code]) sessions[code] = {};
      sessions[code][socket.id] = { name, score: 0 };
      io.to(code).emit("player_list", Object.values(sessions[code]));
    });

    socket.on("teacher_question", ({ code, question }) => {
        console.log("soru gönderiliyor:", question)
        io.to(code).emit("question", question);
      });      

    socket.on("submit_answer", ({ code, timeTaken, correct }) => {
    if (sessions[code] && sessions[code][socket.id]) {
        if (correct) {
        const baseScore = 100;
        const maxTime = 15;
        const speedBonus = Math.max(0, maxTime - timeTaken) * 5;
        sessions[code][socket.id].score += baseScore + speedBonus;
        }
        // ❌ yanlışsa puan verilmez
    }
    });
      

    socket.on("show_leaderboard", (code) => {
        if (sessions[code]) {
          io.to(code).emit("leaderboard", Object.values(sessions[code]));
        }
    });      
      

    socket.on("disconnect", () => {
      for (const code in sessions) {
        if (sessions[code][socket.id]) {
          delete sessions[code][socket.id];
          io.to(code).emit("player_list", Object.values(sessions[code]));
        }
      }
    });
  });
};
