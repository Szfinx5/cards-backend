import { app } from "./server";

const PORT = process.env.PORT || 8081;

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}…`);
});
