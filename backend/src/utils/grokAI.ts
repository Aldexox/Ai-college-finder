import axios from 'axios';
import { TOP_COLLEGES } from '../data/colleges';

type College = (typeof TOP_COLLEGES)[number];

interface StudentContext {
  course?: string;
  entranceExam?: string;
  entranceScore?: number;
  class12Marks?: number;
  budget?: number;
  preferredCities: string[];
  preferredStates: string[];
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const moneyInLakhs = (amount: number) => `Rs ${(amount / 100000).toFixed(1)}L`;

const parseBudget = (question: string): number | null => {
  const lakhMatch = question.match(/(?:under|below|less than|within|upto|up to|max|maximum|budget|around)?\s*(?:rs|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|l)\b/i);
  if (lakhMatch) {
    return Number(lakhMatch[1]) * 100000;
  }

  const rupeeMatch = question.match(/(?:rs|inr)\s*(\d+(?:,\d+)?)/i);
  if (rupeeMatch) {
    return Number(rupeeMatch[1].replace(/,/g, ''));
  }

  return null;
};

const parseMarks = (question: string): number | null => {
  const match = question.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
};

const normalizeEntranceScore = (context: StudentContext): number | undefined => {
  if (!context.entranceScore) return undefined;
  const exam = normalize(context.entranceExam || '');

  if (exam.includes('neet')) {
    return Math.min(100, Math.max(0, (context.entranceScore / 720) * 100));
  }

  if (context.entranceScore > 100) {
    return Math.min(100, Math.max(0, context.entranceScore / 3));
  }

  return Math.min(100, Math.max(0, context.entranceScore));
};

const parseStudentContext = (systemPrompt: string): StudentContext => {
  const course = systemPrompt.match(/Course:\s*(.+)/)?.[1]?.trim();
  const entranceExam = systemPrompt.match(/Entrance Exam:\s*(.+)/)?.[1]?.trim();
  const entranceScore = Number(systemPrompt.match(/Entrance Score:\s*(\d+(?:\.\d+)?)/)?.[1]);
  const class12Marks = Number(systemPrompt.match(/Class 12 Marks:\s*(\d+(?:\.\d+)?)/)?.[1]);
  const budget = Number(systemPrompt.match(/Budget:\D*(\d+)/)?.[1]);
  const preferredStates =
    systemPrompt
      .match(/Preferred States:\s*(.+)/)?.[1]
      ?.split(',')
      .map((state) => state.trim())
      .filter(Boolean) || [];
  const preferredCities =
    systemPrompt
      .match(/Preferred Cities:\s*(.+)/)?.[1]
      ?.split(',')
      .map((city) => city.trim())
      .filter(Boolean) || [];

  return {
    course,
    entranceExam: entranceExam && entranceExam !== 'Not added' ? entranceExam : undefined,
    entranceScore: Number.isFinite(entranceScore) ? entranceScore : undefined,
    class12Marks: Number.isFinite(class12Marks) ? class12Marks : undefined,
    budget: Number.isFinite(budget) ? budget : undefined,
    preferredCities,
    preferredStates,
  };
};

const detectCourse = (text: string): string | null => {
  const value = normalize(text);
  const aliases = [
    { course: 'B.Tech CS', terms: ['cs', 'cse', 'computer science', 'software', 'coding', 'ai', 'data science'] },
    { course: 'B.Tech EC', terms: ['ec', 'ece', 'electronics', 'communication'] },
    { course: 'B.Tech ME', terms: ['me', 'mechanical'] },
    { course: 'B.Tech CE', terms: ['ce', 'civil'] },
    { course: 'B.Tech Electrical', terms: ['electrical', 'eee'] },
  ];

  return aliases.find((alias) => alias.terms.some((term) => value.includes(term)))?.course || null;
};

const collegeAliases = (college: College) => {
  const aliases = new Set([normalize(college.name), normalize(college.city)]);
  const acronymMatch = college.name.match(/\(([^)]+)\)\s*([A-Za-z]+)/);

  if (acronymMatch) {
    aliases.add(normalize(`${acronymMatch[1]} ${acronymMatch[2]}`));
    aliases.add(normalize(acronymMatch[1]));
  }

  if (college.name.includes('BITS')) aliases.add('bits pilani');
  if (college.name.includes('VIT')) aliases.add('vit');
  if (college.name.includes('SRM')) aliases.add('srm');
  if (college.name.includes('Manipal')) aliases.add('manipal');
  if (college.name.includes('Amrita')) aliases.add('amrita');

  return Array.from(aliases).filter((alias) => alias.length > 2);
};

const findMentionedColleges = (question: string) => {
  const value = normalize(question);
  return TOP_COLLEGES.filter((college) =>
    collegeAliases(college).some((alias) => value.includes(alias))
  );
};

const findLocation = (question: string) => {
  const value = normalize(question);
  const locations = new Set<string>();

  for (const college of TOP_COLLEGES) {
    if (value.includes(normalize(college.state))) locations.add(college.state);
    if (value.includes(normalize(college.city))) locations.add(college.city);
  }

  return Array.from(locations);
};

const supportsCourse = (college: College, course: string | null | undefined) => {
  if (!course) return true;
  const normalizedCourse = detectCourse(course) || course;
  return college.courses.some((collegeCourse) => normalize(collegeCourse) === normalize(normalizedCourse));
};

const formatCollegeLine = (college: College) =>
  `${college.name} (${college.city}, ${college.state}) - fees ${moneyInLakhs(college.avgFees)}, avg package ${moneyInLakhs(college.avgPackage)}, placement ${college.placementRate}%, cutoff ${college.cutoff}%.`;

const rankColleges = (colleges: College[], question: string) => {
  const value = normalize(question);
  if (value.includes('placement') || value.includes('package') || value.includes('salary')) {
    return colleges.slice().sort((a, b) => b.avgPackage - a.avgPackage || b.placementRate - a.placementRate);
  }
  if (value.includes('cheap') || value.includes('fee') || value.includes('fees') || value.includes('budget')) {
    return colleges.slice().sort((a, b) => a.avgFees - b.avgFees || a.ranking - b.ranking);
  }
  if (value.includes('cutoff') || value.includes('eligible')) {
    return colleges.slice().sort((a, b) => a.cutoff - b.cutoff || a.ranking - b.ranking);
  }
  return colleges.slice().sort((a, b) => a.ranking - b.ranking);
};

const filterColleges = (question: string, context: StudentContext) => {
  const budget = parseBudget(question) || context.budget;
  const marks = parseMarks(question) || context.class12Marks;
  const entranceIndex = normalizeEntranceScore(context);
  const course = detectCourse(question) || context.course;
  const locations = findLocation(question);
  const value = normalize(question);
  const requestedType = value.includes('government') ? 'government' : value.includes('private') ? 'private' : null;
  const hasProfileCityPreference = locations.length === 0 && context.preferredCities.length > 0;

  let matches = TOP_COLLEGES.filter((college) => supportsCourse(college, course));

  if (budget) {
    matches = matches.filter((college) => college.avgFees <= budget);
  }

  if (locations.length > 0) {
    matches = matches.filter((college) =>
      locations.some((location) => normalize(college.state) === normalize(location) || normalize(college.city) === normalize(location))
    );
  } else if (hasProfileCityPreference) {
    const cityMatches = matches.filter((college) =>
      context.preferredCities.some((city) => normalize(city) === normalize(college.city))
    );
    if (cityMatches.length > 0) {
      matches = cityMatches;
    }
  } else if (context.preferredStates.length > 0 && value.includes('my profile')) {
    matches = matches.filter((college) =>
      context.preferredStates.some((state) => normalize(state) === normalize(college.state))
    );
  }

  if (requestedType) {
    matches = matches.filter((college) => college.type === requestedType);
  }

  const academicIndex = Math.max(marks || 0, entranceIndex || 0);
  if (academicIndex && (value.includes('eligible') || value.includes('cutoff') || value.includes('my marks') || value.includes('my profile'))) {
    matches = matches.filter((college) => college.cutoff <= academicIndex);
  }

  if (matches.length === 0 && hasProfileCityPreference) {
    const cityFallback = TOP_COLLEGES.filter((college) =>
      context.preferredCities.some((city) => normalize(city) === normalize(college.city))
    );
    if (cityFallback.length > 0) {
      return rankColleges(cityFallback, question).slice(0, 5);
    }
  }

  return rankColleges(matches.length > 0 ? matches : TOP_COLLEGES, question).slice(0, 5);
};

const buildComparison = (colleges: College[]) => {
  const lines = colleges.slice(0, 4).map(formatCollegeLine).join('\n');
  const bestPackage = colleges.slice().sort((a, b) => b.avgPackage - a.avgPackage)[0];
  const lowestFees = colleges.slice().sort((a, b) => a.avgFees - b.avgFees)[0];

  return `Here is a quick comparison:\n${lines}\n\nBest for placements/package: ${bestPackage.name}.\nBest for lower fees: ${lowestFees.name}.\nChoose based on course fit, city preference, and whether you prefer government or private colleges.`;
};

const buildSpecificCollegeAnswer = (question: string, colleges: College[]) => {
  const value = normalize(question);
  const college = colleges[0];

  if (value.includes('fee') || value.includes('fees') || value.includes('cost')) {
    return `${college.name} has estimated annual fees of ${moneyInLakhs(college.avgFees)}. It is a ${college.type} college in ${college.city}, ${college.state}.`;
  }

  if (value.includes('placement') || value.includes('package') || value.includes('salary')) {
    return `${college.name} has a placement rate of ${college.placementRate}% and an average package around ${moneyInLakhs(college.avgPackage)}.`;
  }

  if (value.includes('cutoff') || value.includes('marks') || value.includes('eligible')) {
    return `${college.name} has an approximate cutoff of ${college.cutoff}%. If your Class 12 marks are near or above that, it is worth shortlisting.`;
  }

  if (value.includes('course') || value.includes('branch')) {
    return `${college.name} offers these listed courses: ${college.courses.join(', ')}.`;
  }

  return `${college.name} is ranked #${college.ranking} in this app's dataset. It is in ${college.city}, ${college.state}, with fees ${moneyInLakhs(college.avgFees)}, average package ${moneyInLakhs(college.avgPackage)}, placement ${college.placementRate}%, and cutoff ${college.cutoff}%. Website: ${college.website}`;
};

const looksCollegeScoped = (text: string) =>
  /college|university|iit|nit|iiit|campus|admission|jee|fees?|fee|placement|package|salary|cutoff|branch|b\.?tech|m\.?tech|engineering|rank|hostel|scholarship|entrance|gate|neet|course|state|government|private|eligible|marks|percent/i.test(
    text
  );

const buildOfflineGeneralAnswer = (userMessage: string): string => {
  const question = normalize(userMessage);

  if (/^(hi|hello|hey|namaste|start)$/.test(question)) {
    return 'Hi! I can help with college guidance, study planning, career choices, and general academic questions. Ask me anything, or ask for college suggestions by fees, placements, cutoff, branch, or location.';
  }

  if (question.includes('study') || question.includes('exam') || question.includes('prepare') || question.includes('revision')) {
    return 'A good study plan is: set one clear target, split it into daily topics, study in 45-60 minute focused blocks, solve questions after each concept, and revise mistakes weekly. If you tell me your exam, subject, and available time, I can make a specific timetable.';
  }

  if (question.includes('career') || question.includes('job') || question.includes('future') || question.includes('skill')) {
    return 'For career planning, start with your strongest interests, then compare them with marketable skills and the lifestyle you want. Build one practical skill, make 2-3 small projects, get feedback, and improve your communication. If you share your class, stream, and interests, I can suggest a path.';
  }

  if (question.includes('coding') || question.includes('programming') || question.includes('computer') || question.includes('software')) {
    return 'For coding, learn one language well first, such as Python or JavaScript. Practice basics, then build small projects like a calculator, notes app, portfolio, or API-based app. After that, learn data structures, Git, and problem solving. Consistency matters more than learning many languages at once.';
  }

  if (question.includes('motivation') || question.includes('focus') || question.includes('procrastination')) {
    return 'When focus is low, reduce the task size until it feels easy to start. Work for 25 minutes, keep your phone away, write down distractions instead of following them, and end each session with the next tiny step ready. Momentum usually comes after starting, not before.';
  }

  return (
    'I can help with that, but my offline answer may be brief because the live AI API is not reachable right now. ' +
    'Please ask your question with a little more detail, and I will give practical guidance. For best results, include your class/course, goal, subject, deadline, or the decision you are trying to make.'
  );
};

const buildLocalAdvice = (userMessage: string, systemPrompt: string): string => {
  const context = parseStudentContext(systemPrompt);
  const question = normalize(userMessage);
  const mentionedColleges = findMentionedColleges(userMessage);

  if (/^(hi|hello|hey|namaste|start)$/.test(question)) {
    return 'Hi! Ask me things like "suggest CS colleges under 15 lakhs", "fees of VIT", "compare IIT Bombay and NIT Trichy", or "am I eligible with 82%?"';
  }

  if ((question.includes('compare') || question.includes(' vs ') || question.includes(' versus ') || question.includes('better')) && mentionedColleges.length >= 2) {
    return buildComparison(mentionedColleges);
  }

  if (mentionedColleges.length === 1) {
    return buildSpecificCollegeAnswer(userMessage, mentionedColleges);
  }

  if (!looksCollegeScoped(userMessage) && mentionedColleges.length === 0) {
    return buildOfflineGeneralAnswer(userMessage);
  }

  const recommendations = filterColleges(userMessage, context);
  const lines = recommendations.map(formatCollegeLine).join('\n');

  if (question.includes('fee') || question.includes('fees') || question.includes('cheap') || question.includes('budget')) {
    return `Here are budget-friendly matches for your question:\n${lines}\n\nTip: government colleges usually have much lower fees, while some private colleges offer strong placements but higher fees.`;
  }

  if (question.includes('placement') || question.includes('package') || question.includes('salary')) {
    return `These colleges look strongest for placements/package:\n${lines}\n\nFor CS, compare both average package and placement rate. A slightly lower package with stronger course fit can still be a better choice.`;
  }

  if (question.includes('cutoff') || question.includes('eligible') || question.includes('marks')) {
    return `Based on cutoff/marks, these are worth checking:\n${lines}\n\nCutoffs change every year, so treat these as shortlist guidance and verify the latest official admission cutoff before applying.`;
  }

  if (question.includes('course') || question.includes('branch')) {
    return `For course fit, shortlist these colleges:\n${lines}\n\nA good branch choice should match your interest, placement expectations, and the kind of projects you want to build.`;
  }

  return `Based on your question, I would shortlist:\n${lines}\n\nYou can ask a follow-up like "show only private colleges", "compare the first two", "what are the fees?", or "which is best for placements?"`;
};

export const askGrokAI = async (userMessage: string, systemPrompt: string): Promise<string> => {
  const apiKey = (process.env.XAI_API_KEY || process.env.GROK_API_KEY || '').trim();

  if (!apiKey || apiKey.includes('your_grok_api_key')) {
    return buildLocalAdvice(userMessage, systemPrompt);
  }

  const model = process.env.GROK_MODEL || 'grok-3';
  const finalSystemPrompt = `${systemPrompt}

You are also a capable general assistant. Answer non-college questions clearly and safely in plain language.
If a query needs real-time or official data, mention that values may change and suggest checking trusted official sources.`;

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'system',
            content: finalSystemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.65,
        max_tokens: 4096,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) {
      return buildLocalAdvice(userMessage, systemPrompt);
    }
    return text;
  } catch (error: any) {
    console.error('Grok API error:', error.response?.data || error.message);
    return buildLocalAdvice(userMessage, systemPrompt);
  }
};
