const chromePath = process.env.LHCI_CHROME_PATH

const collect = {
  numberOfRuns: 2,
  startServerCommand: 'npm run build && npm run start',
  startServerReadyPattern: 'ready',
  url: ['http://127.0.0.1:3000/'],
}

if (chromePath) {
  collect.chromePath = chromePath
}

module.exports = {
  ci: {
    collect,
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
