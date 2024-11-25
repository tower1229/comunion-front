export const LanguageList = [
  {
    label: 'German - Deutsch',
    value: 'German'
  },
  {
    label: 'English',
    value: 'English'
  },
  {
    label: 'Spanish - Español',
    value: 'Spanish'
  },
  {
    label: 'Chinese - 中文 (简体)',
    value: 'Chinese_simply'
  },
  {
    label: 'Chinese - 中文 (繁體)',
    value: 'Chinese_Traditional'
  },
  {
    label: 'Bengali - বাংলা',
    value: 'Bengali'
  },
  {
    label: 'French - Français',
    value: 'French'
  },
  {
    label: 'Russian - Русский Язык',
    value: 'Russian'
  },
  {
    label: 'Hindi - हिंदी',
    value: 'Hindi'
  },
  {
    label: 'Arabic - العربية',
    value: 'Arabic'
  },
  {
    label: 'Portuguese - Português',
    value: 'Portuguese'
  },
  {
    label: 'Japanese - 日本語 (にほんご／にっぽんご)',
    value: 'Japanese'
  },
  {
    label: 'Italian - Italiano',
    value: 'Italian'
  },
  {
    label: 'Hungarian - Magyar',
    value: 'Hungarian'
  },
  {
    label: 'Dutch - Nederlands',
    value: 'Dutch'
  },
  {
    label: 'Polish - Polski',
    value: 'Polish'
  },
  {
    label: 'Romanian - Română',
    value: 'Romanian'
  },
  {
    label: 'Urdu - اردو',
    value: 'Urdu'
  },
  {
    label: 'Swedish - Svenska',
    value: 'Swedish'
  },
  {
    label: 'Turkish - Türkçe',
    value: 'Turkish'
  },
  {
    label: 'Korean - 한국어',
    value: 'Korean'
  }
]

export const SocialTypeList = [
  {
    label: 'Website',
    value: 'Website',
    serviceKey: 'website'
  },
  {
    label: 'Discord',
    value: 'Discord',
    serviceKey: 'discord'
  },
  {
    label: 'Facebook',
    value: 'Facebook',
    serviceKey: 'facebook'
  },
  {
    label: 'Linktree',
    value: 'Linktree',
    serviceKey: 'linktree'
  },
  {
    label: 'Telegram',
    value: 'Telegram',
    serviceKey: 'telegram'
  },
  {
    label: 'Twitter',
    value: 'Twitter',
    serviceKey: 'twitter'
  },
  {
    label: 'Email',
    value: 'Email',
    serviceKey: 'email'
  },
  {
    label: 'Medium',
    value: 'Medium',
    serviceKey: 'medium'
  }
]
export const languageLevel = [
  { label: 'Beginner', value: 1 },
  { label: 'Elementary', value: 2 },
  { label: 'Intermediate', value: 3 },
  { label: 'Advanced', value: 4 }
]
// 1-SocialEmail
// 2-SocialWebsite
// 3-SocialTwitter
// 4-SocialDiscord
// 5-SocialTelegram
// 6-SocialMedium
// 7-SocialFacebook
// 8-SocialLinktre
export const soureType: { [key: string]: number } = {
  Website: 2,
  Discord: 4,
  Facebook: 7,
  Linktree: 8,
  Telegram: 5,
  Twitter: 3,
  Email: 1,
  Medium: 6
}
