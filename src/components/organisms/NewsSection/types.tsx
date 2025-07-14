import { NewsCardProps } from "@molecules/NewsCard/types";

export interface NewsSectionProps {
    items: Array<{ id: string | number } & NewsCardProps>;
    className: string;
}
