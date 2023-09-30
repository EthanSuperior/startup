# Go

## Description deliverable

### Elevator pitch

Millennia ago, the great general Sun Zhu penned his magnum opus—_the Art of War_. Encapsulated within its pages were the greatest strategic insights ever written. Battles, once blood-soaked and won by sword, are now are waged in the mind. Embark on a journey into the realm of war's ultimate classic—_Go_ and unveil the truth: 'know the enemy and know yourself, you need not fear the result of a hundred battles'. With each stone you place, you'll shape the battlefield, carve out territory, and outmaneuver your opponents. Will you conquer, or will you become forgotten history?

### Design

![Mock](https://senseis.xmp.net/diagrams/10/2fe5ab0114a1f972061c176349af890f.png)

### Key features

-   Secure login over HTTPS
-   Play game with a online opponent (maybe local as well?)
-   Ability to play a game and view past results
-   Total scores from all users displayed in realtime
-   Games results are recorded and viewable

### Technologies

I am going to use the required technologies in the following ways.

-   **HTML** - Uses correct HTML structure for application. Three HTML pages. One for login and one for the game and one for scores.
-   **CSS** - Application styling that looks good on different screen sizes, positioning of the hambuger menu. And style of the text.
-   **JavaScript** - Provides login, the actual game and the scoring.
-   **Service** - Backend service with endpoints for:
    -   login
    -   playing a game
    -   retrieving past scores
-   **DB** - Store users, scores, and games in database.
-   **Login** - Register and login users. Credentials securely stored in database. Can't play unless authenticated.
-   **WebSocket** - As each player moves the move is broadcast to their opponent.
-   **React** - Application ported to use the React web framework.

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

HTML pages - Four HTML page that represent the ability to login, play the game, view scores and the rules.

Links - The login page automatically links to the play page. All other pages have a menu.

Text - An about page with information on the game of Go.

Images - There is an image representing the board, this will become a HTML canvas when we get to JS for interaction.

Login - Input box and submit button for login info with username/password.

Database - The scores of past games, and player infor along with username/password database.

WebSocket - The game will be played with realtime information.

## CSS deliverable

## JavaScript deliverable

## Service deliverable

## DB deliverable

## Login deliverable

## WebSocket deliverable

## React deliverable
