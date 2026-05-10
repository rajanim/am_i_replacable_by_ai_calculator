# Am I Replaceable by AI?

![App Screenshot](./public/screenshot.png)

A viral, production-ready web application that calculates a user's AI automation exposure score based on their daily tasks. The app provides a score, personalized advice, a 30-day action plan, and a shareable LinkedIn card.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (Animations)
- Lucide React (Icons)
- NVIDIA API (Llama 3 models for dynamic analysis)
- html-to-image (for shareable card generation)

## Features
- **Smart Analysis**: Uses NVIDIA API (Meta Llama 3) for intelligent role analysis.
- **Graceful Degradation**: If no API key is provided, the app uses a deterministic fallback scoring algorithm to calculate a risk score.
- **Viral Sharing**: Generates downloadable Open Graph-style PNG cards and pre-written LinkedIn posts.
- **Sleek UI**: Built with a dark-mode-first, neon-accented aesthetic.

## Local Setup

1. **Clone the repository** (if not already done).
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Set up Environment Variables**:
   Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Then, add your \`OPENAI_API_KEY\` to \`.env.local\`. If you skip this, the app will still work using the fallback algorithm.
4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

### Option 1: Using the Vercel Dashboard
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the repository into Vercel.
3. In the "Environment Variables" section, add your \`OPENAI_API_KEY\`.
4. Click Deploy.

### Option 2: Using the Vercel CLI
1. Install the CLI globally:
   \`\`\`bash
   npm i -g vercel
   \`\`\`
2. Run Vercel:
   \`\`\`bash
   vercel
   \`\`\`
3. Follow the prompts to link your project.
4. Add the environment variable:
   \`\`\`bash
   vercel env add OPENAI_API_KEY
   \`\`\`
5. Deploy to production:
   \`\`\`bash
   vercel --prod
   \`\`\`

## Disclaimer
This application is designed for educational and entertainment purposes. It does not provide career, hiring, or employment advice, nor does it predict actual job loss.
