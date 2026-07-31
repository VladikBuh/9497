export type OnboardingStep = {
  background: number;
  overlay: number;
  title: string;
  description: string;
  buttonLabel: string;
  overlayWidthRatio?: number;
  tags?: string[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    background: require('../assets/into-explorer-onboard-bg.png'),
    overlay: require('../assets/into-explorer-onboardimg1.png'),
    title: 'Discover the beauty\nof winter',
    description:
      'Explore amazing winter locations from around the world and find new places to get inspired.',
    buttonLabel: 'Continue',
  },
  {
    background: require('../assets/into-explorer-onboard-bg.png'),
    overlay: require('../assets/into-explorer-onboardimg2.png'),
    title: 'Winter Adventures\nStart Here',
    description:
      'Frozen lakes, cozy villages, and winter wonders are all gathered in one app for easy viewing.',
    buttonLabel: 'Next',
  },
  {
    background: require('../assets/into-explorer-onboard-bg.png'),
    overlay: require('../assets/into-explorer-onboardimg3.png'),
    title: 'Winter knowledge in\none place',
    description:
      'Read interesting facts, complete the Snow Challenge and discover new pages of the winter world.',
    buttonLabel: 'Good!',
  },
  {
    background: require('../assets/into-explorer-onboard-bg.png'),
    overlay: require('../assets/into-explorer-onboardimg4.png'),
    title: 'Your favorite winter\nplaces are always nearby',
    description:
      'Create your own selection of winter places that you liked the most and return to them when you want to discover them again.',
    buttonLabel: 'This is useful!',
  },
  {
    background: require('../assets/into-explorer-onboard-bg.png'),
<<<<<<< HEAD
    overlay: require('../assets/into-explorer-onboardimg6.png'),
    title: 'Unlock Winter Premium',
    description:
      'Access exclusive winter locations and additional blog articles. Explore more destinations, discover fresh travel inspiration, and enjoy the complete winter experience.',
    buttonLabel: 'Next',
  },
  {
    background: require('../assets/into-explorer-onboard-bg.png'),
=======
>>>>>>> new-ios
    overlay: require('../assets/into-explorer-onboardimg5.png'),
    title: 'Let your mood choose\nthe path',
    description:
      'Winter Mood Compass will help you find the place that is best suited for your next winter trip.',
    buttonLabel: 'Start exploring',
  },
];
