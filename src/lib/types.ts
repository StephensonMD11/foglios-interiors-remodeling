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
  publicId: string;
  clientName: string;
  clientAddress: string;
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
