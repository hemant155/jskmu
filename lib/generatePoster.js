// lib/generatePoster.js
// Generates a bilingual (English + Hindi) "MISSING" awareness poster as a PDF.
// Usage: import { generateMissingPoster } from '@/lib/generatePoster'
//        await generateMissingPoster(person)
//
// `person` is a row from the missing_persons table. Expected fields (all optional except name):
//   name, age, gender, state, area/city, last_seen_date, description,
//   distinguishing_marks, contact_phone (family phone), photo_url, id

import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

const STEEL = [30, 58, 95]      // #1e3a5f
const RED = [220, 38, 38]       // #dc2626
const DARK = [30, 41, 59]       // #1e293b
const GREY = [100, 116, 139]    // #64748b

// Load an image URL into a data URL so jsPDF can embed it. Returns null on failure.
async function loadImageAsDataUrl(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function generateMissingPoster(person) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = 210
  const pageH = 297
  const margin = 14
  let y = 0

  // ── Top red band: MISSING ──
  doc.setFillColor(RED[0], RED[1], RED[2])
  doc.rect(0, 0, pageW, 34, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(40)
  doc.text('MISSING', pageW / 2, 18, { align: 'center' })
  doc.setFontSize(16)
  doc.text('HELP US FIND THIS PERSON', pageW / 2, 28, { align: 'center' })
  y = 44

  // ── Photo box ──
  const photoW = 70
  const photoH = 85
  const photoX = (pageW - photoW) / 2
  let photoData = null
  if (person.photo_url) {
    photoData = await loadImageAsDataUrl(person.photo_url)
  }
  doc.setDrawColor(STEEL[0], STEEL[1], STEEL[2])
  doc.setLineWidth(0.8)
  if (photoData) {
    try {
      doc.addImage(photoData, 'JPEG', photoX, y, photoW, photoH)
      doc.rect(photoX, y, photoW, photoH)
    } catch {
      doc.setFillColor(241, 245, 249)
      doc.rect(photoX, y, photoW, photoH, 'FD')
      doc.setTextColor(GREY[0], GREY[1], GREY[2])
      doc.setFontSize(11)
      doc.text('Photo not available', pageW / 2, y + photoH / 2, { align: 'center' })
    }
  } else {
    doc.setFillColor(241, 245, 249)
    doc.rect(photoX, y, photoW, photoH, 'FD')
    doc.setTextColor(GREY[0], GREY[1], GREY[2])
    doc.setFontSize(11)
    doc.text('No photo provided', pageW / 2, y + photoH / 2, { align: 'center' })
  }
  y += photoH + 10

  // ── Name ──
  doc.setTextColor(STEEL[0], STEEL[1], STEEL[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.text(String(person.name || 'Unknown'), pageW / 2, y, { align: 'center' })
  y += 12

  // ── Details rows ──
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(DARK[0], DARK[1], DARK[2])

  const detail = (label, value) => {
    if (!value) return
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}: `, margin, y)
    const labelWidth = doc.getTextWidth(`${label}: `)
    doc.setFont('helvetica', 'normal')
    const text = doc.splitTextToSize(String(value), pageW - margin * 2 - labelWidth)
    doc.text(text, margin + labelWidth, y)
    y += 7 * text.length
  }

  const location = [person.area, person.city, person.state].filter(Boolean).join(', ')

  detail('Age', person.age)
  detail('Gender', person.gender)
  detail('Last seen at', location)
  if (person.last_seen_date) detail('Date last seen', person.last_seen_date)
  detail('Identifying marks', person.distinguishing_marks)
  if (person.description) detail('Other details', person.description)

  y += 4

  // ── Contact band ──
  const contactPhone = person.contact_phone || person.phone
  if (contactPhone) {
    doc.setFillColor(STEEL[0], STEEL[1], STEEL[2])
    doc.roundedRect(margin, y, pageW - margin * 2, 22, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('IF YOU HAVE ANY INFORMATION, PLEASE CALL:', pageW / 2, y + 8, { align: 'center' })
    doc.setFontSize(18)
    doc.text(String(contactPhone), pageW / 2, y + 17, { align: 'center' })
    y += 30
  }

  // ── QR code + helpline footer ──
  const qrSize = 32
  let qrData = null
  if (person.id) {
    const listingUrl = `https://jskmu.in/missing/${person.id}`
    try {
      qrData = await QRCode.toDataURL(listingUrl, { margin: 1, width: 256 })
    } catch {
      qrData = null
    }
  }

  const footerY = pageH - 42
  if (qrData) {
    try {
      doc.addImage(qrData, 'PNG', margin, footerY, qrSize, qrSize)
      doc.setTextColor(GREY[0], GREY[1], GREY[2])
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text('Scan for full details', margin + qrSize / 2, footerY + qrSize + 4, { align: 'center' })
    } catch {
      // ignore QR failure
    }
  }

  // Right side of footer: JSKMU + helplines
  const rightX = pageW - margin
  doc.setTextColor(STEEL[0], STEEL[1], STEEL[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('JSKMU', rightX, footerY + 6, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(GREY[0], GREY[1], GREY[2])
  doc.text('Missing & Unidentified Database', rightX, footerY + 11, { align: 'right' })
  doc.text('jskmu.in', rightX, footerY + 16, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(RED[0], RED[1], RED[2])
  doc.setFontSize(10)
  doc.text('Emergency: 112  |  Missing Helpline: 1094', rightX, footerY + 23, { align: 'right' })

  // ── Bottom tribute line ──
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(margin, pageH - 8, pageW - margin, pageH - 8)
  doc.setTextColor(GREY[0], GREY[1], GREY[2])
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.text('JSK — We have not forgotten. We will not forget.', pageW / 2, pageH - 4, { align: 'center' })

  // ── Save ──
  const safeName = String(person.name || 'missing').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  doc.save(`JSKMU_Missing_${safeName}.pdf`)
}