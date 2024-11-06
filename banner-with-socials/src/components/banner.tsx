import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import * as Icons from './social-icons';

// Social media platforms configuration
export const SOCIAL_PLATFORMS = {
  github: {
    iconName: 'GithubIcon',
    alt: "GitHub"
  },
  facebook: {
    iconName: 'FacebookIcon',
    alt: "Facebook"
  },
  spotify: {
    iconName: 'SpotifyIcon',
    alt: "Spotify"
  },
  huggingface: {
    iconName: 'HuggingFaceIcon',
    alt: "Hugging Face"
  },
  youtube: {
    iconName: 'YoutubeIcon',
    alt: "YouTube"
  },
  twitter: {
    iconName: 'TwitterIcon',
    alt: "X (Twitter)"
  },
  buymeacoffee: {
    iconName: 'BuyMeACoffeeIcon',
    alt: "Buy Me a Coffee"
  },
  linktree: {
    iconName: 'LinktreeIcon',
    alt: "Linktree"
  },
  reddit: {
    iconName: 'RedditIcon',
    alt: "Reddit"
  },
  instagram: {
    iconName: 'InstagramIcon',
    alt: "Instagram"
  },
  twitch: {
    iconName: 'TwitchIcon',
    alt: "Twitch"
  },
  telegram: {
    iconName: 'TelegramIcon',
    alt: "Telegram"
  },
  tiktok: {
    iconName: 'TikTokIcon',
    alt: "TikTok"
  }
} as const;

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;

export default component$(() => {
  const bgColorSignal = useSignal('transparent');
  const iconColorSignal = useSignal('#000000');
  const iconSizeSignal = useSignal('24');
  const socialLinksSignal = useSignal<Array<{
    platform: string;
    url: string;
    iconName: string;
    alt: string
  }>>([]);



  // Use useVisibleTask$ to initialize and update signals
  useOnDocument("DOMContentLoaded",$(() => {

    // Parse parameters from location
    const params = new URLSearchParams(window.location.search);

    // Update background color
    const bgColorParam = params.get('bg-color') || 'transparent';
    bgColorSignal.value = bgColorParam.startsWith('#') ? bgColorParam : `#${bgColorParam}`;

    // Update icon color
    const iconColorParam = params.get('icon-color') || '000000';
    iconColorSignal.value = iconColorParam.startsWith('#') ? iconColorParam : `#${iconColorParam}`;

    // Update icon size
    iconSizeSignal.value = params.get('icon-size') || '24';

    // Update social links
    const socialLinks = Object.keys(SOCIAL_PLATFORMS).reduce((acc, platform) => {
      const url = params.get(platform);
      if (url && platform in SOCIAL_PLATFORMS) {
        acc.push({
          platform,
          url,
          ...SOCIAL_PLATFORMS[platform as SocialPlatform]
        });
      }
      return acc;
    }, [] as Array<{
      platform: string;
      url: string;
      iconName: string;
      alt: string
    }>);
    socialLinksSignal.value = socialLinks;

  }));

  return (
    <>
      {socialLinksSignal.value.length > 0 && (
        <div>
          <ul
            style={{
              backgroundColor: bgColorSignal.value,
              fontFamily: 'system-ui, sans-serif'
            }}
            class="menu menu-horizontal rounded-box flex p-2 gap-2"
          >
            {socialLinksSignal.value.map((social) => {
              // Dynamically select the icon component
              const IconComponent = (Icons as any)[social.iconName];

              return (
                <li key={social.platform} class="flex">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.alt}
                    class="transform transition-transform duration-200 hover:scale-110 flex p-2"
                  >
                    <IconComponent
                      width={iconSizeSignal.value}
                      height={iconSizeSignal.value}
                      fill={iconColorSignal.value}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
});
