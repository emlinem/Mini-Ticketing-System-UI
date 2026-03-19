//export type TicketStatus = "open" | "in-progress" | "approved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export enum TicketStatus {
  open = 'open',
  inProgress = 'in-progress',
  approved = 'approved',
  closed = 'closed',
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface TicketAttachment {
  id: string
  name: string
  type: string
  size: number
  dataUrl: string
  uploadedAt: Date
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  category?: string
  assignee?: string
  attachments?: TicketAttachment[]
  comments?: Comment[]
}