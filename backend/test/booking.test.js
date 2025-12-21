import { jest } from '@jest/globals';

// Use unstable_mockModule + top-level await to mock native ESM modules
jest.unstable_mockModule('../models/doctorModel.js', () => ({
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn()
  }
}));

jest.unstable_mockModule('../models/hospitalModel.js', () => ({
  default: {
    findById: jest.fn()
  }
}));

jest.unstable_mockModule('../models/appointmentModel.js', () => ({
  default: (() => {
    const Appointment = function (data) {
      this.save = jest.fn().mockResolvedValue({});
    };
    Appointment.findById = jest.fn();
    Appointment.findByIdAndDelete = jest.fn();
    Appointment.findByIdAndUpdate = jest.fn();
    Appointment.create = jest.fn();
    return Appointment;
  })()
}));

jest.unstable_mockModule('../models/userModel.js', () => ({
  default: {
    findById: jest.fn()
  }
}));

// Import the mocked modules and controller after mocks are registered
const { default: doctorModel } = await import('../models/doctorModel.js');
const { default: hospitalModel } = await import('../models/hospitalModel.js');
const { default: appointmentModel } = await import('../models/appointmentModel.js');
const { default: userModel } = await import('../models/userModel.js');

const { bookAppointment, cancelAppointment } = await import('../controllers/userController.js');
describe('Booking Flow', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        docId: 'doctor123',
        hospitalId: 'hospital123',
        slotDate: '2025-11-01',
        slotTime: '10:00',
        sDate: '2025-11-01',
        sTime: '10:00'
      },
      userId: 'user123'
    };

    mockRes = {
      json: jest.fn()
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  test('successful booking when doctor and slot available', async () => {
    const mockDoctor = {
      _id: 'doctor123',
      available: true,
      slots_booked: {}
    };

    const mockHospital = {
      _id: 'hospital123',
      available: true
    };

    const mockUser = {
      _id: 'user123',
      name: 'Test User'
    };

  // doctorModel.findById(...).select(...) chain used in controller — return object with select()
  doctorModel.findById.mockImplementationOnce(() => ({ select: () => Promise.resolve(mockDoctor) }));
  hospitalModel.findById.mockImplementationOnce(() => ({ select: () => Promise.resolve(mockHospital) }));
  userModel.findById.mockImplementationOnce(() => ({ select: () => Promise.resolve(mockUser) }));
  // Ensure constructor save returns resolved promise
  appointmentModel.prototype.save = jest.fn().mockResolvedValue({});

    await bookAppointment(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Appointment booked'
    });
  });

  test('fails when doctor not available', async () => {
    const mockDoctor = {
      _id: 'doctor123',
      available: false
    };

  doctorModel.findById.mockImplementationOnce(() => ({ select: () => Promise.resolve(mockDoctor) }));

    await bookAppointment(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Doctor not available'
    });
  });

  test('fails when slot already booked', async () => {
    const mockDoctor = {
      _id: 'doctor123',
      available: true,
      slots_booked: {
        '2025-11-01': ['10:00']
      }
    };

  doctorModel.findById.mockImplementationOnce(() => ({ select: () => Promise.resolve(mockDoctor) }));

    await bookAppointment(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Slot not available'
    });
  });
});

describe('Cancel Flow', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        appointmentId: 'appointment123'
      },
      userId: 'user123'
    };

    mockRes = {
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('successful cancellation', async () => {
    const mockAppointment = {
      _id: 'appointment123',
      userId: 'user123',
      docId: 'doctor123',
      slotDate: '2025-11-01',
      slotTime: '10:00'
    };

    const mockDoctor = {
      slots_booked: {
        '2025-11-01': ['10:00']
      }
    };

    appointmentModel.findById.mockResolvedValue(mockAppointment);
    doctorModel.findById.mockResolvedValue(mockDoctor);
    appointmentModel.findByIdAndUpdate.mockResolvedValue({});
    doctorModel.findByIdAndUpdate.mockResolvedValue({});

    await cancelAppointment(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Appointment cancelled'
    });
  });

  test('fails when trying to cancel another user appointment', async () => {
    const mockAppointment = {
      _id: 'appointment123',
      userId: 'otherUser123',
      docId: 'doctor123'
    };

    appointmentModel.findById.mockResolvedValue(mockAppointment);

    await cancelAppointment(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized action'
    });
  });
});