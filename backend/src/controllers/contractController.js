import Contract from '../models/contract.js'
import Employee from '../models/employee.js'
import contractTemplate from '../utils/contractTemplate.js'
import { generateContractPdf } from '../utils/pdfGenerator.js'
import { v2 as cloudinary } from 'cloudinary'

export const getMyContract = async (req, res, next) => {
  try {
    const contract = await Contract.findOne({ employee: req.user.id }).populate('employee', 'name email position status')
    res.json({ contract, template: contractTemplate })
  } catch (error) {
    next(error)
  }
}

export const submitContract = async (req, res, next) => {
  try {
    const { formData } = req.body
    const employeeId = req.user.id
    const contract = await Contract.findOne({ employee: employeeId })
    if (!contract) {
      const created = await Contract.create({
        employee: employeeId,
        formData,
        status: 'Under Review',
        history: [{ status: 'Draft', changedBy: employeeId }, { status: 'Under Review', changedBy: employeeId }]
      })
      return res.status(201).json({ message: 'Contract submitted for review', contract: created })
    }
    contract.formData = formData
    contract.status = 'Under Review'
    contract.history.push({ status: 'Under Review', changedBy: employeeId, note: 'Employee updated contract' })
    await contract.save()
    res.json({ message: 'Contract updated and submitted for review', contract })
  } catch (error) {
    next(error)
  }
}

export const uploadDocuments = async (req, res, next) => {
  try {
    console.log('Upload request received')
    console.log('Files:', req.files)
    console.log('User:', req.user)

    if (!req.files || !req.files.length) {
      console.log('No files found in request')
      return res.status(400).json({ message: 'No files uploaded' })
    }

    const employee = await Employee.findById(req.user.id)
    if (!employee) {
      console.log('Employee not found:', req.user.id)
      return res.status(404).json({ message: 'Employee not found' })
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    console.log('Processing', req.files.length, 'files')
    const uploaded = []
    for (const file of req.files) {
      console.log('Uploading file:', file.originalname, 'Size:', file.size)
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: 'excellence-contracts',
        resource_type: 'auto',
        public_id: `${Date.now()}-${file.originalname}`,
        timeout: 120000 // 2 minutes
      })
      uploaded.push({ label: file.originalname, url: result.secure_url })
    }

    employee.documents.push(...uploaded)
    await employee.save()
    console.log('Documents saved successfully')
    res.json({ message: 'Documents uploaded successfully', documents: employee.documents })
  } catch (error) {
    console.error('Upload error:', error)
    next(error)
  }
}

export const downloadContractPdf = async (req, res, next) => {
  try {
    const { contractId } = req.params
    const contract = await Contract.findById(contractId).populate('employee')
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' })
    }
    if (contract.status !== 'Approved' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Contract not approved yet' })
    }
    const buffer = await generateContractPdf(contract, contract.employee, {
      logoUrl: process.env.CONTRACT_LOGO_URL,
      hrSignatureUrl: process.env.HR_SIGNATURE_URL,
      employeeSignature: contract.employee.name,
      qrContent: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${contract.id}`
    })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=contract-${contract.employee.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}
