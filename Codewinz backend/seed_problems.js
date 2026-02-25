require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./src/models/problem");
const User = require("./src/models/user");

const problemsData = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nInput format: The first line contains N (array size) and target. The second line contains N integers.\nOutput format: Print the two indices separated by a space.",
    difficulty: "easy",
    tags: ["array"],
    visibleTestCases: [
      {
        input: "4 9\n2 7 11 15",
        output: "0 1",
        explanation: "Because nums[0] + nums[1] == 9, we return 0 1."
      }
    ],
    hiddenTestCases: [
      { input: "3 6\n3 2 4", output: "1 2" },
      { input: "2 6\n3 3", output: "0 1" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}\n\nint main() {\n    int n, target;\n    if (!(cin >> n >> target)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    vector<int> res = twoSum(nums, target);\n    if (res.size() == 2) cout << res[0] << " " << res[1] << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int[] res = twoSum(nums, target);\n        if (res.length == 2) System.out.println(res[0] + " " + res[1]);\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction twoSum(nums, target) {\n    // Write your code here\n    return [];\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const n = parseInt(input[0], 10);\n    const target = parseInt(input[1], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(input[2 + i], 10));\n    const res = twoSum(nums, target);\n    if (res.length === 2) console.log(res[0] + " " + res[1]);\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> m;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (m.count(complement)) return {m[complement], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    int n, target;\n    if (!(cin >> n >> target)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    vector<int> res = twoSum(nums, target);\n    if (res.size() == 2) cout << res[0] << " " << res[1] << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int[] res = twoSum(nums, target);\n        if (res.length == 2) System.out.println(res[0] + " " + res[1]);\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const n = parseInt(input[0], 10);\n    const target = parseInt(input[1], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(input[2 + i], 10));\n    const res = twoSum(nums, target);\n    if (res.length === 2) console.log(res[0] + " " + res[1]);\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nInput format: A single string s.\nOutput format: Print 'true' if valid, else 'false'.",
    difficulty: "easy",
    tags: ["stack", "string"],
    visibleTestCases: [
      {
        input: "()[]{}",
        output: "true",
        explanation: "Parentheses close in correct order."
      }
    ],
    hiddenTestCases: [
      { input: "(]", output: "false" },
      { input: "([)]", output: "false" },
      { input: "{[]}", output: "true" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your code here\n    return false;\n}\n\nint main() {\n    string s;\n    if (cin >> s) cout << (isValid(s) ? "true" : "false") << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) System.out.println(isValid(sc.next()) ? "true" : "false");\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction isValid(s) {\n    // Write your code here\n    return false;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log(isValid(input) ? "true" : "false");\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    string s;\n    if (cin >> s) cout << (isValid(s) ? "true" : "false") << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') stack.push(c);\n            else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) System.out.println(isValid(sc.next()) ? "true" : "false");\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction isValid(s) {\n    const stack = [];\n    for (let c of s) {\n        if (c === '(' || c === '{' || c === '[') stack.push(c);\n        else {\n            if (stack.length === 0) return false;\n            const top = stack.pop();\n            if (c === ')' && top !== '(') return false;\n            if (c === '}' && top !== '{') return false;\n            if (c === ']' && top !== '[') return false;\n        }\n    }\n    return stack.length === 0;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log(isValid(input) ? "true" : "false");\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nInput format: An integer n.\nOutput format: Print the total number of ways.",
    difficulty: "easy",
    tags: ["dp"],
    visibleTestCases: [
      {
        input: "3",
        output: "3",
        explanation: "There are three ways: 1+1+1, 1+2, 2+1."
      }
    ],
    hiddenTestCases: [
      { input: "2", output: "2" },
      { input: "5", output: "8" },
      { input: "10", output: "89" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\nusing namespace std;\n\nint climbStairs(int n) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    if (cin >> n) cout << climbStairs(n) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) System.out.println(climbStairs(sc.nextInt()));\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction climbStairs(n) {\n    // Write your code here\n    return 0;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log(climbStairs(parseInt(input, 10)));\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\nusing namespace std;\n\nint climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    if (cin >> n) cout << climbStairs(n) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) System.out.println(climbStairs(sc.nextInt()));\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log(climbStairs(parseInt(input, 10)));\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum.\n\nInput format: The first line contains N (size). The second line contains N integers.\nOutput format: Print the maximum subarray sum.",
    difficulty: "medium",
    tags: ["array", "dp"],
    visibleTestCases: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      }
    ],
    hiddenTestCases: [
      { input: "1\n1", output: "1" },
      { input: "5\n5 4 -1 7 8", output: "23" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << maxSubArray(nums) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(maxSubArray(nums));\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction maxSubArray(nums) {\n    // Write your code here\n    return 0;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const n = parseInt(input[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(input[1 + i], 10));\n    console.log(maxSubArray(nums));\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0];\n    int currentSum = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        currentSum = max(nums[i], currentSum + nums[i]);\n        maxSum = max(maxSum, currentSum);\n    }\n    return maxSum;\n}\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << maxSubArray(nums) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static int maxSubArray(int[] nums) {\n        int maxSum = nums[0];\n        int currentSum = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            currentSum = Math.max(nums[i], currentSum + nums[i]);\n            maxSum = Math.max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(maxSubArray(nums));\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction maxSubArray(nums) {\n    let maxSum = nums[0];\n    let currentSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const n = parseInt(input[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(input[1 + i], 10));\n    console.log(maxSubArray(nums));\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nInput format: An integer n.\nOutput format: Print F(n).",
    difficulty: "easy",
    tags: ["dp"],
    visibleTestCases: [
      {
        input: "4",
        output: "3",
        explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3."
      }
    ],
    hiddenTestCases: [
      { input: "0", output: "0" },
      { input: "1", output: "1" },
      { input: "8", output: "21" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    if (cin >> n) cout << fib(n) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static int fib(int n) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) System.out.println(fib(sc.nextInt()));\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction fib(n) {\n    // Write your code here\n    return 0;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log(fib(parseInt(input, 10)));\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    if (cin >> n) cout << fib(n) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) System.out.println(fib(sc.nextInt()));\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction fib(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        let c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log(fib(parseInt(input, 10)));\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nInput format: The first line contains s, the second contains t.\nOutput format: Print 'true' or 'false'.",
    difficulty: "easy",
    tags: ["string"],
    visibleTestCases: [
      {
        input: "anagram\nnagaram",
        output: "true",
        explanation: "All letters match exactly."
      }
    ],
    hiddenTestCases: [
      { input: "rat\ncar", output: "false" },
      { input: "a\na", output: "true" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    // Write your code here\n    return false;\n}\n\nint main() {\n    string s, t;\n    if (cin >> s >> t) cout << (isAnagram(s, t) ? "true" : "false") << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            String t = sc.next();\n            System.out.println(isAnagram(s, t) ? "true" : "false");\n        }\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction isAnagram(s, t) {\n    // Write your code here\n    return false;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    console.log(isAnagram(input[0], input[1]) ? "true" : "false");\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    if (s.length() != t.length()) return false;\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t;\n}\n\nint main() {\n    string s, t;\n    if (cin >> s >> t) cout << (isAnagram(s, t) ? "true" : "false") << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        char[] sArr = s.toCharArray();\n        char[] tArr = t.toCharArray();\n        Arrays.sort(sArr);\n        Arrays.sort(tArr);\n        return Arrays.equals(sArr, tArr);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            String t = sc.next();\n            System.out.println(isAnagram(s, t) ? "true" : "false");\n        }\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split('').sort().join('') === t.split('').sort().join('');\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    console.log(isAnagram(input[0], input[1]) ? "true" : "false");\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Min Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nInput format: The first line contains N (number of operations). Each next line contains an operation ('push x', 'pop', 'top', 'getMin').\nOutput format: For 'top' and 'getMin', print the result.",
    difficulty: "medium",
    tags: ["stack"],
    visibleTestCases: [
      {
        input: "7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin",
        output: "-3\n0\n-2",
        explanation: "Operations yield expected stack minimums and tops."
      }
    ],
    hiddenTestCases: [
      { input: "5\npush 5\npush 10\ngetMin\ntop\ngetMin", output: "5\n10\n5" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <stack>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nclass MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    MinStack st;\n    for (int i = 0; i < n; i++) {\n        string op;\n        cin >> op;\n        if (op == "push") {\n            int val;\n            cin >> val;\n            st.push(val);\n        } else if (op == "pop") {\n            st.pop();\n        } else if (op == "top") {\n            cout << st.top() << endl;\n        } else if (op == "getMin") {\n            cout << st.getMin() << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\nclass MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        MinStack st = new MinStack();\n        for (int i = 0; i < n; i++) {\n            String op = sc.next();\n            if (op.equals("push")) st.push(sc.nextInt());\n            else if (op.equals("pop")) st.pop();\n            else if (op.equals("top")) System.out.println(st.top());\n            else if (op.equals("getMin")) System.out.println(st.getMin());\n        }\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nclass MinStack {\n    constructor() {}\n    push(val) {}\n    pop() {}\n    top() { return 0; }\n    getMin() { return 0; }\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\n+/);\n    if (input.length === 0 || input[0] === '') return;\n    const n = parseInt(input[0], 10);\n    const st = new MinStack();\n    for (let i = 1; i <= n; i++) {\n        const parts = input[i].trim().split(/\\s+/);\n        const op = parts[0];\n        if (op === "push") st.push(parseInt(parts[1], 10));\n        else if (op === "pop") st.pop();\n        else if (op === "top") console.log(st.top());\n        else if (op === "getMin") console.log(st.getMin());\n    }\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <stack>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nclass MinStack {\n    stack<int> s;\n    stack<int> min_s;\npublic:\n    MinStack() {}\n    void push(int val) {\n        s.push(val);\n        if (min_s.empty() || val <= min_s.top()) min_s.push(val);\n    }\n    void pop() {\n        if (s.empty()) return;\n        if (s.top() == min_s.top()) min_s.pop();\n        s.pop();\n    }\n    int top() { return s.top(); }\n    int getMin() { return min_s.top(); }\n};\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    MinStack st;\n    for (int i = 0; i < n; i++) {\n        string op;\n        cin >> op;\n        if (op == "push") {\n            int val;\n            cin >> val;\n            st.push(val);\n        } else if (op == "pop") {\n            st.pop();\n        } else if (op == "top") {\n            cout << st.top() << endl;\n        } else if (op == "getMin") {\n            cout << st.getMin() << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\nclass MinStack {\n    private Stack<Integer> s = new Stack<>();\n    private Stack<Integer> min_s = new Stack<>();\n    public MinStack() {}\n    public void push(int val) {\n        s.push(val);\n        if (min_s.isEmpty() || val <= min_s.peek()) min_s.push(val);\n    }\n    public void pop() {\n        if (s.isEmpty()) return;\n        if (s.peek().equals(min_s.peek())) min_s.pop();\n        s.pop();\n    }\n    public int top() { return s.peek(); }\n    public int getMin() { return min_s.peek(); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        MinStack st = new MinStack();\n        for (int i = 0; i < n; i++) {\n            String op = sc.next();\n            if (op.equals("push")) st.push(sc.nextInt());\n            else if (op.equals("pop")) st.pop();\n            else if (op.equals("top")) System.out.println(st.top());\n            else if (op.equals("getMin")) System.out.println(st.getMin());\n        }\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nclass MinStack {\n    constructor() {\n        this.s = [];\n        this.min_s = [];\n    }\n    push(val) {\n        this.s.push(val);\n        if (this.min_s.length === 0 || val <= this.min_s[this.min_s.length - 1]) this.min_s.push(val);\n    }\n    pop() {\n        if (this.s.length === 0) return;\n        const popped = this.s.pop();\n        if (popped === this.min_s[this.min_s.length - 1]) this.min_s.pop();\n    }\n    top() { return this.s[this.s.length - 1]; }\n    getMin() { return this.min_s[this.min_s.length - 1]; }\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\n+/);\n    if (input.length === 0 || input[0] === '') return;\n    const n = parseInt(input[0], 10);\n    const st = new MinStack();\n    for (let i = 1; i <= n; i++) {\n        const parts = input[i].trim().split(/\\s+/);\n        const op = parts[0];\n        if (op === "push") st.push(parseInt(parts[1], 10));\n        else if (op === "pop") st.pop();\n        else if (op === "top") console.log(st.top());\n        else if (op === "getMin") console.log(st.getMin());\n    }\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Implement Queue using Stacks",
    description: "Implement a first in first out (FIFO) queue using only two stacks.\n\nInput format: The first line contains N (number of operations). Each next line contains an operation ('push x', 'pop', 'peek', 'empty').\nOutput format: For 'peek' and 'empty', print the result.",
    difficulty: "easy",
    tags: ["stack", "queue"],
    visibleTestCases: [
      {
        input: "5\npush 1\npush 2\npeek\npop\nempty",
        output: "1\nfalse",
        explanation: "Operations yield correct FIFO outputs."
      }
    ],
    hiddenTestCases: [
      { input: "4\npush 10\nempty\npeek\nempty", output: "false\n10\nfalse" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nclass MyQueue {\npublic:\n    MyQueue() {}\n    void push(int x) {}\n    int pop() { return 0; }\n    int peek() { return 0; }\n    bool empty() { return true; }\n};\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    MyQueue q;\n    for (int i = 0; i < n; i++) {\n        string op;\n        cin >> op;\n        if (op == "push") {\n            int x;\n            cin >> x;\n            q.push(x);\n        } else if (op == "pop") {\n            q.pop();\n        } else if (op == "peek") {\n            cout << q.peek() << endl;\n        } else if (op == "empty") {\n            cout << (q.empty() ? "true" : "false") << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\nclass MyQueue {\n    public MyQueue() {}\n    public void push(int x) {}\n    public int pop() { return 0; }\n    public int peek() { return 0; }\n    public boolean empty() { return true; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        MyQueue q = new MyQueue();\n        for (int i = 0; i < n; i++) {\n            String op = sc.next();\n            if (op.equals("push")) q.push(sc.nextInt());\n            else if (op.equals("pop")) q.pop();\n            else if (op.equals("peek")) System.out.println(q.peek());\n            else if (op.equals("empty")) System.out.println(q.empty() ? "true" : "false");\n        }\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nclass MyQueue {\n    constructor() {}\n    push(x) {}\n    pop() { return 0; }\n    peek() { return 0; }\n    empty() { return true; }\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\n+/);\n    if (input.length === 0 || input[0] === '') return;\n    const n = parseInt(input[0], 10);\n    const q = new MyQueue();\n    for (let i = 1; i <= n; i++) {\n        const parts = input[i].trim().split(/\\s+/);\n        const op = parts[0];\n        if (op === "push") q.push(parseInt(parts[1], 10));\n        else if (op === "pop") q.pop();\n        else if (op === "peek") console.log(q.peek());\n        else if (op === "empty") console.log(q.empty() ? "true" : "false");\n    }\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nclass MyQueue {\n    stack<int> input, output;\n    void move() {\n        if (output.empty()) {\n            while (!input.empty()) {\n                output.push(input.top());\n                input.pop();\n            }\n        }\n    }\npublic:\n    MyQueue() {}\n    void push(int x) {\n        input.push(x);\n    }\n    int pop() {\n        move();\n        int val = output.top();\n        output.pop();\n        return val;\n    }\n    int peek() {\n        move();\n        return output.top();\n    }\n    bool empty() {\n        return input.empty() && output.empty();\n    }\n};\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    MyQueue q;\n    for (int i = 0; i < n; i++) {\n        string op;\n        cin >> op;\n        if (op == "push") {\n            int x;\n            cin >> x;\n            q.push(x);\n        } else if (op == "pop") {\n            q.pop();\n        } else if (op == "peek") {\n            cout << q.peek() << endl;\n        } else if (op == "empty") {\n            cout << (q.empty() ? "true" : "false") << endl;\n        }\n    }\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\nclass MyQueue {\n    private Stack<Integer> input = new Stack<>();\n    private Stack<Integer> output = new Stack<>();\n    private void move() {\n        if (output.isEmpty()) {\n            while (!input.isEmpty()) output.push(input.pop());\n        }\n    }\n    public MyQueue() {}\n    public void push(int x) {\n        input.push(x);\n    }\n    public int pop() {\n        move();\n        return output.pop();\n    }\n    public int peek() {\n        move();\n        return output.peek();\n    }\n    public boolean empty() {\n        return input.isEmpty() && output.isEmpty();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        MyQueue q = new MyQueue();\n        for (int i = 0; i < n; i++) {\n            String op = sc.next();\n            if (op.equals("push")) q.push(sc.nextInt());\n            else if (op.equals("pop")) q.pop();\n            else if (op.equals("peek")) System.out.println(q.peek());\n            else if (op.equals("empty")) System.out.println(q.empty() ? "true" : "false");\n        }\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nclass MyQueue {\n    constructor() {\n        this.input = [];\n        this.output = [];\n    }\n    move() {\n        if (this.output.length === 0) {\n            while (this.input.length > 0) this.output.push(this.input.pop());\n        }\n    }\n    push(x) {\n        this.input.push(x);\n    }\n    pop() {\n        this.move();\n        return this.output.pop();\n    }\n    peek() {\n        this.move();\n        return this.output[this.output.length - 1];\n    }\n    empty() {\n        return this.input.length === 0 && this.output.length === 0;\n    }\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\n+/);\n    if (input.length === 0 || input[0] === '') return;\n    const n = parseInt(input[0], 10);\n    const q = new MyQueue();\n    for (let i = 1; i <= n; i++) {\n        const parts = input[i].trim().split(/\\s+/);\n        const op = parts[0];\n        if (op === "push") q.push(parseInt(parts[1], 10));\n        else if (op === "pop") q.pop();\n        else if (op === "peek") console.log(q.peek());\n        else if (op === "empty") console.log(q.empty() ? "true" : "false");\n    }\n}\n\nmain();`
      }
    ]
  },
  {
    title: "Single Number",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\n\nInput format: The first line contains N (size). The second line contains N integers.\nOutput format: Print the unique integer.",
    difficulty: "easy",
    tags: ["array"],
    visibleTestCases: [
      {
        input: "3\n2 2 1",
        output: "1",
        explanation: "1 appears once; others appear twice."
      }
    ],
    hiddenTestCases: [
      { input: "5\n4 1 2 1 2", output: "4" },
      { input: "1\n1", output: "1" }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint singleNumber(vector<int>& nums) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << singleNumber(nums) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;\n\npublic class Main {\n    public static int singleNumber(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(singleNumber(nums));\n    }\n}`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');\n\nfunction singleNumber(nums) {\n    // Write your code here\n    return 0;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const n = parseInt(input[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(input[1 + i], 10));\n    console.log(singleNumber(nums));\n}\n\nmain();`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint singleNumber(vector<int>& nums) {\n    int result = 0;\n    for (int num : nums) result ^= num;\n    return result;\n}\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << singleNumber(nums) << endl;\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\n\npublic class Main {\n    public static int singleNumber(int[] nums) {\n        int result = 0;\n        for (int num : nums) result ^= num;\n        return result;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        System.out.println(singleNumber(nums));\n    }\n}`
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\n\nfunction singleNumber(nums) {\n    let result = 0;\n    for (let num of nums) result ^= num;\n    return result;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const n = parseInt(input[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(input[1 + i], 10));\n    console.log(singleNumber(nums));\n}\n\nmain();`
      }
    ]
  }
];

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connected to database successfully.");

    // Look for an admin user
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      // Find any user to assign as creator
      admin = await User.findOne({});
    }

    if (!admin) {
      console.log("No users found in database! Please register a user first, then rerun this script.");
      process.exit(1);
    }

    console.log(`Using user ID: ${admin._id} (${admin.firstName} - Role: ${admin.role}) as problem creator.`);

    const problemsToInsert = problemsData.map(problem => ({
      ...problem,
      problemCreator: admin._id
    }));

    console.log(`Inserting ${problemsToInsert.length} problems...`);
    // Delete existing duplicate titles if any
    const titles = problemsToInsert.map(p => p.title);
    await Problem.deleteMany({ title: { $in: titles } });

    const result = await Problem.insertMany(problemsToInsert);
    console.log(`Successfully seeded ${result.length} problems!`);
    
  } catch (error) {
    console.error("Seeding failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seed();
