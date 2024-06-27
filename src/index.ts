import express from "express"
import { tokenApi } from "./adapters/http.adapter"

const app = express()

app.use("/token", tokenApi)

const PORT = 4250;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
