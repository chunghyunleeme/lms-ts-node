import app from "./app";

const PORT: Number = 1995;

app.listen(PORT, (): void => console.log(`running on port ${PORT}`));
