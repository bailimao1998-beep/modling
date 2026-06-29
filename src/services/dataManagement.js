const SUPPORTED_STATE_KEYS = ['progress', 'attempts', 'mistakes', 'reviewSchedule'];

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function createStudyBackup(state, exportedAt = new Date().toISOString()) {
  return {
    app: 'f11mt-study',
    schemaVersion: 1,
    exportedAt,
    data: structuredClone(state)
  };
}

export function validateStudyBackup(payload) {
  const data = payload?.data ?? payload;
  const errors = [];
  if (!isRecord(data)) return { valid: false, errors: ['备份内容必须是 JSON 对象。'], data: null };

  const presentKeys = SUPPORTED_STATE_KEYS.filter((key) => Object.hasOwn(data, key));
  if (!presentKeys.length) errors.push('备份至少需要包含 progress、attempts、mistakes、reviewSchedule 中的一项。');
  if (Object.hasOwn(data, 'progress') && !isRecord(data.progress)) errors.push('progress 必须是对象。');
  if (Object.hasOwn(data, 'attempts') && !isRecord(data.attempts)) errors.push('attempts 必须是对象。');
  if (Object.hasOwn(data, 'mistakes') && !Array.isArray(data.mistakes)) errors.push('mistakes 必须是数组。');
  if (Object.hasOwn(data, 'reviewSchedule') && !isRecord(data.reviewSchedule)) errors.push('reviewSchedule 必须是对象。');
  if (Object.hasOwn(data, 'examHistory') && !Array.isArray(data.examHistory)) errors.push('examHistory 必须是数组。');
  if (Object.hasOwn(data, 'proofHistory') && !Array.isArray(data.proofHistory)) errors.push('proofHistory 必须是数组。');
  if (Object.hasOwn(data, 'understoodMistakes') && !Array.isArray(data.understoodMistakes)) errors.push('understoodMistakes 必须是数组。');

  return { valid: errors.length === 0, errors, data: errors.length ? null : structuredClone(data) };
}

export function mergeImportedStudyData(payload, defaultState) {
  const validation = validateStudyBackup(payload);
  if (!validation.valid) throw new Error(validation.errors.join(' '));
  const imported = validation.data;
  return {
    ...structuredClone(defaultState),
    ...imported,
    progress: { ...structuredClone(defaultState.progress), ...(imported.progress || {}) },
    attempts: imported.attempts || structuredClone(defaultState.attempts),
    mistakes: imported.mistakes || structuredClone(defaultState.mistakes),
    reviewSchedule: imported.reviewSchedule || structuredClone(defaultState.reviewSchedule),
    examHistory: imported.examHistory || structuredClone(defaultState.examHistory),
    proofHistory: imported.proofHistory || structuredClone(defaultState.proofHistory),
    understoodMistakes: imported.understoodMistakes || structuredClone(defaultState.understoodMistakes),
    lastSession: { action: '已导入学习数据', at: new Date().toISOString() }
  };
}

export function getStudyDataSummary(state, storageKey) {
  const attempts = Object.values(state.attempts || {}).flat().length;
  return {
    attempts,
    mistakes: state.mistakes?.length || 0,
    exams: state.examHistory?.length || 0,
    storageKey,
    lastUpdatedAt: state.lastSession?.at || null
  };
}

export function studyBackupFilename(date = new Date()) {
  const isoDate = date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10);
  return `f11mt-study-backup-${isoDate}.json`;
}
