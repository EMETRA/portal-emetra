import React from "react";

import { Icon } from "@/components/server/atoms";
import { Text } from "@/components/atoms";

import classNames from "classnames";
import styles from "./File.module.scss";
import { FileProps } from "./types";
import { IconType } from "@/components/server/atoms/Icon/types";

const getFileIcon = (filename: string): IconType => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
    case 'pdf':
        return 'FilePdf';
    case 'doc':
    case 'docx':
        return 'FileDocx';
    case 'xls':
    case 'xlsx':
    case 'csv':
        return 'FileXlsx';
    case 'ppt':
    case 'pptx':
        return 'FilePptx';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
        return 'Image';
    default:
        return 'File';
    }
};

const File: React.FC<FileProps> = ({ id, name, onClick, variant = "contained", download = false, className }) => {
    const icon = getFileIcon(name);

    return (
        <div className={classNames(styles.File, { [styles.outlined]: variant === "outlined" }, className)} onClick={() => onClick && onClick(id)}>
            <Icon name={icon} width={32} height={32} />
            <Text variant="Medium" className={styles.fileName}>{name}</Text>
            {download && (
                <Icon name="Download" color="#000000" width={24} height={24} />
            )}
        </div>
    );
};

export default File;
