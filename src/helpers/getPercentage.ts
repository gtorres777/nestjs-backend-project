
  export default function getPercentage(total_questions: number, answered_correctly: number){
    if(total_questions == 0){

      return 0

    } else {

      const result = Math.round((answered_correctly * 100)/total_questions)
      return result

    }
  }
