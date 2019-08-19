# Heroku

[Heroku](https://www.heroku.com/) is a Cloud Application Platform that will allow you to publish your apps to the web. We'll be primarily using Heroku in this class but it's important to note that there are many other companies out there that offer similar services.

Best of all, [Heroku](https://www.heroku.com/) is free for development use!

The walkthrough that follows assumes you have already setup your Heroku account and downloaded the CLI to your computer. 

## Heroku Setup

Run the following commands from within your project folder.

1. In terminal, navigate to your project folder and type `heroku create`
2. Login in if prompted -- it might ask to open a browser
3. Type `git remote -v` to ensure it added successfully
    * You should see a heroku remote along with your origin remote

Make sure your PORT is configured correctly as:

```JavaScript
const PORT = process.env.PORT || 5000;
```

Heroku will run by default `npm run build` and then `npm run start` in order to kick off your application. We have to make sure that both scripts are working as expected before deploying our code to Heroku. If you do not have a `build` script in place Heroku will not attempt to run it.

## Heroku Deployment: Server and Client Deployment

Commit your changes and push them to Heroku `master`:

```
git add .
git commit -m "MESSAGE"
git push heroku master
```

   > Note: You'll need to commit and push each time you make a change that you want to deploy to Heroku. **Keep in mind you CAN NOT pull from Heroku. This is not a replacement for GitHub!**

Lastly, open terminal and type `heroku open` as a shortcut to open your website in a browser.

   > Note: It is best to fully test your code locally before deploying to Heroku. Bugs are much harder to troubleshoot on a live website.

## Heroku Deployment: Database



## Addition Heroku Info

The following are some additional resources, information, etc... to help you in your Heroku journey.

### Miscellaneous Heroku CLI commands

- `heroku logs` - Display error logs
- `heroku config` - Show basic app info
- `heroku restart` - Sometimes it helps to turn things off an on again
- `heroku open` - Opens the website for you project in the browser

### Resources

More detailed instructions can be found here: 

- [https://devcenter.heroku.com/articles/git](https://devcenter.heroku.com/articles/git)
