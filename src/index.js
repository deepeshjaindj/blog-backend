import 'dotenv/config.js';
import { app } from "./app.js";
import { connectDB } from './db/index.js';
import { PORT } from './constants.js';

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed!!! ", err);
  });
