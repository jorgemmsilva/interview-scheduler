export const truncateDateToHour = (date) => {
  date = new Date(Date.parse(date))
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString()
}

export const getAvailableBlocks = (candidate, interviewers) => {
  const availableBlocks = []
  interviewers.forEach((interviewer) => {
    const matches = getScheduleMatches(candidate, interviewer)
    if (matches.length) {
      availableBlocks.push({
        interviewer: interviewer.name,
        availableBlocks: matches,
      })
    }
  })
  return availableBlocks
}

const getScheduleMatches = (candidate, interviewer) => (
  candidate.availability.reduce((availableBlocks, availability) => {
    interviewer.availability.forEach((block) => {
      if(blockMatchesAvailability(block, availability)){
        availableBlocks.push(block)
      }
    })
    return availableBlocks
  }, [])
)

const blockMatchesAvailability = (block, { start, end }) => (
  block >= start && block <= end
)
