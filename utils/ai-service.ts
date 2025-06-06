import { Platform } from "react-native";
import { UserProfile, UserRole, StartupStage, CompatibilityFactor, BusinessPlanData, PitchDeckData } from "@/types";

type ContentPart = 
  | { type: 'text'; text: string; }
  | { type: 'image'; image: string; }

type CoreMessage = 
  | { role: 'system'; content: string; }  
  | { role: 'user'; content: string | Array<ContentPart>; }
  | { role: 'assistant'; content: string | Array<ContentPart>; };

export async function generateMatchReasons(
  userProfile: UserProfile,
  potentialMatch: UserProfile
): Promise<string[]> {
  try {
    const systemPrompt = getSystemPromptForRole(userProfile.role, potentialMatch.role);
    const userPrompt = getUserPromptForMatching(userProfile, potentialMatch);

    const messages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate match reasons");
    }

    const data = await response.json();
    const reasons = data.completion
      .split(/\d+\./)
      .filter((reason: string) => reason.trim().length > 0)
      .map((reason: string) => reason.trim())
      .slice(0, 3);

    return reasons;
  } catch (error) {
    console.error("Error generating match reasons:", error);
    return getDefaultMatchReasons(userProfile.role, potentialMatch.role);
  }
}

function getSystemPromptForRole(userRole: UserRole, matchRole: UserRole): string {
  if (userRole === UserRole.FOUNDER && matchRole === UserRole.CO_FOUNDER) {
    return `You are an AI assistant for a startup co-founder matching platform. 
    Analyze the profiles of a founder looking for a co-founder and identify 3 specific reasons why they would make good partners. 
    Focus on complementary skills, aligned vision, and startup synergy.`;
  } else if (userRole === UserRole.FOUNDER && matchRole === UserRole.INVESTOR) {
    return `You are an AI assistant for a startup-investor matching platform. 
    Analyze why this investor would be a good fit for this founder's startup. 
    Focus on investment stage alignment, sector expertise, and value-add potential.`;
  } else if (userRole === UserRole.FOUNDER && matchRole === UserRole.MENTOR) {
    return `You are an AI assistant for a founder-mentor matching platform. 
    Analyze why this mentor would be valuable for this founder's journey. 
    Focus on domain expertise, experience relevance, and guidance potential.`;
  }
  
  return `You are an AI assistant for a professional networking platform. 
  Analyze why these two professionals would benefit from connecting.`;
}

function getUserPromptForMatching(userProfile: UserProfile, potentialMatch: UserProfile): string {
  const baseInfo = `
    User Profile:
    Name: ${userProfile.name}
    Role: ${userProfile.role}
    Skills: ${userProfile.skills.join(", ")}
    Industry: ${userProfile.industry || "Not specified"}
    Location: ${userProfile.location}
    Stage: ${userProfile.stage || "Not specified"}
    Looking For: ${userProfile.lookingFor?.join(", ") || "Not specified"}
    
    Potential Match:
    Name: ${potentialMatch.name}
    Role: ${potentialMatch.role}
    Skills: ${potentialMatch.skills.join(", ")}
    Industry: ${potentialMatch.industry || "Not specified"}
    Location: ${potentialMatch.location}
  `;

  if (potentialMatch.role === UserRole.INVESTOR) {
    return baseInfo + `
    Investment Focus: ${potentialMatch.investmentFocus?.join(", ") || "Not specified"}
    Investment Range: ${potentialMatch.investmentRange || "Not specified"}
    Portfolio: ${potentialMatch.portfolioCompanies?.join(", ") || "Not specified"}
    
    List exactly 3 specific reasons why this investor would be a good match for this founder.`;
  } else if (potentialMatch.role === UserRole.MENTOR) {
    return baseInfo + `
    Mentoring Areas: ${potentialMatch.mentoringAreas?.join(", ") || "Not specified"}
    Experience: ${potentialMatch.experience || "Not specified"}
    Availability: ${potentialMatch.availability || "Not specified"}
    
    List exactly 3 specific reasons why this mentor would be valuable for this founder.`;
  } else {
    return baseInfo + `
    Startup Idea: ${potentialMatch.startupIdea || "Not specified"}
    Vision: ${potentialMatch.vision || "Not specified"}
    
    List exactly 3 specific reasons why these two people would make good co-founders together.`;
  }
}

function getDefaultMatchReasons(userRole: UserRole, matchRole: UserRole): string[] {
  if (matchRole === UserRole.INVESTOR) {
    return [
      "Investment stage aligns with your current funding needs",
      "Strong track record in your industry sector",
      "Provides strategic value beyond just capital"
    ];
  } else if (matchRole === UserRole.MENTOR) {
    return [
      "Deep expertise in your industry domain",
      "Proven experience scaling similar businesses",
      "Available to provide ongoing guidance and support"
    ];
  } else {
    return [
      "Complementary skill sets that fill each other's gaps",
      "Similar startup stage and vision alignment",
      "Both bring unique strengths to the partnership"
    ];
  }
}

export async function calculateMatchScore(
  userProfile: UserProfile,
  potentialMatch: UserProfile
): Promise<number> {
  const compatibilityFactors = calculateCompatibilityFactors(userProfile, potentialMatch);
  
  // Calculate weighted score based on user role and match type
  let totalScore = 0;
  let totalWeight = 0;

  compatibilityFactors.forEach(factor => {
    const weight = getFactorWeight(factor.factor, userProfile.role, potentialMatch.role);
    totalScore += factor.score * weight;
    totalWeight += weight;
  });

  const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  return Math.min(Math.round(finalScore), 99);
}

function calculateCompatibilityFactors(
  userProfile: UserProfile,
  potentialMatch: UserProfile
): CompatibilityFactor[] {
  const factors: CompatibilityFactor[] = [];

  // Skill complementarity
  const skillMatch = calculateSkillMatch(userProfile, potentialMatch);
  factors.push({
    factor: "skill_complementarity",
    score: skillMatch,
    description: "How well your skills complement each other"
  });

  // Location proximity
  const locationMatch = calculateLocationMatch(userProfile, potentialMatch);
  factors.push({
    factor: "location_proximity",
    score: locationMatch,
    description: "Geographic compatibility for collaboration"
  });

  // Stage alignment (for founders)
  if (userProfile.role === UserRole.FOUNDER && potentialMatch.role === UserRole.CO_FOUNDER) {
    const stageAlignment = calculateStageAlignment(userProfile, potentialMatch);
    factors.push({
      factor: "stage_alignment",
      score: stageAlignment,
      description: "Startup stage compatibility"
    });
  }

  // Investment alignment (for investors)
  if (potentialMatch.role === UserRole.INVESTOR) {
    const investmentAlignment = calculateInvestmentAlignment(userProfile, potentialMatch);
    factors.push({
      factor: "investment_alignment",
      score: investmentAlignment,
      description: "Investment criteria and stage match"
    });
  }

  // Industry expertise (for mentors)
  if (potentialMatch.role === UserRole.MENTOR) {
    const industryExpertise = calculateIndustryExpertise(userProfile, potentialMatch);
    factors.push({
      factor: "industry_expertise",
      score: industryExpertise,
      description: "Relevant industry experience and knowledge"
    });
  }

  // Availability match
  const availabilityMatch = calculateAvailabilityMatch(userProfile, potentialMatch);
  factors.push({
    factor: "availability_match",
    score: availabilityMatch,
    description: "Time commitment and availability alignment"
  });

  return factors;
}

function calculateSkillMatch(userProfile: UserProfile, potentialMatch: UserProfile): number {
  const userSkills = new Set(userProfile.skills);
  const matchSkills = new Set(potentialMatch.skills);
  const userLookingFor = new Set(userProfile.lookingFor || []);
  const matchLookingFor = new Set(potentialMatch.lookingFor || []);

  // Calculate how many skills the match has that the user is looking for
  const skillsMatchHas = Array.from(matchSkills).filter(skill => userLookingFor.has(skill));
  const skillsUserHas = Array.from(userSkills).filter(skill => matchLookingFor.has(skill));

  const userSatisfaction = skillsMatchHas.length / Math.max(1, userLookingFor.size);
  const matchSatisfaction = skillsUserHas.length / Math.max(1, matchLookingFor.size);

  return (userSatisfaction + matchSatisfaction) / 2;
}

function calculateLocationMatch(userProfile: UserProfile, potentialMatch: UserProfile): number {
  const userCity = userProfile.location.split(",")[0].trim().toLowerCase();
  const matchCity = potentialMatch.location.split(",")[0].trim().toLowerCase();
  
  if (userCity === matchCity) return 1.0;
  
  // Check if same country/state
  const userLocation = userProfile.location.toLowerCase();
  const matchLocation = potentialMatch.location.toLowerCase();
  
  if (userLocation.includes(matchLocation) || matchLocation.includes(userLocation)) {
    return 0.7;
  }
  
  return 0.3; // Different locations but still possible to collaborate
}

function calculateStageAlignment(userProfile: UserProfile, potentialMatch: UserProfile): number {
  const userStage = userProfile.stage || StartupStage.IDEATION;
  const matchStage = potentialMatch.stage || StartupStage.IDEATION;
  
  const stageValues = Object.values(StartupStage);
  const userStageIndex = stageValues.indexOf(userStage);
  const matchStageIndex = stageValues.indexOf(matchStage);
  const stageDistance = Math.abs(userStageIndex - matchStageIndex);
  
  return Math.max(0, 1 - (stageDistance / stageValues.length));
}

function calculateInvestmentAlignment(userProfile: UserProfile, potentialMatch: UserProfile): number {
  let score = 0;
  let factors = 0;

  // Check if investor focuses on user's industry
  if (potentialMatch.investmentFocus && userProfile.industry) {
    const focusMatch = potentialMatch.investmentFocus.includes(userProfile.industry);
    score += focusMatch ? 1 : 0.3;
    factors++;
  }

  // Check stage alignment for investment
  if (potentialMatch.sectors) {
    const userStage = userProfile.stage || StartupStage.IDEATION;
    const stageMatch = isInvestmentStageMatch(userStage, potentialMatch.sectors);
    score += stageMatch ? 1 : 0.2;
    factors++;
  }

  return factors > 0 ? score / factors : 0.5;
}

function calculateIndustryExpertise(userProfile: UserProfile, potentialMatch: UserProfile): number {
  let score = 0;
  let factors = 0;

  // Check if mentor has experience in user's industry
  if (potentialMatch.mentoringAreas && userProfile.industry) {
    const industryMatch = potentialMatch.mentoringAreas.includes(userProfile.industry);
    score += industryMatch ? 1 : 0.3;
    factors++;
  }

  // Check if mentor has relevant skills
  if (potentialMatch.skills && userProfile.lookingFor) {
    const skillOverlap = potentialMatch.skills.filter(skill => 
      userProfile.lookingFor?.includes(skill)
    ).length;
    score += skillOverlap / Math.max(1, userProfile.lookingFor.length);
    factors++;
  }

  return factors > 0 ? score / factors : 0.5;
}

function calculateAvailabilityMatch(userProfile: UserProfile, potentialMatch: UserProfile): number {
  // For now, return a default score. In a real app, this would consider
  // actual availability preferences and schedules
  return 0.8;
}

function isInvestmentStageMatch(startupStage: StartupStage, investorSectors: string[]): boolean {
  // Map startup stages to typical investment stages
  const stageMapping: Record<StartupStage, string[]> = {
    [StartupStage.IDEATION]: ["Pre-seed"],
    [StartupStage.VALIDATION]: ["Pre-seed", "Seed"],
    [StartupStage.MVP]: ["Pre-seed", "Seed"],
    [StartupStage.EARLY_TRACTION]: ["Seed", "Series A"],
    [StartupStage.SCALING]: ["Series A", "Series B", "Series C+"],
    [StartupStage.GROWTH]: ["Series B", "Series C+"]
  };

  const relevantStages = stageMapping[startupStage] || [];
  return relevantStages.some(stage => investorSectors.includes(stage));
}

function getFactorWeight(factor: string, userRole: UserRole, matchRole: UserRole): number {
  const weights: Record<string, number> = {
    skill_complementarity: 0.3,
    location_proximity: 0.15,
    stage_alignment: 0.2,
    investment_alignment: 0.25,
    industry_expertise: 0.25,
    availability_match: 0.1
  };

  // Adjust weights based on match type
  if (matchRole === UserRole.INVESTOR) {
    weights.investment_alignment = 0.4;
    weights.skill_complementarity = 0.2;
  } else if (matchRole === UserRole.MENTOR) {
    weights.industry_expertise = 0.4;
    weights.skill_complementarity = 0.25;
  }

  return weights[factor] || 0.1;
}

export async function generatePitchDeck(pitchDeckData: any) {
  try {
    const systemPrompt = `You are an expert pitch deck consultant who helps startups create compelling investor presentations. 
    Create a professional 10-slide pitch deck outline based on the information provided.`;

    const userPrompt = `
    Startup Name: ${pitchDeckData.startupName}
    Industry: ${pitchDeckData.industry}
    Problem: ${pitchDeckData.problem}
    Solution: ${pitchDeckData.solution}
    Business Model: ${pitchDeckData.businessModel}
    Market: ${pitchDeckData.market}
    Team: ${pitchDeckData.team}
    Traction: ${pitchDeckData.traction}
    Funding Needs: ${pitchDeckData.fundingNeeds}
    
    Create a detailed outline for a 10-slide pitch deck that includes:
    1. Title slide
    2. Problem
    3. Solution
    4. Product/Demo
    5. Market Opportunity
    6. Business Model
    7. Go-to-Market Strategy
    8. Team
    9. Traction & Milestones
    10. Funding Ask
    
    For each slide, provide a title and 3-5 bullet points of content.`;

    const messages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate pitch deck");
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error("Error generating pitch deck:", error);
    throw error;
  }
}

export async function generateBusinessPlan(businessPlanData: any) {
  try {
    const systemPrompt = `You are an expert business consultant who helps entrepreneurs create comprehensive business plans. 
    Create a detailed business plan based on the information provided.`;

    const userPrompt = `
    Business Name: ${businessPlanData.businessName}
    Industry: ${businessPlanData.industry}
    Executive Summary: ${businessPlanData.executiveSummary}
    Business Description: ${businessPlanData.businessDescription}
    Market Analysis: ${businessPlanData.marketAnalysis}
    Products & Services: ${businessPlanData.productsServices}
    Marketing Strategy: ${businessPlanData.marketingStrategy}
    Operations Plan: ${businessPlanData.operationsPlan}
    Financial Projections: ${businessPlanData.financialProjections}
    
    Create a comprehensive business plan that includes:
    1. Executive Summary (expanded)
    2. Company Description
    3. Market Analysis & Research
    4. Organization & Management
    5. Products or Services
    6. Marketing & Sales Strategy
    7. Funding Request (if applicable)
    8. Financial Projections
    9. Implementation Timeline
    10. Risk Analysis
    
    For each section, provide detailed content that would be suitable for investors or lenders.`;

    const messages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate business plan");
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error("Error generating business plan:", error);
    throw error;
  }
}

export async function generatePitchDeckSlide(
  field: keyof PitchDeckData,
  formData: PitchDeckData
): Promise<string> {
  try {
    const systemPrompt = `You are an expert pitch deck consultant. Generate compelling content for a specific slide in a startup pitch deck.`;

    const userPrompt = `
    Company: ${formData.companyName}
    Industry: ${formData.industry}
    Stage: ${formData.stage}
    
    Generate content for the "${field}" slide. 
    Context from other fields:
    ${Object.entries(formData)
      .filter(([key, value]) => key !== field && value && typeof value === 'string')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    
    Provide 3-5 bullet points or a short paragraph that would be compelling for investors.`;

    const messages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate slide content");
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error("Error generating slide content:", error);
    throw error;
  }
}

export async function generateBusinessPlanSection(
  field: keyof BusinessPlanData,
  formData: BusinessPlanData
): Promise<string> {
  try {
    const systemPrompt = `You are an expert business consultant. Generate detailed content for a specific section of a business plan.`;

    const userPrompt = `
    Company: ${formData.companyName}
    Industry: ${formData.industry}
    Stage: ${formData.stage}
    
    Generate content for the "${field}" section of the business plan.
    Context from other sections:
    ${Object.entries(formData)
      .filter(([key, value]) => key !== field && value && typeof value === 'string')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    
    Provide detailed, professional content suitable for investors or lenders.`;

    const messages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate section content");
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error("Error generating section content:", error);
    throw error;
  }
}