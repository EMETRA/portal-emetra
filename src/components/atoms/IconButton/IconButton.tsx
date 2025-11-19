import type { IconButtonProps } from './types';
import styles from './IconButton.module.scss';
import classNames from 'classnames';

export default function IconButton({icon: Icon, onClick, label}: IconButtonProps) {

    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={classNames(styles.button)}
        >
            <Icon className={classNames(styles.icon)} />
        </button>
    );

};