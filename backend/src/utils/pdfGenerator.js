import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import contractTemplate from './contractTemplate.js'

let fetchRef

const sanitizeTextForPDF = (text) => {
  if (!text) return ''
  return String(text)
    .replace(/[\r\n\t]/g, ' ')  // Replace newlines, tabs with spaces
    .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
    .trim()
}

const getFetch = async () => {
  if (typeof fetch !== 'undefined') {
    return fetch
  }
  if (!fetchRef) {
    const mod = await import('node-fetch')
    fetchRef = mod.default
  }
  return fetchRef
}

const fetchImage = async (url) => {
  if (!url) {
    return null
  }
  try {
    const fetcher = await getFetch()
    const response = await fetcher(url)
    if (!response.ok) {
      return null
    }
    const arrayBuffer = await response.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  } catch (error) {
    return null
  }
}

const drawMultilineText = (page, text, x, y, options, addNewPage, margin, height) => {
  const { font, size, maxWidth, lineHeight } = options
  
  // Clean text: remove newlines, carriage returns, and other problematic characters
  const cleanText = String(text)
    .replace(/[\r\n\t]/g, ' ')  // Replace newlines, carriage returns, tabs with spaces
    .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
    .trim()
  
  const words = cleanText.split(' ').filter(word => word.length > 0)
  let line = ''
  let cursorY = y
  let currentPage = page

  words.forEach((word, index) => {
    // Sanitize word to remove any problematic characters
    const sanitizedWord = word.replace(/[^\x20-\x7E]/g, '')
    if (!sanitizedWord) return // Skip empty words after sanitization
    
    const testLine = `${line}${line ? ' ' : ''}${sanitizedWord}`
    
    try {
      const width = font.widthOfTextAtSize(testLine, size)
      if (width > maxWidth && line) {
        currentPage.drawText(line, { x, y: cursorY, size, font, color: rgb(0, 0, 0) })
        line = sanitizedWord
        cursorY -= lineHeight

        // Check if we need a new page
        if (cursorY < margin + 50) {
          currentPage = addNewPage()
          cursorY = height - margin
        }
      } else {
        line = testLine
      }
    } catch (error) {
      console.warn(`Warning: Could not measure text "${testLine}". Skipping problematic characters.`)
      // Fallback: try with basic ASCII only
      const asciiWord = sanitizedWord.replace(/[^\x20-\x7E]/g, '')
      if (asciiWord) {
        line = `${line}${line ? ' ' : ''}${asciiWord}`
      }
    }
    
    if (index === words.length - 1 && line) {
      try {
        currentPage.drawText(line, { x, y: cursorY, size, font, color: rgb(0, 0, 0) })
      } catch (error) {
        console.warn(`Warning: Could not draw final line "${line}".`)
      }
      cursorY -= lineHeight

      // Check if we need a new page after the last line
      if (cursorY < margin + 50) {
        currentPage = addNewPage()
        cursorY = height - margin
      }
    }
  })
  return { cursorY, currentPage }
}

export const generateContractPdf = async (contract, employee, options = {}) => {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89])
  let { width, height } = page.getSize()
  const margin = 40
  const contentWidth = width - margin * 2

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  let cursorY = height - margin
  let currentPage = page

  const addNewPage = () => {
    currentPage = pdfDoc.addPage([595.28, 841.89])
    cursorY = height - margin
    return currentPage
  }

  const logoBytes = await fetchImage(options.logoUrl)
  if (logoBytes) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBytes)
      const ratio = logoImage.width / logoImage.height
      const logoHeight = 50
      const logoWidth = logoHeight * ratio
      currentPage.drawImage(logoImage, {
        x: margin,
        y: cursorY - logoHeight,
        width: logoWidth,
        height: logoHeight
      })
      cursorY -= logoHeight + 20
    } catch (error) {
      cursorY -= 20
    }
  }

  currentPage.drawText('Employment Contract', { x: margin, y: cursorY, size: 20, font: titleFont, color: rgb(0.12, 0.25, 0.69) })
  cursorY -= 30

  currentPage.drawText(`Employee: ${sanitizeTextForPDF(employee.name)}`, { x: margin, y: cursorY, size: 12, font: bodyFont })
  cursorY -= 18
  if (employee.position) {
    currentPage.drawText(`Position: ${sanitizeTextForPDF(employee.position)}`, { x: margin, y: cursorY, size: 12, font: bodyFont })
    cursorY -= 18
  }
  currentPage.drawText(`Status: ${sanitizeTextForPDF(contract.status)}`, { x: margin, y: cursorY, size: 12, font: bodyFont })
  cursorY -= 30

  currentPage.drawText('Contract Details', { x: margin, y: cursorY, size: 14, font: titleFont })
  cursorY -= 24

  const formData = contract.formData || {}
  const fields = contractTemplate.fields || []
  fields.forEach((field) => {
    // Check if we need a new page before starting a field
    if (cursorY < margin + 80) {
      currentPage = addNewPage()
    }

    currentPage.drawText(`${field.label}:`, { x: margin, y: cursorY, size: 12, font: bodyFont })
    cursorY -= 16

    let value = formData[field.key] ?? ''
    // Sanitize the value
    value = sanitizeTextForPDF(value)
    
    if (value !== '') {
      // Use multiline text for textarea fields and long text fields
      if (field.type === 'textarea' || String(value).length > 50) {
        const result = drawMultilineText(currentPage, String(value), margin + 10, cursorY, {
          font: bodyFont,
          size: 11,
          maxWidth: contentWidth - 10,
          lineHeight: 14
        }, addNewPage, margin, height)
        cursorY = result.cursorY
        currentPage = result.currentPage
      } else {
        // Single line for short text fields
        currentPage.drawText(String(value), { x: margin + 10, y: cursorY, size: 11, font: bodyFont })
        cursorY -= 14
      }
    } else {
      cursorY -= 14
    }
    cursorY -= 8 // Add extra space between fields
  })

  // Ensure we have enough space for signatures
  if (cursorY < 420) {
    currentPage = addNewPage()
  }

  // Draw a decorative line
  currentPage.drawLine({
    start: { x: margin, y: cursorY - 5 },
    end: { x: width - margin, y: cursorY - 5 },
    thickness: 1.5,
    color: rgb(0.12, 0.25, 0.69)
  })
  cursorY -= 25

  currentPage.drawText('APPROVALS AND SIGNATURES', { x: margin, y: cursorY, size: 14, font: titleFont, color: rgb(0.12, 0.25, 0.69) })
  cursorY -= 28

  // Chairman Section
  const chairmanX = margin
  const chairmanWidth = 160
  currentPage.drawText('CHAIRMAN', { x: chairmanX, y: cursorY, size: 11, font: titleFont, color: rgb(0.2, 0.2, 0.2) })
  cursorY -= 50
  currentPage.drawLine({
    start: { x: chairmanX, y: cursorY },
    end: { x: chairmanX + chairmanWidth, y: cursorY },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5)
  })
  cursorY -= 14
  currentPage.drawText('Abdala Nzabandora', { x: chairmanX, y: cursorY, size: 10, font: bodyFont })
  cursorY -= 12
  currentPage.drawText('Signature & Stamp', { x: chairmanX, y: cursorY, size: 9, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })
  cursorY -= 40

  // Managing Director Section
  const mdX = chairmanX + 200
  const mdWidth = 160
  currentPage.drawText('MANAGING DIRECTOR', { x: mdX, y: cursorY + 40, size: 11, font: titleFont, color: rgb(0.2, 0.2, 0.2) })
  cursorY -= 50
  currentPage.drawLine({
    start: { x: mdX, y: cursorY + 40 },
    end: { x: mdX + mdWidth, y: cursorY + 40 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5)
  })
  currentPage.drawText('Hashimu Imfuransa', { x: mdX, y: cursorY + 26, size: 10, font: bodyFont })
  currentPage.drawText('Signature & Stamp', { x: mdX, y: cursorY + 14, size: 9, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })
  
  cursorY -= 70

  // Chief Technology Officer Section
  const ctoCursorY = cursorY + 40
  const ctoX = chairmanX + 200
  const ctoWidth = 160
  currentPage.drawText('CHIEF TECHNOLOGY OFFICER', { x: ctoX, y: ctoCursorY, size: 11, font: titleFont, color: rgb(0.2, 0.2, 0.2) })
  currentPage.drawLine({
    start: { x: ctoX, y: ctoCursorY - 25 },
    end: { x: ctoX + ctoWidth, y: ctoCursorY - 25 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5)
  })
  currentPage.drawText('Tuyizere Dieudonne', { x: ctoX, y: ctoCursorY - 39, size: 10, font: bodyFont })
  currentPage.drawText('Signature & Stamp', { x: ctoX, y: ctoCursorY - 51, size: 9, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })
  
  cursorY -= 70

  // Dividing space
  cursorY -= 15

  // Employee Section
  const employeeX = margin
  const employeeWidth = 160
  currentPage.drawText('EMPLOYEE', { x: employeeX, y: cursorY, size: 11, font: titleFont, color: rgb(0.2, 0.2, 0.2) })
  cursorY -= 50
  currentPage.drawLine({
    start: { x: employeeX, y: cursorY },
    end: { x: employeeX + employeeWidth, y: cursorY },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5)
  })
  cursorY -= 14
  const employeeSignature = sanitizeTextForPDF(options.employeeSignature || employee.name)
  currentPage.drawText(employeeSignature, { x: employeeX, y: cursorY, size: 10, font: bodyFont })
  cursorY -= 12
  currentPage.drawText('Signature', { x: employeeX, y: cursorY, size: 9, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })
  cursorY -= 30

  // Date Section
  currentPage.drawText('Date Signed:', { x: margin, y: cursorY, size: 11, font: bodyFont })
  currentPage.drawText(new Date().toLocaleDateString(), { x: margin + 100, y: cursorY, size: 11, font: bodyFont })
  
  cursorY -= 50

  // Company Stamp Area
  currentPage.drawText('COMPANY STAMP & SEAL', { x: margin, y: cursorY, size: 10, font: titleFont, color: rgb(0.12, 0.25, 0.69) })
  cursorY -= 35

  // Draw a box for stamp area
  currentPage.drawRectangle({
    x: margin,
    y: cursorY - 80,
    width: 140,
    height: 80,
    borderColor: rgb(0.12, 0.25, 0.69),
    borderWidth: 1.5
  })
  
  currentPage.drawText('(Affix official stamp here)', { x: margin + 10, y: cursorY - 35, size: 9, font: bodyFont, color: rgb(0.5, 0.5, 0.5) })

  // Footer
  cursorY -= 150
  currentPage.drawLine({
    start: { x: margin, y: cursorY },
    end: { x: width - margin, y: cursorY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  })
  
  cursorY -= 15
  currentPage.drawText('Excellence Coaching Hub HR System', { x: margin, y: cursorY, size: 9, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })
  currentPage.drawText('Document ID: ' + sanitizeTextForPDF(contract.id), { x: width - margin - 120, y: cursorY, size: 9, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })

  // QR Code
  const qrContent = options.qrContent || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/contract/${contract.id}`
  const qrDataUrl = await QRCode.toDataURL(qrContent)
  const qrBase64 = qrDataUrl.split(',')[1]
  const qrBytes = Uint8Array.from(Buffer.from(qrBase64, 'base64'))
  const qrImage = await pdfDoc.embedPng(qrBytes)
  const qrSize = 80
  currentPage.drawImage(qrImage, {
    x: width - margin - qrSize - 10,
    y: margin + 15,
    width: qrSize,
    height: qrSize
  })

  currentPage.drawText('Verify authenticity', { x: width - margin - qrSize - 35, y: margin + qrSize + 20, size: 8, font: bodyFont, color: rgb(0.4, 0.4, 0.4) })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
