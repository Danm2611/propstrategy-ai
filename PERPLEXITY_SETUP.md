# Perplexity API Setup Guide

## Overview
The property analysis system now integrates with Perplexity AI to provide comprehensive web research, including:
- Recent property sales data
- Current rental market analysis
- Local area demographics
- Planning applications and developments
- Crime statistics and school ratings
- Market trends and predictions

## Setup Instructions

### 1. Add API Key to Environment
Add your Perplexity API key to your `.env.local` file:

```bash
PERPLEXITY_API_KEY=pplx-YOUR_API_KEY_HERE
```

### 2. API Key Provided
Your API key is: `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`

### 3. Perplexity API Details
- **Monthly Cost**: $20/month for unlimited API usage
- **Model Used**: `sonar-medium-online` (most cost-effective)
- **Features**:
  - Real-time web search
  - Source citations
  - Recent data focus (last 30 days priority)
  - Low temperature for factual accuracy

## How It Works

When a property analysis is requested:

1. **Land Registry Data** - Fetches official sold prices (free API)
2. **Perplexity Research** - Comprehensive web search for:
   - Recent comparable sales
   - Current listings
   - Area demographics
   - Transport and amenities
   - Development activity
3. **Comparables Search** - Targeted search for specific properties
4. **Claude Analysis** - Combines all data for final report

## Testing the Integration

1. Ensure your `.env.local` has the Perplexity API key
2. Restart your Next.js development server
3. Create a new property analysis
4. Check the console for research progress messages:
   ```
   🔍 Fetching live property data...
   🌐 Conducting comprehensive web research...
   🏘️ Searching for comparable properties...
   ```

## Fallback Behavior

If the Perplexity API key is not set:
- The system will still work using Land Registry data only
- A warning will appear in the console
- The PDF will note "LIMITED DATA MODE"

## API Usage Monitoring

Monitor your Perplexity API usage at: https://console.perplexity.ai

## Troubleshooting

### API Key Not Working
- Check for typos in the `.env.local` file
- Ensure no extra spaces or quotes around the key
- Restart the Next.js server after adding the key

### Rate Limits
- Perplexity has generous rate limits for paid accounts
- If you hit limits, the system falls back to basic research

### No Research Data
- Check browser console for error messages
- Verify API key is correctly set
- Check Perplexity API status

## Benefits of Perplexity Integration

1. **Better Comparables**: Finds specific recent sales with addresses
2. **Market Intelligence**: Current listings, rental rates, demographics
3. **Planning Context**: Recent applications and development activity
4. **Risk Assessment**: Crime data, flood risk, environmental factors
5. **Source Citations**: All data comes with verifiable sources

This integration significantly improves the quality and accuracy of property investment reports.