import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./SelectGeneral.module.scss";
import { SelectProps } from "./types";

const SelectGeneral: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Seleccione...",
    disabled = false,
    id,
    name,
    className,
    "aria-label": ariaLabel,
}) => {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const selectId = id;
    const listboxId = `${selectId}-listbox`;

    const selectedOption = options.find((opt) => opt.value === value);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Sync highlighted option with current value whenever it opens
    useEffect(() => {
        if (open) {
        const idx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
        }
    }, [open, value, options]);

    // Keep the highlighted option visible while navigating with arrows
    useEffect(() => {
        if (!open || highlightedIndex < 0) return;
        const node = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
        node?.scrollIntoView({ block: "nearest" });
    }, [open, highlightedIndex]);

    const commitSelection = (index: number) => {
        const opt = options[index];
        if (!opt || opt.disabled) return;
        onChange(opt.value);
        setOpen(false);
    };

    const moveHighlight = (direction: 1 | -1) => {
        let next = highlightedIndex;
        for (let i = 0; i < options.length; i++) {
        next = (next + direction + options.length) % options.length;
        if (!options[next].disabled) break;
        }
        setHighlightedIndex(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
            e.preventDefault();
            if (open) {
            moveHighlight(e.key === "ArrowDown" ? 1 : -1);
            } else {
            setOpen(true);
            }
            break;
        case "Enter":
        case " ":
            e.preventDefault();
            if (open) {
            commitSelection(highlightedIndex);
            } else {
            setOpen(true);
            }
            break;
        case "Escape":
            if (open) {
            e.preventDefault();
            setOpen(false);
            }
            break;
        case "Tab":
            setOpen(false);
            break;
        }
    };

    return (
        <div className={classNames(styles.container, className)} ref={containerRef}>
        <button
            type="button"
            id={selectId}
            className={classNames(styles.trigger, { [styles.open]: open, [styles.disabled]: disabled })}
            onClick={() => !disabled && setOpen((o) => !o)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-label={ariaLabel}
        >
            <span className={classNames(styles.value, { [styles.placeholder]: !selectedOption })}>
            {selectedOption ? selectedOption.label : placeholder}
            </span>
            <svg
            className={classNames(styles.chevron, { [styles.chevronOpen]: open })}
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            aria-hidden="true"
            >
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>

        {name && <input type="hidden" name={name} value={value} />}

        {open && (
            <ul ref={listRef} id={listboxId} role="listbox" className={styles.panel} aria-labelledby={selectId} tabIndex={-1}>
            {options.map((opt, idx) => (
                <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                aria-disabled={opt.disabled}
                className={classNames(styles.option, {
                    [styles.highlighted]: idx === highlightedIndex,
                    [styles.selected]: opt.value === value,
                    [styles.optionDisabled]: opt.disabled,
                })}
                onMouseEnter={() => !opt.disabled && setHighlightedIndex(idx)}
                onMouseDown={(e) => e.preventDefault()} // keeps the trigger from blurring before click registers
                onClick={() => commitSelection(idx)}
                >
                {opt.label}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default SelectGeneral;