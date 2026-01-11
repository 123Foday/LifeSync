import express from 'express'
import { addDoctor, addHospital, loginAdmin, allDoctors, allHospitals, appointmentsAdmin, appointmentCancel, adminDashboard, allUsers } from '../controllers/adminController.js'
import { changeHospitalAvailability } from '../controllers/hospitalController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'
import { loginLimiter } from '../middlewares/rateLimiter.js'


const adminRouter = express.Router()
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginLimiter, loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/all-hospitals', authAdmin, allHospitals)
adminRouter.post('/all-users', authAdmin, allUsers)
adminRouter.post('/add-hospital', authAdmin, upload.single('image'), addHospital)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.post('/change-hospital-availability', authAdmin, changeHospitalAvailability)

adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter