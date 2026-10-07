import React from "react";
import { CasilleroPopUpProps } from "./types";
import { PopOver } from "../../atoms/PopOver";
import { Icon } from "@/components/server/atoms";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/server/atoms";
import styles from "./CasilleroPopUp.module.scss";

export const CasilleroPopUp = ({
    isOpen,
    variant = "default",
    title,
    description,
    actions,
    onClose,
}: CasilleroPopUpProps) => {
    return (
        <PopOver isOpen={isOpen} onClose={onClose} position="center">
            <div className={styles.popUpCard}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {title}
                    </h2>
                    {variant === 'default' && <Icon name="Cross" width={24} height={24} className={styles.mainIcon} onClick={onClose} />}
                </div>

                <div className={styles.descriptionWrapper}>
                    <Text variant="Medium" className={styles.description}>
                        {description}
                    </Text>
                </div>

                <div className={styles.actionsWrapper}>
                    {variant === 'success' || variant === 'error' || variant === 'warning' ? (
                        <Button
                            variant={variant === 'success' ? 'success' : variant === 'error' ? 'danger' : 'warning'}
                            onClick={onClose}
                        >
                            Cerrar
                        </Button>
                    ) : (actions?.map((action) => (
                        <Button key={action.text} variant={action.variant} onClick={action.onClick}>
                            {action.text}
                        </Button>
                    )))}
                </div>
            </div>
        </PopOver>
    );
};

export default CasilleroPopUp;