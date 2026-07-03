import express from 'express';
import cors from 'cors';
import { getDb, seedMateri, seedQuiz, seedAdmin } from './models/database.js';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import materiRoutes from './routes/materi.js';
import quizRoutes from './routes/quiz.js';
import progressRoutes from './routes/progress.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/materi', authenticateToken, materiRoutes);
app.use('/api/quiz', authenticateToken, quizRoutes);
app.use('/api/progress', authenticateToken, progressRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  await getDb();
  seedMateri();
  seedQuiz();
  seedAdmin();
  console.log('Database initialized');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
