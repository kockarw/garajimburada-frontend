const router = require('express').Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate, isAdmin, isAdminOrGarageOwner } = require('../middleware/auth.middleware');

// Tüm route'lar için kimlik doğrulaması gerekli
router.use(authenticate);

// Kullanıcının kendi randevularını getir
router.get('/user', appointmentController.getUserAppointments);

// Bir garajın tüm randevularını getir (garaj sahibi veya admin için)
router.get('/garage/:garageId', isAdminOrGarageOwner, appointmentController.getGarageAppointments);

// Tek bir randevu detayını getir
router.get('/:id', appointmentController.getAppointmentById);

// Yeni randevu oluştur
router.post('/', appointmentController.createAppointment);

// Randevu güncelle
router.put('/:id', appointmentController.updateAppointment);

// Randevu iptal et (kısayol olarak)
router.patch('/:id/cancel', appointmentController.cancelAppointment);

// Bir garaj için belirli bir gündeki müsait saatleri getir
router.get('/available-times', appointmentController.getAvailableTimes);

module.exports = router; 