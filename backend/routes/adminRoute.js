import express from 'express'
import { addDoctor, addHospital, loginAdmin, allDoctors, allHospitals, appointmentsAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js'
import { changeHospitalAvailability } from '../controllers/hospitalController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'


const adminRouter = express.Router()
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/all-hospitals', authAdmin, allHospitals)
adminRouter.post('/add-hospital', authAdmin, upload.single('image'), addHospital)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.post('/change-hospital-availability', authAdmin, changeHospitalAvailability)

adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter