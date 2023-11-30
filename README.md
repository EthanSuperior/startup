# Otrio

## Description deliverable

### Elevator pitch

Otrio is the ultimate twist on the classic Tic-Tac-Toe game, designed to
challenge your strategic thinking and entertain players of all ages. With its
elegant and visually striking design, Otrio presents a circular board divided
into concentric rings, each featuring three spaces. Your mission is simple yet
deeply engaging: align three of your game pieces either horizontally,
vertically, or diagonally before your opponent. What sets Otrio apart is the
inclusion of three differently sized game pieces, adding complexity and strategy
to every move. Are you ready to master the art of Otrio and become the ultimate
strategist?"

### Design

![Mock](https://i.ebayimg.com/images/g/LnAAAOSwZHthCbrS/s-l1200.png)

### Key features

- Secure login over HTTPS
- Play game with a online opponent (maybe local as well?)
- Ability to play a game and view past results
- Total scores from all users displayed in realtime
- Games results are recorded and viewable

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Three HTML pages. One
  for login and one for the game and one for scores.
- **CSS** - Application styling that looks good on different screen sizes,
  positioning of the hambuger menu. And style of the text.
- **JavaScript** - Provides login, the actual game and the scoring.
- **Service** - Backend service with endpoints for:
  - login
  - playing a game
  - retrieving past scores
- **DB** - Store users, scores, and games in database.
- **Login** - Register and login users. Credentials securely stored in database.
  Can't play unless authenticated.
- **WebSocket** - As each player moves the move is broadcast to their opponent.
- **React** - Application ported to use the React web framework.

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

HTML pages - Four HTML page that represent the ability to login, play the game,
view scores and the rules.

Links - The login page automatically links to the play page. All other pages
have a menu.

Text - An about page with information on the game of Otrio.

Images - There is an image representing the board, this will become a HTML
canvas when we get to JS for interaction.

Login - Input box and submit button for login info with username/password.

Database - The scores of past games, and player infor along with
username/password database.

WebSocket - The game will be played with realtime information.

## CSS deliverable

For this deliverable I properly styled the application into its final
appearance, mostly using Bootstrap.

- Body - Header footer, and main content style
- Iframes - Easier Viewing/Loading
- Navigation elements - I added an underline animation and changed the color for
  anchor elements.
- Nav Bar menu - Collapseable nav bar for the menu for any size device.
- Responsive to window resizing - My app looks great on all window sizes and
  devices
- Application elements - Used good contrast and whitespace
- Application text content - Consistent fonts
- Application images - It dynamically resizes the image.

## JavaScript deliverable

For this deliverable I implemented by JavaScript so that the application works
for a single user, tow player. I also added placeholders for future technology.

- login - When you press enter or the login button it takes you to the game
  page, and sets your username.
- database - Displayed the scores. Currently this is stored and retrieved from a
  json file, which is not updated, but there is code to update it, jsut need to
  be in a server.
- WebSocket - It logs your moves, and periodically someone else 'wins' a game.
- application logic - The highlight and ranking number change based up the
  user's selections.
- Otrio Game - Added all the code for the otrio game, switched form doing GO and
  updated all documentation.

## Service deliverable

For this delieveable I redid my entire website to use `Deno` rather than Node,
as such its a little more jank than it was as I have not completly redid
everything. And am in the process of rewriting the whole thing to use react
better.

But I do have working backend endpoints that receives scores and returns them,
its cached on a local json so DB is soon.

- Node.js/Express HTTP service - I did a Deno/Fresh website, HTTP routes work to
  give you the pages, its all done with react/TypeScript!
- Static middleware for frontend - It logs time it took to fetch a request as a
  header, and console.logs it to the server!
- Calls to third party endpoints - I have random CS jokes displayed at the
  bottom, I'll probably remove them if thats okay....
- Backend service endpoints - Endpoint for Scores both POST/GET Login is not yet
  added, I will do such with the DB
- Frontend calls service endpoints - I did this using the fetch function to get
  and post for the scores.

## DB deliverable

For this deliverable I replaced my local JSON with the database.

- MongoDB Atlas database created - done!
- Endpoints for data - My my endpoints now process the data and send it to
  Mongo.
- Stores data in MongoDB - done!

Log in will be done shortly with the next deliverable...

## Login deliverable

- User registration - Creates a new account in the database.
- Existing user - Stores the scores if the user already exists, maybe will add
  settings soon...
- Added cookies - They were a pain to get working, turns out it was a
  e.preventsDefaults() error....
- Use MongoDB to store credentials - Stores both user and their scores in two
  different collections.
- Restricts functionality - You cannot do play until you have logged in, it
  redirects you back to the login screen.

## WebSocket deliverable

For this deliverable I used webSocket to update the votes on the frontend in
realtime.

- Backend listens for WebSocket connection - done!
- Frontend makes WebSocket connection - done!
- Data sent over WebSocket connection - done!
- WebSocket data displayed - All user votes display in realtime. I'm really
  proud that this is working. Way cool!~~

## React deliverable

For this deliverable I converted the application over to use Deno/Fresh, which
uses Preact. I got permission to do so.

- Transpiled to .tsx files
- Components - Header, Footer, the game, etc are all seperate components
- Router - Routing between all components is done
- Hooks - Im using Signals, recent improvement over states
