import { validationResult } from 'express-validator'
import Job from '../models/job.js'

export const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, department, category, subcategories, requirements, qualifications, responsibilities, requiredDocuments, baseSalaryMin, baseSalaryMax, salaryPaymentFrequency, amountPerSession, modeOfPayment, paymentTerms, rateAdjustment, benefits, contractType, contractDurationMonths, workingHoursPerWeek, workingHoursStart, workingHoursEnd, workingHoursByDay, remoteWorkPolicy, location, startDate, status } = req.body

    const job = new Job({
      title,
      description,
      department,
      category,
      subcategories: subcategories || [],
      requirements: requirements || [],
      qualifications: qualifications || [],
      responsibilities: responsibilities || [],
      requiredDocuments: requiredDocuments || [],
      baseSalaryMin,
      baseSalaryMax,
      salaryPaymentFrequency,
      amountPerSession,
      modeOfPayment,
      paymentTerms,
      rateAdjustment,
      benefits: benefits || [],
      contractType,
      contractDurationMonths,
      workingHoursPerWeek,
      workingHoursStart,
      workingHoursEnd,
      workingHoursByDay: workingHoursByDay || {},
      remoteWorkPolicy,
      location,
      startDate,
      status,
      createdBy: req.user.id
    })

    await job.save()
    res.status(201).json({ message: 'Job created successfully', job })
  } catch (error) {
    next(error)
  }
}

export const updateJob = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { jobId } = req.params
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Only admin who created the job can update it
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' })
    }

    Object.assign(job, req.body)
    job.updatedAt = new Date()
    await job.save()

    res.json({ message: 'Job updated successfully', job })
  } catch (error) {
    next(error)
  }
}

export const getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId).populate('createdBy', 'name email')

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.json({ job })
  } catch (error) {
    next(error)
  }
}

export const listActiveJobs = async (req, res, next) => {
  try {
    const { category, department, page = 1, limit = 20, search } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = { status: 'Active' }

    if (category) query.category = category
    if (department) query.department = department
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    next(error)
  }
}

export const listAllJobs = async (req, res, next) => {
  try {
    const { status, category, department, page = 1, limit = 20, search } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = {}

    if (status) query.status = status
    if (category) query.category = category
    if (department) query.department = department
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Only admin who created the job can delete it
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' })
    }

    await Job.findByIdAndDelete(jobId)
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getJobStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments()
    const activeJobs = await Job.countDocuments({ status: 'Active' })
    const draftJobs = await Job.countDocuments({ status: 'Draft' })
    const closedJobs = await Job.countDocuments({ status: 'Closed' })

    res.json({
      totalJobs,
      activeJobs,
      draftJobs,
      closedJobs
    })
  } catch (error) {
    next(error)
  }
}