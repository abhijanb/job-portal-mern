export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  experience?: string;
  status: string;
  companyId: string;
  company?: { name: string; location?: string; logo?: string; description?: string };
  createdAt: string;
  _count?: { applications: number };
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logo?: string;
  ownerId: string;
  jobs?: Job[];
}

export interface Application {
  id: string;
  status: string;
  coverLetter?: string;
  resumeUrl?: string;
  userId: string;
  jobId: string;
  job?: { title: string; location?: string; type?: string; company?: { name: string } };
  user?: { name: string; email: string; status?: string };
  createdAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  sortOrder: number;
  profileId: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  sortOrder: number;
  profileId: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  job: { id: string; title: string; location?: string; type?: string; salaryMin?: number; salaryMax?: number; company?: { name: string } };
}


export interface Profile {
  id: string;
  phone?: string;
  location?: string;
  headline?: string;
  avatar?: string;
  skills: string[];
  experience?: string;
  education?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  userId: string;
  experiences?: Experience[];
  educations?: Education[];
}
