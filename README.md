## WalletWatch

Welcome to WalletWatch, the app that helps you keepm track of daily one-offs, the things that you don't think about buying (like coffee or a bag of chips), but really add up over the course of a month.

To access the live version, click [here](https://walletwatch.now.sh).

That link should bring you to the landing page, which gives a brief description of the app, and provides
a link to either login (if you already have an account) or to register for a new account. 

Landing Page: ![screenshot of landing page](https://i.gyazo.com/f6fdc9ece4e4415457e6ae646a3af513.jpg)

There is also a demo account listed if you just want to check it out without the hassle of creating an 
account.

Once you register an account and login, you will be taken to the main budget page, where you can set your net income, and add in your big monthly expenses, things that you know are going to come around every month that MUST get paid, like your mortgage, or utilities. 

Main Lobby: ![screenshot of main lobby](https://i.gyazo.com/977350cabcf834478abdd7f12dfeef54.png)

From here, you can add your big monthly items to get an idea of what your spending looks like and to see your disposable income. You can also click on the 'Daily Expenditures' button to be taken to the Daily Expense page.

![screenshot of link input](https://i.gyazo.com/ed38399a4af5d6831738e11ae510d749.png)

Here is where you'll keep track of all of those small things you buy throughout the month, like your morning energy drink, or perhaps that trip to your favorite fast food joint every Friday. This page will show you the impact these small purchases have by the week and by the month. Once added to the page, your disposable income will be recalculated to show you how much is left after all of your purchases, giving you and idea of what you could save by trimming a few simple items a day!



Follow [this](https://github.com/bmtron/walletwatch) link to discover how the front end client operates.

## Technology

WalletWatch was created with a multitude of different technologies. The client was built using HTML5 and CSS for the skeleton and skin, respectively, and uses React.js to deliver the main functionality. The backend uses Node.js and Express, and uses PostgreSQL as the database.

## Backend API Endpoints

Supports JSON format.

### GET /api/users
Supports 'GET' for all users in the database. Returns all users.

### POST /api/users
Post a username and a password to the database. Passwords are hashed with bcrypt, and a JWT is required for proper user authentication. Username and password must be supplied to successfully POST. Password must be between 8-36 characters, and contain an uppercase, a lowercase, a number, and a special character

### GET /api/daily_items/:user
Returns all items that have been posted to the database for the username provided in the url parameters. 

### POST /api/daily_items
Adds new daily items to the database, linked to the user that added the item. Requires username, price, item name, and the frequency of the purchase.

### DELETE /api/daily_items/:room_id
Allows the ability to delete specific items based on the ID of the item in the database.

### GET /api/net_income/:user
Returns the net income in the database of the username provided in the request parameters.

### POST /api/net_income
Adds net income to the database linked by the username. This is done once the first time a user logs in. All other requests to this endpoint will be PATCH requests to update the value that's already in there.

### PATCH /api/net_income/:user_name
Allows the ability to update a users net income. 

### GET /api/budget_items/:user
Returns all of the monthly big budget items in the database that have a username matching the parameters of the request.

### POST /api/budget_items
Adds a new monthly item to the database linked by the user's username. Requires a category and amount field.

### DELETE /api/budget_items/:item_id

### POST /api/login
Handles the login authentication. Checks for valid username and password, and will return 'user_name or password invalid' for either username or password being incorrect. Creates a JWT upon successful validation that is passed to the client.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
