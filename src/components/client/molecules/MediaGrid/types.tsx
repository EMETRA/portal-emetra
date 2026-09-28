import { ImageProps } from "@/components/server/atoms/Image/types";
import { VideoProps } from "@/components/server/atoms/Video/Video";
import { FileProps } from "@/components/server/atoms/File/types";

export type MediaGridItem =
    | ({ type: "image" } & ImageProps)
    | ({ type: "video" } & VideoProps)
    | ({ type: "file" } & FileProps);

export interface MediaGridProps {
    items: MediaGridItem[];
    columns?: number;
}
