const express = require("express");
const path = require("path");
const bp = require("body-parser");
const cors = require("cors");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const authenticateToken = (request, response, next) => {
  let jwt_token;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwt_token = authHeader.split(" ")[1];
  }
  if (jwt_token === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwt_token, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        console.log(payload);
        next();
      }
    });
  }
};

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        user (username,name,password,gender,location) 
      VALUES 
        (
          '${username}',
          '${name}',
          '${hashedPassword}',
          '${gender}',
          '${location}'
         )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.send(`Created new user with ${newUserId}`);
  } else {
    response.status = 400;
    response.send("User already exists");
  }
});

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const databaseUser = await db.get(selectUserQuery);
  if (databaseUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      databaseUser.password
    );
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };
      const jwt_token = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwt_token });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.post("/products/", authenticateToken, async (request, response) => {
  const { id, image_url, description } = request.body;
  const getProducts = `
  INSERT INTO
    product (id, image_url, description)
  VALUES
    ('${id}','${image_url}','${description}');`;
  await db.run(getProducts);
  response.send("Products Successfully Added");
});

app.delete("/products/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const deleteId = `
  DELETE FROM
    product
  WHERE
    id = '${id}'
  `;
  await db.run(deleteId);
  response.send("product Removed");
});

app.get("/products/", authenticateToken, async (request, response) => {
  const getAllProduct = `
    SELECT
      *
    FROM
      product;`;
  const productArray = await db.all(getAllProduct);
  response.send(productArray);
});

app.put("/products/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { description } = request.body;
  const updateProduct = `
    UPDATE
      product
    SET 
      
      description ='${description}'
     
    WHERE
    id='${id}';`;
  await db.run(updateProduct);
  response.send("Product updated successfully");
});

module.exports = app;
