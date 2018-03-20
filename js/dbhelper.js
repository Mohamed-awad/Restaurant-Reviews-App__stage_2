//import * as idb from '../node_modules/idb';
/**
 * Common database helper functions.
 */
//const idb = require('idb');
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  // using indexed db
  static initIndexedDB() {
    this.dbPromise = idb.open('restaurant-db', 1, function (upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
        case 1:
          const restaurantStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
          });
          restaurantStore.createIndex('photographs', 'photograph');
      }
    });
  }

  //Fetch restaurants from indexed database
  static fetchRestaurantsFromIndexedDb() {
    return this.dbPromise.then(function (db) {
      var tx = db.transaction('restaurants');
      var restaurantsStore = tx.objectStore('restaurants');
      return restaurantsStore.getAll();
    })
  }
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    var self = this;
    DBHelper.fetchRestaurantsFromIndexedDb().then((restaurants) => {
      callback(null, restaurants);
    });

    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const restaurants = JSON.parse(xhr.responseText);
        restaurants.map(function (restaurant) {
          self.dbPromise.then(function (db) {
            var tx = db.transaction('restaurants', 'readwrite');
            var restaurantStore = tx.objectStore('restaurants');
            return restaurantStore.put(restaurant);
          });
          return restaurant;
        });
        callback(null, restaurants);
      } else {
        // Oops!. Got an error from server.
        this.dbPromise.then(() => {
          return DBHelper.fetchRestaurantsFromIndexedDb()
        }).then(function (restaurants) {
          callback(null, restaurants);
        }).catch(function () {
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        });
      }
    };
    xhr.onerror = function () {
      DBHelper.fetchRestaurantsFromIndexedDb().then((restaurants) => {
        callback(null, restaurants);
      });
    }
    xhr.send();
  }

  // Fetch restaurant by Id from indecedDB
  static fetchRestaurantFromIndexedDb(id) {
    return this.dbPromise.then(function (db) {
      var tx = db.transaction('restaurants');
      var restaurantsStore = tx.objectStore('restaurants');
      return restaurantsStore.get(parseInt(id));
    })
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    var self = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL + '/' + id);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const restaurant = JSON.parse(xhr.responseText);
        //console.log(self.dbPromise);
        //console.log(typeof dbPromise);
        self.dbPromise.then(function (db) {
          var tx = db.transaction('restaurants', 'readwrite');
          var restaurantStore = tx.objectStore('restaurants');
          return restaurantStore.put(restaurant);
        })
        callback(null, restaurant);
      } else {
        // Oops!. Got an error from server.
        this.dbPromise.then(() => {
          return DBHelper.fetchRestaurantFromIndexedDb(id)
        }).then(function (restaurant) {
          callback(null, restaurant);
        }).catch(function () {
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        });
      }
    };
    xhr.onerror = function () {
      DBHelper.fetchRestaurantFromIndexedDb(id).then(function (restaurant) {
        callback(null, restaurant);
      });
    }
    xhr.send();
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if(restaurant.photograph === undefined) {
      return (`/img/1.webp`);
    }
    return (`/img/${restaurant.photograph}.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }
}

