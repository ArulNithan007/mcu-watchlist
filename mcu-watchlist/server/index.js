const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  'https://bmxeahedgzvqhqkfylky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJteGVhaGVkZ3p2cWhxa2Z5bGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0Mjk4MTYsImV4cCI6MjA5NDAwNTgxNn0.VWdZhfg0BQ6Sxrk7zKpaM39gY3Upjx7VWKWijV2GRpc'
);

app.post('/api/users/login', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const { data: existing } = await supabase.from('users').select('*').eq('username', username.toLowerCase().trim()).single();
  if (existing) return res.json(existing);
  const { data, error } = await supabase.from('users').insert({ username: username.toLowerCase().trim() }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/progress/:userId', async (req, res) => {
  const { data, error } = await supabase.from('progress').select('*').eq('user_id', req.params.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/progress', async (req, res) => {
  const { userId, itemId } = req.body;
  const { data, error } = await supabase.from('progress').insert({ user_id: userId, item_id: itemId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/progress', async (req, res) => {
  const { userId, itemId } = req.body;
  const { error } = await supabase.from('progress').delete().eq('user_id', userId).eq('item_id', itemId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/leaderboard', async (req, res) => {
  const { data: users } = await supabase.from('users').select('*');
  const { data: progress } = await supabase.from('progress').select('*');
  const leaderboard = (users || []).map(u => ({
    ...u,
    watched: (progress || []).filter(p => p.user_id === u.id).length
  })).sort((a, b) => b.watched - a.watched);
  res.json(leaderboard);
});

app.listen(3001, () => console.log('Server running on port 3001'));
