import app from "./app.js";
import { connectDB } from "./config/database.js";

connectDB();
PORT = procees.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is working on port: ${PORT}`);
});

export default app;
