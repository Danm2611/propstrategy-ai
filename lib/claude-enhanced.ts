import Anthropic from '@anthropic-ai/sdk'
import { generateMarketIntelligence } from './market-research'
import { generateRealMarketIntelligence } from './property-apis'
import { propertyResearchService } from './property-research-service'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface PropertyData {
  propertyAddress: string
  propertyPostcode: string
  purchasePrice: number
  propertyType: string
  currentCondition: string
  propertySize?: number
  numberOfUnits?: number
  developmentGoals: string[]
  additionalNotes?: string
  reportType: string
}

// Enhanced prompts for better research and analysis
const ENHANCED_SYSTEM_PROMPT = `You are PropStrategy AI, an elite property investment analyst specializing in UK real estate development. You combine deep market knowledge with data-driven insights to provide institutional-grade property analysis.

Your analysis methodology includes:
1. Comprehensive location analysis using postcode data
2. Current market trends and comparable sales analysis
3. Planning permission feasibility and local authority considerations
4. Detailed financial modeling with sensitivity analysis
5. Risk-adjusted returns and scenario planning
6. Construction cost estimates based on BCIS data
7. Exit strategy optimization

Format your response as a professional HTML report with:
- Executive Summary with key metrics and recommendations
- Detailed Property & Location Analysis
- Market Research & Comparables
- Development Strategy Analysis (for each requested strategy)
- Financial Projections with detailed breakdowns
- Risk Matrix with mitigation strategies
- Implementation Roadmap with critical milestones
- Professional Recommendations with confidence levels

Use professional formatting with tables, charts references, and color-coded risk indicators.
Include specific data points, percentages, ROI calculations, and market references.
Cite relevant planning policies, market reports, and industry standards where applicable.`

const LOCATION_RESEARCH_PROMPT = `For the postcode area, analyze:
- Demographics and target market
- Local amenities and transport links
- School catchment areas and ratings
- Crime statistics and neighborhood safety
- Planning history and local development plans
- Rental demand and average yields
- Property price trends (last 5 years)
- Competition analysis`

const FINANCIAL_MODELING_PROMPT = `Provide detailed financial projections including:
- Development costs breakdown (construction, professional fees, contingency)
- Revenue projections with market comparables
- Cash flow analysis with monthly breakdowns
- ROI, IRR, and payback period calculations
- Sensitivity analysis for key variables
- Financing options and leverage scenarios
- Tax implications and allowances`

export async function analyzePropertyEnhanced(data: PropertyData) {
  // Generate REAL market intelligence using free APIs
  console.log('🔍 Fetching live property data...')
  const realMarketIntelligence = await generateRealMarketIntelligence(
    data.propertyPostcode,
    data.propertyType,
    data.developmentGoals
  )
  
  // Get comprehensive web research using Perplexity
  console.log('🌐 Conducting comprehensive web research...')
  const perplexityResearch = await propertyResearchService.researchProperty(data)
  
  // Search for specific comparables
  console.log('🏘️ Searching for comparable properties...')
  const comparablesData = await propertyResearchService.searchComparables(
    data.propertyPostcode,
    data.propertyType
  )
  
  // Build comprehensive analysis prompt
  const userPrompt = `Please provide an institutional-grade property investment analysis for:

PROPERTY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: ${data.propertyAddress}, ${data.propertyPostcode}
Purchase Price: £${data.purchasePrice.toLocaleString()}
Property Type: ${data.propertyType}
Current Condition: ${data.currentCondition}
${data.propertySize ? `Size: ${data.propertySize} sq ft` : ''}
${data.numberOfUnits ? `Current Units: ${data.numberOfUnits}` : ''}

DEVELOPMENT STRATEGIES TO ANALYZE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.developmentGoals.map(goal => `• ${formatGoal(goal)}`).join('\n')}

${data.additionalNotes ? `ADDITIONAL CONTEXT:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.additionalNotes}` : ''}

REPORT REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report Type: ${data.reportType}
Analysis Depth: ${getReportDepth(data.reportType)}

Please conduct thorough research and analysis including:
${LOCATION_RESEARCH_PROMPT}

${FINANCIAL_MODELING_PROMPT}

For each development strategy, provide:
1. Feasibility assessment with confidence score
2. Detailed cost breakdown
3. Revenue projections with market evidence
4. Timeline with key milestones
5. Specific risks and mitigation strategies
6. Expected returns (ROI, IRR, Cash-on-Cash)

Include market data references, planning considerations, and professional recommendations backed by evidence.

COMPREHENSIVE WEB RESEARCH (Perplexity AI):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${perplexityResearch}

COMPARABLE PROPERTIES ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${comparablesData}

LIVE MARKET INTELLIGENCE DATA (Land Registry):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${realMarketIntelligence}

ANALYSIS REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Using ALL the research data above, provide:

1. **Comparable Analysis**: Reference specific sold properties with addresses, prices, and dates from BOTH Perplexity research AND Land Registry data
2. **Market Positioning**: Compare the subject property against recent sales and current listings
3. **Pricing Strategy**: Based on actual market evidence from multiple sources
4. **Investment Rationale**: Support recommendations with real transaction data and market trends
5. **Risk Assessment**: Use actual market trends, crime data, and demographic information
6. **Development Feasibility**: Consider planning precedents and local development activity

IMPORTANT: Cross-reference data from all three sources (Perplexity, Comparables Search, and Land Registry) to provide the most accurate and comprehensive analysis.

Ensure all financial projections and recommendations are backed by the real market data provided above.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192, // Increased for more detailed reports
      messages: [{
        role: 'user',
        content: userPrompt
      }],
      system: ENHANCED_SYSTEM_PROMPT,
      temperature: 0.7, // Balanced creativity and accuracy
    })

    const content = response.content[0]
    if (content.type === 'text') {
      // Post-process to ensure quality formatting
      const enhancedHtml = enhanceHtmlOutput(content.text)
      
      return {
        html: enhancedHtml,
        usage: response.usage,
      }
    }

    throw new Error('Unexpected response format from Claude')
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error('Failed to generate property analysis')
  }
}

function enhanceHtmlOutput(html: string): string {
  // Add Bootstrap classes and custom styling
  let enhanced = html
  
  // Add responsive tables
  enhanced = enhanced.replace(/<table>/g, '<table class="table table-striped table-hover">')
  
  // Add alert styling for key metrics
  enhanced = enhanced.replace(/\[ALERT\](.*?)\[\/ALERT\]/g, '<div class="alert alert-info">$1</div>')
  enhanced = enhanced.replace(/\[WARNING\](.*?)\[\/WARNING\]/g, '<div class="alert alert-warning">$1</div>')
  enhanced = enhanced.replace(/\[SUCCESS\](.*?)\[\/SUCCESS\]/g, '<div class="alert alert-success">$1</div>')
  
  // Add section styling
  enhanced = enhanced.replace(/<h2>/g, '<h2 class="mt-5 mb-3 border-bottom pb-2">')
  enhanced = enhanced.replace(/<h3>/g, '<h3 class="mt-4 mb-2">')
  
  return enhanced
}

function formatGoal(goal: string): string {
  const goalMap: Record<string, string> = {
    hmo: 'HMO (House in Multiple Occupation) Conversion - Student/Professional Accommodation',
    apartments: 'Apartment/Flat Development - Residential Units Creation',
    flip: 'Renovate and Flip Strategy - Quick Turnaround Investment',
    btl: 'Buy-to-Let Investment - Long-term Rental Income',
    commercial_residential: 'Commercial to Residential Conversion - Change of Use Development',
    serviced: 'Serviced Accommodation - Short-term Rental Business',
    care_facility: 'Care Home/Assisted Living Facility - Specialized Accommodation',
    student: 'Student Accommodation - Purpose-built Student Housing',
  }
  return goalMap[goal] || goal
}

function getReportDepth(reportType: string): string {
  switch (reportType) {
    case 'basic':
      return 'Essential analysis with key metrics and recommendations'
    case 'professional':
      return 'Comprehensive analysis with detailed financials and market research'
    case 'development':
      return 'Institutional-grade analysis with granular costing, phasing, and professional team requirements'
    default:
      return 'Comprehensive analysis'
  }
}

// Additional specialized analysis functions
export async function analyzeMarketComparables(postcode: string) {
  const prompt = `Analyze recent property sales and rental data for ${postcode} area including:
  - Recent sales within 0.5 miles (last 6 months)
  - Current listings and time on market
  - Rental yields by property type
  - Price per square foot trends
  - Supply and demand dynamics`
  
  // This could be enhanced with real API calls to property databases
  return prompt
}

export async function analyzePlanningPotential(address: string, developmentType: string) {
  const prompt = `Assess planning permission likelihood for ${developmentType} at ${address}:
  - Local planning policies and precedents
  - Recent planning applications in area
  - Conservation areas or restrictions
  - Permitted development rights
  - Pre-application advice recommendations`
  
  return prompt
}

export async function calculateDevelopmentCosts(
  propertySize: number,
  developmentType: string,
  condition: string
) {
  // Basic cost estimation model
  const baseCosts: Record<string, number> = {
    hmo: 250, // £ per sq ft
    apartments: 350,
    flip: 150,
    btl: 100,
    commercial_residential: 400,
    serviced: 300,
    care_facility: 500,
    student: 400,
  }
  
  const conditionMultiplier: Record<string, number> = {
    'excellent': 0.5,
    'good': 0.8,
    'fair': 1.0,
    'poor': 1.3,
    'derelict': 1.6,
  }
  
  const baseCost = baseCosts[developmentType] || 200
  const multiplier = conditionMultiplier[condition.toLowerCase()] || 1.0
  
  return {
    constructionCost: propertySize * baseCost * multiplier,
    professionalFees: propertySize * baseCost * multiplier * 0.15,
    contingency: propertySize * baseCost * multiplier * 0.10,
    total: propertySize * baseCost * multiplier * 1.25
  }
}