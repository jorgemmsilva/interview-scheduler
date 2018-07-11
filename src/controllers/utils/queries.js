export const getInterviewersQuery = interviewers => {
  if (!interviewers) return {}
  if (Array.isArray(interviewers)){
    return { name: { $in: interviewers } }
  }
  return { name: interviewers }
}
