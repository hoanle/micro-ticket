import expres from "express";
import { json } from "body-parser";

const app = expres();
app.use(json());

app.get("/api/users/currentuser", (request, response) => {
    response.send("Hi there!");
})
app.listen(3000, () => {
    console.log("Listening to port 3000!!");
});