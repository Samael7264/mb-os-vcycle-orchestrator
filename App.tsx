import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { SummaryTool } from './components/SummaryTool';
import { TestCaseTool } from './components/TestCaseTool';
import { TestQualityTool } from './components/TestQualityTool';
import { VisualizationTool } from './components/VisualizationTool';
import { UncoveredBranchesTool } from './components/UncoveredBranchesTool';
import { AstreeTool } from './components/AstreeTool';
import { CopilotTool } from './components/CopilotTool';
import { HistoryTool } from './components/HistoryTool';
import { VCycleWorkflow } from './components/VCycleWorkflow';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflow/:featureId" element={<VCycleWorkflow />} />
          <Route path="/summary" element={<SummaryTool />} />
          <Route path="/test-gen" element={<TestCaseTool />} />
          <Route path="/quality" element={<TestQualityTool />} />
          <Route path="/visualization" element={<VisualizationTool />} />
          <Route path="/branches" element={<UncoveredBranchesTool />} />
          <Route path="/astree" element={<AstreeTool />} />
          <Route path="/copilot" element={<CopilotTool />} />
          <Route path="/history" element={<HistoryTool />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
