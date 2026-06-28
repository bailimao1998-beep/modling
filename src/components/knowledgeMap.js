import { getTopicsByModule } from '../data/topics.js';
import { masteryLabels } from '../services/progress.js';
import { icon } from './icon.js';

export function knowledgeMap(moduleId, state) {
  const moduleTopics = getTopicsByModule(moduleId);
  return `<div class="knowledge-map" aria-label="知识地图">
    ${moduleTopics.map((topic, index) => {
      const mastery = Number(state?.progress?.topics?.[topic.id]?.mastery || 0);
      return `<article class="knowledge-node ${topic.status === 'preview' ? 'is-preview' : ''}">
        <span class="knowledge-index">${index + 1}</span>
        <div><strong>${topic.title}</strong><p>${topic.summary}</p></div>
        <span class="knowledge-state">${topic.status === 'preview' ? `${icon('lock-keyhole')} 目录预览` : masteryLabels[mastery]}</span>
      </article>`;
    }).join('')}
  </div>`;
}
