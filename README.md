# Heroku

[Heroku](https://www.heroku.com/) is a Cloud Application Platform that will allow you to publish your apps to the web. We'll be primarily using Heroku in this class but it's important to note that there are many other companies out there that offer similar services.

Best of all, [Heroku](https://www.heroku.com/) is free for development use!


## Heroku Prerequisite

The walkthrough that follows assumes you have already setup your Heroku account and downloaded the CLI to your computer. If you already have done a Heroku deployment from your computer before goto the [Code Readiness](#code-readiness) section.

1. Sign up for an account on [Heroku.com](https://www.heroku.com/)
1. Install Heroku CLI by typing `brew install heroku` in Terminal
  - [Additional installation notes and troubleshooting](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
1. Authenticate by typing `heroku login` in Terminal

> Note: Your project also needs to have a git repository.


## Codebase Readiness

The following alterations need to be made to your codebase in order to deploy to Heroku. Please make sure you have these in place before following any of the rest of the deployment notes.


### Scripts

Heroku will run by default `npm run build` and then `npm run start` in order to kick off your application every time you deploy. We have to make sure that both scripts are working as expected before deploying our code to Heroku. If you do not have a `build` script in place Heroku will not attempt to run it.

1. In `package.json` as part of the `scripts` add `start` script:

    ```JS
    "scipts": {
      ...
      "start": "node server/server.js"
    }
    ```

    > Note: the `server/server.js` path in the example is a sample and you should update that to be the path to the file that kicks off your node application

1. If you have a bundler / complier in place add it as the `build` script:

    ```JS
    "scipts": {
      ...
      "start": "node server/server.js",
      "build": "webpack --config webpack.config.js"
    }
    ```

    > Note: we are showing the use of a webpack bundler in this example but the CLI command should be replaced by whatever you are using for your bundler


### Accepting Heroku PORT

Make sure your PORT is configured correctly. This should be in your node server application kickoff file. In most cases it's a `server.js` file.

*in `server.js`:*

```JavaScript
const PORT = process.env.PORT || 5000;
```

Ensure these updates are committed to the repository.


### pg.Pool Configuration

To ensure that pool is going to work with the Heroku database we're going to need to abstract out the configuration to accept som custom settings in the event that the Heroku DB is being used instead of a local. If you already have a separate pool module then go-ahead and open it up, otherwise go ahead and create the module at `./server/modules/pool.js`. We're going to set it up so that the pool configuration is built off of the heroku `DATABASE_URL`.

With these changes in place the only alterations that you would need to make  would be on single line where you change `database: process.env.DATABASE_NAME || 'your_database'` to reflect the name of your local database. Change `your_database` to the actual name of your database.

**modules/pool.js**

```JavaScript
/**
* You'll need to use environment variables in order to deploy your
* pg-pool configuration to Heroku.
* It will look something like this:
**/
/* the only line you likely need to change is
 database: 'prime_app',
 change `prime_app` to the name of your database, and you should be all set!
*/

const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
} else {
  config = {
    host: 'localhost', // Server hosting the postgres database
    port: 5432, // env var: PGPORT
    database: 'prime_app', // CHANGE THIS LINE! env var: PGDATABASE, this is likely the one thing you need to change to get up and running
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
}

// this creates the pool that will be shared by all other modules
const pool = new pg.Pool(config);

// the pool will log when it connects to the database
pool.on('connect', () => {
  console.log('Postgesql connected');
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
```

Now you can import the pool module into any file that needs it:

```JS
const pool = require('../modules/pool.js');
```

Ensure these updates are committed to the repository.


## Heroku Setup

Run the following commands from within your project folder.

1. In terminal, navigate to your project folder.
    * run in terminal:
    
      ```
      heroku create
      ```

1. Login in if prompted -- it might ask to open a browser
1. Verify the the `heroku` remote has been added successfully
    * run in terminal: 
      
      ```
      git remote -v
      ```

    * You should see a heroku remote along with your origin remote

Heroku will run by default `npm run build` and then `npm run start` in order to kick off your application make sure these are setup as seen in the [Scripts](#scripts) section.


## Heroku Deployment: Server and Client Deployment

Ensure that all code changes have been committed to the local repository. With the code up to date and committed it can then be pushed to Heroku `master`:

1. Use terminal in project directory to run:

    ```
    git push heroku master
    ```

    > Note: You'll need to commit and push each time you make a change that you want to deploy to Heroku. **Keep in mind you CAN NOT pull from Heroku. This is not a replacement for GitHub!**

1. From the same terminal in the project directory run: 
    
    ```
    heroku open
    ```

    > Note: It is best to fully test your code locally before deploying to Heroku. Bugs are much harder to troubleshoot on a live website.


## Heroku Deployment: Database

Our website is now live! However... we also have a database, so how do we get that deployed?


### Postgresql on Heroku

1. Create a **postgresql** database on Heroku.
    * run in terminal:
  
      ```
      heroku addons:create heroku-postgresql:hobby-dev
      ```

1. Push all of our local database data over to the new Heroku database.
    * run in terminal *(replace `your_database` with the actual name of your database)*:
    
      ```
      heroku pg:push your_database DATABASE_URL
      ```
    
    * **DO NOT** replace `DATABASE_URL` with something else, just type: `DATABASE_URL`.

Next, commit your changes and push them to Heroku:

```
git add .
git commit -m "MESSAGE"
git push heroku master
```

> Note: You'll need to commit and push each time you make a change that you want to deploy to Heroku. Automatic deployments are covered in [a later section](#gui-and-automatic-deployment) **Keep in mind you CAN NOT pull from Heroku. This is not a replacement for GitHub!**

Lastly, open terminal and type `heroku open`, which should show you your deployed site!

> Note: It is best to fully test your code locally before deploying to Heroku. Bugs are much harder to troubleshoot on a live website.


### Miscellaneous

- `heroku logs` - Display error logs
- `heroku config` - Show basic app info
- `heroku restart` - Sometimes it helps to turn things off an on again
- `heroku open` - Opens the website for you project in the browser


## Connecting Postico to your Heroku Database

If you would like to edit your database, you can connect to your Heroku database directly from Postico. 

1. In [your list of Heroku apps](https://dashboard.heroku.com/apps), select your application.
1. Under `Resources` or in the `Configure Add-Ons` section, select `Heroku Postgres`.
1. Select the `Settings` tab and click `View Credentials`
1. Open Postico and select `New Favorite`.
1. In the new Postico favorite, update the following to match Heroku:
    - Host
    - User
    - Database
    - Password
    - Port
1. Click `Connect` and you should have access to your database directly from Postico!


## GUI and Automatic Deployment

The [Heroku](https://www.heroku.com/) website GUI can simplify several of the steps taken above especially for projects where you intend to make future changes.

1. In [your list of Heroku apps](https://dashboard.heroku.com/apps), select your application.
2. Under the `Deploy` tab, in the `Deployment Method` section, select `Github`. Connect to the `Github` repository with your application by searching for the name of your repository.
3. In the `Manual Deploy` section, click `Deploy Branch` to deploy for the first time.


## Additional Heroku Info

The following are some additional resources, information, etc... to help you in your Heroku journey.


### Miscellaneous Heroku CLI commands

- `heroku logs` - Display error logs
- `heroku config` - Show basic app info
- `heroku restart` - Sometimes it helps to turn things off an on again
- `heroku open` - Opens the website for you project in the browser


### Resources

More detailed instructions can be found here: 

- [https://devcenter.heroku.com/articles/git](https://devcenter.heroku.com/articles/git)
- Deployment Videos [https://drive.google.com/drive/u/1/folders/0B9sCDSmGi72ZN2hpR1Etbl9qb2c](https://drive.google.com/drive/u/1/folders/0B9sCDSmGi72ZN2hpR1Etbl9qb2c)
- [https://devcenter.heroku.com/articles/git](https://devcenter.heroku.com/articles/git)
- [https://devcenter.heroku.com/articles/heroku-postgresql](https://devcenter.heroku.com/articles/heroku-postgresql)
