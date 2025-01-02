import type { ImageMetadata } from 'astro';
import { css } from 'goober';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function LightBox({
  children,
  image,
  images,
}: {
  children: any;
  image: ImageMetadata;
  images?: ImageMetadata[];
}) {
  const w = window as unknown as {
    touch_anim_preview: number;
  };
  const local = useRef({
    loading: true,
    open: false,
    mx: 0,
    pos: 0,
    show_nav: false,
    img: image,
    show_wobble: true,
    loading_text: [
      'Rendering Elegance',
      'Crafting Spaces',
      'Loading Aesthetics',
      'Styling Interiors',
      'Processing Designs',
      'Arranging Decor',
      'Preparing Layouts',
      'Curating Ambiance',
      'Composing Elements',
      'Assembling Details',
    ],
  }).current;
  const _ = useState({})[1];
  const render = () => _({});

  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const is_mobile = vw < 768;

  if ((images?.length || 0) > 0) {
    local.show_nav = true;
  }

  return (
    <>
      <div
        className={css`
          cursor: pointer;
        `}
        onClick={() => {
          local.open = true;
          local.img = image;
          local.pos = images?.findIndex((e) => e.src === image.src) || 0;

          if (typeof w.touch_anim_preview !== 'number') {
            w.touch_anim_preview = localStorage.getItem('touch_anim_preview')
              ? parseInt(localStorage.getItem('touch_anim_preview') || '0')
              : 0;
          }
          if (w.touch_anim_preview < 5) {
            w.touch_anim_preview++;
            localStorage.setItem('touch_anim_preview', w.touch_anim_preview.toString());
          }

          setTimeout(() => {
            local.show_wobble = false;
            render();
          }, 2000);

          const cal = document.querySelector('cal-floating-button') as HTMLDivElement;
          if (cal) {
            cal.style.display = 'none';
          }
          render();
        }}
      >
        {children}
      </div>
      {local.open &&
        createPortal(
          <div
            className={cx(
              css`
                position: fixed;
                display: flex;
                inset: 0;
                cursor: pointer;

                background: rgba(0, 0, 0, 0.9);
                justify-content: center;
                align-items: center;
                z-index: 1000;

                & img {
                  max-width: 90vw;
                  max-height: 90vh;
                }

                @media (max-width: 768px) {
                  & img {
                    height: 100vh;
                    width: ${local.img.width}px;
                    max-height: none;
                    max-width: none;
                  }
                }

                -webkit-tap-highlight-color: transparent;
              `,
              'motion-preset-fade',
              is_mobile && `overflow-auto`
            )}
            onClick={(e) => {
              e.preventDefault();

              local.open = false;
              const cal = document.querySelector('cal-floating-button') as HTMLDivElement;
              if (cal) {
                cal.style.display = 'block';
              }
              render();
            }}
          >
            <img
              onLoad={() => {
                local.loading = false;
                render();
              }}
              className={cx('motion-preset-slide-up-sm select-none')}
              src={`/_image?href=${local.img.src}&w=${local.img.width}&f=webp`}
            />
            {local.loading && (
              <div className="motion-preset-fade fixed inset-0 flex items-center justify-center bg-primary-950 bg-opacity-50 text-white">
                {local.loading_text[Math.floor(Math.random() * local.loading_text.length)]}
              </div>
            )}
            {w.touch_anim_preview <= 3 && local.show_wobble && is_mobile && (
              <div className="motion-preset-fade pointer-events-none fixed inset-0 flex items-center justify-center bg-opacity-50 text-white">
                <div className="flex flex-1 items-center justify-center bg-primary-950 bg-opacity-50 py-[30px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={'50'}
                    viewBox="0 0 32 32"
                    className="motion-preset-wobble-lg motion-duration-1000 motion-loop-infinite"
                  >
                    <path fill="currentColor" d="M20 24h-2a5 5 0 0 1-10 0H6a7 7 0 0 0 14 0Z" />
                    <path
                      fill="currentColor"
                      d="M28 14V8a7.008 7.008 0 0 0-7-7h-5a6.146 6.146 0 0 0-4.106 1.566l-8.01 7.308a2.999 2.999 0 0 0 3.88 4.55l.001.001L10 12.895V24a3 3 0 0 0 6 0v-5.184a2.939 2.939 0 0 0 3.53-1.217A2.963 2.963 0 0 0 21 18a2.994 2.994 0 0 0 2.53-1.401A2.963 2.963 0 0 0 25 17a3.003 3.003 0 0 0 3-3Zm-2 0a1 1 0 0 1-2 0v-1h-2v2a1 1 0 0 1-2 0v-2h-2v3a1 1 0 0 1-2 0v-3h-2v11a1 1 0 0 1-2 0V9.104l-5.4 3.697a1 1 0 0 1-1.308-1.505l7.95-7.251A4.148 4.148 0 0 1 16 3h5a5.006 5.006 0 0 1 5 5Z"
                    />
                  </svg>
                </div>
              </div>
            )}
            {local.show_nav && (
              <>
                <div
                  className="fixed bottom-0 left-0 w-[80px] px-[10px] pb-[30px] text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    local.loading = true;
                    local.pos = local.pos - 1;
                    if (local.pos < 0) local.pos = (images?.length || 0) - 1;
                    if (images?.[local.pos]) local.img = images?.[local.pos];
                    render();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path
                      fill="currentColor"
                      d="M1443 2045L421 1024L1443 3l90 90l-930 931l930 931l-90 90z"
                    />
                  </svg>
                </div>

                <div
                  className="fixed bottom-0 right-0 w-[80px] px-[10px] pb-[30px] text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    local.loading = true;
                    local.pos = local.pos + 1;
                    if (local.pos > (images?.length || 0) - 1) local.pos = 0;
                    if (images?.[local.pos]) local.img = images?.[local.pos];
                    render();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path
                      fill="currentColor"
                      d="m515 1955l930-931L515 93l90-90l1022 1021L605 2045l-90-90z"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

const cx = (...args: any[]) => {
  return args.filter((e) => !!e).join(' ');
};
