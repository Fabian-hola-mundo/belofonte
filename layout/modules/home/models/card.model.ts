export interface CardServices {
  icon?: string,
  title: string,
  content: CardData,
  color?: CardColor
}

export interface CardColor {
  baseColor: string,
  onBase: string,
}

interface CardData {
  description: string,
  list: string[]
}
