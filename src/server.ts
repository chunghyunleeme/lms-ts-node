import App from "./app";

const PORT: Number = 1995;

// app.listen(PORT, (): void => console.log(`running on port ${PORT}`));

try {
  const app = new App().app;
  const port = 1995;

  app.listen(port, () => {
    console.log(`running on port ${PORT}`);
  });
} catch (e) {
  console.error(e);
}
