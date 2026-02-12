const axios = require('axios');

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "javascript": 63,
    "java": 62,
  };
  return language[lang.toLowerCase()];
};

const JUDGE0_URL = process.env.JUDGE0_URL || "https://ce.judge0.com";

const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: `${JUDGE0_URL}/submissions/batch`,
    params: {
      base64_encoded: 'true'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      submissions: submissions.map(sub => ({
        ...sub,
        source_code: Buffer.from(sub.source_code || '').toString('base64'),
        stdin: Buffer.from(sub.stdin || '').toString('base64'),
        expected_output: Buffer.from(sub.expected_output || '').toString('base64')
      }))
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("Error in submitBatch:", error.message);
  }
};

const waiting = async (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

const safeDecode = (str) => {
  if (!str) return str;
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch (e) {
    return str;
  }
};

const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: `${JUDGE0_URL}/submissions/batch`,
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("Error in fetchData:", error.message);
      return { submissions: [] };
    }
  }

  while (true) {
    const result = await fetchData();

    if (result?.submissions?.every((r) => r.status_id > 2)) {
      return result.submissions.map(sub => ({
        ...sub,
        stdout: safeDecode(sub.stdout),
        stderr: safeDecode(sub.stderr),
        compile_output: safeDecode(sub.compile_output),
        message: safeDecode(sub.message)
      }));
    }

    // Wait 1 second to avoid hitting rate limits
    await waiting(1000);
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
