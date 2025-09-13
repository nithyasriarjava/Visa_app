import fs from 'fs'
import path from 'path'

const DATA_DIR = './data'
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json')

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]))
}

if (!fs.existsSync(APPLICATIONS_FILE)) {
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([]))
}

// Helper functions
const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// User operations
export const getUsers = () => readFile(USERS_FILE)

export const saveUser = (user) => {
  const users = getUsers()
  users.push({ ...user, _id: Date.now().toString(), createdAt: new Date() })
  writeFile(USERS_FILE, users)
  return users[users.length - 1]
}

export const findUserByEmail = (email) => {
  const users = getUsers()
  return users.find(user => user.email === email)
}

export const findUserById = (id) => {
  const users = getUsers()
  return users.find(user => user._id === id)
}

// Application operations
export const getApplications = () => readFile(APPLICATIONS_FILE)

export const saveApplication = (application) => {
  const applications = getApplications()
  const existingIndex = applications.findIndex(app => app.userId === application.userId)
  
  if (existingIndex !== -1) {
    applications[existingIndex] = { ...application, updatedAt: new Date() }
    writeFile(APPLICATIONS_FILE, applications)
    return applications[existingIndex]
  } else {
    const newApp = { ...application, _id: Date.now().toString(), createdAt: new Date() }
    applications.push(newApp)
    writeFile(APPLICATIONS_FILE, applications)
    return newApp
  }
}

export const findApplicationByUserId = (userId) => {
  const applications = getApplications()
  return applications.find(app => app.userId === userId)
}