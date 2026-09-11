export const socialPages = {
  '/': {
    label: 'SOFTWARE ENGINEER · FOUNDER',
    lineOne: 'Software. Systems.',
    lineTwo: 'Exploring AI & ML.',
    detail: 'Founder, NIPPYSKY',
    alt: 'Chukwudubem Osegbe — Software, Systems & AI/ML. Founder of NIPPYSKY and MSc AI & Automation student.',
  },
  '/work': {
    label: 'SELECTED WORK · VENTURES & CLIENT PRODUCTS',
    lineOne: 'Ideas into products.',
    lineTwo: 'Built from the ground up.',
    detail: 'Engineering contributions · NIPPYSKY case studies',
    alt: 'Selected work by Chukwudubem Osegbe — web and mobile products, NIPPYSKY ventures and client work.',
  },
  '/about': {
    label: 'ABOUT · EXPERIENCE & EDUCATION',
    lineOne: 'A builder’s curiosity.',
    lineTwo: 'An engineer’s perspective.',
    detail: 'Software · Infrastructure · Founder',
    alt: 'About Chukwudubem Osegbe — software and infrastructure engineer, founder and MSc AI & Automation student in Sweden.',
  },
  '/lab': {
    label: 'AI & ML LAB · LEARNING IN PUBLIC',
    lineOne: 'Questions into code.',
    lineTwo: 'Learning through building.',
    detail: 'Coursework · Experiments · Projects',
    alt: 'Chukwudubem Osegbe’s AI & ML Lab — coursework, experiments and projects from an MSc in AI & Automation.',
  },
};
export type SocialPage = keyof typeof socialPages;
