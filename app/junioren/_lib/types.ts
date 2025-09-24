export type AgeGroup =
  | 'A-Junior'
  | 'B-Junior'
  | 'C-Junior'
  | 'D-Junior'
  | 'E-Junior';

export interface TrainingSession {
  id: string;
  title: string;
  category: string;
  ageGroup: AgeGroup;
  htmlPath: string;
  pdfPath: string;
  description?: string;
}
