export const analyzeFailuresTool = {
  name: "analyze_test_failures",
  description: "Analyze Cypress and Playwright failures and summarize patterns",
  inputSchema: {
    type: "object",
    properties: {
      reportText: { type: "string" }
    },
    required: ["reportText"]
  },
  async execute({ reportText }) {
    const lines = reportText.split("\n");

    const failures = lines.filter(line =>
      line.toLowerCase().includes("fail")
    );

    return {
      totalFailures: failures.length,
      samples: failures.slice(0, 10)
    };
  }
};
