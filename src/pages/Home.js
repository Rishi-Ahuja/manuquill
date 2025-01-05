import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Textura</h1>
      <p>Upload or paste your text to get started.</p>
      <Link to="/formatter">Go to Formatter</Link>
    </div>
  );
}

export default Home;
