const { analyzeTimeComplexity } = require('./utils/geminiAI');

async function testComplexityAnalyzer() {
  console.log('🧪 Testing Time Complexity Analyzer...\n');
  
  const testCode = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

  try {
    console.log('📝 Test Code:');
    console.log(testCode);
    console.log('\n🔍 Analyzing complexity...\n');
    
    const result = await analyzeTimeComplexity(testCode, 'javascript');
    
    console.log('✅ Analysis Result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n🎯 Key Findings:');
    console.log(`- Algorithm Type: ${result.algorithmAnalysis.algorithmType}`);
    console.log(`- Time Complexity: ${result.timeComplexity.worstCase}`);
    console.log(`- Space Complexity: ${result.spaceComplexity.total}`);
    console.log(`- Efficiency: ${result.algorithmAnalysis.efficiency}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testComplexityAnalyzer(); 