import classNames from "classnames";
import type { InfoTextProps } from "./types";
import styles from './InfoText.module.scss';

export default function InfoText({icon, text, value}: InfoTextProps) {

    return (
        <div className={classNames(styles.infoText)}>
            { icon }
            <p>
                <span>{ value }</span> 
                &nbsp;
                {text}
            </p>
        </div>
    );

};