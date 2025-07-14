import React from "react";

export interface NewsCardProps {
    imageSrc: string;
    title: string;
    date: string;
    mode: string;
    onClick?: () => void;
}
