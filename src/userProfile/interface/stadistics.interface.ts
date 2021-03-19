

export interface today_tales{
  today_tales_readed:number,
  hit_percentaje_today: number
}

export interface week_tales{
  week_tales_readed:number,
  hit_percentaje_week: number
}

export interface Stadistics{
  today: today_tales,
  week: week_tales,
  total_tales: number
}


