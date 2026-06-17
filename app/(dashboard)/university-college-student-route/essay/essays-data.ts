export type Review = 'Complete' | 'Reviewing' | 'Pending' | 'Not Started';
export type Rating = 'Excellent' | 'Good' | 'Needs Work';

export interface Essay {
  id: number;
  title: string;
  subtitle: string;
  university: string;
  program: string;
  rating: Rating;
  score: number;
  words: number;
  wordLimit: number;
  review: Review;
  deadline: string;
  daysLeft: number;
}

export const ESSAYS: Essay[] = [
  { id: 1, title: 'Why Engineering', subtitle: 'UofT Engineering AIF', university: 'University of Toronto', program: 'Engineering', rating: 'Excellent', score: 485, words: 485, wordLimit: 500, review: 'Complete', deadline: 'Jan 15, 2026', daysLeft: 81 },
  { id: 2, title: 'Why Health Science', subtitle: 'McMaster Supplementary', university: 'McMaster University', program: 'Software Engineering', rating: 'Good', score: 430, words: 430, wordLimit: 500, review: 'Reviewing', deadline: 'Jan 15, 2026', daysLeft: 81 },
  { id: 3, title: 'My Impact in Community', subtitle: 'UofT Engineering AIF', university: 'University of Waterloo', program: 'Health Science', rating: 'Needs Work', score: 390, words: 390, wordLimit: 500, review: 'Pending', deadline: 'Jan 15, 2026', daysLeft: 81 },
  { id: 4, title: 'Leadership Experience', subtitle: 'Western AIF', university: 'Western University', program: 'Medical Science', rating: 'Excellent', score: 470, words: 470, wordLimit: 500, review: 'Complete', deadline: 'Jan 15, 2026', daysLeft: 81 },
  { id: 5, title: 'Future Goals', subtitle: 'UBC Personal Profile', university: 'UBC', program: 'Computer Science', rating: 'Needs Work', score: 320, words: 320, wordLimit: 500, review: 'Not Started', deadline: 'Jan 15, 2026', daysLeft: 81 },
  { id: 6, title: 'Overcoming Challenges', subtitle: "Queen's Supplementary", university: "Queen's University", program: 'Commerce', rating: 'Good', score: 445, words: 445, wordLimit: 500, review: 'Reviewing', deadline: 'Jan 15, 2026', daysLeft: 81 },
];

export function getEssay(id: number): Essay | undefined {
  return ESSAYS.find((e) => e.id === id);
}
