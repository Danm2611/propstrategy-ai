import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'

interface ReportData {
  html: string
  propertyAddress: string
  reportType: string
  createdAt: Date
  userId: string
}

// Enhanced PDF generation with better styling and charts
export async function generateEnhancedPDF(reportData: ReportData): Promise<Buffer> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // Generate enhanced HTML with styling
    const styledHtml = await generateStyledHTML(reportData)
    
    await page.setContent(styledHtml, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    })
    
    // Generate PDF with enhanced options
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; margin: 0 auto; width: 100%; text-align: center; color: #666;">
          <span>PropStrategy AI - Property Investment Analysis</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; margin: 0 auto; width: 100%; text-align: center; color: #666;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          <span style="float: right; margin-right: 1cm;">Generated: ${new Date().toLocaleDateString()}</span>
        </div>
      `
    })
    
    return pdf
  } finally {
    await browser.close()
  }
}

async function generateStyledHTML(reportData: ReportData): Promise<string> {
  const css = await getEnhancedCSS()
  const coverPage = generateCoverPage(reportData)
  
  // Process the HTML content to improve formatting
  const processedHtml = processReportContent(reportData.html)
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Property Analysis Report - ${reportData.propertyAddress}</title>
      <style>${css}</style>
    </head>
    <body>
      <div class="container">
        ${coverPage}
        <div class="page-break"></div>
        <div class="report-content">
          ${processedHtml}
        </div>
      
      <!-- Risk Matrix -->
      <div class="risk-matrix">
        <h3>🎯 Risk Assessment Matrix</h3>
        <table class="risk-table">
          <thead>
            <tr>
              <th>Risk Factor</th>
              <th>Probability</th>
              <th>Impact</th>
              <th>Mitigation</th>
            </tr>
          </thead>
          <tbody>
            <tr class="risk-medium">
              <td>Market Downturn</td>
              <td>Medium</td>
              <td>High</td>
              <td>Conservative valuations, stress testing</td>
            </tr>
            <tr class="risk-low">
              <td>Planning Rejection</td>
              <td>Low</td>
              <td>High</td>
              <td>Pre-application consultation, professional advice</td>
            </tr>
            <tr class="risk-medium">
              <td>Construction Delays</td>
              <td>Medium</td>
              <td>Medium</td>
              <td>Experienced contractors, realistic timelines</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Disclaimer -->
        <!-- Footer -->
        <div class="footer">
          <p>This document is for information purposes only and does not constitute financial advice.</p>
          <p>All figures are projections based on current market conditions and comparable evidence.</p>
          <p>Document prepared: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCoverPage(reportData: ReportData): string {
  const reportTypeNames: Record<string, string> = {
    'basic': 'ESSENTIAL ANALYSIS',
    'professional': 'PROFESSIONAL INVESTMENT REPORT',
    'development': 'COMPREHENSIVE DEVELOPMENT ANALYSIS'
  }
  
  return `
    <!-- Header -->
    <div class="header">
      <h1>${reportData.propertyAddress.toUpperCase()}</h1>
      <p class="subtitle">${reportTypeNames[reportData.reportType] || 'PROPERTY ANALYSIS REPORT'}</p>
    </div>
  `
}

async function getEnhancedCSS(): Promise<string> {
  return `
    @page {
      size: A4;
      margin: 20mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.4;
      color: #333;
      background: #fff;
    }
    
    /* Fix paragraph and text spacing */
    p {
      margin: 5px 0;
      line-height: 1.4;
    }
    
    /* List spacing */
    ul, ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    li {
      margin: 2px 0;
      line-height: 1.3;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* Header Styles */
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #1e3a8a;
      padding-bottom: 20px;
    }
    
    h1 {
      color: #1e3a8a;
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    h2 {
      color: #1e3a8a;
      font-size: 24px;
      margin-top: 25px;
      margin-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 5px;
    }
    
    h3 {
      color: #374151;
      font-size: 18px;
      margin-top: 15px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .subtitle {
      color: #6b7280;
      font-size: 18px;
      font-weight: 400;
    }
    
    /* Executive Summary Box */
    .executive-summary {
      background: #f3f4f6;
      border-left: 4px solid #1e3a8a;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }
    
    .summary-label {
      color: #6b7280;
      font-weight: 500;
    }
    
    .summary-value {
      color: #1e3a8a;
      font-weight: 700;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    th {
      background: #1e3a8a;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    
    tr:hover {
      background: #f9fafb;
    }
    
    .table-header {
      background: #374151;
      color: white;
      font-weight: 600;
    }
    
    .table-subheader {
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    
    .table-total {
      background: #eff6ff;
      font-weight: 700;
      color: #1e3a8a;
    }
    
    .right-align {
      text-align: right;
    }
    
    .center-align {
      text-align: center;
    }
    
    /* Value Highlights */
    .positive {
      color: #059669;
      font-weight: 600;
    }
    
    .negative {
      color: #dc2626;
      font-weight: 600;
    }
    
    /* Key Metrics Box */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .metric-box {
      background: #eff6ff;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #dbeafe;
    }
    
    .metric-label {
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .metric-value {
      color: #1e3a8a;
      font-size: 24px;
      font-weight: 700;
    }
    
    /* Risk Matrix */
    .risk-matrix {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 20px 0;
    }
    
    .risk-item {
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      font-size: 14px;
    }
    
    .risk-low {
      background: #d1fae5;
      color: #065f46;
    }
    
    .risk-medium {
      background: #fed7aa;
      color: #92400e;
    }
    
    .risk-high {
      background: #fee2e2;
      color: #991b1b;
    }
    
    /* Info Box */
    .info-box {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    
    .info-box strong {
      color: #92400e;
    }
    
    /* Print Styles */
    @media print {
      .page-break {
        page-break-after: always;
      }
      
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .container {
        padding: 0;
      }
    }
    
    /* Footer */
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    
    /* Cover Page Styles */
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
    }
    
    .cover-header .logo {
      max-height: 80px;
      margin-bottom: 20px;
    }
    
    .company-name {
      font-size: 3em;
      margin: 0;
      font-weight: 300;
    }
    
    .tagline {
      font-size: 1.2em;
      opacity: 0.9;
      margin: 10px 0 0 0;
    }
    
    .report-title {
      font-size: 2.5em;
      margin: 40px 0;
      font-weight: 600;
    }
    
    .property-highlight {
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 15px;
      margin: 20px 0;
    }
    
    .property-address {
      font-size: 1.8em;
      margin-bottom: 20px;
    }
    
    .report-meta {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    
    .meta-item {
      margin: 10px;
      font-size: 1.1em;
    }
    
    .confidence-score {
      margin: 30px auto;
      max-width: 400px;
    }
    
    .confidence-bar {
      width: 100%;
      height: 20px;
      background: rgba(255,255,255,0.3);
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    
    .confidence-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s ease;
    }
    
    .powered-by {
      font-size: 1em;
      opacity: 0.8;
    }
    
    /* Report Content Styles */
    .report-content {
      padding: 20px;
    }
    
    .report-content h2 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    
    .report-content h3 {
      color: #34495e;
      margin-top: 25px;
    }
    
    /* Table Styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    th {
      background: #3498db;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
    }
    
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    tr:hover {
      background: #e8f4fd;
    }
    
    /* Executive Summary Box */
    .executive-summary-box {
      background: linear-gradient(135deg, #74b9ff, #0984e3);
      color: white;
      padding: 25px;
      border-radius: 10px;
      margin: 30px 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .executive-summary-box h2 {
      margin-top: 0;
      border-bottom: 2px solid rgba(255,255,255,0.3);
    }
    
    /* Risk Matrix */
    .risk-matrix {
      margin: 30px 0;
    }
    
    .risk-table th {
      background: #e74c3c;
    }
    
    .risk-low {
      background: #d5f4e6;
    }
    
    .risk-medium {
      background: #fef9e7;
    }
    
    .risk-high {
      background: #fadbd8;
    }
    
    /* Market Intelligence Styles */
    .market-intelligence {
      background: #f8f9fa;
      border-left: 5px solid #28a745;
      padding: 20px;
      margin: 20px 0;
    }
    
    .market-intelligence h3 {
      color: #28a745;
      margin-top: 0;
    }
    
    /* Alert Styles */
    .alert {
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    
    .alert-info {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      color: #1565C0;
    }
    
    .alert-warning {
      background: #fff8e1;
      border-left: 4px solid #ff9800;
      color: #E65100;
    }
    
    .alert-success {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
      color: #2E7D32;
    }
    
    /* Badge Styles */
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .badge-success {
      background: #28a745;
      color: white;
    }
    
    .badge-warning {
      background: #ffc107;
      color: #212529;
    }
    
    .badge-secondary {
      background: #6c757d;
      color: white;
    }
    
    /* Disclaimer */
    .disclaimer {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      padding: 20px;
      margin-top: 40px;
      border-radius: 5px;
    }
    
    .disclaimer h4 {
      color: #dc3545;
      margin-top: 0;
    }
    
    /* Page Break */
    .page-break {
      page-break-before: always;
    }
    
    /* Print Optimizations */
    @media print {
      .cover-page {
        page-break-after: always;
      }
      
      h2 {
        page-break-after: avoid;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      .market-intelligence {
        page-break-inside: avoid;
      }
    }
  `
}

function processReportContent(html: string): string {
  // Improve formatting while preserving structure
  let processed = html
  
  // First, protect table content from processing
  const tables: string[] = []
  processed = processed.replace(/<table[\s\S]*?<\/table>/gi, (match) => {
    tables.push(match)
    return `__TABLE_PLACEHOLDER_${tables.length - 1}__`
  })
  
  // Convert markdown-style formatting to HTML
  // Headers
  processed = processed.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  processed = processed.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  processed = processed.replace(/^# (.*$)/gim, '<h2>$1</h2>')
  
  // Bold text
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Bullet points - handle both - and * bullets
  processed = processed.replace(/^[\s]*[-\*]\s+(.+)$/gm, '<li>$1</li>')
  
  // Wrap consecutive list items in ul tags
  processed = processed.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gm, '<ul>$1</ul>')
  
  // Number lists
  processed = processed.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
  processed = processed.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gm, (match) => {
    if (match.includes('<ul>')) return match
    return '<ol>' + match + '</ol>'
  })
  
  // Convert double line breaks to paragraph breaks
  processed = processed.replace(/\n\s*\n/g, '</p><p>')
  
  // Wrap content in paragraphs if not already wrapped
  if (!processed.includes('<p>') && !processed.includes('<h')) {
    processed = '<p>' + processed + '</p>'
  }
  
  // Clean up formatting
  processed = processed.replace(/<p>\s*<\/p>/g, '')
  processed = processed.replace(/<p>\s*(<h[1-6])/g, '$1')
  processed = processed.replace(/(<\/h[1-6]>)\s*<\/p>/g, '$1')
  processed = processed.replace(/<p>\s*(<ul>)/g, '$1')
  processed = processed.replace(/(<\/ul>)\s*<\/p>/g, '$1')
  processed = processed.replace(/<p>\s*(<ol>)/g, '$1')
  processed = processed.replace(/(<\/ol>)\s*<\/p>/g, '$1')
  
  // Restore tables with enhanced formatting
  tables.forEach((table, index) => {
    let enhancedTable = table.replace(/<table>/g, '<table class="professional-table">')
    // Clean up any paragraph breaks inside table cells
    enhancedTable = enhancedTable.replace(/<td([^>]*)>\s*<p>/g, '<td$1>')
    enhancedTable = enhancedTable.replace(/<\/p>\s*<\/td>/g, '</td>')
    enhancedTable = enhancedTable.replace(/<th([^>]*)>\s*<p>/g, '<th$1>')
    enhancedTable = enhancedTable.replace(/<\/p>\s*<\/th>/g, '</th>')
    processed = processed.replace(`__TABLE_PLACEHOLDER_${index}__`, enhancedTable)
  })
  
  return processed
}

function generateReportId(reportData: ReportData): string {
  const date = reportData.createdAt.toISOString().slice(0, 10).replace(/-/g, '')
  const userHash = reportData.userId.slice(-4).toUpperCase()
  const randomId = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PSA-${date}-${userHash}-${randomId}`
}

// Chart generation helper (for future integration)
export function generateChartData(data: any) {
  // This could integrate with Chart.js or similar libraries
  // to generate charts within the PDF
  return {
    priceComparison: data.comparables?.map((comp: any) => ({
      address: comp.address,
      price: comp.price,
      pricePerSqFt: comp.pricePerSqFt
    })),
    marketTrends: {
      labels: ['6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago', 'Current'],
      values: [100, 102, 98, 105, 108, 110] // Price index
    }
  }
}