export type TicketStatus = "open" | "in-progress" | "closed";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee: string | null;
  createdAt: Date;
  updatedAt: Date;
}