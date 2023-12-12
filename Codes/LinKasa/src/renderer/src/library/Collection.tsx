import { collection } from 'firebase/firestore'
import { db } from '../config/firebase'

export const userCollection = collection(db, 'Users');
export const lostAndFoundCollection = collection(db, 'LostAndFound');
export const flightScheduleCollection = collection(db, 'FlightSchedule');
export const budgetCollection = collection(db, 'Budget');
export const maintenanceScheduleCollection = collection(db, 'MaintenanceSchedule');
export const taskCollection = collection(db, 'Task');
export const vacancyCollection = collection(db, 'Vacancy');
export const applicantCollection = collection(db, 'Applicant');
export const trainingCollection = collection(db, 'Training');
export const messageCollection = collection(db, 'Messages');
export const crewCollection = collection(db, 'Crew');
export const boardingPassCollection = collection(db, 'BoardingPass');
