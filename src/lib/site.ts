export const site = {
  name: 'Stanislav Sinitsyn',
  names: {en: 'Stanislav Sinitsyn', ru: 'Станислав Синицын'},
  email: 'stanislav.sinitsyn.work@gmail.com',
  telegram: 'https://t.me/stanislav_sinitsynn',
  year: 2026,
  contentUpdated: '2026-11-16',

  profiles: [
    'https://www.linkedin.com/in/stanislav-sinitsyn/'
    // 'https://github.com/<username>',
    // 'https://career.habr.com/<username>',
  ] as readonly string[],
  skills: ['Vue', 'React', 'TypeScript', 'Nuxt / Next.js', 'Node.js']
} as const;

export const servedCountries = ['Russia', 'Belarus', 'Kazakhstan', 'Uzbekistan', 'Tajikistan',
  'Kyrgyzstan', 'Armenia', 'Azerbaijan', 'Georgia', 'Moldova', 'United States'] as const;
