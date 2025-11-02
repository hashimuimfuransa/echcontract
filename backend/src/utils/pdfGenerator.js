import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import contractTemplate from './contractTemplate.js'

let fetchRef

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
  const words = text.split(' ')
  let line = ''
  let cursorY = y
  let currentPage = page

  words.forEach((word, index) => {
    const testLine = `${line}${line ? ' ' : ''}${word}`
    const width = font.widthOfTextAtSize(testLine, size)
    if (width > maxWidth && line) {
      currentPage.drawText(line, { x, y: cursorY, size, font, color: rgb(0, 0, 0) })
      line = word
      cursorY -= lineHeight

      // Check if we need a new page
      if (cursorY < margin + 50) {
        currentPage = addNewPage()
        cursorY = height - margin
      }
    } else {
      line = testLine
    }
    if (index === words.length - 1 && line) {
      currentPage.drawText(line, { x, y: cursorY, size, font, color: rgb(0, 0, 0) })
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

  currentPage.drawText(`Employee: ${employee.name}`, { x: margin, y: cursorY, size: 12, font: bodyFont })
  cursorY -= 18
  if (employee.position) {
    currentPage.drawText(`Position: ${employee.position}`, { x: margin, y: cursorY, size: 12, font: bodyFont })
    cursorY -= 18
  }
  currentPage.drawText(`Status: ${contract.status}`, { x: margin, y: cursorY, size: 12, font: bodyFont })
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

    const value = formData[field.key] ?? ''
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
  if (cursorY < 250) {
    currentPage = addNewPage()
  }

  currentPage.drawText('Signatures', { x: margin, y: cursorY, size: 14, font: titleFont })
  cursorY -= 24

  const employeeSignature = options.employeeSignature || employee.name
  currentPage.drawText('Employee Signature:', { x: margin, y: cursorY, size: 12, font: bodyFont })
  currentPage.drawText(employeeSignature, { x: margin + 160, y: cursorY, size: 12, font: bodyFont })
  cursorY -= 24

  currentPage.drawText('HR Signature:', { x: margin, y: cursorY, size: 12, font: bodyFont })
  const hrSignatureBytes = await fetchImage(options.hrSignatureUrl)
  if (hrSignatureBytes) {
    try {
      const hrSignatureImage = await pdfDoc.embedPng(hrSignatureBytes)
      const signatureWidth = 120
      const ratio = hrSignatureImage.width / hrSignatureImage.height
      const signatureHeight = signatureWidth / ratio
      currentPage.drawImage(hrSignatureImage, {
        x: margin + 160,
        y: cursorY - signatureHeight + 12,
        width: signatureWidth,
        height: signatureHeight
      })
    } catch (error) {
      currentPage.drawText('Authorized HR Signature', { x: margin + 160, y: cursorY, size: 12, font: bodyFont })
    }
  } else {
    currentPage.drawText('Authorized HR Signature', { x: margin + 160, y: cursorY, size: 12, font: bodyFont })
  }
  cursorY -= 40

  currentPage.drawText('Date:', { x: margin, y: cursorY, size: 12, font: bodyFont })
  currentPage.drawText(new Date().toLocaleDateString(), { x: margin + 40, y: cursorY, size: 12, font: bodyFont })
  cursorY -= 40

  const qrContent = options.qrContent || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${contract.id}`
  const qrDataUrl = await QRCode.toDataURL(qrContent)
  const qrBase64 = qrDataUrl.split(',')[1]
  const qrBytes = Uint8Array.from(Buffer.from(qrBase64, 'base64'))
  const qrImage = await pdfDoc.embedPng(qrBytes)
  const qrSize = 100
  currentPage.drawImage(qrImage, {
    x: width - margin - qrSize,
    y: margin,
    width: qrSize,
    height: qrSize
  })

  currentPage.drawText('Scan to verify contract authenticity', { x: width - margin - qrSize - 40, y: margin + qrSize + 10, size: 10, font: bodyFont })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
