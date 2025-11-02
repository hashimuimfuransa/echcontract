import { validationResult } from 'express-validator'
import Employee from '../models/employee.js'
import Contract from '../models/contract.js'
import { sendEmail } from '../utils/sendEmail.js'
import { contractApprovedTemplate, contractRejectedTemplate } from '../utils/emailTemplates.js'

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments()
    const activeEmployees = await Employee.countDocuments({ status: 'active' })
    const totalContracts = await Contract.countDocuments()
    const pendingContracts = await Contract.countDocuments({ status: 'Under Review' })
    const approvedContracts = await Contract.countDocuments({ status: 'Approved' })
    const rejectedContracts = await Contract.countDocuments({ status: 'Rejected' })

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      totalContracts,
      pendingContracts,
      approvedContracts,
      rejectedContracts
    })
  } catch (error) {
    next(error)
  }
}

export const listEmployees = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = status ? { status } : {}
    const employees = await Employee.find(query)
      .select('name email position status verified createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Employee.countDocuments(query)

    res.json({
      employees,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    next(error)
  }
}

export const getContractDetails = async (req, res, next) => {
  try {
    const { contractId } = req.params
    const contract = await Contract.findById(contractId).populate('employee', 'name email position status documents')

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' })
    }

    res.json({ contract })
  } catch (error) {
    next(error)
  }
}

export const editContract = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { contractId } = req.params
    const { formData, notes } = req.body

    const contract = await Contract.findById(contractId).populate('employee', 'name email')
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' })
    }

    contract.formData = formData
    contract.history.push({
      status: contract.status,
      changedBy: req.user.id,
      note: notes || 'Contract details edited by admin'
    })
    await contract.save()

    res.json({ message: 'Contract updated successfully', contract })
  } catch (error) {
    next(error)
  }
}

export const reviewContract = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { contractId } = req.params
    const { status, notes } = req.body

    const contract = await Contract.findById(contractId).populate('employee', 'name email')
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' })
    }

    contract.status = status
    contract.history.push({
      status,
      changedBy: req.user.id,
      note: notes || `Contract ${status.toLowerCase()} by admin`
    })
    await contract.save()

    const portalLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/contracts`
    
    if (status === 'Approved') {
      await sendEmail({
        to: contract.employee.email,
        subject: 'Contract Approved ✓',
        html: contractApprovedTemplate(contract.employee.name, portalLink),
        text: 'Your employment contract has been approved. You can now download your contract.'
      })
    } else if (status === 'Rejected') {
      await sendEmail({
        to: contract.employee.email,
        subject: 'Contract Update Required ⚠️',
        html: contractRejectedTemplate(contract.employee.name, notes || 'Please review and update your contract', portalLink),
        text: `Your employment contract has been rejected. Reason: ${notes || 'Please review and update your contract'}`
      })
    }

    res.json({ message: `Contract ${status.toLowerCase()} successfully`, contract })
  } catch (error) {
    next(error)
  }
}

export const approveContract = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { contractId } = req.params
    const { notes } = req.body

    const contract = await Contract.findById(contractId).populate('employee', 'name email')
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' })
    }

    contract.status = 'Approved'
    contract.approvedAt = new Date()
    contract.approvedBy = req.user.id
    contract.history.push({
      status: 'Approved',
      changedBy: req.user.id,
      note: notes || 'Contract approved by admin'
    })
    await contract.save()

    const portalLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/contracts`
    await sendEmail({
      to: contract.employee.email,
      subject: 'Contract Approved ✓',
      html: contractApprovedTemplate(contract.employee.name, portalLink),
      text: 'Your employment contract has been approved. You can now download your contract.'
    })

    res.json({ message: 'Contract approved successfully', contract })
  } catch (error) {
    next(error)
  }
}

export const rejectContract = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { contractId } = req.params
    const { reason } = req.body

    const contract = await Contract.findById(contractId).populate('employee', 'name email')
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' })
    }

    contract.status = 'Rejected'
    contract.history.push({
      status: 'Rejected',
      changedBy: req.user.id,
      note: `Contract rejected: ${reason}`
    })
    await contract.save()

    const portalLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/contracts`
    await sendEmail({
      to: contract.employee.email,
      subject: 'Contract Update Required ⚠️',
      html: contractRejectedTemplate(contract.employee.name, reason, portalLink),
      text: `Your employment contract has been rejected. Reason: ${reason}`
    })

    res.json({ message: 'Contract rejected successfully', contract })
  } catch (error) {
    next(error)
  }
}

export const updateEmployeeStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { employeeId } = req.params
    const { status } = req.body

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { status },
      { new: true }
    ).select('name email position status')

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res.json({ message: `Employee status updated to ${status}`, employee })
  } catch (error) {
    next(error)
  }
}

export const listContracts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = status ? { status } : {}
    const contracts = await Contract.find(query)
      .populate('employee', 'name email position')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Contract.countDocuments(query)

    res.json({
      contracts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    next(error)
  }
}
