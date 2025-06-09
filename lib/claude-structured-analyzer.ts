import Anthropic from '@anthropic-ai/sdk'
import { PropertyData } from './claude-enhanced'
import { propertyResearchService } from './property-research-service'
import { generateRealMarketIntelligence } from './property-apis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface StructuredAnalysis {
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

const STRUCTURED_ANALYSIS_PROMPT = `You are PropStrategy AI, an elite UK property investment analyst. You must provide a comprehensive investment analysis in EXACTLY the JSON structure specified below.

CRITICAL REQUIREMENTS:
1. Analyze ALL development strategies requested (HMO, apartments, BTL, commercial conversion, etc.)
2. Compare strategies and recommend the OPTIMAL one
3. Use REAL market data provided to calculate accurate figures
4. Include detailed rental comparables and sale comparables
5. Provide specific financial projections with monthly/annual breakdowns
6. Calculate accurate ROI, yields, and profit margins
7. Include comprehensive risk assessment
8. Structure response as valid JSON ONLY

ANALYSIS DEPTH REQUIREMENTS:
- Professional-grade financial modeling
- Detailed cost breakdowns per strategy
- Market positioning analysis
- Rental yield calculations based on actual market rates
- Exit strategy valuation using comparable evidence
- Comprehensive risk matrix with specific mitigation strategies
- Implementation timeline with critical milestones

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:`

export async function generateStructuredPropertyAnalysis(propertyData: PropertyData): Promise<StructuredAnalysis> {
  // Get comprehensive research data
  console.log('🔍 Gathering comprehensive market intelligence...')
  
  try {
    const [perplexityResearch, comparablesData, landRegistryData] = await Promise.all([
      propertyResearchService.researchProperty(propertyData),
      propertyResearchService.searchComparables(propertyData.propertyPostcode, propertyData.propertyType),
      generateRealMarketIntelligence(propertyData.propertyPostcode, propertyData.propertyType, propertyData.developmentGoals)
    ])
    console.log('✅ Market research completed')
  } catch (researchError) {
    console.error('❌ Research failed:', researchError)
    // Continue with basic analysis if research fails
    var perplexityResearch = { analysis: 'Basic analysis - research unavailable' }
    var comparablesData = { sales: [], rentals: [] }
    var landRegistryData = { marketIntelligence: 'Market data unavailable' }
  }

  const prompt = `${STRUCTURED_ANALYSIS_PROMPT}

{
  "executiveSummary": {
    "strategy": "PRIMARY RECOMMENDED STRATEGY (detailed description)",
    "investmentRequired": "£XXX,XXX",
    "capitalReturned": "£XXX,XXX", 
    "portfolioRetained": "£XXX,XXX",
    "netAnnualIncome": "£XX,XXX"
  },
  "keyMetrics": {
    "totalROI": "XX.X%",
    "netProfit": "£XXXk",
    "timeline": "XX mo", 
    "cashYield": "X.X%"
  },
  "transactionStructure": {
    "acquisitionCosts": [
      {"component": "Purchase Price", "value": "£XXX,XXX"},
      {"component": "Stamp Duty (X%)", "value": "£XX,XXX"},
      {"component": "Legal & Professional Fees", "value": "£X,XXX"},
      {"component": "Survey & Due Diligence", "value": "£X,XXX"},
      {"component": "Total Acquisition Cost", "value": "£XXX,XXX"}
    ],
    "financingStructure": [
      {"source": "Purchase Finance", "amount": "£XXX,XXX", "ltvLtc": "XX%"},
      {"source": "Development Finance", "amount": "£XXX,XXX", "ltvLtc": "XX%"},
      {"source": "Total Debt", "amount": "£XXX,XXX"},
      {"source": "Equity Required", "amount": "£XXX,XXX", "ltvLtc": "XX%"}
    ]
  },
  "developmentCosts": {
    "constructionBudget": [
      {"item": "Building Works", "totalCost": "£XXX,XXX", "perUnit": "£XX,XXX"},
      {"item": "M&E Installation", "totalCost": "£XX,XXX", "perUnit": "£X,XXX"},
      {"item": "Professional Fees", "totalCost": "£XX,XXX", "perUnit": "£X,XXX"},
      {"item": "Contingency (10%)", "totalCost": "£XX,XXX", "perUnit": "£X,XXX"},
      {"item": "Total Construction", "totalCost": "£XXX,XXX", "perUnit": "£XX,XXX"}
    ],
    "totalDevelopmentInvestment": [
      {"item": "Acquisition Costs", "cost": "£XXX,XXX"},
      {"item": "Construction Costs", "cost": "£XXX,XXX"},
      {"item": "Net Holding Costs", "cost": "£XX,XXX"},
      {"item": "Total Project Cost", "cost": "£XXX,XXX"}
    ]
  },
  "exitStrategy": {
    "components": [
      {"property": "Unit/Component 1", "type": "1-bed apt", "currentRent": "£XXX pcm", "saleValue": "£XXX,XXX", "netProceeds": "£XXX,XXX"},
      {"property": "Total", "type": "", "currentRent": "£X,XXX pcm", "saleValue": "£XXX,XXX", "netProceeds": "£XXX,XXX"}
    ]
  },
  "comparables": {
    "apartmentSales": [
      {"development": "Specific Address/Development", "type": "1-bed apt", "price": "£XXX,XXX", "pricePerSqft": "£XXX", "date": "Mon YYYY", "source": "Rightmove/Zoopla"},
      {"development": "Average", "type": "", "price": "£XXX,XXX", "pricePerSqft": "£XXX", "date": "", "source": ""}
    ],
    "portfolioComparables": [
      {"portfolio": "Local Portfolio Name", "location": "Area", "units": "X", "totalPrice": "£XXX,XXX", "perUnit": "£XX,XXX", "yield": "X.X%"}
    ]
  },
  "financialReturns": {
    "returnMetrics": [
      {"metric": "Total Equity Invested", "value": "£XXX,XXX"},
      {"metric": "Portfolio Value", "value": "£XXX,XXX"},
      {"metric": "Development Costs", "value": "(£XXX,XXX)"},
      {"metric": "Net Position", "value": "£XXX,XXX"},
      {"metric": "Profit", "value": "£XXX,XXX"},
      {"metric": "ROI", "value": "XX.X%"}
    ],
    "ongoingIncome": [
      {"item": "Gross Rental Income", "annual": "£XX,XXX", "monthly": "£X,XXX"},
      {"item": "Operating Expenses (XX%)", "annual": "(£X,XXX)", "monthly": "(£XXX)"},
      {"item": "Net Operating Income", "annual": "£XX,XXX", "monthly": "£X,XXX"},
      {"item": "Debt Service", "annual": "(£XX,XXX)", "monthly": "(£X,XXX)"},
      {"item": "Net Cash Flow", "annual": "£XX,XXX", "monthly": "£X,XXX"}
    ]
  },
  "riskAssessment": [
    {"risk": "Planning Permission", "probability": "Low/Medium/High", "impact": "Low/Medium/High", "mitigation": "Specific mitigation strategy"},
    {"risk": "Construction Overrun", "probability": "Low/Medium/High", "impact": "Low/Medium/High", "mitigation": "Specific mitigation strategy"}
  ],
  "implementationTimeline": [
    {"phase": "Months 0-X", "description": "Specific activities and milestones"},
    {"phase": "Months X-XX", "description": "Specific activities and milestones"}
  ],
  "conclusion": {
    "delivers": [
      "XX.X% ROI within XX months",
      "£XXX,XXX net profit", 
      "X.X% ongoing cash yield"
    ],
    "comparesTo": [
      "Alternative strategy 1: X.X% ROI",
      "Alternative strategy 2: X.X% yield"
    ],
    "summary": "Detailed conclusion explaining why this is the optimal strategy"
  }
}

PROPERTY TO ANALYZE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: ${propertyData.propertyAddress}, ${propertyData.propertyPostcode}
Purchase Price: £${propertyData.purchasePrice.toLocaleString()}
Property Type: ${propertyData.propertyType}
Current Condition: ${propertyData.currentCondition}
${propertyData.propertySize ? `Size: ${propertyData.propertySize} sq ft` : ''}
${propertyData.numberOfUnits ? `Current Units: ${propertyData.numberOfUnits}` : ''}

DEVELOPMENT STRATEGIES TO ANALYZE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${propertyData.developmentGoals.map(goal => `• ${formatGoal(goal)}`).join('\n')}

COMPREHENSIVE WEB RESEARCH (Perplexity AI):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${perplexityResearch}

COMPARABLE PROPERTIES ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${comparablesData}

LIVE MARKET INTELLIGENCE DATA (Land Registry):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${landRegistryData}

ANALYSIS REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. **Strategy Comparison**: Analyze EACH development goal and compare returns
2. **Rental Analysis**: Use actual rental rates from research for yield calculations
3. **Sale Comparables**: Use specific property addresses and prices from research
4. **Financial Modeling**: Calculate accurate ROI, IRR, and cash-on-cash returns
5. **Risk Assessment**: Include market, planning, construction, and financial risks
6. **Implementation**: Provide detailed timeline with specific milestones

CRITICAL: Use the market research data above to provide accurate rental rates, sale prices, and market positioning. All figures must be backed by the real data provided.`

  try {
    console.log('🧠 Generating structured analysis with Claude...')
    
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.3, // Lower temperature for more structured output
    })

    const content = response.content[0]
    if (content.type === 'text') {
      try {
        // Extract JSON from the response
        const jsonMatch = content.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('No JSON found in response')
        }
        
        const analysisData = JSON.parse(jsonMatch[0]) as StructuredAnalysis
        console.log('✅ Structured analysis generated successfully')
        return analysisData
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError)
        console.log('Raw response:', content.text)
        throw new Error('Failed to parse structured analysis from Claude')
      }
    }

    throw new Error('Unexpected response format from Claude')
  } catch (error) {
    console.error('Claude API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      apiKeyExists: !!process.env.ANTHROPIC_API_KEY,
      apiKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0
    })
    throw new Error(`Failed to generate structured property analysis: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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