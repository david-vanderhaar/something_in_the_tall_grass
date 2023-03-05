import { THEMES } from "../constants"
import CharacterSelect from "../Screen/CharacterSelect"
import { SCREENS } from "../Screen/constants"
import Level from "../Screen/Level"
import Lose from "../Screen/Lose"
import ModeSelect from "../Screen/ModeSelect"
import Title from "../Screen/Title"
import Win from "../Screen/Win"

export const createCartridge = (data = {}) => {
  const cart = {
    name: data?.name || 'ゲーム (Gemu)', //also serves ast meta tag title
    coverImage: data?.coverImage || '',
    icon: data?.icon || `${window.PUBLIC_URL}/favicon.ico`,
    modes: data?.modes || [], // mode should define available characters?
    characters: data?.characters || [], // mode should define available characters?
    theme: data?.theme || THEMES.SOLARIZED, // theme should define bg/text/accent color etc,
    screens: getScreens(data?.screens)
  }

  updateWindowTitle(cart.name)
  return cart
}

const updateWindowTitle = (title) => window.document.title = title

// const getScreens = (screensFromData = {}) => ({...defaultScreens, ...screensFromData})
const getScreens = (screensFromData) => screensFromData || defaultScreens

const defaultScreens = {
  [SCREENS.TITLE]: {
    component: Title,
  },
  [SCREENS.MODE_SELECT]: {
    component: ModeSelect,
  },
  [SCREENS.CHARACTER_SELECT]: {
    component: CharacterSelect,
  },
  [SCREENS.LEVEL]: {
    component: Level, // level
  },
  [SCREENS.WIN]: {
    component: Win,
  },
  [SCREENS.LOSE]: {
    component: Lose,
  },
}