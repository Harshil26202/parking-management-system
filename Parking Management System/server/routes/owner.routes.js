const controller = require('../controllers/owner.controller.js');

module.exports = function(app) {
  app.get('/owner/home', controller.getTotalVehicles);

  app.post('/owner/edit-profile', controller.getProfile);

  app.post(
      '/owner/complain-for-wrong-parking',
      controller.complainForWrongParking,
  );

  app.get('/owner/search', controller.getOwners);

  app.get('/owner/search/search-by-vehicle-no', controller.getOwnerByType);

  app.get('/owner/search/search-by-owner-id', controller.getOwnerByType);

  app.get('/owner/search/search-by-block-no', controller.getOwnerByType);

  app.get('/owner/search/search-by-owner-name', controller.getOwnerByType);

  app.get('/owner/map', controller.getMap);

  app.post('/owner/update-profile', controller.updateProfile);

  app.post('/add-vehicle', controller.addVehicleRequest);

  app.delete('/owner/request/delete-vehicle', controller.deleteVehicle);

  app.post('/owner/guest-parking-request', controller.guestParkingRequest);

  // app.post("/owner/request/resolve-penalty", controller.resolvePenalties);

  app.post('/owner/request/resolve-wrong-parking', controller.getWrongParking);

  app.post('/owner/request/get-penalties', controller.getPenalties);

  app.post('/owner/resolve-parking', controller.resolveWrongParking);

  app.post('/owner/resolve-penalty', controller.resolvePenalty);

  app.post('/edit-vehicle', controller.updateVehicle);
};
