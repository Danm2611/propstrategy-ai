// Market Research Module for Property Analysis
// This module can be enhanced with real API integrations

interface PostcodeData {
  area: string
  district: string
  region: string
  averagePrice: number
  priceChange12m: number
  demographics: {
    medianAge: number
    households: number
    rentalPercentage: number
  }
  amenities: {
    transport: string[]
    schools: string[]
    shops: string[]
  }
}

interface MarketAnalysis {
  comparables: PropertyComparable[]
  marketTrends: MarketTrend[]
  rentalYields: RentalYield[]
  planningData: PlanningData
}

interface PropertyComparable {
  address: string
  price: number
  size: number
  pricePerSqFt: number
  soldDate: string
  daysOnMarket: number
}

interface MarketTrend {
  period: string
  priceChange: number
  volume: number
  averageDaysOnMarket: number
}

interface RentalYield {
  propertyType: string
  averageRent: number
  yieldPercentage: number
  demand: 'high' | 'medium' | 'low'
}

interface PlanningData {
  recentApplications: PlanningApplication[]
  localPolicies: string[]
  developmentOpportunities: string[]
}

interface PlanningApplication {
  reference: string
  description: string
  status: string
  distance: number
}

// Mock data generator (to be replaced with real API calls)
export async function getPostcodeAnalysis(postcode: string): Promise<PostcodeData> {
  // This would integrate with APIs like:
  // - Rightmove Property Data API
  // - Zoopla API
  // - ONS (Office for National Statistics)
  // - Open Street Map for amenities
  
  const mockData: PostcodeData = {
    area: postcode.substring(0, 2),
    district: postcode.substring(0, 4),
    region: getRegionFromPostcode(postcode),
    averagePrice: generateMockPrice(postcode),
    priceChange12m: (Math.random() - 0.5) * 20, // -10% to +10%
    demographics: {
      medianAge: 32 + Math.random() * 20,
      households: 1000 + Math.random() * 5000,
      rentalPercentage: 20 + Math.random() * 40,
    },
    amenities: {
      transport: ['Underground Station', 'Bus Routes', 'Main Road Access'],
      schools: ['Primary School (0.3mi)', 'Secondary School (0.8mi)'],
      shops: ['Local Shops', 'Supermarket (0.5mi)', 'Shopping Centre (1.2mi)']
    }
  }
  
  return mockData
}

export async function getMarketComparables(
  postcode: string, 
  propertyType: string,
  radius: number = 0.5
): Promise<PropertyComparable[]> {
  // Mock comparable properties
  const comparables: PropertyComparable[] = []
  
  for (let i = 0; i < 8; i++) {
    comparables.push({
      address: `${Math.floor(Math.random() * 200)} Sample Street, ${postcode.substring(0, 4)}`,
      price: 200000 + Math.random() * 400000,
      size: 800 + Math.random() * 1200,
      pricePerSqFt: 250 + Math.random() * 200,
      soldDate: getRandomDate(6), // Within last 6 months
      daysOnMarket: Math.floor(Math.random() * 120)
    })
  }
  
  return comparables
}

export async function analyzeRentalMarket(
  postcode: string,
  developmentTypes: string[]
): Promise<RentalYield[]> {
  const yields: RentalYield[] = []
  
  const baseYields: Record<string, number> = {
    'hmo': 8.5,
    'apartments': 5.5,
    'btl': 6.0,
    'serviced': 12.0,
    'student': 7.5,
    'care_facility': 10.0
  }
  
  for (const type of developmentTypes) {
    const baseYield = baseYields[type] || 6.0
    yields.push({
      propertyType: type,
      averageRent: 1000 + Math.random() * 1500,
      yieldPercentage: baseYield + (Math.random() - 0.5) * 2,
      demand: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any
    })
  }
  
  return yields
}

export async function getPlanningIntel(
  postcode: string,
  developmentType: string
): Promise<PlanningData> {
  // Mock planning data
  return {
    recentApplications: [
      {
        reference: 'APP/2024/001234',
        description: 'Change of use to HMO',
        status: 'Approved',
        distance: 0.2
      },
      {
        reference: 'APP/2024/005678',
        description: 'Residential development',
        status: 'Pending',
        distance: 0.4
      }
    ],
    localPolicies: [
      'Local Plan Policy H4: House in Multiple Occupation',
      'Supplementary Planning Document: Residential Conversions',
      'Article 4 Direction: Permitted Development Rights'
    ],
    developmentOpportunities: [
      'High demand for family housing',
      'Student accommodation shortage',
      'Commercial properties suitable for conversion'
    ]
  }
}

// Market Intelligence for Enhanced Reports
export async function generateMarketIntelligence(
  postcode: string,
  developmentGoals: string[]
): Promise<string> {
  try {
    // Gather all market data
    const [postcodeData, comparables, rentalYields, planningData] = await Promise.all([
      getPostcodeAnalysis(postcode),
      getMarketComparables(postcode, 'mixed'),
      analyzeRentalMarket(postcode, developmentGoals),
      getPlanningIntel(postcode, developmentGoals[0])
    ])
    
    // Generate market intelligence summary
    const avgPrice = comparables.reduce((sum, comp) => sum + comp.price, 0) / comparables.length
    const avgPricePerSqFt = comparables.reduce((sum, comp) => sum + comp.pricePerSqFt, 0) / comparables.length
    const avgDaysOnMarket = comparables.reduce((sum, comp) => sum + comp.daysOnMarket, 0) / comparables.length
    
    return `
    <div class="market-intelligence">
      <h3>📊 Market Intelligence Report</h3>
      
      <div class="row">
        <div class="col-md-6">
          <h4>Area Overview - ${postcode}</h4>
          <ul>
            <li><strong>Average Property Price:</strong> £${avgPrice.toLocaleString()}</li>
            <li><strong>Price per sq ft:</strong> £${avgPricePerSqFt.toFixed(0)}</li>
            <li><strong>12-month price change:</strong> ${postcodeData.priceChange12m > 0 ? '+' : ''}${postcodeData.priceChange12m.toFixed(1)}%</li>
            <li><strong>Average time on market:</strong> ${avgDaysOnMarket.toFixed(0)} days</li>
          </ul>
        </div>
        
        <div class="col-md-6">
          <h4>Demographics</h4>
          <ul>
            <li><strong>Median Age:</strong> ${postcodeData.demographics.medianAge.toFixed(0)} years</li>
            <li><strong>Rental Properties:</strong> ${postcodeData.demographics.rentalPercentage.toFixed(0)}%</li>
            <li><strong>Total Households:</strong> ${postcodeData.demographics.households.toLocaleString()}</li>
          </ul>
        </div>
      </div>
      
      <h4>🎯 Rental Yield Analysis</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Est. Monthly Rent</th>
            <th>Gross Yield</th>
            <th>Market Demand</th>
          </tr>
        </thead>
        <tbody>
          ${rentalYields.map(yieldData => `
            <tr>
              <td>${yieldData.propertyType.toUpperCase()}</td>
              <td>£${yieldData.averageRent.toLocaleString()}</td>
              <td>${yieldData.yieldPercentage.toFixed(1)}%</td>
              <td><span class="badge badge-${yieldData.demand === 'high' ? 'success' : yieldData.demand === 'medium' ? 'warning' : 'secondary'}">${yieldData.demand}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h4>🏗️ Planning Context</h4>
      <p><strong>Recent Applications:</strong> ${planningData.recentApplications.length} within 0.5 miles</p>
      <ul>
        ${planningData.recentApplications.map(app => `
          <li>${app.description} - <em>${app.status}</em> (${app.distance}mi away)</li>
        `).join('')}
      </ul>
    </div>
    `
  } catch (error) {
    console.error('Error generating market intelligence:', error)
    return '<p class="text-muted">Market intelligence temporarily unavailable</p>'
  }
}

// Helper functions
function getRegionFromPostcode(postcode: string): string {
  const regions: Record<string, string> = {
    'SW': 'South West London',
    'SE': 'South East London', 
    'N': 'North London',
    'E': 'East London',
    'W': 'West London',
    'NW': 'North West London',
    'EC': 'City of London',
    'WC': 'West Central London',
    'M': 'Manchester',
    'B': 'Birmingham',
    'L': 'Liverpool',
    // Add more mappings
  }
  
  const prefix = postcode.substring(0, 2).replace(/\d/g, '')
  return regions[prefix] || 'UK Region'
}

function generateMockPrice(postcode: string): number {
  // Generate realistic prices based on postcode
  const londonAreas = ['SW', 'SE', 'N', 'E', 'W', 'NW', 'EC', 'WC']
  const prefix = postcode.substring(0, 2)
  
  if (londonAreas.some(area => prefix.startsWith(area))) {
    return 400000 + Math.random() * 600000 // £400k - £1M for London
  }
  
  return 150000 + Math.random() * 300000 // £150k - £450k for other areas
}

function getRandomDate(monthsBack: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() - Math.random() * monthsBack)
  return date.toISOString().split('T')[0]
}