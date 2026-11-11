import type { JobForm } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

 export const createJob = async (data: JobForm) =>{
  const res = await fetch(`${BASE_URL}/jobs`, {

   method: 'POST',
   headers: {
    'content-type': 'application/json'
   },
    body: JSON.stringify(data),
   })
   return res.json();
}

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
  });
  return res.json();
}


export const updateJob = async (jobId: string, data: JobForm) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
};