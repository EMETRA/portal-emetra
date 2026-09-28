import React from "react";
import { SkeletonProps } from "./types";
import styles from "./Skeleton.module.scss";

export const Skeleton: React.FC <SkeletonProps> = ({
    width = "100%",
    height = "100%",
    radius = "6px",
    className
}) => {
    return (
        <div 
            className={`${styles.skeleton} ${className}`}
            style={{
                width,
                height,
                borderRadius: radius
            }}
            aria-hidden="true"
        >
        </div>
    );
};