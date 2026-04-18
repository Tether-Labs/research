import { z } from "zod/v4";

export const EmailPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
  attachments: z.array(z.string()).optional().default([]),
});

export const CrmPayloadSchema = z.object({
  provider: z.string(),
  object_type: z.string(),
  object_id: z.string(),
  field: z.string(),
  old_value: z.union([z.string(), z.number()]),
  new_value: z.union([z.string(), z.number()]),
});

export const EvaluateRequestSchema = z.object({
  action: z.enum(["send_email", "update_crm"]),
  user_id: z.string(),
  org_id: z.string(),
  payload: z.union([EmailPayloadSchema, CrmPayloadSchema]),
});

export type EmailPayload = z.infer<typeof EmailPayloadSchema>;
export type CrmPayload = z.infer<typeof CrmPayloadSchema>;
export type ActionPayload = EmailPayload | CrmPayload;
export type ActionType = "send_email" | "update_crm";

export type Decision = "allow" | "block" | "require_approval";
export type ApprovalStatus = "not_required" | "pending" | "approved" | "rejected";
export type ExecutionStatus = "not_started" | "executed" | "failed";

export type DerivedStatus =
  | "executed"
  | "blocked"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "execution_failed"
  | "pending_evaluation";

export function deriveStatus(
  decision: Decision,
  approvalStatus: ApprovalStatus,
  executionStatus: ExecutionStatus,
): DerivedStatus {
  if (executionStatus === "failed") return "execution_failed";
  if (executionStatus === "executed") return "executed";
  if (decision === "block") return "blocked";
  if (approvalStatus === "pending") return "pending_approval";
  if (approvalStatus === "rejected") return "rejected";
  if (approvalStatus === "approved" && executionStatus === "not_started") return "approved";
  return "pending_evaluation";
}

export type ExecutionResult = {
  success: boolean;
  execution_id: string;
  message: string;
  mock: boolean;
};

export type EvaluateRequest = z.infer<typeof EvaluateRequestSchema>;
