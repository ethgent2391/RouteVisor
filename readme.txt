# RouteVisor

In this group project, we solved the need for a web application that splits a long driving trip into shorter legs in miles as defined by the user. We solved this issue with a collaborative effort, combining our knowledge of html, css, bootstrap, javascript, jquery and apis to create a dynamic functioning app. It utilizes the google maps api, open weather api and heroku as well as the languages previously mentioned.

The application displays a route from user-defined locations and as user types, it suggests places matching their input using pieces of the google places api and its autocomplete fuction. Users should also enter the maximum distance in miles they want to travel in one stretch. The application then plots stopping points along route based on user input and lodging around each point. When the user clicks a lodging point, it gives a brief overview, displaying a photo, the address, and hotel rating. Finally, written directions are displayed below the map.


## live demo

https://group3tripplanner.herokuapp.com/




- - -


### Git notes for commiting changes
// we have a branch that we are ready to push to the repo
// in a branch called your-branch
git checkout master
git pull
git checkout your-branch
git pull origin master
	resolve any conflicts in Visual Studio Code
git add -A
git commit -m “comment”
git push
	set upstream if needed  by copying line from bash

go to github
compare and pull request
create pull request
another group member reviews and approves changes
merge branch
