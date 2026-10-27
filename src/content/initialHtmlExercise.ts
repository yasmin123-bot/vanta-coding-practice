/**
 * Preserved from the original prototype for the future learning/challenge system.
 * Reference content only: this module does not render a code editor or execute code.
 */
export const initialHtmlExercise = {
  id: 'html-first-heading',
  level: 'beginner',
  language: 'html',
  lesson: {
    title: 'What is HTML?',
    summary: 'Learn the basic structure of a web page.',
    sectionTitle: 'HTML Basics',
    explanation:
      'HTML stands for HyperText Markup Language. It is used to create the structure of web pages.',
    example: '<h1>Hello, Developer!</h1>',
  },
  challenge: {
    title: 'Write Your First HTML Code',
    instruction: 'Create a heading that says: Hello, Developer!',
    expectedHeadingText: 'Hello, Developer!',
  },
} as const;
