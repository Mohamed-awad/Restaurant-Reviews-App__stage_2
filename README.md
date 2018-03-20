# Restaurant Reviews App Stage 2


---

## Project Overview: Stage 2

 For the **Restaurant Reviews** project, I convert a static webpage to a mobile-ready web application. I am take a static design that lacks accessibility and I convert the design to be responsive on different sized displays and accessible for screen reader use. I also add a service worker to begin the process of creating a seamless offline experience for your users.
 The webiste retrieves data about restaurants from a server. The restaurants' data contain rating information about restaurants. The data main structure and images of the website is persisted in `cache` using a `service worker` and the restaurant information/list is stored in `indexedDB` to achieve a good Offline first experience. Furthermore, the design is responsive, to adjust properly in most/all screen displays. And finally, optimizations have been done based on results from `lighthouse` to ensure high score of accessibility, Optimization and Progressive Web App.


you can do the following in this project :-

* you can filter some resturants according to some features
* see the review of each restaurant
* see the address of the resturant
* see the Work schedule in the restaurant weekly
* if you are blind no problem, you can access the website via google chrome extention chromeVox

In this Project I used:-

* Service-Worker to make the website work offline
* Aria roles to get the website accessabile to blind people
* Google map application to mark all needed restaurants on it
* Indexed DataBase to store date retrived from the server
# Install

you need to install :-

* python2 or python3 on your computer
* webbrowser on your pc


### How to run the project

1- open project directory on terminal
2- install node modules by run this `npm i`
3- install sails global by run this `sudo npm i sails -g`
4- run your backend-server by run `node server`
5- open another terminal on the same directory of project
6- in the new terminal run client-side server `python3 -m http.server 8000`

To see the data in the backend-server open <http://localhost:1337/restaurants>

To see the project in the client-server open <http://localhost:8000>

# That's it Cool