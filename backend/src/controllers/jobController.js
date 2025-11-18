import { validationResult } from 'express-validator'
import Job from '../models/job.js'

export const createJob = async (req, res, next) => {
  try {
    // For auto-save drafts, we allow creation without all required fields
    // But for non-draft jobs, we still enforce required fields
    const isDraft = req.body.status === 'Draft'
    
    if (!isDraft) {
      // Only validate required fields for non-draft jobs
      if (!req.body.title) {
        return res.status(400).json({ message: 'Title is required for non-draft jobs' })
      }
      if (!req.body.description) {
        return res.status(400).json({ message: 'Description is required for non-draft jobs' })
      }
      if (!req.body.department) {
        return res.status(400).json({ message: 'Department is required for non-draft jobs' })
      }
      if (!req.body.category) {
        return res.status(400).json({ message: 'Category is required for non-draft jobs' })
      }
    }

    const { title, description, department, category, subcategories, requirements, qualifications, responsibilities, requiredDocuments, baseSalaryMin, baseSalaryMax, salaryPaymentFrequency, amountPerSession, modeOfPayment, paymentTerms, rateAdjustment, benefits, contractType, contractDurationMonths, workingHoursPerWeek, workingHoursStart, workingHoursEnd, workingHoursByDay, remoteWorkPolicy, location, startDate, status } = req.body

    // Handle array fields properly for create
    const processArrayField = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        return field.split(',').map(item => item.trim()).filter(item => item);
      }
      return [];
    };

    const job = new Job({
      title: title || '',
      description: description || '',
      department: department || '',
      category: category || '',
      subcategories: processArrayField(subcategories),
      requirements: processArrayField(requirements),
      qualifications: processArrayField(qualifications),
      responsibilities: processArrayField(responsibilities),
      requiredDocuments: processArrayField(requiredDocuments),
      baseSalaryMin,
      baseSalaryMax,
      salaryPaymentFrequency,
      amountPerSession,
      modeOfPayment,
      paymentTerms,
      rateAdjustment,
      benefits: processArrayField(benefits),
      contractType,
      contractDurationMonths,
      workingHoursPerWeek,
      workingHoursStart,
      workingHoursEnd,
      workingHoursByDay: workingHoursByDay || {},
      remoteWorkPolicy,
      location,
      startDate,
      status: status || 'Draft',
      createdBy: req.user.id
    })

    await job.save()
    res.status(201).json({ message: 'Job created successfully', job })
  } catch (error) {
    console.error('Error creating job:', error)
    next(error)
  }
}

export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Only admin who created the job can update it
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' })
    }

    // For auto-save updates, we allow partial updates
    // Only validate required fields if status is being changed from Draft to Active
    const isStatusChangeToActive = req.body.status === 'Active' && job.status === 'Draft'
    
    if (isStatusChangeToActive) {
      // Only validate required fields when publishing a draft
      if (!req.body.title) {
        return res.status(400).json({ message: 'Title is required for active jobs' })
      }
      if (!req.body.description) {
        return res.status(400).json({ message: 'Description is required for active jobs' })
      }
      if (!req.body.department) {
        return res.status(400).json({ message: 'Department is required for active jobs' })
      }
      if (!req.body.category) {
        return res.status(400).json({ message: 'Category is required for active jobs' })
      }
    }

    // Handle array fields properly
    const arrayFields = ['subcategories', 'requirements', 'qualifications', 'responsibilities', 'requiredDocuments', 'benefits']
    arrayFields.forEach(field => {
      if (req.body[field] !== undefined && !Array.isArray(req.body[field])) {
        // Convert comma-separated string to array if needed
        if (typeof req.body[field] === 'string') {
          req.body[field] = req.body[field].split(',').map(item => item.trim()).filter(item => item)
        } else {
          req.body[field] = [req.body[field]]
        }
      }
    })

    // Handle working hours by day structure
    if (req.body.workingHoursByDay) {
      // Ensure each day entry has the correct structure
      Object.keys(req.body.workingHoursByDay).forEach(day => {
        if (typeof req.body.workingHoursByDay[day] === 'object') {
          // Ensure required properties exist
          req.body.workingHoursByDay[day] = {
            start: req.body.workingHoursByDay[day].start || '',
            end: req.body.workingHoursByDay[day].end || '',
            payment: req.body.workingHoursByDay[day].payment || ''
          }
        }
      })
    }

    // Merge the updated fields with the existing job data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        job[key] = req.body[key]
      }
    })
    
    job.updatedAt = new Date()
    await job.save()

    res.json({ message: 'Job updated successfully', job })
  } catch (error) {
    console.error('Error updating job:', error)
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
      applications: 0, // Placeholder until we have application data
      interviews: 0    // Placeholder until we have interview data
    })
  } catch (error) {
    next(error)
  }
}