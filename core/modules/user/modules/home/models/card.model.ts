export interface CardServices {
  icon?: string,
  image: string,
  title: string,
  color?: CardColor
}

export interface CardColor {
  baseColor: string,
  onBase: string,
}
