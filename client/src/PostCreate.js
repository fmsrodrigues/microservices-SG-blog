import React, { useState } from 'react';
import axios from 'axios';

export const PostCreate = () => {
  const [title, setTitle] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    await axios.post('http://posts.com/posts/create', {
      title
    });

    setTitle('');
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" type="text" onChange={e => setTitle(e.target.value)} value={title}/>
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
};