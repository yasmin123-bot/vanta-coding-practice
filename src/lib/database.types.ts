import type { HtmlLessonId, LearningPathId } from '../content/learningSystem';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      path_progress: {
        Row: {
          user_id: string;
          path_id: LearningPathId;
          started_at: string;
          last_opened_at: string;
        };
        Insert: {
          user_id: string;
          path_id: LearningPathId;
          started_at?: string;
          last_opened_at?: string;
        };
        Update: {
          user_id?: string;
          path_id?: LearningPathId;
          started_at?: string;
          last_opened_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          user_id: string;
          path_id: LearningPathId;
          lesson_id: HtmlLessonId;
          started_at: string;
          last_opened_at: string;
          completed_at: string | null;
          quiz_score: number | null;
          quiz_total: number | null;
        };
        Insert: {
          user_id: string;
          path_id: LearningPathId;
          lesson_id: HtmlLessonId;
          started_at?: string;
          last_opened_at?: string;
          completed_at?: string | null;
          quiz_score?: number | null;
          quiz_total?: number | null;
        };
        Update: {
          user_id?: string;
          lesson_id?: HtmlLessonId;
          path_id?: LearningPathId;
          started_at?: string;
          last_opened_at?: string;
          completed_at?: string | null;
          quiz_score?: number | null;
          quiz_total?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_path_fk';
            columns: ['user_id', 'path_id'];
            isOneToOne: false;
            referencedRelation: 'path_progress';
            referencedColumns: ['user_id', 'path_id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
