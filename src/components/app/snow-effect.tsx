"use client";

import React, { useEffect, useState } from 'react';

const SNOWFLAKE_COUNT = 100;

export function SnowEffect() {
    const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const createSnowflakes = () => {
            const newSnowflakes = Array.from({ length: SNOWFLAKE_COUNT }).map((_, index) => {
                const style: React.CSSProperties = {
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    opacity: Math.random() * 0.5 + 0.3,
                };
                return <div key={index} className="snowflake" style={style} />;
            });
            setSnowflakes(newSnowflakes);
        };

        createSnowflakes();
    }, []);

    return <>{snowflakes}</>;
};
