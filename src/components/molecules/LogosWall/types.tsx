type Logo = {
    src: string;
    alt?: string;
};

type TrackProps = {
    logos: Logo[];
    speed?: number; // pixels per second
}

type LogoWallProps = {
    logos: Logo[];
    centerBadgeSrc: string;
};

export type { Logo, TrackProps, LogoWallProps };