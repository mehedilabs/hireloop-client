import type { JobForm } from "@/app/dashboard/recruiter/jobs/new/page"

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