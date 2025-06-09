import puppeteer from 'puppeteer'
import { PropertyData } from './claude-enhanced'

interface ReportData {
  html: string
  propertyAddress: string
  reportType: string
  createdAt: Date
  userId: string
}

interface AdvancedAnalysisData {
  executiveSummary: {
    strategy: string
    investmentRequired: string
    capitalReturned: string
    portfolioRetained: string
    netAnnualIncome: string
  }
  keyMetrics: {
    totalROI: string
    netProfit: string
    timeline: string
    cashYield: string
  }
  transactionStructure: {
    acquisitionCosts: Array<{component: string, value: string}>
    financingStructure: Array<{source: string, amount: string, ltvLtc?: string}>
  }
  developmentCosts: {
    constructionBudget: Array<{item: string, totalCost: string, perUnit?: string}>
    totalDevelopmentInvestment: Array<{item: string, cost: string}>
  }
  exitStrategy: {
    components: Array<{
      property: string
      type: string
      currentRent?: string
      saleValue: string
      netProceeds: string
    }>
  }
  comparables: {
    apartmentSales: Array<{
      development: string
      type: string
      price: string
      pricePerSqft: string
      date: string
      source: string
    }>
    portfolioComparables: Array<{
      portfolio: string
      location: string
      units: string
      totalPrice: string
      perUnit: string
      yield: string
    }>
  }
  financialReturns: {
    returnMetrics: Array<{metric: string, value: string}>
    ongoingIncome: Array<{item: string, annual: string, monthly: string}>
  }
  riskAssessment: Array<{
    risk: string
    probability: string
    impact: string
    mitigation: string
  }>
  implementationTimeline: Array<{
    phase: string
    description: string
  }>
  conclusion: {
    delivers: string[]
    comparesTo: string[]
    summary: string
  }
}

export async function generateAdvancedPropertyReport(
  reportData: ReportData,
  analysisData: AdvancedAnalysisData
): Promise<Buffer> {
  // Try system Chrome first, fallback to bundled Chromium
  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
  
  if (!executablePath) {
    // Try common Chrome locations
    const chromePaths = [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium'
    ]
    
    for (const path of chromePaths) {
      try {
        const fs = await import('fs')
        if (fs.existsSync(path)) {
          executablePath = path
          break
        }
      } catch (e) {
        // Continue to next path
      }
    }
  }

  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    executablePath,
  })
  
  try {
    const page = await browser.newPage()
    
    const styledHtml = generateParkGrangeStyleHTML(reportData, analysisData)
    
    await page.setContent(styledHtml, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    })
    
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
    
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

function generateParkGrangeStyleHTML(
  reportData: ReportData,
  analysisData: AdvancedAnalysisData
): string {
  const css = getParkGrangeCSS()
  const reportTypeNames: Record<string, string> = {
    'basic': 'ESSENTIAL ANALYSIS',
    'professional': 'PROFESSIONAL INVESTMENT REPORT',
    'development': 'COMPREHENSIVE DEVELOPMENT ANALYSIS'
  }
  
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
        <!-- Header -->
        <div class="header">
          <h1>${reportData.propertyAddress.toUpperCase()}</h1>
          <p class="subtitle">${reportTypeNames[reportData.reportType] || 'PROPERTY ANALYSIS REPORT'}</p>
        </div>
        
        <!-- Executive Summary -->
        <div class="executive-summary">
          <h3>EXECUTIVE SUMMARY</h3>
          <p><strong>Strategy:</strong> ${analysisData.executiveSummary.strategy}</p>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Investment Required:</span>
              <span class="summary-value">${analysisData.executiveSummary.investmentRequired}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Capital Returned:</span>
              <span class="summary-value">${analysisData.executiveSummary.capitalReturned}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Portfolio Retained:</span>
              <span class="summary-value">${analysisData.executiveSummary.portfolioRetained}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Net Annual Income:</span>
              <span class="summary-value">${analysisData.executiveSummary.netAnnualIncome}</span>
            </div>
          </div>
        </div>
        
        <!-- Key Metrics -->
        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Total ROI</div>
            <div class="metric-value">${analysisData.keyMetrics.totalROI}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Net Profit</div>
            <div class="metric-value">${analysisData.keyMetrics.netProfit}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Timeline</div>
            <div class="metric-value">${analysisData.keyMetrics.timeline}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Cash Yield</div>
            <div class="metric-value">${analysisData.keyMetrics.cashYield}</div>
          </div>
        </div>
        
        <!-- Transaction Structure -->
        <h2>TRANSACTION STRUCTURE</h2>
        
        <h3>Acquisition Costs</h3>
        <table>
          <tr>
            <th>Component</th>
            <th class="right-align">Value</th>
          </tr>
          ${analysisData.transactionStructure.acquisitionCosts.map(item => `
            <tr${item.component.includes('Total') ? ' class="table-total"' : ''}>
              <td>${item.component.includes('Total') ? `<strong>${item.component}</strong>` : item.component}</td>
              <td class="right-align">${item.component.includes('Total') ? `<strong>${item.value}</strong>` : item.value}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3>Financing Structure</h3>
        <table>
          <tr>
            <th>Source</th>
            <th class="right-align">Amount</th>
            ${analysisData.transactionStructure.financingStructure[0]?.ltvLtc ? '<th class="center-align">LTV/LTC</th>' : ''}
          </tr>
          ${analysisData.transactionStructure.financingStructure.map(item => `
            <tr${item.source.includes('Total') || item.source.includes('Equity') ? ' class="table-total"' : (item.source.includes('Debt') ? ' class="table-subheader"' : '')}>
              <td>${(item.source.includes('Total') || item.source.includes('Equity')) ? `<strong>${item.source}</strong>` : item.source}</td>
              <td class="right-align">${(item.source.includes('Total') || item.source.includes('Equity')) ? `<strong>${item.amount}</strong>` : item.amount}</td>
              ${item.ltvLtc ? `<td class="center-align">${(item.source.includes('Total') || item.source.includes('Equity')) ? `<strong>${item.ltvLtc}</strong>` : item.ltvLtc}</td>` : ''}
            </tr>
          `).join('')}
        </table>
        
        <div class="page-break"></div>
        
        <!-- Development Costs -->
        <h2>DEVELOPMENT COSTS</h2>
        
        <h3>Construction Budget</h3>
        <table>
          <tr>
            <th>Item</th>
            <th class="right-align">Total Cost</th>
            ${analysisData.developmentCosts.constructionBudget[0]?.perUnit ? '<th class="right-align">Per Unit</th>' : ''}
          </tr>
          ${analysisData.developmentCosts.constructionBudget.map(item => `
            <tr${item.item.includes('Total') ? ' class="table-total"' : ''}>
              <td>${item.item.includes('Total') ? `<strong>${item.item}</strong>` : item.item}</td>
              <td class="right-align">${item.item.includes('Total') ? `<strong>${item.totalCost}</strong>` : item.totalCost}</td>
              ${item.perUnit ? `<td class="right-align">${item.item.includes('Total') ? `<strong>${item.perUnit}</strong>` : item.perUnit}</td>` : ''}
            </tr>
          `).join('')}
        </table>
        
        <h3>Total Development Investment</h3>
        <table>
          ${analysisData.developmentCosts.totalDevelopmentInvestment.map(item => `
            <tr${item.item.includes('Total') ? ' class="table-total"' : ''}>
              <td>${item.item.includes('Total') ? `<strong>${item.item}</strong>` : item.item}</td>
              <td class="right-align">${item.item.includes('Total') ? `<strong>${item.cost}</strong>` : item.cost}</td>
            </tr>
          `).join('')}
        </table>
        
        <!-- Exit Strategy -->
        <h2>EXIT STRATEGY BREAKDOWN</h2>
        
        <h3>Component 1: Property Disposals</h3>
        <table>
          <tr>
            <th>Property</th>
            <th>Type</th>
            ${analysisData.exitStrategy.components[0]?.currentRent ? '<th class="right-align">Current Rent</th>' : ''}
            <th class="right-align">Sale Value</th>
            <th class="right-align">Net Proceeds</th>
          </tr>
          ${analysisData.exitStrategy.components.map(item => `
            <tr${item.property.includes('Total') ? ' class="table-total"' : ''}>
              <td>${item.property.includes('Total') ? `<strong>${item.property}</strong>` : item.property}</td>
              <td>${item.type}</td>
              ${item.currentRent ? `<td class="right-align">${item.property.includes('Total') ? `<strong>${item.currentRent}</strong>` : item.currentRent}</td>` : ''}
              <td class="right-align">${item.property.includes('Total') ? `<strong>${item.saleValue}</strong>` : item.saleValue}</td>
              <td class="right-align">${item.property.includes('Total') ? `<strong>${item.netProceeds}</strong>` : item.netProceeds}</td>
            </tr>
          `).join('')}
        </table>
        
        <div class="page-break"></div>
        
        <!-- Comparable Evidence -->
        <h2>COMPARABLE EVIDENCE</h2>
        
        <h3>Recent Sales - ${new Date().getFullYear()}</h3>
        <table>
          <tr>
            <th>Development</th>
            <th>Type</th>
            <th class="right-align">Price</th>
            <th class="center-align">£/sqft</th>
            <th class="center-align">Date</th>
            <th>Source</th>
          </tr>
          ${analysisData.comparables.apartmentSales.map(item => `
            <tr${item.development.includes('Average') ? ' class="table-subheader"' : ''}>
              <td>${item.development.includes('Average') ? `<strong>${item.development}</strong>` : item.development}</td>
              <td>${item.type}</td>
              <td class="right-align">${item.development.includes('Average') ? `<strong>${item.price}</strong>` : item.price}</td>
              <td class="center-align">${item.development.includes('Average') ? `<strong>${item.pricePerSqft}</strong>` : item.pricePerSqft}</td>
              <td class="center-align">${item.date}</td>
              <td>${item.source}</td>
            </tr>
          `).join('')}
        </table>
        
        ${analysisData.comparables.portfolioComparables.length > 0 ? `
        <h3>Investment Portfolio Comparables</h3>
        <table>
          <tr>
            <th>Portfolio</th>
            <th>Location</th>
            <th class="center-align">Units</th>
            <th class="right-align">Total Price</th>
            <th class="right-align">Per Unit</th>
            <th class="center-align">Yield</th>
          </tr>
          ${analysisData.comparables.portfolioComparables.map(item => `
            <tr>
              <td>${item.portfolio}</td>
              <td>${item.location}</td>
              <td class="center-align">${item.units}</td>
              <td class="right-align">${item.totalPrice}</td>
              <td class="right-align">${item.perUnit}</td>
              <td class="center-align">${item.yield}</td>
            </tr>
          `).join('')}
        </table>
        ` : ''}
        
        <!-- Financial Returns -->
        <h2>FINANCIAL RETURNS</h2>
        
        <h3>Return Metrics</h3>
        <table>
          <tr>
            <th>Metric</th>
            <th class="right-align">Value</th>
          </tr>
          ${analysisData.financialReturns.returnMetrics.map(item => `
            <tr${item.metric.includes('Profit') || item.metric.includes('ROI') ? ' class="table-total"' : ''}>
              <td>${(item.metric.includes('Profit') || item.metric.includes('ROI')) ? `<strong>${item.metric}</strong>` : item.metric}</td>
              <td class="right-align ${item.value.includes('£') && parseInt(item.value.replace(/[^0-9-]/g, '')) > 0 ? 'positive' : ''}">${(item.metric.includes('Profit') || item.metric.includes('ROI')) ? `<strong>${item.value}</strong>` : item.value}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3>Ongoing Income Analysis</h3>
        <table>
          <tr>
            <th></th>
            <th class="right-align">Annual</th>
            <th class="right-align">Monthly</th>
          </tr>
          ${analysisData.financialReturns.ongoingIncome.map(item => `
            <tr${item.item.includes('Net Cash Flow') ? ' class="table-total"' : ''}>
              <td>${item.item.includes('Net Cash Flow') ? `<strong>${item.item}</strong>` : item.item}</td>
              <td class="right-align ${item.item.includes('Net Cash Flow') ? 'positive' : (item.annual.includes('(') ? '' : '')}">${item.item.includes('Net Cash Flow') ? `<strong>${item.annual}</strong>` : item.annual}</td>
              <td class="right-align ${item.item.includes('Net Cash Flow') ? 'positive' : (item.monthly.includes('(') ? '' : '')}">${item.item.includes('Net Cash Flow') ? `<strong>${item.monthly}</strong>` : item.monthly}</td>
            </tr>
          `).join('')}
        </table>
        
        <div class="page-break"></div>
        
        <!-- Risk Assessment -->
        <h2>RISK ASSESSMENT</h2>
        
        <h3>Key Risks</h3>
        <table>
          <tr>
            <th>Risk</th>
            <th class="center-align">Probability</th>
            <th class="center-align">Impact</th>
            <th>Mitigation</th>
          </tr>
          ${analysisData.riskAssessment.map(item => `
            <tr>
              <td>${item.risk}</td>
              <td class="center-align"><span class="risk-${item.probability.toLowerCase()}">${item.probability}</span></td>
              <td class="center-align"><span class="risk-${item.impact.toLowerCase()}">${item.impact}</span></td>
              <td>${item.mitigation}</td>
            </tr>
          `).join('')}
        </table>
        
        <!-- Implementation Timeline -->
        <h2>IMPLEMENTATION TIMELINE</h2>
        
        <div class="timeline">
          ${analysisData.implementationTimeline.map(item => `
            <div class="timeline-item">
              <div class="timeline-phase">${item.phase}</div>
              <div class="timeline-description">${item.description}</div>
            </div>
          `).join('')}
        </div>
        
        <!-- Conclusion -->
        <h2>CONCLUSION</h2>
        
        <div class="executive-summary">
          <p>The optimal strategy delivers:</p>
          <ul style="margin-top: 10px; margin-left: 20px;">
            ${analysisData.conclusion.delivers.map(item => `<li><strong>${item}</strong></li>`).join('')}
          </ul>
          ${analysisData.conclusion.comparesTo.length > 0 ? `
          <p style="margin-top: 15px;">This compares favorably to:</p>
          <ul style="margin-top: 10px; margin-left: 20px;">
            ${analysisData.conclusion.comparesTo.map(item => `<li>${item}</li>`).join('')}
          </ul>
          ` : ''}
          <p style="margin-top: 15px;">${analysisData.conclusion.summary}</p>
        </div>
        
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

function getParkGrangeCSS(): string {
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
    
    p {
      margin: 5px 0;
      line-height: 1.4;
    }
    
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
      margin-top: 15px;
      margin-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 5px;
    }
    
    h3 {
      color: #374151;
      font-size: 18px;
      margin-top: 10px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .subtitle {
      color: #6b7280;
      font-size: 18px;
      font-weight: 400;
    }
    
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
    
    .positive {
      color: #059669;
      font-weight: 600;
    }
    
    .negative {
      color: #dc2626;
      font-weight: 600;
    }
    
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
    
    .timeline {
      margin: 20px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .timeline-item {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
    }
    
    .timeline-phase {
      background: #1e3a8a;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-right: 15px;
      min-width: 120px;
      text-align: center;
    }
    
    .timeline-description {
      color: #374151;
      font-size: 14px;
    }
    
    .risk-low {
      background: #d1fae5;
      color: #065f46;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .risk-medium {
      background: #fed7aa;
      color: #92400e;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .risk-high {
      background: #fee2e2;
      color: #991b1b;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    
    .page-break {
      page-break-before: always;
    }
    
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
  `
}

export function parseClaudeAnalysisToStructured(htmlContent: string): AdvancedAnalysisData {
  // This function would parse Claude's HTML response and extract structured data
  // For now, return a template structure that we'll enhance with a better prompt
  return {
    executiveSummary: {
      strategy: "Convert to mixed-use development with retail and residential",
      investmentRequired: "£200,000",
      capitalReturned: "£350,000",
      portfolioRetained: "£0",
      netAnnualIncome: "£18,000"
    },
    keyMetrics: {
      totalROI: "35%",
      netProfit: "£150k",
      timeline: "18 mo",
      cashYield: "6.5%"
    },
    transactionStructure: {
      acquisitionCosts: [
        {component: "Purchase Price", value: "£200,000"},
        {component: "Stamp Duty", value: "£6,000"},
        {component: "Legal & Professional Fees", value: "£3,000"},
        {component: "Survey & Due Diligence", value: "£2,000"},
        {component: "Total Acquisition Cost", value: "£211,000"}
      ],
      financingStructure: [
        {source: "Cash Purchase", amount: "£200,000", ltvLtc: "100%"},
        {source: "Development Finance", amount: "£150,000", ltvLtc: "60%"},
        {source: "Total Debt", amount: "£150,000"},
        {source: "Equity Required", amount: "£200,000", ltvLtc: "57%"}
      ]
    },
    developmentCosts: {
      constructionBudget: [
        {item: "Building Works", totalCost: "£120,000", perUnit: "£40,000"},
        {item: "M&E Installation", totalCost: "£30,000", perUnit: "£10,000"},
        {item: "Professional Fees", totalCost: "£18,000", perUnit: "£6,000"},
        {item: "Contingency (10%)", totalCost: "£16,800", perUnit: "£5,600"},
        {item: "Total Construction", totalCost: "£184,800", perUnit: "£61,600"}
      ],
      totalDevelopmentInvestment: [
        {item: "Acquisition Costs", cost: "£211,000"},
        {item: "Construction Costs", cost: "£184,800"},
        {item: "Net Holding Costs", cost: "£15,000"},
        {item: "Total Project Cost", cost: "£410,800"}
      ]
    },
    exitStrategy: {
      components: [
        {property: "Ground Floor Retail", type: "Commercial", saleValue: "£150,000", netProceeds: "£147,000"},
        {property: "Upper Floor Apartments", type: "2x 1-bed", saleValue: "£220,000", netProceeds: "£215,600"},
        {property: "Total", type: "", saleValue: "£370,000", netProceeds: "£362,600"}
      ]
    },
    comparables: {
      apartmentSales: [
        {development: "Ocean Road Properties", type: "1-bed apt", price: "£110,000", pricePerSqft: "£200", date: "Mar 2025", source: "Rightmove"},
        {development: "South Shields Centre", type: "1-bed apt", price: "£95,000", pricePerSqft: "£180", date: "Feb 2025", source: "Zoopla"},
        {development: "Average", type: "", price: "£102,500", pricePerSqft: "£190", date: "", source: ""}
      ],
      portfolioComparables: []
    },
    financialReturns: {
      returnMetrics: [
        {metric: "Total Equity Invested", value: "£200,000"},
        {metric: "Project Value", value: "£370,000"},
        {metric: "Development Costs", value: "(£210,800)"},
        {metric: "Net Position", value: "£159,200"},
        {metric: "Profit", value: "£159,200"},
        {metric: "ROI", value: "35%"}
      ],
      ongoingIncome: [
        {item: "Gross Rental Income", annual: "£21,600", monthly: "£1,800"},
        {item: "Operating Expenses (20%)", annual: "(£4,320)", monthly: "(£360)"},
        {item: "Net Operating Income", annual: "£17,280", monthly: "£1,440"},
        {item: "Debt Service", annual: "£0", monthly: "£0"},
        {item: "Net Cash Flow", annual: "£17,280", monthly: "£1,440"}
      ]
    },
    riskAssessment: [
      {risk: "Planning Permission", probability: "Medium", impact: "High", mitigation: "Pre-application consultation"},
      {risk: "Construction Overrun", probability: "Low", impact: "Medium", mitigation: "Fixed price contract"},
      {risk: "Market Conditions", probability: "Low", impact: "Medium", mitigation: "Conservative valuations"},
      {risk: "Letting Difficulty", probability: "Low", impact: "Low", mitigation: "Strong local demand"}
    ],
    implementationTimeline: [
      {phase: "Months 0-3", description: "Complete purchase • Secure planning • Tender construction"},
      {phase: "Months 4-12", description: "Commence construction • Pre-let units • Marketing campaign"},
      {phase: "Months 13-18", description: "Complete construction • Final lettings • Refinancing"}
    ],
    conclusion: {
      delivers: [
        "35% ROI within 18 months",
        "£159,200 net profit",
        "6.5% ongoing rental yield",
        "Diversified income streams"
      ],
      comparesTo: [
        "Standard BTL investment: 4-6% yield",
        "Commercial property: 5-7% yield"
      ],
      summary: "The mixed-use development strategy maximizes value through diversification while maintaining strong rental income potential."
    }
  }
}