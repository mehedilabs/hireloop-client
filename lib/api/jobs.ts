
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`);
  return res.json();
};

export const getJobById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch job details');
  }

  return res.json();
};
