import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function normalize(result, code) {
  return {
    score: result.score ?? 7,

    summary:
      result.summary ?? "Code review completed.",

    metrics: result.metrics ?? {
      readability: 8,
      maintainability: 8,
      performance: 7,
      security: 8,
      bugs: (result.issues || []).length,
    },

    issues: (result.issues || []).map((issue) => ({
      line: issue.line ?? 1,
      category: issue.category || issue.type || "General",
      title: issue.title || issue.type || "Issue",
      description:
        issue.description ||
        issue.message ||
        "Issue detected.",
      recommendation:
        issue.recommendation ||
        "Review and improve this section.",
      severity: issue.severity || "low",
    })),

    optimizedCode:
      result.optimizedCode || code,

    suggestions:
      result.suggestions || [],

    finalRecommendations:
      result.finalRecommendations ||
      [
        "Review highlighted issues.",
        "Improve readability.",
        "Test before deployment."
      ],

    source: result.source || "groq",
  };
}

function fallback(language, code) {

  const issues = [];

  code.split("\n").forEach((line, index) => {

    if (line.includes("console.log")) {
      issues.push({
        line: index + 1,
        category: "Cleanliness",
        title: "Console statement",
        description:
          "console.log should not remain in production code.",
        recommendation:
          "Remove console.log or use a logger.",
        severity: "low",
      });
    }

    if (line.includes("var ")) {
      issues.push({
        line: index + 1,
        category: "Best Practice",
        title: "Use let/const",
        description:
          "Avoid using var.",
        recommendation:
          "Replace var with let or const.",
        severity: "medium",
      });
    }

  });

  return normalize(
    {
      score: 7,
      summary:
        "Basic static analysis completed.",
      issues,
      suggestions: [
        "Use meaningful variable names.",
        "Write comments where required.",
        "Follow best coding practices."
      ],
    },
    code
  );
}

export async function createReview(language, code) {

  try {

    const prompt = `
You are an expert senior software engineer.

Review the following ${language} code.

Return ONLY valid JSON.

{
 "score":8,
 "summary":"",
 "metrics":{
   "readability":8,
   "maintainability":8,
   "performance":8,
   "security":8,
   "bugs":2
 },
 "issues":[
   {
    "line":1,
    "category":"",
    "title":"",
    "description":"",
    "recommendation":"",
    "severity":"low"
   }
 ],
 "optimizedCode":"",
 "suggestions":[],
 "finalRecommendations":[]
}

Code:

${code}
`;

    const response =
      await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "Return ONLY valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

      });

    let result =
      response.choices[0].message.content;

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return normalize(
      JSON.parse(result),
      code
    );

  } catch (error) {

    console.log(error.message);

    return fallback(language, code);

  }

}
