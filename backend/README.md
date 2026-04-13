## STEPS

- run npm init -y to create package.json file change it's name to spender-backend and then create a server.js file

- run npm install express jsonwebtoken mongoose dotenv cors bcryptjs multer xlsx

- create a http server in express and run it on port 8000 create a .env file and add PORT as 8000 and fallback as 5000

- import dotenv, express, cors and path and then add a middleware to handle cors and then a middlware to parse json

- import connectDB function from config/db and connect the mongo database, create a mongo connection going to atlas add the MONGO_URI in .env

- write the authentication route and import it in server.js from route/authRoute and start the server on the specified PORT in .env

- node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" to create a JWT_SECRET and add it in the .env

- create config(inside db.js), controller(inside authController.js), middleware(authMiddleware.js), models(Expense.js, Income.js, User.js), routes(authRoute.js, dashboardRoute.js, expenseRoute.js, incomeRoute.js) and uploads folder

- in the db.js file import the mongoose library and define the async connectDB function with try and catch block and export the module and import it in the server.js file

- in the User.js file import mongoose and define the UserSchema function that defines the schema for the Users mainly fullName, email, Password, ProfileImage and add Timestamps

- write a function to hash the password before saving in User.js then write the function to compare the hashed and the entered password to check matching during login

- in the authController.js file import jsonwebtoke as jwt and write generateToken function that creates a jwt token for a session that expires in 1 hour, then write the async functions for registerUser, loginUser and getUserInfo and export those functions.

- in the authRoute.js import these registerUser, loginUser and getUserInfo functions from authController.js and use express router to register and login user via post method and get method to get the user info at /register, /login, and /getUser

- then start writing the logic for registerUser, first destructure the object for the req.body then do the validation check for missing fields then in a try catch block implement the logic for if the email already exists if it exists return email is already in use else register the user and generate a user id, and in the catch block return the status 500 with error message
