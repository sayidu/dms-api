import app from './app';

const port = process.env.PORT || 8000;

// Start server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
