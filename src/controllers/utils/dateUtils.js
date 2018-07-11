export const truncateDateToHour = date => {
  date = new Date(Date.parse(date))
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString()
}

export const getAvailableBlocks = (candidate, interviewers) => {
  const availableBlocks = []
  interviewers.forEach(interviewer => {
    availableBlocks.push({
      interviewer: interviewer.name,
      availableBlocks: getScheduleMatches(candidate, interviewer),
    })
  })
  return availableBlocks
}

const getScheduleMatches = (candidate, interviewer) => (
  candidate.availability.reduce((availableBlocks, availability) => {
    interviewer.availability.forEach(block => {
      if (blockMatchesAvailability(block, availability)){
        availableBlocks.push(block)
      }
    })
    return availableBlocks
  }, [])
)

export const getBlocksFromTimeInterval = ({ start, end }) => {
  const blocks = []
  const block = new Date(Date.parse(start))
  const endDate = new Date(Date.parse(end))
  while (block <= endDate){
    blocks.push(new Date(block))
    block.setHours(block.getHours()+1)
  }
  return blocks
}

const blockMatchesAvailability = (block, { start, end }) => (
  block >= start && block < end
)
