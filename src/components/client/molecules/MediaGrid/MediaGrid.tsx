"use client";

import { Image } from "@/components/server/atoms/Image";
import { Video } from "@/components/server/atoms/Video";
import { File } from "@/components/server/atoms/File";
import { MediaGridProps } from "./types";
import styles from "./MediaGrid.module.scss";

const MediaGrid = ({ items, columns = 1 }: MediaGridProps) => {
    const sortedItems = items.sort((a, b) => {
        if (a.type === "image") return -1;
        if (a.type === "video") return 0;
        return 1;
    });

    return (
        <>
            <div
                className={styles.grid}
                style={{ "--columns": columns } as React.CSSProperties}
            >
                {sortedItems.map((item, index) => {
                    if (item.type === "image") {
                        const { type, ...imageProps } = item;
                        return (
                            <Image {...imageProps} />
                        );
                    }

                    if (item.type === "video") {
                        const { type, ...videoProps } = item;
                        return <Video key={`video-${index}`} {...videoProps} />;
                    }
                })}
            </div>
            <div
                className={styles.grid}
                style={{ "--columns": columns } as React.CSSProperties}
            >
                {sortedItems.map((item, index) => {
                    if (item.type === "file") {    
                        const { type, ...fileProps } = item;
                        return <File key={fileProps.id} download {...fileProps} />;
                    }
                })}
            </div>
        </>
    );
};

export default MediaGrid;
