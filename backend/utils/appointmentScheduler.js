import appointmentModel from '../models/appointmentModel.js';
import { createNotification } from '../controllers/notificationController.js';

/**
 * Automatically cancels overdue pending/unapproved appointments.
 * An appointment is considered overdue if:
 * - Status is "pending" (not yet approved)
 * - The slotDate + slotTime has passed
 * 
 * This function should be called periodically (e.g., every hour or on server startup)
 */
const cancelOverdueAppointments = async () => {
  try {
    const now = new Date();
    
    // Find all pending appointments
    const pendingAppointments = await appointmentModel.find({
      status: 'pending',
      cancelled: false,
      isCompleted: false
    });

    let cancelledCount = 0;

    for (const appointment of pendingAppointments) {
      // Parse the appointment date and time
      const [day, month, year] = appointment.slotDate.split('_').map(Number);
      const [hours, minutes] = appointment.slotTime.match(/(\d+):(\d+)/).slice(1).map(Number);
      const isPM = appointment.slotTime.toLowerCase().includes('pm');
      
      let hour24 = hours;
      if (isPM && hours !== 12) hour24 += 12;
      if (!isPM && hours === 12) hour24 = 0;
      
      const appointmentDateTime = new Date(year, month - 1, day, hour24, minutes);
      
      // Check if appointment is overdue (past the scheduled time)
      if (appointmentDateTime < now) {
        // Cancel the appointment
        await appointmentModel.findByIdAndUpdate(appointment._id, {
          cancelled: true,
          status: 'cancelled',
          cancelledBy: 'system'  // Note: May need to add 'system' to enum
        });

        // Get provider name for notification
        const providerName = appointment.providerType === 'doctor' 
          ? appointment.docData?.name 
          : appointment.hospitalData?.name;

        // Create notification for the user
        await createNotification(
          'appointment_auto_cancelled',
          'Appointment Expired',
          `Your pending appointment with ${providerName || 'the provider'} scheduled for ${appointment.slotDate.replace(/_/g, '/')} at ${appointment.slotTime} has been automatically cancelled as it was not approved in time. Please reschedule for a future date and time.`,
          {
            userId: appointment.userId,
            appointmentId: appointment._id.toString(),
            providerType: appointment.providerType,
            doctorId: appointment.docId || null,
            hospitalId: appointment.hospitalId || null
          }
        );

        cancelledCount++;
        console.log(`[Scheduler] Auto-cancelled overdue appointment ${appointment._id} for user ${appointment.userId}`);
      }
    }

    if (cancelledCount > 0) {
      console.log(`[Scheduler] Successfully cancelled ${cancelledCount} overdue pending appointments`);
    }

    return { success: true, cancelledCount };
  } catch (error) {
    console.error('[Scheduler] Error cancelling overdue appointments:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Starts the appointment scheduler
 * Runs immediately on startup, then every hour
 */
const startAppointmentScheduler = () => {
  // Run immediately on startup
  console.log('[Scheduler] Running initial overdue appointment check...');
  cancelOverdueAppointments();

  // Run every hour (3600000 ms)
  const INTERVAL_MS = 60 * 60 * 1000; // 1 hour
  
  setInterval(() => {
    console.log('[Scheduler] Running scheduled overdue appointment check...');
    cancelOverdueAppointments();
  }, INTERVAL_MS);

  console.log('[Scheduler] Appointment scheduler started (runs every hour)');
};

export { cancelOverdueAppointments, startAppointmentScheduler };
