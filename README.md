                            # Description

App is implementation of simple cookbook for storing recipes.

Registered users can perform basic CRUD operations. However, editing can be done only by user who created recipe. For deleting recipes soft deleting is enabled (status on recipe is chnaged from active to inactive). Only recipes with status active are displayed for user

App also enables user to see highest rated recipes. This feature is only available for recipes with >= 3 ratings from the users. Rating is average value of all user ratings. When user rates an recipe his _id is stored in userRater array and his rating is entered in userRating, hence rating is sum of all values in userRating array / length of userRater array. As rating stars cannot hold values like 3.75 (only decimal point .5 can be read and fill half on the star) computation of rating includes checking if value includes .5 (value is saved with decimal point). If decimal point is lower or higher than .5 value is rounded to higher or lower values without decimal point (if 4.25 stored rating will be 4; if 4.75 stored rating will be 5)

User can filter data on home page. Filtering is case insenstive (all titles are converted to lower case and all characters entered in search field are converted to lower case to enable case insenstive filtering of data)

User can view recipe, and also get complete overview of all his recipes. All users recipes are displayed in tabular form and can be sorted by clicking on the column header. Only for sorting by rating, costum logic is used as data in cell for rating holds jsx (rating starts)

User profile can be edited and deleted. For user profile I used hard delete

To prevent CRUD operations from POSTMAN and similar tools, middleware is added to check if user is logged in and if user is admin. Checking of user role and signin status is done by using httponlycookie. If user has jwttoken stored in cookie user is logged in, while if jwtToken role value is admin, user is authorized to perform CRUD operations.
## Important notes

User should create following two variables in /server/.env

DATABASE=<NAME OF YOUR DATABASE>
PASSWORD=<YOUR DATABASE PASSOWRD>
USERNAME=<USERNAME USED FOR DATABASE>

User can select folder server in terminal and enter command node seed to send post request to express server and enter ten values in database. Seed will create three users:

1. user1
2. user2
3. user3

Pass: 12345678

After creating users seed will take _id of users and randomly assign one of the ten recepies to three available users (createdBy field be filled randomly with one user _id)

To show get similar functionality default value for category is lunch

To enable checking of behavior of app without data user can enter node deleteSeed and all values will be removed from database. Then user can create user with signup and test behavior of the app without available recipes.

I have also attached in zip files ten images that can be used for testing purposes (url values in seeded database will have values image1, image2, ... .jpg and images in zip folder were named like this.)

## Redux toolkit
For state management Redux toolkit is used. For fetching API data redux thunk middleware is used.

## Server and database
For server express is used and all server logic is stored in server folder.

## UI
For UI react-bootstrap library is used.


