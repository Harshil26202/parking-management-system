const controller = require('../controllers/admin.controller.js');

module.exports = function(app) {
  app.get('/admin/home', controller.displayDashboard);

  app.get('/admin/get-chart', controller.displayChart);

  app.post('/admin/profile', controller.getProfile);

  app.get('/search', controller.getOwners);

  app.post('/admin/search/search-by-vehicle-no', controller.getOwnerByType);

  app.post('/admin/search/search-by-owner-id', controller.getOwnerByType);

  app.post('/admin/search/search-by-block-no', controller.getOwnerByType);

  app.post('/admin/search/search-by-owner-name', controller.getOwnerByType);

  app.get('/admin/map', controller.getMap);

  app.post('/get-vehicle-by-id', controller.getVehicles);

  app.post('/update-profile', controller.updateProfile);

  app.delete('/admin/delete-owner', controller.deleteOwner);

  app.get('/admin/pending-owner', controller.getPendingOwner);

  app.post('/admin/approve-owner', controller.approveOwner);

  app.post('/admin/reject-owner', controller.rejectOwner);

  app.post('/get-notifications', controller.getNotifications);

  app.post('/change-notification-status', controller.changeNotificationStatus);

  app.post('/clear-notification', controller.clearNotifications);

  app.get('/admin/pending-vehicle', controller.getPendingVehicle);

  app.post('/admin/approve-vehicle', controller.approveVehicle);

  app.post('/admin/reject-vehicle', controller.rejectVehicle);

  app.get('/admin/pending-wrong-parking', controller.getWrongParking);

  app.post('/admin/approve-wrong-parking', controller.approveWrongParking);

  app.post('/admin/reject-wrong-parking', controller.rejectWrongParking);

  app.get('/admin/pending-penalties', controller.getPenalties);

  app.post('/admin/approve-penalty', controller.approvePenalty);

  app.post('/admin/reject-penalty', controller.rejectPenalty);

  app.get('/get-slots', controller.getSlots);

  app.get('/get-vehicle-parking-slots', controller.getVehicleSlots);

  app.post('/admin/request/add-owner', controller.addOwner);

  app.get('/admin/request/update-owner', controller.updateOwner);

  app.post('/delete-vehicle', controller.deleteVehicle);

  app.get('/admin/request/wrong-parking', controller.wrongParkingApprovement);

  app.get('/admin/get-guest-parking', controller.getGuestParking);

  app.post('/admin/reject-guest-parking', controller.rejectGuestParking);

  app.post('/admin/approve-guest-parking', controller.approveGuestParking);

  app.get('/admin/request/penalties', controller.penaltiesApprovement);
};
