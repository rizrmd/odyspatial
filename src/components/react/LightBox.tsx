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
    ival: null as any,
    div: null as unknown as HTMLDivElement,
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
            ref={(el) => {
              if (el) local.div = el;
            }}
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

              clearInterval(local.ival);
              local.open = false;
              const cal = document.querySelector('cal-floating-button') as HTMLDivElement;
              if (cal) {
                cal.style.display = 'block';
              }
              render();
            }}
            onPointerMove={() => {
              clearInterval(local.ival);
            }}
          >
            <img
              onLoad={() => {
                local.loading = false;
                render();

                if (is_mobile) {
                  local.div.scrollLeft = 0;
                  clearInterval(local.ival);
                  setTimeout(() => {
                    let last = -1;
                    local.ival = setInterval(() => {
                      if (local.div.scrollLeft === last) {
                        clearInterval(local.ival);
                      } else {
                        last = local.div.scrollLeft;
                        local.div.scrollLeft += 0.5;
                      }
                      render();
                    }, 10);
                  }, 500);
                }
              }}
              className={cx('motion-preset-slide-up-sm select-none')}
              src={`/_image?href=${local.img.src}&w=${local.img.width}&f=webp`}
            />
            {local.loading && (
              <div
                className={cx(
                  'motion-preset-fade fixed inset-0 flex items-center justify-center bg-primary-950 bg-opacity-50 text-white'
                )}
              >
                {local.loading_text[Math.floor(Math.random() * local.loading_text.length)]}
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
