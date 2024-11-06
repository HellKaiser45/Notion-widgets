import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { SOCIAL_PLATFORMS, type SocialPlatform } from '~/components/banner';

export const head: DocumentHead = {
  title: "Notion Social Banner Generator",
  meta: [
    {
      name: "description",
      content: "Create customizable social media banners for your Notion pages. Choose colors, sizes, and add your social media links."
    }
  ],
};

export default component$(() => {
  const location = useLocation();
  const previewUrl = useSignal('');
  const iconColor = useSignal('#36BCF7FF');
  const bgColor = useSignal('#00000000');
  const iconSize = useSignal('24');
  const socialUrls = useSignal<Partial<Record<SocialPlatform, string>>>({});
  const showSocialInputs = useSignal<Partial<Record<SocialPlatform, boolean>>>({});

  const updatePreview = $(() => {
    const params = new URLSearchParams();
    params.set('icon-color', iconColor.value.replace("#", ""));
    params.set('bg-color', bgColor.value.replace("#", ""));
    params.set('icon-size', iconSize.value);

    // Include all checked platforms, even without URLs
    Object.entries(showSocialInputs.value).forEach(([platform, isChecked]) => {
      if (isChecked) {
        const url = socialUrls.value[platform as SocialPlatform];
        // If URL exists and is not empty, include it. Otherwise just include the platform
        if (url?.trim()) {
          params.set(platform, url);
        } else {
          params.set(platform, '.');
        }
      }
    });

    const baseUrl = `${location.url.origin}`;
    previewUrl.value = `${baseUrl}?${params.toString()}`;
  });

  const userMode = $(() => {
    const checkbox = document.getElementById('theme-toggle') as HTMLInputElement;
    if (checkbox.checked) {
      document.cookie = `mode=dark; SameSite=Strict; Secure`;
    } else {
      document.cookie = `mode=light; SameSite=Strict; Secure`;
    }
  });

  useOnDocument("DOMContentLoaded", $(async () => {
    import("../.././components/jscolor.min.js");
  }));

  // Use useOnDocument to detect initial theme on page load
  useOnDocument("DOMContentLoaded", $(() => {
    const checkbox = document.getElementById('theme-toggle') as HTMLInputElement;
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check for existing cookie
    const cookie = document.cookie;
    const mode = cookie.split(';').find(item => item.trim().startsWith('mode='));

    if (mode) {
      checkbox.checked = mode.trim() === 'mode=dark';
    } else {
      checkbox.checked = theme;
    }
  }));



  // Rest of the component remains the same as in the original file
  return (

    <div class="min-h-screen bg-base-100 p-8">
      <label class="swap swap-rotate">
        <input
          onChange$={userMode}
          type="checkbox"
          class="theme-controller"
          id="theme-toggle"
          value="mydarktheme"
        />
        <svg
          class="swap-off h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
        <svg
          class="swap-on h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-center">Notion Simple Socials Banner</h1>
        <div class="flex justify-center items-center space-x-2 mb-8">
          <a href="https://github.com/HellKaiser45/Notion-widgets" target="_blank" rel="noopener noreferrer" aria-label="View project on Github">
            <img loading='lazy' class="w-auto h-auto object-contain"
              alt="View on Github"
              src="https://img.shields.io/badge/View%20on%20Github-white?logo=github&logoColor=black"
              height="50"
              width="70"
            />
          </a>
          <a href="https://linktr.ee/julienJDE" target="_blank" rel="noopener noreferrer" aria-label="View my social links">
            <img loading='lazy' class="w-auto h-auto object-contain"
              alt="My socials"
              src="https://img.shields.io/badge/My%20socials-white?logo=linktree"
              height="50"
              width="70"
            />
          </a>
          <a href="https://www.twitch.tv/julienjde" target="_blank" rel="noopener noreferrer" aria-label="Check Twitch status">
            <img loading='lazy' class="w-auto h-auto object-contain"
              alt="Twitch Status"
              src="https://img.shields.io/twitch/status/julienJDE"
              height="50"
              width="70"
            />
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div class="bg-base-100 border-2 border-neutral p-6 rounded-lg shadow-xl">
            <h2 class="border-primary-content border-b-2 text-2xl font-semibold mb-6">Customize Your Banner</h2>
            {/* Color Settings */}
            <div class="mb-8">
              <h3 class="font-bold text-lg mb-4">Colors</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label" for="icon-color">
                    <span class="label-text">Icon Color</span>
                  </label>
                  <input
                    id="icon-color"
                    type="text"
                    class="jscolor input input-bordered w-full max-w-xs"
                    value={iconColor.value}
                    data-jscolor={`{value: '${iconColor.value}'}`}
                    onChange$={(e) => {
                      const input = e.target as HTMLInputElement;
                      iconColor.value = `${input.value.replace("#", "")}`;
                      updatePreview();
                    }}
                    placeholder="Choose Icon Color"
                    aria-label="Select icon color"
                  />
                </div>
                <div>
                  <label class="label" for="bg-color">
                    <span class="label-text">Background Color</span>
                  </label>
                  <input
                    id="bg-color"
                    type="text"
                    class="jscolor input input-bordered w-full max-w-xs"
                    value={bgColor.value}
                    data-jscolor={`{value: '${bgColor.value}'}`}
                    onChange$={(e) => {
                      const input = e.target as HTMLInputElement;
                      bgColor.value = `${input.value.replace("#", "")}`;
                      updatePreview();
                    }}
                    placeholder="Choose Background Color"
                    aria-label="Select background color"
                  />
                </div>
              </div>
            </div>

            {/* Icon Size Settings */}
            <div class="mb-8">
              <h3 class="font-bold text-lg mb-4">Icon Size (px)</h3>
              <div>
                <label class="label" for="icon-size">
                  <span class="label-text">Size</span>
                </label>
                <input
                  id="icon-size"
                  type="number"
                  value={iconSize.value}
                  class="input input-bordered w-full"
                  onChange$={(e) => {
                    const input = e.target as HTMLInputElement;
                    iconSize.value = input.value;
                    updatePreview();
                  }}
                  placeholder="Enter icon size (e.g., 24)"
                  aria-label="Enter icon size in pixels"
                />
              </div>
            </div>

            {/* Social Media URLs */}
            <div>
              <h3 class="font-bold text-lg mb-4">Social Media Links</h3>
              <div class="space-y-4">
                {(Object.entries(SOCIAL_PLATFORMS) as [SocialPlatform, { alt: string }][]).map(([platform, { alt }]) => (
                  <div key={platform} class="form-control">
                    <label class="label cursor-pointer" for={`${platform}-checkbox`}>
                      <span class="label-text">{alt}</span>
                      <input
                        id={`${platform}-checkbox`}
                        type="checkbox"
                        class="checkbox"
                        checked={showSocialInputs.value[platform]}
                        onChange$={() => {
                          const newValue = !showSocialInputs.value[platform];
                          showSocialInputs.value = {
                            ...showSocialInputs.value,
                            [platform]: newValue
                          };
                          updatePreview();
                        }}
                        aria-label={`Enable ${alt}`}
                      />
                    </label>
                    {showSocialInputs.value[platform] && (
                      <div class="mt-2">
                        <span class="text-sm opacity-70 mb-2 block">Optional: Add URL to make icon clickable</span>
                        <label for={`${platform}-url`} class="sr-only">{`${alt} URL`}</label>
                        <input
                          id={`${platform}-url`}
                          type="text"
                          placeholder={`Enter your ${alt} URL (optional)`}
                          class="input input-bordered w-full"
                          value={socialUrls.value[platform] || ""}
                          onChange$={(e) => {
                            const input = e.target as HTMLInputElement;
                            socialUrls.value = {
                              ...socialUrls.value,
                              [platform]: input.value,
                            };
                            updatePreview();
                          }}
                          aria-label={`Enter ${alt} URL`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Code Panel */}
          <div class="space-y-8">
            {/* Live Preview */}
            <div class="bg-base-100 p-6 rounded-lg shadow-xl border-2 border-neutral">
              <h2 class="border-primary-content border-b-2 text-2xl font-semibold mb-4">Preview</h2>
              <div class="bg-neutral p-4 rounded">
                <iframe
                  loading='lazy'
                  src={previewUrl.value}
                  class="w-full h-32 border-none"
                  title="Banner Preview"
                />
              </div>
            </div>

            {/* Embed Code */}
            <div class="bg-base-100 p-6 rounded-lg shadow-xl border-2 border-neutral">
              <h2 class="border-primary-content border-b-2 text-2xl font-semibold mb-4">Embed Code</h2>
              <div class="space-y-4">
                <div>
                  <label class="label" for="preview-url">
                    <span class="label-text">URL</span>
                  </label>
                  <div class="join w-full">
                    <input
                      id="preview-url"
                      type="text"
                      readOnly
                      value={previewUrl.value}
                      class="input input-bordered join-item w-full"
                      aria-label="Preview URL"
                    />
                    <button
                      class="btn bg-neutral join-item"
                      onClick$={() => {
                        navigator.clipboard.writeText(previewUrl.value);
                      }}
                      aria-label="Copy URL"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label class="label" for="iframe-code">
                    <span class="label-text">Iframe Code</span>
                  </label>
                  <div class="join w-full">
                    <input
                      id="iframe-code"
                      type="text"
                      readOnly
                      value={`<iframe src="${previewUrl.value}" style="width: 100%; height: 80px; border: none;"></iframe>`}
                      class="input input-bordered join-item w-full font-mono text-sm"
                      aria-label="Iframe embed code"
                    />
                    <button
                      class="btn join-item bg-neutral"
                      onClick$={() => {
                        navigator.clipboard.writeText(
                          `<iframe src="${previewUrl.value}" style="width: 100%; height: 80px; border: none;"></iframe>`
                        );
                      }}
                      aria-label="Copy iframe code"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
});
