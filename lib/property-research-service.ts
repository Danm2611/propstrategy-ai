import { PropertyData } from './claude-enhanced'

interface PerplexityResponse {
  id: string
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  citations?: string[]
}

export class PropertyResearchService {
  private getPerplexityKey(): string {
    return process.env.PERPLEXITY_API_KEY || ''
  }

  constructor() {
    // Service initialized
  }

  async researchProperty(propertyData: PropertyData): Promise<string> {
    const perplexityKey = this.getPerplexityKey()
    
    if (!perplexityKey) {
      console.log('📊 Using basic property research (Perplexity API not configured)')
      return this.getBasicResearch(propertyData)
    }

    try {
      console.log('🔍 Researching property with Perplexity AI...')
      
      const researchPrompt = `
Research UK property investment opportunity at ${propertyData.propertyAddress}, ${propertyData.propertyPostcode}:

COMPREHENSIVE RESEARCH REQUIRED:

1. RECENT SALES DATA (Priority):
   - Find specific sold prices within 0.5 miles from last 6 months
   - Include exact addresses, sale dates, and prices
   - Focus on ${propertyData.propertyType} properties
   - Note property sizes and price per sq ft

2. RENTAL MARKET ANALYSIS:
   - Current rental listings in the area
   - Average rental rates for ${propertyData.propertyType}
   - HMO room rates if applicable
   - Tenant demand indicators
   - Void periods and occupancy rates

3. LOCAL AREA INTELLIGENCE:
   - Demographics and population growth
   - Major employers and employment rates
   - Transport links (stations, bus routes, motorways)
   - Universities and student population
   - Crime statistics by category
   - School ratings and catchment areas

4. DEVELOPMENT CONTEXT:
   - Planning applications in the area (last 12 months)
   - Approved developments and regeneration projects
   - Conservation areas or planning restrictions
   - Local authority development plans
   - Infrastructure improvements planned

5. INVESTMENT COMPARABLES:
   - Similar investment properties for sale
   - BTL yields in the area
   - HMO properties performance
   - Commercial property metrics if relevant

6. MARKET TRENDS:
   - Price growth last 5 years
   - Rental growth trends
   - Supply and demand dynamics
   - Future market predictions

Provide specific figures, percentages, and cite recent sources (2024-2025 preferred).
Include actual property addresses where available.
Focus on data relevant to a £${propertyData.purchasePrice.toLocaleString()} investment.
`

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro', // Using the professional model with web search
          messages: [
            {
              role: 'system',
              content: 'You are a UK property market research analyst. Provide detailed, factual information with specific numbers, addresses, and recent data. Always cite sources when available.'
            },
            {
              role: 'user',
              content: researchPrompt
            }
          ],
          temperature: 0.1, // Low temperature for factual accuracy
          max_tokens: 4000,
          return_citations: true,
          return_related_questions: false,
          search_recency_filter: 'month', // Focus on recent data
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Perplexity API error:', errorText)
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`)
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices[0]?.message?.content || ''
      
      console.log('✅ Perplexity research completed')
      
      // Format the research with citations if available
      let formattedResearch = content
      if (data.citations && data.citations.length > 0) {
        formattedResearch += '\n\n📚 SOURCES:\n'
        data.citations.forEach((citation, index) => {
          formattedResearch += `[${index + 1}] ${citation}\n`
        })
      }

      return formattedResearch
    } catch (error) {
      console.error('❌ Perplexity API error:', error)
      console.log('📊 Falling back to basic research')
      return this.getBasicResearch(propertyData)
    }
  }

  async searchComparables(postcode: string, propertyType: string): Promise<string> {
    const perplexityKey = this.getPerplexityKey()
    if (!perplexityKey) {
      return 'No comparable search available without Perplexity API'
    }

    try {
      console.log('🏠 Searching comparable properties...')
      
      const comparablesPrompt = `
Search for UK property comparables in ${postcode} area:

1. RECENT SOLD PRICES (Priority):
   - Search Rightmove sold prices for ${propertyType} in ${postcode}
   - Include properties sold in 2024-2025
   - List specific addresses, prices, dates, bedrooms, sq ft
   - Calculate price per sq ft

2. CURRENT LISTINGS:
   - Active listings on Rightmove and Zoopla
   - ${propertyType} properties for sale
   - Price ranges and time on market
   - Include asking prices and property details

3. RENTAL COMPARABLES:
   - Current rental listings in ${postcode}
   - Monthly rents for ${propertyType}
   - Yield calculations based on asking prices
   - HMO room rates if applicable

Format as a table with columns: Address | Type | Beds | Price/Rent | Date | £/sqft | Source

Focus on properties within 0.5 miles of the postcode center.
`

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'user',
              content: comparablesPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000,
          return_citations: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`)
      }

      const data: PerplexityResponse = await response.json()
      return data.choices[0]?.message?.content || 'No comparables found'
    } catch (error) {
      console.error('❌ Comparables search error:', error)
      return 'Comparables search unavailable'
    }
  }

  private getBasicResearch(propertyData: PropertyData): string {
    // Fallback to the existing basic research if Perplexity is not available
    return `
MARKET RESEARCH FOR ${propertyData.propertyPostcode}:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ LIMITED DATA MODE - Perplexity API not configured
Consider adding PERPLEXITY_API_KEY for comprehensive market research

PROPERTY OVERVIEW:
• Address: ${propertyData.propertyAddress}
• Type: ${propertyData.propertyType}
• Purchase Price: £${propertyData.purchasePrice.toLocaleString()}
• Condition: ${propertyData.currentCondition}

GENERAL MARKET INDICATORS (Estimates):
• Typical yields for ${propertyData.propertyType}: 5-8%
• Average rental demand: Moderate to High
• Capital growth potential: 3-5% annually

Note: For accurate comparables and specific market data, 
configure Perplexity API or use manual research.
`
  }
}

// Export singleton instance
export const propertyResearchService = new PropertyResearchService()