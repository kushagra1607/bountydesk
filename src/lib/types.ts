import type { Plan } from "./constants";

export type Profile = {
  id: string;
  email: string | null;
  plan: Plan;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  created_at: string;
};

export type Program = {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  url: string | null;
  scope: string | null;
  min_bounty: number | null;
  max_bounty: number | null;
  notes: string | null;
  created_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  program_id: string | null;
  title: string;
  vuln_type: string;
  severity: string;
  status: string;
  bounty_amount: number;
  currency: string;
  target: string | null;
  description: string | null;
  submitted_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SubmissionWithProgram = Submission & {
  programs: { name: string } | null;
};
