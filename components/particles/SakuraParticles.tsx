"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

export function SakuraParticles() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="sakura-particles"
            className="absolute inset-0 -z-10"
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#e44372",
                    },
                    move: {
                        direction: "bottom-right",
                        enable: true,
                        outModes: {
                            default: "out",
                        },
                        random: true,
                        speed: 2,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                        },
                        value: 40,
                    },
                    opacity: {
                        value: 0.6,
                        animation: {
                            enable: true,
                            speed: 0.5,
                            sync: false
                        }
                    },
                    shape: {
                        type: "circle", // Ideally this would be an image of a petal, but circle works for now
                    },
                    size: {
                        value: { min: 3, max: 6 },
                    },
                    roll: {
                        darken: {
                            enable: true,
                            value: 25
                        },
                        enable: true,
                        speed: {
                            min: 5,
                            max: 15
                        }
                    },
                    wobble: {
                        distance: 30,
                        enable: true,
                        speed: {
                            min: -7,
                            max: 7
                        }
                    }
                },
                detectRetina: true,
            }}
        />
    );
}
