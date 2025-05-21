const { Appointment, Garage, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Bir kullanıcının tüm randevularını listele
 */
exports.getUserAppointments = async (req, res) => {
  try {
    // Kullanıcı ID'si auth middleware'den gelmeli
    const userId = req.user.id;

    const appointments = await Appointment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Garage,
          as: 'garage',
          attributes: ['id', 'name', 'address', 'city', 'district']
        }
      ],
      order: [['appointment_date', 'DESC'], ['appointment_time', 'ASC']]
    });

    // Format the appointments for the response
    const formattedAppointments = appointments.map(appointment => {
      const appointmentJson = appointment.toJSON();
      return {
        id: appointmentJson.id,
        garageId: appointmentJson.garage_id,
        garageName: appointmentJson.garage.name,
        userId: appointmentJson.user_id,
        serviceType: appointmentJson.service_type,
        date: appointmentJson.appointment_date,
        time: appointmentJson.appointment_time,
        status: appointmentJson.status,
        address: `${appointmentJson.garage.address}, ${appointmentJson.garage.district}, ${appointmentJson.garage.city}`,
        notes: appointmentJson.notes,
        createdAt: appointmentJson.created_at,
        updatedAt: appointmentJson.updated_at
      };
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ 
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

/**
 * Bir garajın tüm randevularını listele (garaj sahipleri için)
 */
exports.getGarageAppointments = async (req, res) => {
  try {
    const { garageId } = req.params;
    
    // Garaj sahibi olduğundan emin ol
    const garage = await Garage.findOne({
      where: { 
        id: garageId,
        user_id: req.user.id
      }
    });
    
    if (!garage && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to view these appointments' });
    }

    const appointments = await Appointment.findAll({
      where: { garage_id: garageId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['appointment_date', 'DESC'], ['appointment_time', 'ASC']]
    });

    // Format the appointments for the response
    const formattedAppointments = appointments.map(appointment => {
      const appointmentJson = appointment.toJSON();
      return {
        id: appointmentJson.id,
        garageId: appointmentJson.garage_id,
        userId: appointmentJson.user_id,
        userName: appointmentJson.user.username,
        userEmail: appointmentJson.user.email,
        serviceType: appointmentJson.service_type,
        date: appointmentJson.appointment_date,
        time: appointmentJson.appointment_time,
        status: appointmentJson.status,
        notes: appointmentJson.notes,
        createdAt: appointmentJson.created_at,
        updatedAt: appointmentJson.updated_at
      };
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching garage appointments:', error);
    res.status(500).json({ 
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

/**
 * Tek bir randevu detayını getir
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Garage,
          as: 'garage',
          attributes: ['id', 'name', 'address', 'city', 'district', 'phone']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Erişim kontrolü
    if (
      appointment.user_id !== req.user.id && // Kullanıcının kendi randevusu değilse
      appointment.garage.user_id !== req.user.id && // Garaj sahibi değilse
      req.user.role !== 'admin' // Admin değilse
    ) {
      return res.status(403).json({ message: 'You do not have permission to view this appointment' });
    }
    
    // Format the appointment for the response
    const appointmentJson = appointment.toJSON();
    const formattedAppointment = {
      id: appointmentJson.id,
      garageId: appointmentJson.garage_id,
      garageName: appointmentJson.garage.name,
      garageAddress: `${appointmentJson.garage.address}, ${appointmentJson.garage.district}, ${appointmentJson.garage.city}`,
      garagePhone: appointmentJson.garage.phone,
      userId: appointmentJson.user_id,
      userName: appointmentJson.user.username,
      userEmail: appointmentJson.user.email,
      serviceType: appointmentJson.service_type,
      date: appointmentJson.appointment_date,
      time: appointmentJson.appointment_time,
      status: appointmentJson.status,
      notes: appointmentJson.notes,
      createdAt: appointmentJson.created_at,
      updatedAt: appointmentJson.updated_at
    };
    
    res.status(200).json(formattedAppointment);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch appointment details',
      error: error.message
    });
  }
};

/**
 * Yeni randevu oluştur
 */
exports.createAppointment = async (req, res) => {
  try {
    const { garageId, serviceType, date, time, notes } = req.body;
    const userId = req.user.id;
    
    // Garajın var olduğunu kontrol et
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Seçilen tarih ve saat için çakışan randevu var mı kontrol et
    const existingAppointment = await Appointment.findOne({
      where: {
        garage_id: garageId,
        appointment_date: date,
        appointment_time: time,
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    // Yeni randevu oluştur
    const appointment = await Appointment.create({
      garage_id: garageId,
      user_id: userId,
      service_type: serviceType,
      appointment_date: date,
      appointment_time: time,
      status: 'pending',
      notes: notes || null
    });
    
    // Format the appointment for the response
    const formattedAppointment = {
      id: appointment.id,
      garageId: appointment.garage_id,
      userId: appointment.user_id,
      serviceType: appointment.service_type,
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at
    };
    
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: formattedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

/**
 * Randevu güncelle (tarih, saat, durum)
 */
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time, notes } = req.body;
    
    // Randevuyu bul
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Garage,
          as: 'garage',
          attributes: ['user_id']
        }
      ]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Erişim kontrolü
    const isOwner = appointment.user_id === req.user.id;
    const isGarageOwner = appointment.garage.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isGarageOwner && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to update this appointment' });
    }
    
    // Kullanıcılar sadece iptal edebilir, garaj sahipleri durumu değiştirebilir
    if (status && !isGarageOwner && !isAdmin && status !== 'cancelled') {
      return res.status(403).json({ message: 'You do not have permission to change status other than cancelling' });
    }
    
    // Tarih ve saat değişikliği için çakışma kontrolü
    if ((date && date !== appointment.appointment_date) || (time && time !== appointment.appointment_time)) {
      if (!isGarageOwner && !isAdmin) {
        return res.status(403).json({ message: 'Only garage owners or admins can change appointment time' });
      }
      
      const existingAppointment = await Appointment.findOne({
        where: {
          id: { [Op.ne]: id }, // Kendi dışındaki randevular
          garage_id: appointment.garage_id,
          appointment_date: date || appointment.appointment_date,
          appointment_time: time || appointment.appointment_time,
          status: {
            [Op.notIn]: ['cancelled']
          }
        }
      });
      
      if (existingAppointment) {
        return res.status(400).json({ message: 'This time slot is already booked' });
      }
    }
    
    // Güncellenecek alanları belirle
    const updateData = {};
    if (status) updateData.status = status;
    if (date) updateData.appointment_date = date;
    if (time) updateData.appointment_time = time;
    if (notes !== undefined) updateData.notes = notes;
    
    // Randevuyu güncelle
    await appointment.update(updateData);
    
    // Güncel halini getir
    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Garage,
          as: 'garage',
          attributes: ['id', 'name', 'address', 'city', 'district']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    
    // Format the appointment for the response
    const appointmentJson = updatedAppointment.toJSON();
    const formattedAppointment = {
      id: appointmentJson.id,
      garageId: appointmentJson.garage_id,
      garageName: appointmentJson.garage.name,
      userId: appointmentJson.user_id,
      userName: appointmentJson.user.username,
      serviceType: appointmentJson.service_type,
      date: appointmentJson.appointment_date,
      time: appointmentJson.appointment_time,
      status: appointmentJson.status,
      notes: appointmentJson.notes,
      createdAt: appointmentJson.created_at,
      updatedAt: appointmentJson.updated_at
    };
    
    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment: formattedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

/**
 * Randevu iptal et (kısayol)
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Randevuyu bul
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Erişim kontrolü
    if (appointment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to cancel this appointment' });
    }
    
    // Tamamlanmış randevular iptal edilemez
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Completed appointments cannot be cancelled' });
    }
    
    // Randevuyu iptal et
    await appointment.update({ status: 'cancelled' });
    
    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment: {
        id: appointment.id,
        status: 'cancelled'
      }
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ 
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

/**
 * Bir garaj için belirli bir gündeki müsait saatleri getir
 */
exports.getAvailableTimes = async (req, res) => {
  try {
    const { garageId, date } = req.query;
    
    if (!garageId || !date) {
      return res.status(400).json({ message: 'Both garageId and date are required' });
    }
    
    // Garajın var olduğunu kontrol et
    const garage = await Garage.findByPk(garageId, {
      include: [
        {
          model: WorkingHours,
          as: 'working_hours'
        }
      ]
    });
    
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Seçilen gün için çalışma saatlerini kontrol et
    const dayOfWeek = new Date(date).getDay(); // 0: Pazar, 1: Pazartesi, ...
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    const workingHours = garage.working_hours;
    if (!workingHours || !workingHours[`${dayName}_open`]) {
      return res.status(200).json([]); // Bu gün garaj kapalı
    }
    
    // Garajın o gün için çalışma saatlerini al
    const openTime = workingHours[`${dayName}_open`];
    const closeTime = workingHours[`${dayName}_close`];
    
    if (!openTime || !closeTime) {
      return res.status(200).json([]); // Bu gün için saat bilgisi yok
    }
    
    // Saat dilimlerini oluştur (1 saatlik aralıklarla)
    const timeSlots = [];
    let currentHour = parseInt(openTime.split(':')[0]);
    const closingHour = parseInt(closeTime.split(':')[0]);
    
    while (currentHour < closingHour) {
      timeSlots.push(`${currentHour.toString().padStart(2, '0')}:00`);
      currentHour++;
    }
    
    // O gün ve garaj için mevcut randevuları getir
    const bookedAppointments = await Appointment.findAll({
      where: {
        garage_id: garageId,
        appointment_date: date,
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: ['appointment_time']
    });
    
    // Dolu saatleri çıkar
    const bookedTimes = bookedAppointments.map(apt => apt.appointment_time);
    const availableTimes = timeSlots.filter(time => !bookedTimes.includes(time));
    
    res.status(200).json(availableTimes);
  } catch (error) {
    console.error('Error fetching available times:', error);
    res.status(500).json({ 
      message: 'Failed to fetch available times',
      error: error.message
    });
  }
}; 