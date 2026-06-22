'use strict';

const { appendState } = require('./lib/state.cjs');

exports.run = (input) => {
  const desc = input?.tool_input?.description || '';
  const prompt = input?.tool_input?.prompt || '';
  const subagentType = input?.tool_input?.subagent_type || '';
  // 兼容不同 Agent 工具传参格式（Task、Agent、SubAgent 等）
  const toolName = input?.tool_name || '';
  const toolOutput = JSON.stringify(input?.tool_result || '');

  const combined = `${desc} ${prompt} ${subagentType} ${toolOutput}`.toLowerCase();

  if (/code.?review|security.?review|reviewer/.test(combined)) {
    appendState('review-called.txt', new Date().toISOString());
  }

  return null;
};
