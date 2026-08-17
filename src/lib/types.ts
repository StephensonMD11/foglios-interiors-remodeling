export type Project = {
  id: string;
  title: string;
  roomType: string;
  caption: string;
  images: string[];
  published: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  projectTag?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProposalLineItem = {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Proposal = {
  id: string;
  /** Active public share token; null/empty when no share is open. */
  publicId: string | null;
  /** ISO timestamp when the public link stops working. */
  shareExpiresAt: string | null;
  clientName: string;
  /** Admin-only — never shown on the public / printable proposal. */
  clientAddress: string;
  /** Admin-only — never shown on the public / printable proposal. */
  clientPhone: string;
  projectTitle: string;
  notes: string;
  lineItems: ProposalLineItem[];
  status: "draft" | "sent";
  createdAt: string;
  updatedAt: string;
};

export type ContentStore = {
  projects: Project[];
  testimonials: Testimonial[];
  proposals: Proposal[];
};
