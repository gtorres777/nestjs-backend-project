
  export default function getPercentage(total_questions: number, answered_correctly: number){
    const result = Math.round((answered_correctly * 100)/total_questions)
    return result
  }
