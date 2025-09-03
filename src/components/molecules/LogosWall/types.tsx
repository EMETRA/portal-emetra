type Logo = {
    src: string;
    alt?: string;
};

type TrackProps = {
    logos: Logo[];
    speed?: number; // pixels per second
    preload?: number; // number of logos to preload
}

type LogoWallProps = {
    logos: Logo[];
    centerBadgeSrc: string;
};

export type { Logo, TrackProps, LogoWallProps };