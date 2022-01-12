const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');

  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  const comment = { id, content, status: 'pending' };
  comments.push(comment)

  commentsByPostId[postId] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { postId, ...comment }
  }).catch((err) => {
    console.log(err.message);
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if(type === 'CommentModerated') {
    const { postId, id, status } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => comment.id === id);

    comment.status = status;

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { postId, ...comment }
    }).catch((err) => {
      console.log(err.message);
    });
  }

  res.send();
});

app.listen(4001, () => {
  console.log('listening on 4001');
});